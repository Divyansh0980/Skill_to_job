import { FetchOptions, GitHubAPIError, GitHubRateLimitError, GraphQLResponse } from './types';

const IN_MEMORY_CACHE = new Map<string, { data: string, expires: number }>();

/**
 * Universal internal fetcher with built-in Exponential Backoff, Rate Limit Queueing,
 * and In-Memory Caching for standalone Node.js environments.
 */
export async function githubFetch(url: string, options: FetchOptions): Promise<Response> {
  const cacheKey = `${options.method || 'GET'}:${url}:${options.body || ''}`;
  const now = Date.now();

  if (options.cacheTime && IN_MEMORY_CACHE.has(cacheKey)) {
    const cached = IN_MEMORY_CACHE.get(cacheKey)!;
    if (now < cached.expires) {
      return new Response(cached.data, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    IN_MEMORY_CACHE.delete(cacheKey);
  }

  const maxRetries = options.retries ?? 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, options);

      // 2. Rate Limit Handling (429 & 403 Secondary Limits)
      if (response.status === 403 || response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        if (retryAfter) {
          const waitMs = parseInt(retryAfter, 10) * 1000;
          console.warn(`[API] Rate Limit hit. Waiting ${waitMs}ms...`);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }

        const remaining = response.headers.get('x-ratelimit-remaining');
        const reset = response.headers.get('x-ratelimit-reset');

        if (remaining === '0' && reset) {
          const resetDate = new Date(parseInt(reset, 10) * 1000);
          const waitMs = resetDate.getTime() - Date.now() + 1000; // 1s buffer

          if (waitMs > 0 && waitMs < 60000) { // Only auto-wait if it's less than 60s
            console.warn(`[API] Rate Exhausted. Auto-waiting until reset...`);
            await new Promise(r => setTimeout(r, waitMs));
            continue;
          }
          throw new GitHubRateLimitError(resetDate);
        }

        // Secondary abuse limit missing Retry-After
        const fallbackWait = (Math.pow(2, attempt) * 1000) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, fallbackWait));
        attempt++;
        continue;
      }

      // 3. Exponential Backoff for 5xx Server Errors
      if (response.status >= 500 && attempt < maxRetries) {
        const backoff = (Math.pow(2, attempt) * 1000) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, backoff));
        attempt++;
        continue;
      }

      // Success Cache Storage
      if (response.ok && options.cacheTime) {
        const cacheData = await response.clone().text();
        IN_MEMORY_CACHE.set(cacheKey, { data: cacheData, expires: now + options.cacheTime });
      }

      return response;

    } catch (error: any) {
      if (error.name === 'AbortError') throw error;
      if (attempt >= maxRetries) throw error;
      const backoff = (Math.pow(2, attempt) * 1000) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, backoff));
      attempt++;
    }
  }

  throw new Error('Maximum retries exceeded');
}

/**
 * Executes API promises sequentially in highly controlled chunks to securely prevent 
 * Anti-Abuse IP Blocks when analyzing massive commit trees.
 */
export async function executeInChunks<T, R>(items: T[], chunkSize: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
  }
  return results;
}

/**
 * Reusable function to send GraphQL queries to GitHub API v4
 */
export async function fetchGitHubGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options: FetchOptions = {}
): Promise<T> {
  const token = options.token || process.env.GITHUB_ACCESS_TOKEN;
  const baseUrl = process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql';

  if (!token) {
    throw new Error('GITHUB_ACCESS_TOKEN environment variable is not set');
  }

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 8000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await githubFetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
      cacheTime: 3600 * 1000,
      ...options
    });

    clearTimeout(timeoutId);

    let result: GraphQLResponse<T>;
    const text = await response.text();
    try {
      result = JSON.parse(text);
    } catch (e) {
      throw new GitHubAPIError(
        `Failed to parse GitHub response: status ${response.status}`,
        response.status
      );
    }

    if (!response.ok && !result?.errors) {
      throw new GitHubAPIError(
        `GitHub API request failed with status ${response.status}`,
        response.status
      );
    }

    if (result.errors && !result.data) {
      throw new GitHubAPIError('GraphQL query failed completely', response.status, result.errors);
    }

    if (result.errors) {
      console.warn('GitHub GraphQL Partial Errors:', result.errors);
    }

    return result.data as T;

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`GitHub API request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}

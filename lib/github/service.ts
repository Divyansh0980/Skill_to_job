import { cache as reactCache } from 'react';
import { executeInChunks, fetchGitHubGraphQL, githubFetch } from './api';
import {
  CandidateExtractionResult,
  CandidateRepositoryAnalysis,
  FetchOptions,
  FileContribution,
  GitHubCommitNode,
  GitHubRepositoryNode,
  PaginatedCommits,
  PaginatedRepositories,
  RepoDetails,
  RepositoryCommitsResponse,
  RepositoryContextPayload,
  UserIdLookupResponse,
  UserProfile,
  UserRepositoriesResponse
} from './types';

// Fallback for standalone Node.js environments (like Jest or ts-node) where React.cache may not be natively polyfilled
const cache = typeof reactCache === 'function' ? reactCache : <T extends Function>(fn: T): T => fn;

/**
 * Fetches the authenticated user's profile.
 * Wrapped in React's `cache()` to deduplicate identical requests in the same Server Render pass.
 */
export const getViewerProfile = cache(async (options?: FetchOptions): Promise<UserProfile> => {
  const query = `
    query {
      viewer {
        login
        name
        avatarUrl
        bio
      }
    }
  `;
  return fetchGitHubGraphQL<UserProfile>(query, {}, options);
});

/**
 * Fetches specific repository details.
 */
export const getRepositoryDetails = cache(async (
  owner: string, 
  name: string,
  options?: FetchOptions
): Promise<RepoDetails> => {
  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        name
        description
        stargazerCount
        url
      }
    }
  `;
  return fetchGitHubGraphQL<RepoDetails>(query, { owner, name }, options);
});

/**
 * Fetches natively sorted, most recently updated public repositories.
 */
export const getUserPublicRepositories = cache(async (
  username: string,
  limit: number = 10,
  cursor: string | null = null,
  options?: FetchOptions
): Promise<PaginatedRepositories> => {
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const query = `
    query getUserRepositories($username: String!, $limit: Int!, $cursor: String) {
      user(login: $username) {
        repositories(
          first: $limit,
          after: $cursor,
          orderBy: { field: UPDATED_AT, direction: DESC },
          privacy: PUBLIC
        ) {
          nodes {
            name
            description
            stargazerCount
            primaryLanguage { name color }
            defaultBranchRef { name }
            updatedAt
            url
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }
  `;

  const fetchOptions: FetchOptions = { next: { revalidate: 3600 }, ...options };
  const result = await fetchGitHubGraphQL<UserRepositoriesResponse>(query, { username, limit: safeLimit, cursor }, fetchOptions);

  if (!result.user) {
    return { repositories: [], pageInfo: { hasNextPage: false, endCursor: null }, userExists: false };
  }

  const validNodes = result.user.repositories.nodes.filter(
    (node): node is GitHubRepositoryNode => node !== null
  );

  return { repositories: validNodes, pageInfo: result.user.repositories.pageInfo, userExists: true };
});

const resolveGitHubUserId = cache(async (username: string, options?: FetchOptions) => {
  const result = await fetchGitHubGraphQL<UserIdLookupResponse>(
    `query($username: String!) { user(login: $username) { id } }`,
    { username },
    { ...options, next: { revalidate: 31536000 } } 
  ).catch(() => null);

  return result?.user?.id || null;
});

export const getRepositoryCommitsByAuthor = cache(async (
  username: string, owner: string, repoName: string,
  limit: number = 10, cursor: string | null = null, branchName: string | null = null,
  options?: FetchOptions
): Promise<PaginatedCommits> => {
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const fetchOptions: FetchOptions = { next: { revalidate: 3600 }, ...options };

  const authorId = await resolveGitHubUserId(username, fetchOptions);
  if (!authorId) throw new Error(`Could not resolve Node ID for username: ${username}`);

  const privacyEmail = `${username}@users.noreply.github.com`;

  const qualifiedBranch = branchName ? `refs/heads/${branchName}` : null;
  const branchVarDef = qualifiedBranch ? ', $branch: String!' : '';
  const branchQuery = qualifiedBranch ? 'branchRef: ref(qualifiedName: $branch) { target { ...CommitFragment } }' : '';

  const query = `
    query getAuthorCommits($owner: String!, $name: String!, $authorId: ID!, $emails: [String!], $limit: Int!, $cursor: String${branchVarDef}) {
      repository(owner: $owner, name: $name) {
        ${branchQuery}
        defaultBranchRef { target { ...CommitFragment } }
      }
    }
    
    fragment CommitFragment on GitObject {
      ... on Commit {
        history(first: $limit, after: $cursor, author: { id: $authorId, emails: $emails }) {
          pageInfo { hasNextPage endCursor }
          nodes { message committedDate changedFilesIfAvailable url }
        }
      }
    }
  `;

  const variables: Record<string, any> = { owner, name: repoName, authorId, emails: [privacyEmail], limit: safeLimit, cursor };
  if (qualifiedBranch) variables.branch = qualifiedBranch;

  const result = await fetchGitHubGraphQL<RepositoryCommitsResponse>(
    query, variables, fetchOptions
  );

  const targetRef = result.repository?.branchRef || result.repository?.defaultBranchRef;
  const history = targetRef?.target?.history;

  if (!result.repository || !history) {
    return { commits: [], pageInfo: { hasNextPage: false, endCursor: null }, repositoryExists: false };
  }

  const validCommits = history.nodes.filter((node): node is GitHubCommitNode => node !== null);
  return { commits: validCommits, pageInfo: history.pageInfo, repositoryExists: true };
});

export const getTopContributedFiles = cache(async (
  username: string, owner: string, repoName: string,
  limitCommitsToScan: number = 30, options?: FetchOptions
): Promise<FileContribution[]> => {
  const token = options?.token || process.env.GITHUB_ACCESS_TOKEN;
  if (!token) throw new Error('GITHUB_ACCESS_TOKEN is required for file analytics');

  const fetchOpts = { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' }, next: { revalidate: 3600 }, ...options };

  const commitsResponse = await githubFetch(
    `https://api.github.com/repos/${owner}/${repoName}/commits?author=${username}&per_page=${limitCommitsToScan}`,
    { ...fetchOpts, cacheTime: 3600 * 1000, retries: 3 }
  );
  
  if (!commitsResponse.ok) return [];
  const commits = await commitsResponse.json();
  const commitShas: string[] = commits.map((c: any) => c.sha);

  const detailedCommits = await executeInChunks(commitShas, 5, async (sha) => {
    const res = await githubFetch(`https://api.github.com/repos/${owner}/${repoName}/commits/${sha}`, {
       ...fetchOpts, cacheTime: 3600 * 1000, retries: 3 
    });
    if (!res.ok) return null;
    return res.json();
  });

  const fileTally = new Map<string, number>();
  for (const commit of detailedCommits) {
    if (!commit || !commit.files) continue;
    for (const file of commit.files) {
      const filename = file.filename as string;
      fileTally.set(filename, (fileTally.get(filename) || 0) + 1);
    }
  }

  return Array.from(fileTally.entries())
    .map(([path, count]) => ({ path, commitsTouched: count }))
    .sort((a, b) => b.commitsTouched - a.commitsTouched)
    .slice(0, 5); 
});

export const getTargetedRepositoryContext = cache(async (
  owner: string, repoName: string, topContributedPaths: string[],
  branch: string = 'HEAD', options?: FetchOptions
): Promise<RepositoryContextPayload> => {

  const validExtensions = /\.(js|ts|jsx|tsx|py|go|rs|java|c|cpp|md|json|yml|yaml|html|css|scss)$/i;
  const filteredPaths = topContributedPaths.filter(p => validExtensions.test(p)).slice(0, 10);
  const corePaths = ['README.md', 'README', 'readme.md', 'package.json', 'requirements.txt', 'go.mod', 'Makefile', 'Cargo.toml'];
  const allPathsToFetch = Array.from(new Set([...corePaths, ...filteredPaths]));

  if (allPathsToFetch.length === 0) return { readme: null, stackFile: null, contributedFiles: [] };

  const aliases = allPathsToFetch.map((path, index) => `
    file_${index}: object(expression: "${branch}:${path}") { ... on Blob { text } }
  `).join('\n');

  const query = `
    query getBatchedFiles($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) { ${aliases} }
    }
  `;

  const fetchOptions: FetchOptions = { next: { revalidate: 3600 }, ...options };
  const response = await fetchGitHubGraphQL<any>(query, { owner, name: repoName }, fetchOptions);
  
  const repoData = response.repository;
  if (!repoData) return { readme: null, stackFile: null, contributedFiles: [] };

  const fileMap = new Map<string, string>();
  allPathsToFetch.forEach((path, index) => {
    const rawText = repoData[`file_${index}`]?.text;
    if (rawText) fileMap.set(path, rawText);
  });

  const readme = fileMap.get('README.md') || fileMap.get('README') || fileMap.get('readme.md') || null;
  const stackFilePayload = 
    (fileMap.has('package.json') && { path: 'package.json', content: fileMap.get('package.json')! }) ||
    (fileMap.has('requirements.txt') && { path: 'requirements.txt', content: fileMap.get('requirements.txt')! }) ||
    (fileMap.has('go.mod') && { path: 'go.mod', content: fileMap.get('go.mod')! }) ||
    (fileMap.has('Cargo.toml') && { path: 'Cargo.toml', content: fileMap.get('Cargo.toml')! }) ||
    (fileMap.has('Makefile') && { path: 'Makefile', content: fileMap.get('Makefile')! }) || null;

  const validContributions = filteredPaths.filter(path => fileMap.has(path)).map(path => ({ path, content: fileMap.get(path)! }));

  return { readme, stackFile: stackFilePayload, contributedFiles: validContributions };
});

export const extractCandidateProfile = cache(async (
  username: string, maxRepos: number = 3, options?: FetchOptions
): Promise<CandidateExtractionResult> => {
  const reposData = await getUserPublicRepositories(username, maxRepos, null, options);
  if (!reposData.userExists) return { username, userExists: false, repositories: [] };

  const structuredAnalysis: CandidateRepositoryAnalysis[] = [];

  for (const repo of reposData.repositories) {
    const owner = repo.url.includes(`github.com/${username}/`) ? username : new URL(repo.url).pathname.split('/')[1];
    const repoName = repo.name;

    const commitGraph = await getRepositoryCommitsByAuthor(username, owner, repoName, 100, null, null, options);
    const totalAuthored = commitGraph.commits.length;
    if (totalAuthored === 0) continue;

    const fileAnalytics = await getTopContributedFiles(username, owner, repoName, 30, options);
    const topPathStrings = fileAnalytics.map(f => f.path);

    const context = await getTargetedRepositoryContext(owner, repoName, topPathStrings, 'HEAD', options);

    let techStack: string | null = null;
    if (context.stackFile?.path === 'package.json') techStack = 'Node.js / TypeScript';
    else if (context.stackFile?.path === 'requirements.txt') techStack = 'Python';
    else if (context.stackFile?.path === 'go.mod') techStack = 'GoLang';
    else if (repo.primaryLanguage?.name) techStack = repo.primaryLanguage.name;

    structuredAnalysis.push({
      repoName, description: repo.description, techStack, readme: context.readme, topFiles: context.contributedFiles,
      commitStats: { totalAuthoredFound: totalAuthored, lastCommitDate: commitGraph.commits[0]?.committedDate || null }
    });
  }

  return { username, userExists: true, repositories: structuredAnalysis };
});

export class GitHubAPIError extends Error {
  constructor(message: string, public status?: number, public errors?: any[]) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubRateLimitError extends Error {
  constructor(public resetAt: Date) {
    super(`GitHub API rate limit exceeded. Resets at ${resetAt.toISOString()}`);
    this.name = 'GitHubRateLimitError';
  }
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: any[];
}

export interface FetchOptions extends RequestInit {
  token?: string;
  timeoutMs?: number;
  retries?: number;
  cacheTime?: number;
}

export interface UserProfile {
  viewer: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
  };
}

export interface RepoDetails {
  repository: {
    name: string;
    description: string | null;
    stargazerCount: number;
    url: string;
  }
}

export interface GitHubRepositoryNode {
  name: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string | null; } | null;
  defaultBranchRef: { name: string; } | null;
  updatedAt: string;
  url: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface UserRepositoriesResponse {
  user: {
    repositories: {
      nodes: (GitHubRepositoryNode | null)[];
      pageInfo: PageInfo;
    };
  } | null;
}

export interface PaginatedRepositories {
  repositories: GitHubRepositoryNode[];
  pageInfo: PageInfo;
  userExists: boolean;
}

export interface GitHubCommitNode {
  message: string;
  committedDate: string;
  changedFilesIfAvailable: number | null;
  url: string;
}

export interface TargetBranchRef {
  target: { history: { nodes: (GitHubCommitNode | null)[]; pageInfo: PageInfo; }; } | null;
}

export interface RepositoryCommitsResponse {
  repository: {
    branchRef: TargetBranchRef | null;
    defaultBranchRef: TargetBranchRef | null;
  } | null;
}

export interface UserIdLookupResponse {
  user: { id: string; } | null;
}

export interface PaginatedCommits {
  commits: GitHubCommitNode[];
  pageInfo: PageInfo;
  repositoryExists: boolean;
}

export interface FileContribution {
  path: string;
  commitsTouched: number;
}

export interface FileResult {
  path: string;
  content: string;
}

export interface RepositoryContextPayload {
  readme: string | null;
  stackFile: FileResult | null;
  contributedFiles: FileResult[];
}

export interface CandidateRepositoryAnalysis {
  repoName: string;
  description: string | null;
  techStack: string | null;
  readme: string | null;
  topFiles: FileResult[];
  commitStats: { totalAuthoredFound: number; lastCommitDate: string | null; };
}

export interface CandidateExtractionResult {
  username: string;
  userExists: boolean;
  repositories: CandidateRepositoryAnalysis[];
}

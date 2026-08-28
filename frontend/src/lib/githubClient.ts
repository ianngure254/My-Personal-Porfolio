import { siteMetadata } from '@/data/meta'

export interface GithubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  fork: boolean
  archived: boolean
}

const USERNAME = siteMetadata.github.replace('https://github.com/', '')
const BASE = 'https://api.github.com'

async function apiFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { headers })
  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export async function fetchPublicRepos(): Promise<GithubRepo[]> {
  const repos = await apiFetch<GithubRepo[]>(
    `/users/${USERNAME}/repos?sort=updated&per_page=100&type=public`,
  )
  return repos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 12)
}

export async function fetchGithubStats(): Promise<{
  public_repos: number
  followers: number
  following: number
  name: string
}> {
  return apiFetch(`/users/${USERNAME}`)
}

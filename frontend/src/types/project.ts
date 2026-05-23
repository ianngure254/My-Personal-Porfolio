export interface CaseStudy {
  problem: string
  solution: string
  impact: string
}

export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  tags: string[]
  liveUrl?: string
  githubUrl?: string
  image: string
  featured: boolean
  year: number
  caseStudy?: CaseStudy
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  publishedAt: string
  readingTime: number
  coverImage?: string
}

export interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
  tags: string[]
  current?: boolean
}

export const experience: ExperienceItem[] = [
  {
    role: 'Full-Stack JavaScript Developer',
    company: 'Freelance',
    period: '2023 — Present',
    description:
      'Designing and shipping production-ready web applications for clients across Kenya and remotely. Responsible for full project lifecycle: requirements gathering, architecture, development, and deployment.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel', 'Railway'],
    current: true,
  },
  {
    role: 'Frontend Developer',
    company: 'Contract Projects',
    period: '2022 — 2023',
    description:
      'Built responsive marketing sites and web apps for small businesses and startups. Focused on performance, accessibility, and mobile-first design using modern CSS and JavaScript.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Netlify'],
    current: false,
  },
]

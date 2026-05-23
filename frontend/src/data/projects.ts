import type { Project } from '@/types/project'

export const projects: Project[] = [
  {
    slug: 'children-welfare-compassion',
    title: 'Children Welfare & Compassion App',
    tagline: 'A platform connecting donors with children in need across Kenya.',
    description:
      'A full-stack giving platform that enables donors to discover, fund, and track welfare initiatives for children. Built with React, Node.js, and PostgreSQL, featuring real-time donation tracking and impact reporting.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Express', 'Tailwind CSS'],
    liveUrl: 'https://give-and-receive.onrender.com/',
    image: '/projects/children-welfare.png',
    featured: true,
    year: 2024,
    caseStudy: {
      problem: 'Non-profits lacked a streamlined digital channel to connect donors with specific children welfare causes.',
      solution: 'Built a full-stack platform with donor dashboards, cause listings, and secure contribution flows.',
      impact: 'Enabled transparent giving with real-time impact metrics visible to every donor.',
    },
  },
  {
    slug: 'retailer-pos',
    title: 'Retailer POS & Analytics',
    tagline: 'A point-of-sale system with custom analytics for retail businesses.',
    description:
      'A production-grade POS application with real-time inventory management, sales tracking, and a custom analytics dashboard. Built to replace expensive off-the-shelf software for small-to-medium retailers.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Chart.js'],
    liveUrl: 'https://stride-analytics-custom.onrender.com/',
    image: '/projects/retailer-pos.png',
    featured: true,
    year: 2024,
    caseStudy: {
      problem: 'Small retailers needed affordable POS software with meaningful analytics beyond basic receipts.',
      solution: 'Designed a custom dashboard with daily/weekly/monthly sales breakdowns, low-stock alerts, and export capabilities.',
      impact: 'Cut manual stock-counting time by over 60% for pilot retail partners.',
    },
  },
  {
    slug: 'developer-portfolio',
    title: 'Developer Mini Portfolio',
    tagline: 'A fast, minimal developer portfolio built with Tailwind CSS.',
    description:
      'A clean, single-page portfolio template showcasing projects and skills. Built as a rapid-deploy starter for developers who want a professional web presence without the overhead.',
    tags: ['HTML', 'Tailwind CSS', 'JavaScript'],
    liveUrl: 'https://tailwind-trial-tailwindcss.onrender.com/',
    image: '/projects/dev-portfolio.png',
    featured: false,
    year: 2023,
  },
  {
    slug: 'mawega-juice',
    title: 'Mawega Juice Company',
    tagline: 'Brand website for a Kenyan juice company with product showcase.',
    description:
      'A fully static marketing website for Mawega Juice Company featuring product listings, brand story, and contact details. Designed with a vibrant color palette to reflect the brand identity.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Netlify'],
    liveUrl: 'https://sensational-gumption-9002d5.netlify.app',
    image: '/projects/mawega-juice.png',
    featured: false,
    year: 2023,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

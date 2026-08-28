export interface Testimonial {
  name: string
  role: string
  company: string
  avatar: string
  quote: string
  linkedinUrl?: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Wanjiku',
    role: 'Project Manager',
    company: 'Give & Receive Initiative',
    avatar: 'SW',
    quote:
      'Ian delivered the children welfare platform ahead of schedule and exceeded every requirement. The donor dashboard he built is intuitive and the real-time tracking feature has genuinely changed how we communicate impact to our partners.',
    linkedinUrl: 'https://linkedin.com/in/ianngure',
  },
  {
    name: 'David Kamau',
    role: 'Owner',
    company: 'Stride Retail',
    avatar: 'DK',
    quote:
      'The POS system Ian built replaced our manual spreadsheets entirely. We now have live sales data, stock alerts, and clean reports — things we never thought we could afford. It pays for itself every month.',
  },
  {
    name: 'Amina Ochieng',
    role: 'Founder',
    company: 'Mawega Juice Company',
    avatar: 'AO',
    quote:
      'Ian understood our brand instantly and turned our ideas into a website that genuinely feels like us. The response from customers has been incredible — several mentioned finding us through the site for the first time.',
  },
]

import { motion } from 'framer-motion'
import { FaReact, FaNodeJs, FaGithub, FaLinkedin } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss } from 'react-icons/si'
import { fadeUp } from '@/animations/variants'
import { siteMetadata } from '@/data/meta'

const NAV = [
  { label: 'Home',       href: '#hero'       },
  { label: 'About',      href: '#about'      },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Skills',       href: '#skills'       },
  { label: 'Contact',      href: '#contact'      },
]

interface FooterProps {}

const Footer = (_props: FooterProps) => {
  const year = new Date().getFullYear()
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        position: 'relative',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Glow accent on top border */}
      <div
        className="divider-glow"
        style={{ position: 'absolute', top: 0, left: '20%', right: '20%' }}
        aria-hidden="true"
      />

      <div
        style={{ maxWidth: '80rem', margin: '0 auto', padding: '3.5rem 1.5rem 0' }}
        className="sm:px-6 lg:px-8"
      >
        <div
          style={{ display: 'grid', gap: '3rem', marginBottom: '3rem' }}
          className="md:grid-cols-3"
        >
          {/* Brand */}
          <div style={{ paddingBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'var(--orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 900, fontFamily: 'var(--font-mono)',
                  color: '#fff', boxShadow: '0 2px 12px rgba(249,115,22,0.35)',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                IN
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-strong)' }}>
                ian<span style={{ color: 'var(--muted)' }}>.dev</span>
              </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 8 }}>
              Full-Stack JavaScript Developer
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              Actively seeking frontend or full-stack roles where I can build scalable,
              high-impact products and grow with a strong engineering team.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{
              fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 16,
            }}>
              Pages
            </h3>
            <nav aria-label="Footer navigation">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {NAV.map(({ label, href }) => (
                  <li key={label}>
                    <button
                      onClick={() => scrollTo(href)}
                      style={{
                        background: 'none', border: 'none', padding: '2px 0',
                        fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
                        color: 'var(--muted)', cursor: 'pointer',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)' }}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Tech Stack + Socials */}
          <div>
            <h3 style={{
              fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 16,
            }}>
              Tech Stack
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '1.5rem', marginBottom: 24 }}>
              <FaReact style={{ color: '#38bdf8' }} title="React" />
              <SiTypescript style={{ color: '#3178c6' }} title="TypeScript" />
              <FaNodeJs style={{ color: '#4ade80' }} title="Node.js" />
              <SiTailwindcss style={{ color: '#34d399' }} title="Tailwind CSS" />
            </div>

            <h3 style={{
              fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700,
              color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.12em',
              marginBottom: 12,
            }}>
              Connect
            </h3>

            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href={siteMetadata.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={{
                  width: 36, height: 36, borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--orange)'
                  e.currentTarget.style.color = 'var(--orange)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <FaGithub size={17} />
              </a>

              <a
                href={siteMetadata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{
                  width: 36, height: 36, borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)', background: 'var(--surface-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--muted)', textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--orange)'
                  e.currentTarget.style.color = 'var(--orange)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--muted)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                <FaLinkedin size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.25rem 0 1.5rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-2)', fontFamily: 'var(--font-mono)' }}>
            © {year}{' '}
            <a
              href={siteMetadata.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--orange)', textDecoration: 'none' }}
            >
              {siteMetadata.name}
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer

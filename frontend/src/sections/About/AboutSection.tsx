import { motion, useReducedMotion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { fadeUp, scaleIn, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { siteMetadata } from '@/data/meta'
import { fetchGithubStats } from '@/lib/githubClient'
import profilePhoto from '@/assets/profile.png'

interface AboutProps {}

const STATS = [
  { value: '3+',   label: 'Years Building'  },
  { value: '10+',  label: 'Projects Shipped' },
  { value: '100%', label: 'Remote-Ready'     },
]

const STACK = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion']

const GhStatsCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['github-stats'],
    queryFn: fetchGithubStats,
    staleTime: 1000 * 60 * 15,
  })

  const GhIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )

  return (
    <a
      href={siteMetadata.github}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-sm)',
        textDecoration: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        width: '100%',
        maxWidth: 320,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'
        e.currentTarget.style.boxShadow = 'var(--glow-orange)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'none'
      }}
      aria-label="View GitHub profile"
    >
      <span style={{ color: 'var(--muted)', flexShrink: 0 }}><GhIcon /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          GitHub Activity
        </p>
        {isLoading ? (
          <div style={{ height: 14, width: 120, borderRadius: 4, background: 'var(--surface-2)', animation: 'pulse 1.8s ease-in-out infinite' }}>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text)', fontWeight: 600 }}>
              <span style={{ color: 'var(--orange)' }}>{data?.public_repos ?? '—'}</span>
              <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 3 }}>repos</span>
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text)', fontWeight: 600 }}>
              <span style={{ color: 'var(--orange)' }}>{data?.followers ?? '—'}</span>
              <span style={{ color: 'var(--muted)', fontWeight: 400, marginLeft: 3 }}>followers</span>
            </span>
          </div>
        )}
      </div>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted-2)', flexShrink: 0 }} aria-hidden="true">
        <path d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
    </a>
  )
}

const AboutSection = (_props: AboutProps) => {
  const prefersReduced = useReducedMotion()

  return (
    <Section id="about">
      <SectionHeading eyebrow="About Me" title="The person behind the code" align="left" />

      <div style={{ display: 'grid', gap: '3rem' }} className="lg:grid-cols-[340px_1fr] lg:gap-20 items-start">

        {/* ── Photo column ── */}
        <motion.div
          variants={prefersReduced ? undefined : scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
          className="lg:items-start"
        >
          {/* Photo wrapper */}
          <div style={{ position: 'relative' }}>
            {/* Gradient ring */}
            <div style={{
              position: 'absolute',
              inset: -3,
              borderRadius: 'calc(var(--r-xl) + 3px)',
              background: 'var(--orange)',
              opacity: 0.6,
              filter: 'blur(2px)',
            }} aria-hidden="true" />

            <div style={{
              position: 'relative',
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <img
                src={profilePhoto}
                alt="Ian Ngure — Full-Stack JavaScript Developer"
                width={320}
                height={320}
                style={{ display: 'block', objectFit: 'cover', objectPosition: 'center' }}
                className="h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                loading="lazy"
              />
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
              }} aria-hidden="true" />
            </div>

            {/* Available badge */}
            <div style={{
              position: 'absolute',
              bottom: -14, left: '50%', transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px',
              borderRadius: 'var(--r-full)',
              border: '1px solid rgba(249,115,22,0.3)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap',
            }}>
              <span className="live-dot" aria-hidden="true" />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--orange)', fontFamily: 'var(--font-mono)' }}>
                Available for work
              </span>
            </div>
          </div>

          {/* Stats */}
          <dl
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', width: '100%', maxWidth: 320, marginTop: '0.75rem' }}
            className="lg:max-w-none"
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="card-flat"
                style={{ padding: '0.875rem 0.5rem', textAlign: 'center' }}
              >
                <dt
                  className="g-text"
                  style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1, display: 'block', marginBottom: 4 }}
                >
                  {value}
                </dt>
                <dd style={{ fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 500, lineHeight: 1.3 }}>{label}</dd>
              </div>
            ))}
          </dl>

          {/* GitHub live stats */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUp}
            style={{ width: '100%', maxWidth: 320 }}
            className="lg:max-w-none"
          >
            <GhStatsCard />
          </motion.div>
        </motion.div>

        {/* ── Text column ── */}
        <motion.div
          variants={prefersReduced ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          className="lg:pt-2"
        >
          <motion.p variants={prefersReduced ? undefined : fadeUp} style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--muted)' }}>
            I'm a full-stack JavaScript developer based in{' '}
            <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{siteMetadata.location}</span>,
            focused on building web applications that are fast, accessible, and genuinely useful.
          </motion.p>

          <motion.p variants={prefersReduced ? undefined : fadeUp} style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--muted)' }}>
            My stack centers on{' '}
            <span style={{ color: 'var(--orange)', fontWeight: 600 }}>React</span> and{' '}
            <span style={{ color: 'var(--orange)', fontWeight: 600 }}>TypeScript</span> on the frontend,
            paired with{' '}
            <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>Node.js</span> and{' '}
            <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>PostgreSQL</span> on the backend.
            I care deeply about clean architecture, type safety, and code that's a pleasure to maintain.
          </motion.p>

          <motion.p variants={prefersReduced ? undefined : fadeUp} style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--muted)' }}>
            I'm actively looking for{' '}
            <span style={{ color: 'var(--orange)', fontWeight: 600 }}>remote full-time or contract roles</span>{' '}
            where I can solve hard problems and ship great products.
          </motion.p>

          {/* Stack */}
          <motion.div variants={prefersReduced ? undefined : fadeUp}>
            <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              Current stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STACK.map((tech) => (
                <span key={tech} className="pill pill-orange">{tech}</span>
              ))}
            </div>
          </motion.div>

          {/* Info items */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUp}
            style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {[
              { label: 'Location',     text: `${siteMetadata.location} · Remote` },
              { label: 'Availability', text: 'Open to full-time & contract'       },
              { label: 'Work style',   text: 'Fast turnaround · Clean code'       },
            ].map(({ label, text }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.875rem' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  minWidth: 80, textAlign: 'center',
                  flexShrink: 0,
                }}>{label}</span>
                <span style={{ color: 'var(--muted)' }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  )
}

export default AboutSection

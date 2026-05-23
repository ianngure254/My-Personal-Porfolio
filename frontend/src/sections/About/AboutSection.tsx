import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { siteMetadata } from '@/data/meta'
import profilePhoto from '@/assets/profile.png'

interface AboutProps {}

const STATS = [
  { value: '3+',   label: 'Years Building'  },
  { value: '10+',  label: 'Projects Shipped' },
  { value: '100%', label: 'Remote-Ready'     },
]

const STACK = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion']

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
              background: 'linear-gradient(135deg, var(--cyan), var(--emerald), var(--violet))',
              opacity: 0.7,
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
              border: '1px solid rgba(52,211,153,0.3)',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-md)',
              whiteSpace: 'nowrap',
            }}>
              <span className="live-dot" aria-hidden="true" />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--emerald)', fontFamily: 'var(--font-mono)' }}>
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
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>React</span> and{' '}
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>TypeScript</span> on the frontend,
            paired with{' '}
            <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>Node.js</span> and{' '}
            <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>PostgreSQL</span> on the backend.
            I care deeply about clean architecture, type safety, and code that's a pleasure to maintain.
          </motion.p>

          <motion.p variants={prefersReduced ? undefined : fadeUp} style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--muted)' }}>
            I'm actively looking for{' '}
            <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>remote full-time or contract roles</span>{' '}
            where I can solve hard problems and ship great products.
          </motion.p>

          {/* Stack */}
          <motion.div variants={prefersReduced ? undefined : fadeUp}>
            <p style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 10 }}>
              Current stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STACK.map((tech) => (
                <span key={tech} className="pill pill-cyan">{tech}</span>
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

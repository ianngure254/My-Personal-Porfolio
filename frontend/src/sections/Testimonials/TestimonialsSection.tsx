import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { testimonials } from '@/data/testimonials'

interface TestimonialsProps {}

const QuoteIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M11.3 6C8.2 6 6 8.3 6 11.3c0 2.7 1.8 4.9 4.4 5.4L9 21h2.5l1.5-4.8c2.4-.7 4-2.8 4-5.2C17 8.1 14.5 6 11.3 6zm-6.7 0C1.5 6 0 8.3 0 11.3c0 2.7 1.8 4.9 4.4 5.4L2.3 21h2.5l1.5-4.8c2.4-.7 4-2.8 4-5.2C10.3 8.1 7.8 6 4.6 6z" opacity="0.3"/>
  </svg>
)

const StarRow = () => (
  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }} aria-label="5 stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--orange)" aria-hidden="true">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ))}
  </div>
)

const AvatarInitials = ({ initials, accent }: { initials: string; accent: string }) => (
  <div
    style={{
      width: 44, height: 44,
      borderRadius: '50%',
      background: accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.75rem', fontWeight: 800, color: '#fff',
      fontFamily: 'var(--font-mono)',
      flexShrink: 0,
      boxShadow: `0 2px 12px color-mix(in srgb, ${accent} 40%, transparent)`,
    }}
    aria-hidden="true"
  >
    {initials}
  </div>
)

const ACCENTS = ['var(--orange)', 'var(--orange)', 'var(--orange)']

const TestimonialsSection = (_props: TestimonialsProps) => {
  const prefersReduced = useReducedMotion()

  return (
    <Section id="testimonials" style={{ background: 'var(--surface)' } as React.CSSProperties}>
      <div className="divider" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} aria-hidden="true" />

      <SectionHeading
        eyebrow="Testimonials"
        title="What clients say"
        description="Feedback from people I've shipped real products with."
      />

      <motion.div
        variants={prefersReduced ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        style={{ display: 'grid', gap: '1.25rem' }}
        className="md:grid-cols-3"
      >
        {testimonials.map((t, idx) => {
          const accent = ACCENTS[idx % ACCENTS.length]
          return (
            <motion.blockquote
              key={t.name}
              variants={prefersReduced ? undefined : fadeUp}
              className="card"
              style={{
                display: 'flex', flexDirection: 'column', padding: '1.75rem',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                opacity: 0.7,
              }} aria-hidden="true" />

              {/* Quote icon */}
              <div style={{ color: accent, marginBottom: 8 }}><QuoteIcon /></div>

              <StarRow />

              <p style={{
                fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.8, flex: 1,
                fontStyle: 'italic', marginBottom: '1.5rem',
              }}>
                "{t.quote}"
              </p>

              {/* Attribution */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
                <AvatarInitials initials={t.avatar} accent={accent} />
                <div style={{ minWidth: 0 }}>
                  {t.linkedinUrl ? (
                    <a
                      href={t.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none' }}
                    >
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 2 }}>{t.name}</p>
                    </a>
                  ) : (
                    <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 2 }}>{t.name}</p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.4 }}>
                    {t.role}
                    {t.company && (
                      <> · <span style={{ color: accent, fontWeight: 500 }}>{t.company}</span></>
                    )}
                  </p>
                </div>
              </div>
            </motion.blockquote>
          )
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.p
        variants={prefersReduced ? undefined : fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}
      >
        Have we worked together?{' '}
        <a
          href="https://linkedin.com/in/ianngure"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--orange)', textDecoration: 'underline', textUnderlineOffset: 3, fontWeight: 600 }}
        >
          Leave a recommendation on LinkedIn
        </a>
      </motion.p>
    </Section>
  )
}

export default TestimonialsSection

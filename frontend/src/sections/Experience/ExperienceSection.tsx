import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { experience } from '@/data/experience'

interface ExperienceProps {}

const ExperienceSection = (_props: ExperienceProps) => {
  const prefersReduced = useReducedMotion()

  return (
    <Section id="experience">
      <div className="divider" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} aria-hidden="true" />

      <SectionHeading eyebrow="Experience" title="Where I've worked" align="left" />

      <div className="exp-timeline">
        <motion.ol
          className="exp-list"
          variants={prefersReduced ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          aria-label="Work experience timeline"
        >
          {experience.map((item, idx) => (
            <motion.li
              key={`${item.company}-${idx}`}
              className="exp-item"
              variants={prefersReduced ? undefined : fadeUp}
            >
              {/* Timeline dot */}
              <div
                className={item.current ? 'exp-dot exp-dot--current' : 'exp-dot'}
                aria-hidden="true"
              >
                {item.current && (
                  <motion.span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'block',
                    }}
                    animate={prefersReduced ? {} : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>

              {/* Card */}
              <div className={item.current ? 'exp-card exp-card--current' : 'exp-card'}>
                {item.current && <div className="exp-card__accent" aria-hidden="true" />}
                {item.current && <div className="exp-card__glow" aria-hidden="true" />}

                {/* Header */}
                <div className="exp-card__header">
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.0625rem',
                      fontWeight: 700,
                      color: 'var(--text-strong)',
                      lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      marginBottom: '0.3rem',
                    }}>
                      {item.role}
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: item.current ? 'var(--cyan)' : 'var(--muted)',
                      fontWeight: 500,
                    }}>
                      {item.company}
                    </p>
                  </div>

                  <div className="exp-card__meta">
                    {item.current && (
                      <span className="exp-badge exp-badge--current">
                        <motion.span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: 'var(--emerald)',
                            display: 'inline-block',
                            flexShrink: 0,
                          }}
                          animate={prefersReduced ? {} : { opacity: [1, 0.25, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          aria-hidden="true"
                        />
                        Current
                      </span>
                    )}
                    <span className="exp-badge exp-badge--period">{item.period}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="exp-card__divider" aria-hidden="true" />

                {/* Description */}
                <p style={{
                  fontSize: '0.9rem',
                  lineHeight: 1.85,
                  color: 'var(--muted)',
                }}>
                  {item.description}
                </p>

                {/* Tags */}
                <div className="exp-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="pill">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </Section>
  )
}

export default ExperienceSection

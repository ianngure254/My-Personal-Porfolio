import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import { skills } from '@/data/skills'

interface SkillsProps {}

interface SkillBarProps {
  name: string
  level: number
  index: number
}

const LEVEL_MAP = [
  { min: 90, label: 'Expert',     color: 'var(--orange)'    },
  { min: 80, label: 'Advanced',   color: 'var(--text-strong)' },
  { min: 70, label: 'Proficient', color: 'var(--text)'  },
  { min: 0,  label: 'Competent',  color: 'var(--muted)'   },
]

const getLevel = (n: number) => LEVEL_MAP.find(({ min }) => n >= min)!

const SkillBar = ({ name, level, index }: SkillBarProps) => {
  const prefersReduced = useReducedMotion()
  const { label, color } = getLevel(level)

  return (
    <motion.div variants={prefersReduced ? undefined : fadeUp} custom={index}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color }}>{label}</span>
          <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted-2)' }}>{level}%</span>
        </div>
      </div>
      <div
        className="skill-track"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: ${level}%`}
      >
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={
            prefersReduced
              ? { duration: 0 }
              : { duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }
          }
        />
      </div>
    </motion.div>
  )
}

const CATEGORIES: Record<string, { icon: string; accent: string }> = {
  'Frontend':       { icon: '</>', accent: 'var(--orange)' },
  'Backend':        { icon: '⚙',  accent: 'var(--orange)' },
  'Tools & DevOps': { icon: '🛠',  accent: 'var(--orange)' },
}

const SkillsSection = (_props: SkillsProps) => {
  const prefersReduced = useReducedMotion()

  return (
    <Section id="skills" style={{ background: 'var(--surface)' } as React.CSSProperties}>
      {/* top divider */}
      <div className="divider" style={{ position: 'absolute', top: 0, left: 0, right: 0 }} aria-hidden="true" />

      <SectionHeading
        eyebrow="Skills"
        title="Tools I build with"
        description="Technologies I use daily to ship production-ready applications."
      />

      <div
        style={{ display: 'grid', gap: '1.25rem' }}
        className="md:grid-cols-3"
      >
        {skills.map((cat) => {
          const meta = CATEGORIES[cat.category] ?? { icon: '●', accent: 'var(--orange)' }

          return (
            <div
              key={cat.category}
              className="card"
              style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}
            >
              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)`,
                opacity: 0.7,
                borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
              }} aria-hidden="true" />

              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: 'var(--r-md)',
                  border: `1px solid`,
                  borderColor: `color-mix(in srgb, ${meta.accent} 30%, transparent)`,
                  background: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.875rem',
                  color: meta.accent,
                  flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                }}>
                  {meta.icon}
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--text)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase' as const,
                }}>
                  {cat.category}
                </span>
              </div>

              <motion.div
                variants={prefersReduced ? undefined : staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
              >
                {cat.skills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} index={i} />
                ))}
              </motion.div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export default SkillsSection

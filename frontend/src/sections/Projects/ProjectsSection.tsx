import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { projects } from '@/data/projects'

interface ProjectsProps {}

const ALL = 'All'

const BANNERS: Record<string, string> = {
  welfare:   'linear-gradient(135deg,#7f1d1d 0%,#1a0510 100%)',
  pos:       'linear-gradient(135deg,#78350f 0%,#0c1a08 100%)',
  portfolio: 'linear-gradient(135deg,#0c2a4a 0%,#050d1a 100%)',
  default:   'linear-gradient(135deg,#064e3b 0%,#071a12 100%)',
}

const getBanner = (slug: string): string => {
  if (slug.includes('welfare'))   return BANNERS.welfare
  if (slug.includes('pos'))       return BANNERS.pos
  if (slug.includes('portfolio')) return BANNERS.portfolio
  return BANNERS.default
}

const ExternalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
  </svg>
)

const GhIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
)

const ProjectsSection = (_props: ProjectsProps) => {
  const prefersReduced = useReducedMotion()
  const [filter, setFilter] = useState(ALL)

  const allTags = [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))]
  const filtered = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter))
  
  const featuredFiltered = filtered.filter((p) => p.featured)
  const regularFiltered = filtered.filter((p) => !p.featured)

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="Production applications shipped for real users — each solving a distinct problem."
      />

      {/* Filter row */}
      <motion.div
        variants={prefersReduced ? undefined : staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: '2.5rem' }}
        role="group"
        aria-label="Filter projects by technology"
      >
        {allTags.slice(0, 9).map((tag) => (
          <motion.span key={tag} variants={prefersReduced ? undefined : fadeUp}>
            <Tag label={tag} active={filter === tag} onClick={() => setFilter(tag)} />
          </motion.span>
        ))}
      </motion.div>

      {/* Featured Projects Grid (full width, larger) */}
      {featuredFiltered.length > 0 && (
        <motion.div
          variants={prefersReduced ? undefined : staggerContainer}
          initial="hidden"
          animate="visible"
          key={`featured-${filter}`}
          style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}
          className="lg:grid-cols-2"
        >
          {/* Featured Projects */}
          {featuredFiltered.map((project, idx) => {
            const gradient = getBanner(project.slug)

            return (
              <motion.article
                key={project.slug}
                variants={prefersReduced ? undefined : scaleIn}
                custom={idx}
                layout
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '2px solid var(--orange)',
                  boxShadow: '0 0 0 1px rgba(255,140,66,0.1), 0 8px 32px rgba(255,140,66,0.08)',
                }}
              >
                {/* Banner */}
                <div style={{
                  position: 'relative',
                  height: 220,
                  borderBottom: '1px solid var(--border)',
                  overflow: 'hidden',
                  background: gradient,
                }}>
                  <img
                    src={project.image}
                    alt={`${project.title} screenshot`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />

                  {/* Featured Badge */}
                  <span style={{
                    position: 'absolute', top: 16, right: 16,
                    padding: '6px 14px',
                    borderRadius: 'var(--r-full)',
                    background: 'linear-gradient(135deg, rgba(255,140,66,0.2), rgba(255,140,66,0.1))',
                    border: '1px solid rgba(255,140,66,0.5)',
                    color: 'var(--orange)',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    backdropFilter: 'blur(8px)',
                  }}>★ FEATURED</span>

                  {/* Year */}
                  <span style={{
                    position: 'absolute', top: 16, left: 16,
                    padding: '4px 10px',
                    borderRadius: 'var(--r-full)',
                    background: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    backdropFilter: 'blur(6px)',
                  }}>{project.year}</span>
                </div>

                {/* Body */}
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1.2, marginBottom: 12 }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.25rem', flex: 1 }}>
                    {project.description}
                  </p>

                  {/* Case study (if available) */}
                  {project.caseStudy && (
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Problem</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{project.caseStudy.problem}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Impact</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{project.caseStudy.impact}</p>
                      </div>
                    </div>
                  )}

                  {/* Tech pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
                    {project.tags.map((t) => (
                      <span key={t} className="pill" style={{ fontSize: '0.7rem' }}>{t}</span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    {project.liveUrl && (
                      <Button label="View Live" href={project.liveUrl} variant="primary" size="md" external icon={<ExternalIcon />} />
                    )}
                    {project.githubUrl && (
                      <Button label="Source Code" href={project.githubUrl} variant="outline" size="md" external icon={<GhIcon />} iconPosition="left" />
                    )}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      )}

      {/* Regular Projects Grid */}
      {regularFiltered.length > 0 && (
        <>
          {featuredFiltered.length > 0 && (
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '2rem 0' }} aria-hidden="true" />
          )}
          <motion.div
            variants={prefersReduced ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            key={`regular-${filter}`}
            style={{ display: 'grid', gap: '1.25rem' }}
            className="sm:grid-cols-2"
          >
            {regularFiltered.map((project) => {
              const gradient = getBanner(project.slug)

              return (
                <motion.article
                  key={project.slug}
                  variants={prefersReduced ? undefined : scaleIn}
                  layout
                  className="card"
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  {/* Banner */}
                  <div style={{
                    position: 'relative',
                    height: 160,
                    borderBottom: '1px solid var(--border)',
                    overflow: 'hidden',
                    background: gradient,
                  }}>
                    <img
                      src={project.image}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />

                    <span style={{
                      position: 'absolute', top: 10, left: 10,
                      padding: '3px 10px',
                      borderRadius: 'var(--r-full)',
                      background: 'rgba(0,0,0,0.55)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      backdropFilter: 'blur(6px)',
                    }}>{project.year}</span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 8 }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem', flex: 1 }}>
                      {project.tagline}
                    </p>

                    {/* Tech pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                      {project.tags.slice(0, 4).map((t) => (
                        <span key={t} className="pill" style={{ fontSize: '0.68rem' }}>{t}</span>
                      ))}
                      {project.tags.length > 4 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-2)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      {project.liveUrl && (
                        <Button label="Live Demo" href={project.liveUrl} variant="primary" size="sm" external icon={<ExternalIcon />} />
                      )}
                      {project.githubUrl && (
                        <Button label="Source" href={project.githubUrl} variant="outline" size="sm" external icon={<GhIcon />} iconPosition="left" />
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </>
      )}
    </Section>
  )
}

export default ProjectsSection

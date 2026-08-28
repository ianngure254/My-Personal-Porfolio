import { useState, type ChangeEvent, type FormEvent } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { fadeUp, scaleIn, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import { projects as staticProjects } from '@/data/projects'
import type { Project } from '@/types/project'
import { fetchPublicRepos } from '@/lib/githubClient'

interface ProjectsProps {}

const ALL = 'All'

type Tab = 'mine' | 'github' | 'add'

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

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const ForkIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="12" cy="6" r="3"/>
    <path d="M6 15V9a6 6 0 0012 0v6"/>
  </svg>
)

/* ── Tab navigation ── */
interface TabBtnProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  badge?: string | number
}

const TabBtn = ({ active, onClick, children, badge }: TabBtnProps) => (
  <button
    onClick={onClick}
    style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: '8px 20px',
      fontSize: '0.8125rem',
      fontWeight: 600,
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--r-full)',
      border: active ? 'none' : '1px solid var(--border)',
      cursor: 'pointer',
      background: active ? 'var(--orange)' : 'var(--surface)',
      color: active ? '#fff' : 'var(--muted)',
      boxShadow: active ? '0 2px 16px rgba(249,115,22,0.25)' : 'var(--shadow-sm)',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap' as const,
    }}
  >
    {children}
    {badge !== undefined && (
      <span style={{
        padding: '1px 7px',
        borderRadius: 'var(--r-full)',
        fontSize: '0.62rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)',
        color: active ? '#fff' : 'var(--muted)',
        border: active ? 'none' : '1px solid var(--border)',
      }}>
        {badge}
      </span>
    )}
  </button>
)

/* ── My Projects panel ── */
const MyProjectsPanel = ({ projects }: { projects: Project[] }) => {
  const prefersReduced = useReducedMotion()
  const [filter, setFilter] = useState(ALL)

  const allTags = [ALL, ...Array.from(new Set(projects.flatMap((p) => p.tags)))]
  const filtered = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter))
  const featuredFiltered = filtered.filter((p) => p.featured)
  const regularFiltered  = filtered.filter((p) => !p.featured)

  return (
    <>
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

      {/* Featured */}
      {featuredFiltered.length > 0 && (
        <motion.div
          variants={prefersReduced ? undefined : staggerContainer}
          initial="hidden"
          animate="visible"
          key={`featured-${filter}`}
          style={{ display: 'grid', gap: '1.5rem', marginBottom: '3rem' }}
          className="lg:grid-cols-2"
        >
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
                  display: 'flex', flexDirection: 'column', overflow: 'hidden',
                  border: '2px solid var(--orange)',
                  boxShadow: '0 0 0 1px rgba(249,115,22,0.1), 0 8px 32px rgba(249,115,22,0.08)',
                }}
              >
                <div style={{ position: 'relative', height: 220, borderBottom: '1px solid var(--border)', overflow: 'hidden', background: gradient }}>
                  <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={{ position: 'absolute', top: 16, right: 16, padding: '6px 14px', borderRadius: 'var(--r-full)', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.5)', color: 'var(--orange)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', backdropFilter: 'blur(8px)' }}>★ FEATURED</span>
                  <span style={{ position: 'absolute', top: 16, left: 16, padding: '4px 10px', borderRadius: 'var(--r-full)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 600, backdropFilter: 'blur(6px)' }}>{project.year}</span>
                </div>
                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1.2, marginBottom: 12 }}>{project.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: '1.25rem', flex: 1 }}>{project.description}</p>
                  {project.caseStudy && (
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Problem</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{project.caseStudy.problem}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-strong)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Impact</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text)', lineHeight: 1.6 }}>{project.caseStudy.impact}</p>
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.5rem' }}>
                    {project.tags.map((t) => <span key={t} className="pill" style={{ fontSize: '0.7rem' }}>{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {project.liveUrl  && <Button label="View Live"    href={project.liveUrl}   variant="primary" size="md" external icon={<ExternalIcon />} />}
                    {project.githubUrl && <Button label="Source Code" href={project.githubUrl} variant="outline" size="md" external icon={<GhIcon />} iconPosition="left" />}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      )}

      {/* Regular */}
      {regularFiltered.length > 0 && (
        <>
          {featuredFiltered.length > 0 && <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--border),transparent)', margin: '2rem 0' }} aria-hidden="true" />}
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
                <motion.article key={project.slug} variants={prefersReduced ? undefined : scaleIn} layout className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ position: 'relative', height: 160, borderBottom: '1px solid var(--border)', overflow: 'hidden', background: gradient }}>
                    <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <span style={{ position: 'absolute', top: 10, left: 10, padding: '3px 10px', borderRadius: 'var(--r-full)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', backdropFilter: 'blur(6px)' }}>{project.year}</span>
                  </div>
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 8 }}>{project.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '1rem', flex: 1 }}>{project.tagline}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
                      {project.tags.slice(0, 4).map((t) => <span key={t} className="pill" style={{ fontSize: '0.68rem' }}>{t}</span>)}
                      {project.tags.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--muted-2)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>+{project.tags.length - 4}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {project.liveUrl   && <Button label="Live Demo" href={project.liveUrl}   variant="primary" size="sm" external icon={<ExternalIcon />} />}
                      {project.githubUrl && <Button label="Source"    href={project.githubUrl} variant="outline" size="sm" external icon={<GhIcon />} iconPosition="left" />}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        </>
      )}
    </>
  )
}

/* ── GitHub Repos panel ── */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f0db4f',
  Python:     '#3572A5',
  Rust:       '#dea584',
  Go:         '#00ADD8',
  CSS:        '#563d7c',
  HTML:       '#e34c26',
  Shell:      '#89e051',
}

const GithubReposPanel = () => {
  const prefersReduced = useReducedMotion()
  const { data: repos, isLoading, isError } = useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchPublicRepos,
    staleTime: 1000 * 60 * 10,
  })

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gap: '1.25rem' }} className="sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card" style={{ height: 180, background: 'var(--surface)', animation: 'pulse 1.8s ease-in-out infinite' }}>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        ))}
      </div>
    )
  }

  if (isError || !repos) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Could not load GitHub repositories. This may be due to API rate limits.
        </p>
        <Button label="View on GitHub" href="https://github.com/ianngure254" variant="outline" size="md" external icon={<GhIcon />} iconPosition="left" />
      </div>
    )
  }

  return (
    <motion.div
      variants={prefersReduced ? undefined : staggerContainer}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gap: '1.25rem' }}
      className="sm:grid-cols-2 lg:grid-cols-3"
    >
      {repos.map((repo) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          variants={prefersReduced ? undefined : fadeUp}
          className="card"
          style={{
            display: 'flex', flexDirection: 'column', padding: '1.5rem',
            textDecoration: 'none', cursor: 'pointer',
          }}
          whileHover={{ y: -4 }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted-2)', letterSpacing: '0.05em' }}>public repo</span>
            <GhIcon />
          </div>

          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 8, wordBreak: 'break-word' }}>
            {repo.name}
          </h3>

          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, flex: 1, marginBottom: '1rem' }}>
            {repo.description ?? 'No description provided.'}
          </p>

          {/* Topics */}
          {repo.topics.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '1rem' }}>
              {repo.topics.slice(0, 3).map((t) => (
                <span key={t} className="pill" style={{ fontSize: '0.62rem' }}>{t}</span>
              ))}
              {repo.topics.length > 3 && <span style={{ fontSize: '0.68rem', color: 'var(--muted-2)', alignSelf: 'center', fontFamily: 'var(--font-mono)' }}>+{repo.topics.length - 3}</span>}
            </div>
          )}

          {/* Footer stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
            {repo.language && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'var(--muted)' }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: LANG_COLORS[repo.language] ?? 'var(--muted)', flexShrink: 0 }} />
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--muted)' }}>
                <StarIcon />{repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--muted)' }}>
                <ForkIcon />{repo.forks_count}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: 'var(--muted-2)', fontFamily: 'var(--font-mono)' }}>
              {new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
        </motion.a>
      ))}
    </motion.div>
  )
}

/* ── Add Project panel ── */
interface NewProjectForm {
  title: string
  tagline: string
  description: string
  tags: string
  liveUrl: string
  githubUrl: string
  year: string
  featured: boolean
  problem: string
  solution: string
  impact: string
}

const EMPTY_FORM: NewProjectForm = {
  title: '', tagline: '', description: '', tags: '', liveUrl: '',
  githubUrl: '', year: String(new Date().getFullYear()), featured: false,
  problem: '', solution: '', impact: '',
}

const AddProjectPanel = ({
  onAdd,
}: {
  onAdd: (p: Project) => void
}) => {
  const [form, setForm]       = useState<NewProjectForm>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [errors, setErrors]   = useState<Partial<Record<keyof NewProjectForm, string>>>({})

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setForm((p) => ({ ...p, [name]: val }))
    if (errors[name as keyof NewProjectForm]) setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof NewProjectForm, string>> = {}
    if (!form.title.trim())       e.title       = 'Title is required'
    if (!form.tagline.trim())     e.tagline     = 'Tagline is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.tags.trim())        e.tags        = 'At least one tag is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const buildProject = (): Project => {
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
    const proj: Project = {
      slug,
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      tags,
      liveUrl:   form.liveUrl.trim()   || undefined,
      githubUrl: form.githubUrl.trim() || undefined,
      image: `/projects/${slug}.png`,
      featured: form.featured,
      year: parseInt(form.year, 10) || new Date().getFullYear(),
    }
    if (form.problem.trim() || form.impact.trim()) {
      proj.caseStudy = {
        problem:  form.problem.trim(),
        solution: form.solution.trim(),
        impact:   form.impact.trim(),
      }
    }
    return proj
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    const project = buildProject()
    onAdd(project)
    setSubmitted(true)
  }

  const codeSnippet = submitted ? (() => {
    const p = buildProject()
    return `  {
    slug: '${p.slug}',
    title: '${p.title}',
    tagline: '${p.tagline}',
    description: '${p.description}',
    tags: [${p.tags.map((t) => `'${t}'`).join(', ')}],
    liveUrl: ${p.liveUrl ? `'${p.liveUrl}'` : 'undefined'},
    githubUrl: ${p.githubUrl ? `'${p.githubUrl}'` : 'undefined'},
    image: '${p.image}',
    featured: ${p.featured},
    year: ${p.year},${p.caseStudy ? `
    caseStudy: {
      problem: '${p.caseStudy.problem}',
      solution: '${p.caseStudy.solution}',
      impact: '${p.caseStudy.impact}',
    },` : ''}
  },`
  })() : ''

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
    color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.14em',
    marginBottom: '0.4rem', fontWeight: 600,
  }

  const inputStyle = (field: keyof NewProjectForm): React.CSSProperties => ({
    width: '100%', padding: '11px 14px', fontSize: '0.9rem',
    fontFamily: 'var(--font-sans)', borderRadius: 'var(--r-lg)',
    border: `1.5px solid ${errors[field] ? 'rgba(248,113,113,0.6)' : 'var(--border)'}`,
    background: 'var(--surface-2)', color: 'var(--text)', outline: 'none',
    transition: 'border-color 0.2s ease',
  })

  if (submitted) {
    const preview = buildProject()
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Live preview card */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem', fontWeight: 700 }}>
            ✓ Project added — live preview below
          </p>
          <motion.article
            className="card"
            style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '2px solid var(--orange)', maxWidth: 480 }}
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
          >
            <div style={{ height: 100, background: getBanner(preview.slug), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>NO IMAGE YET — add /public/projects/{preview.slug}.png</span>
            </div>
            <div style={{ padding: '1.25rem 1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 6 }}>{preview.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: 10 }}>{preview.tagline}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {preview.tags.map((t) => <span key={t} className="pill" style={{ fontSize: '0.65rem' }}>{t}</span>)}
              </div>
            </div>
          </motion.article>
        </div>

        {/* Code snippet to paste into projects.ts */}
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.05em' }}>
              src/data/projects.ts — paste into the array
            </span>
            <button
              onClick={copyToClipboard}
              style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: copied ? 'var(--orange)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, transition: 'color 0.2s' }}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre style={{ padding: '1rem 1.25rem', fontSize: '0.72rem', color: 'var(--text)', overflowX: 'auto', lineHeight: 1.8, margin: 0 }}>
            <code>{codeSnippet}</code>
          </pre>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Copy the snippet above into <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>src/data/projects.ts</code>, add a screenshot to <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>public/projects/{preview.slug}.png</code>, then redeploy.
        </p>

        <button
          onClick={() => { setForm(EMPTY_FORM); setSubmitted(false) }}
          style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--orange)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, fontFamily: 'var(--font-sans)' }}
        >
          + Add another project
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add new project form"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gap: '1.5rem', maxWidth: 720 }}
    >
      <div style={{ padding: '1rem 1.25rem', borderRadius: 'var(--r-lg)', background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Fill in the form to preview a new project entry. The generated code snippet can be pasted into <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--orange)' }}>src/data/projects.ts</code> to make it permanent.
        </p>
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gap: '1.25rem' }} className="sm:grid-cols-2">
        <div>
          <label style={labelStyle} htmlFor="ap-title">Project Title *</label>
          <input id="ap-title" name="title" value={form.title} onChange={onChange} placeholder="My Awesome Project" style={inputStyle('title')} />
          {errors.title && <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--error)' }}>{errors.title}</p>}
        </div>
        <div>
          <label style={labelStyle} htmlFor="ap-year">Year *</label>
          <input id="ap-year" name="year" type="number" min={2000} max={2099} value={form.year} onChange={onChange} style={inputStyle('year')} />
        </div>
      </div>

      {/* Tagline */}
      <div>
        <label style={labelStyle} htmlFor="ap-tagline">Tagline * <span style={{ color: 'var(--muted-2)', textTransform: 'none', letterSpacing: 0 }}>(one sentence)</span></label>
        <input id="ap-tagline" name="tagline" value={form.tagline} onChange={onChange} placeholder="A platform that does X for Y users." style={inputStyle('tagline')} />
        {errors.tagline && <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--error)' }}>{errors.tagline}</p>}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle} htmlFor="ap-description">Description * <span style={{ color: 'var(--muted-2)', textTransform: 'none', letterSpacing: 0 }}>(2–3 sentences)</span></label>
        <textarea id="ap-description" name="description" rows={3} value={form.description} onChange={onChange} placeholder="Full description of the project..." style={{ ...inputStyle('description'), resize: 'none' }} />
        {errors.description && <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--error)' }}>{errors.description}</p>}
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle} htmlFor="ap-tags">Tech Tags * <span style={{ color: 'var(--muted-2)', textTransform: 'none', letterSpacing: 0 }}>(comma-separated)</span></label>
        <input id="ap-tags" name="tags" value={form.tags} onChange={onChange} placeholder="React, TypeScript, Node.js, PostgreSQL" style={inputStyle('tags')} />
        {errors.tags && <p style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--error)' }}>{errors.tags}</p>}
      </div>

      {/* URLs */}
      <div style={{ display: 'grid', gap: '1.25rem' }} className="sm:grid-cols-2">
        <div>
          <label style={labelStyle} htmlFor="ap-liveUrl">Live URL</label>
          <input id="ap-liveUrl" name="liveUrl" type="url" value={form.liveUrl} onChange={onChange} placeholder="https://myproject.com" style={inputStyle('liveUrl')} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="ap-githubUrl">GitHub URL</label>
          <input id="ap-githubUrl" name="githubUrl" type="url" value={form.githubUrl} onChange={onChange} placeholder="https://github.com/user/repo" style={inputStyle('githubUrl')} />
        </div>
      </div>

      {/* Featured toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={onChange}
          style={{ width: 16, height: 16, accentColor: 'var(--orange)', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>
          Mark as <strong style={{ color: 'var(--orange)' }}>featured</strong> (shown larger at top)
        </span>
      </label>

      {/* Case study */}
      <details style={{ borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <summary style={{ padding: '12px 16px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', background: 'var(--surface-2)', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--orange)', letterSpacing: '0.1em' }}>▸</span>
          Case Study (optional) — Problem / Solution / Impact
        </summary>
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface)' }}>
          {(['problem', 'solution', 'impact'] as const).map((f) => (
            <div key={f}>
              <label style={labelStyle} htmlFor={`ap-${f}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
              <textarea id={`ap-${f}`} name={f} rows={2} value={form[f]} onChange={onChange} placeholder={`Describe the ${f}...`} style={{ ...inputStyle(f), resize: 'none' }} />
            </div>
          ))}
        </div>
      </details>

      <Button label="Preview & Generate Code" type="submit" variant="primary" size="lg" />
    </motion.form>
  )
}

/* ── Main section ── */
const ProjectsSection = (_props: ProjectsProps) => {
  const prefersReduced = useReducedMotion()
  const [tab, setTab]               = useState<Tab>('mine')
  const [extraProjects, setExtraProjects] = useState<Project[]>([])

  const allProjects = [...staticProjects, ...extraProjects]

  const handleAdd = (p: Project) => {
    setExtraProjects((prev) => [p, ...prev])
  }

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Projects"
        title="Things I've built"
        description="Production applications shipped for real users — each solving a distinct problem."
      />

      {/* Tab bar */}
      <motion.div
        variants={prefersReduced ? undefined : fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '2.5rem' }}
      >
        <TabBtn active={tab === 'mine'} onClick={() => setTab('mine')} badge={allProjects.length}>
          My Projects
        </TabBtn>
        <TabBtn active={tab === 'github'} onClick={() => setTab('github')}>
          GitHub Repos
        </TabBtn>
        <TabBtn active={tab === 'add'} onClick={() => setTab('add')}>
          + Add Project
        </TabBtn>
      </motion.div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === 'mine'   && <MyProjectsPanel projects={allProjects} />}
          {tab === 'github' && <GithubReposPanel />}
          {tab === 'add'    && <AddProjectPanel onAdd={handleAdd} />}
        </motion.div>
      </AnimatePresence>
    </Section>
  )
}

export default ProjectsSection

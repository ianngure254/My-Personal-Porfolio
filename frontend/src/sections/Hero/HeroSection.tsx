import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import Button from '@/components/ui/Button'
import { siteMetadata } from '@/data/meta'

interface HeroProps {}

const ROLES = [
  'Full-Stack Developer',
  'React Specialist',
  'Node.js Engineer',
  'UI/UX Craftsman',
]

const HeroSection = (_props: HeroProps) => {
  const prefersReduced = useReducedMotion()
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (prefersReduced) { setDisplayed(ROLES[0]); return }
    const current = ROLES[roleIndex]
    let t: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed.length < current.length) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75)
    } else if (!isDeleting && displayed.length === current.length) {
      t = setTimeout(() => setIsDeleting(true), 2200)
    } else if (isDeleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 38)
    } else {
      setIsDeleting(false)
      setRoleIndex((i) => (i + 1) % ROLES.length)
    }
    return () => clearTimeout(t)
  }, [displayed, isDeleting, roleIndex, prefersReduced])

  const toProjects = () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="hero"
      aria-label="Introduction"
      style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '0 1rem',
      }}
      className="sm:px-6 lg:px-8"
    >
      {/* ── Background ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }} aria-hidden="true">
        {/* Dot grid */}
        <div className="dot-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />

        {/* Glow orbs */}
        <div className="orb orb-cyan"    style={{ width: 600, height: 600, top: '-15%', left: '-10%' }} />
        <div className="orb orb-emerald" style={{ width: 500, height: 500, bottom: '-10%', right: '-5%' }} />
        <div className="orb orb-violet"  style={{ width: 350, height: 350, top: '40%', left: '50%', transform: 'translate(-50%,-50%)' }} />

        {/* Radial vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--bg) 100%)',
        }} />
      </div>

      {/* ── Content ── */}
      <div
        style={{ position: 'relative', zIndex: 1, maxWidth: '72rem', width: '100%', margin: '0 auto' }}
        className="py-28 md:py-36"
      >
        <div
          style={{ display: 'grid', alignItems: 'center', gap: '3rem' }}
          className="lg:grid-cols-[1fr_auto] lg:gap-20"
        >
          {/* Left */}
          <motion.div
            variants={prefersReduced ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: 640 }}
          >
            {/* Status badge */}
            <motion.div
              variants={prefersReduced ? undefined : fadeUp}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 16px',
                borderRadius: 'var(--r-full)',
                border: '1px solid rgba(249,115,22,0.25)',
                background: 'rgba(249,115,22,0.06)',
                marginBottom: '2rem',
              }}
            >
              <span className="live-dot" aria-hidden="true" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--orange)', letterSpacing: '0.08em' }}>
                Available for work · Kenya
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={prefersReduced ? undefined : fadeUp}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}
            >
              <span style={{ display: 'block', color: 'var(--text-strong)' }}>Hi, I'm</span>
              <span style={{ display: 'block', color: 'var(--orange)' }}>{siteMetadata.name}</span>
            </motion.h1>

            {/* Typewriter */}
            <motion.div
              variants={prefersReduced ? undefined : fadeUp}
              style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}
              aria-label={`Role: ${ROLES[roleIndex]}`}
            >
              <span style={{ width: 32, height: 2, borderRadius: 2, background: 'var(--orange)', flexShrink: 0 }} aria-hidden="true" />
              <p style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 600, color: 'var(--muted)', letterSpacing: '-0.01em' }}>
                <span aria-hidden="true">{displayed}</span>
                <span className="cursor" aria-hidden="true" />
              </p>
            </motion.div>

            {/* Body text */}
            <motion.p
              variants={prefersReduced ? undefined : fadeUp}
              style={{ fontSize: 'clamp(0.9rem,2vw,1.0625rem)', lineHeight: 1.75, color: 'var(--muted)', maxWidth: 480, marginBottom: '2.5rem' }}
            >
              I build fast, accessible, production-ready web apps with{' '}
              <span style={{ color: 'var(--orange)', fontWeight: 600 }}>React</span>,{' '}
              <span style={{ color: 'var(--orange)', fontWeight: 600 }}>Node.js</span>, and{' '}
              <span style={{ color: 'var(--text-strong)', fontWeight: 600 }}>TypeScript</span> —
              turning ideas into digital products that users love.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={prefersReduced ? undefined : fadeUp}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '2.5rem' }}
            >
              <Button label="View My Work" onClick={toProjects} variant="primary" size="lg" />
              <Button label="GitHub"       href={siteMetadata.github} variant="outline" size="lg" external />
              <motion.button
                onClick={async () => {
                  try {
                    const res = await fetch('/Ian_Ngure_CV.pdf')
                    if (!res.ok) throw new Error('fetch failed')
                    const blob = await res.blob()
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'Ian_Ngure_CV.pdf'
                    document.body.appendChild(a)
                    a.click()
                    a.remove()
                    URL.revokeObjectURL(url)
                  } catch {
                    // Fallback: open in new tab
                    window.open('/Ian_Ngure_CV.pdf', '_blank')
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '0.75rem 1.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  borderRadius: 'var(--r-full)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  background: 'rgba(249,115,22,0.07)',
                  color: 'var(--orange)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'box-shadow 0.2s, filter 0.2s',
                }}
                whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.97 }}
                aria-label="Download CV"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download CV
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={prefersReduced ? undefined : fadeUp}
              style={{ display: 'flex', alignItems: 'center', gap: 20 }}
            >
              <a
                href={siteMetadata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                style={{ fontSize: '0.8125rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--orange)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
              <span style={{ width: 1, height: 16, background: 'var(--border)' }} aria-hidden="true" />
              <a
                href={`mailto:${siteMetadata.email}`}
                style={{ fontSize: '0.8125rem', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--orange)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {siteMetadata.email}
              </a>
            </motion.div>
          </motion.div>

          {/* Right — terminal card (hidden on mobile/tablet) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
            className="hidden lg:block"
          >
            <div
              style={{
                width: 300,
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
              }}
            >
              {/* Terminal titlebar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 14px',
                background: 'var(--surface-2)',
                borderBottom: '1px solid var(--border)',
              }}>
                {['#ef4444','#f59e0b','#22c55e'].map((c, i) => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8, flexShrink: 0 }} />
                ))}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', marginLeft: 6 }}>ian.ts</span>
              </div>
              {/* Code body */}
              <div style={{ padding: '20px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', lineHeight: 1.9 }}>
                <p><span style={{ color: 'var(--muted)' }}>const</span>{' '}<span style={{ color: 'var(--text-strong)' }}>dev</span>{' '}<span style={{ color: 'var(--muted)' }}>=</span>{' '}<span style={{ color: 'var(--muted)' }}>{'{'}</span></p>
                <p style={{ paddingLeft: 16 }}><span style={{ color: 'var(--orange)' }}>name</span><span style={{ color: 'var(--muted)' }}>:</span>{' '}<span style={{ color: 'var(--text)' }}>'Ian Ngure'</span><span style={{ color: 'var(--muted)' }}>,</span></p>
                <p style={{ paddingLeft: 16 }}><span style={{ color: 'var(--orange)' }}>stack</span><span style={{ color: 'var(--muted)' }}>: [</span></p>
                {['React','TypeScript','Node.js','PostgreSQL'].map((s) => (
                  <p key={s} style={{ paddingLeft: 32 }}><span style={{ color: 'var(--text)' }}>'{s}'</span><span style={{ color: 'var(--muted)' }}>,</span></p>
                ))}
                <p style={{ paddingLeft: 16 }}><span style={{ color: 'var(--muted)' }}>],</span></p>
                <p style={{ paddingLeft: 16 }}><span style={{ color: 'var(--orange)' }}>available</span><span style={{ color: 'var(--muted)' }}>:</span>{' '}<span style={{ color: 'var(--text-strong)' }}>true</span><span style={{ color: 'var(--muted)' }}>,</span></p>
                <p style={{ paddingLeft: 16 }}><span style={{ color: 'var(--orange)' }}>remote</span><span style={{ color: 'var(--muted)' }}>:</span>{' '}<span style={{ color: 'var(--text-strong)' }}>true</span><span style={{ color: 'var(--muted)' }}>,</span></p>
                <p><span style={{ color: 'var(--muted)' }}>{'}'}</span></p>
                <p style={{ marginTop: 8, color: 'var(--muted-2)' }}>{'// let\'s build something great'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}
      >
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 22, height: 36,
            borderRadius: 11,
            border: '1.5px solid var(--border)',
            display: 'flex', justifyContent: 'center', paddingTop: 6,
          }}
        >
          <div style={{
            width: 2, height: 8, borderRadius: 2,
            background: 'linear-gradient(to bottom, var(--orange), transparent)',
          }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default HeroSection

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from '@/components/common/ThemeToggle'

interface NavLink { label: string; href: string }

const navLinks: NavLink[] = [
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Projects',      href: '#projects'      },
  { label: 'Testimonials',  href: '#testimonials'  },
  { label: 'Experience',    href: '#experience'    },
  { label: 'Contact',    href: '#contact'    },
]

const Navbar = () => {
  const [scrolled,       setScrolled]       = useState(false)
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [activeSection,  setActiveSection]  = useState('')
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(`#${e.target.id}`) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const go = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('#')) document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          ...(scrolled
            ? {
                background: 'rgba(5,7,15,0.80)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderBottom: '1px solid var(--border)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
              }
            : { background: 'transparent' }),
        }}
      >
        <div
          style={{
            maxWidth: '72rem',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
            padding: '0 1rem',
          }}
          className="sm:px-6 lg:px-8"
        >
          {/* Logo */}
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            aria-label="Ian Ngure — Home"
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30, height: 30,
                borderRadius: 8,
                background: 'var(--orange)',
                fontSize: '0.65rem',
                fontWeight: 900,
                fontFamily: 'var(--font-mono)',
                color: '#fff',
                letterSpacing: '-0.02em',
                boxShadow: '0 2px 12px rgba(249,115,22,0.35)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              IN
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-strong)' }}>
              ian
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--muted)', marginLeft: '-4px' }}>
              .dev
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex" style={{ alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-full)',
                padding: '4px',
              }}
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.href
                return (
                  <button
                    key={link.label}
                    onClick={() => go(link.href)}
                    style={{
                      position: 'relative',
                      padding: '6px 16px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      fontFamily: 'var(--font-sans)',
                      borderRadius: 'var(--r-full)',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'transparent',
                      color: isActive ? '#fff' : 'var(--muted)',
                      transition: 'color 0.2s ease',
                      zIndex: 1,
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 'var(--r-full)',
                          background: 'var(--orange)',
                          zIndex: -1,
                          boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </button>
                )
              })}
            </div>
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />

            {/* Hire me — desktop */}
            <motion.button
              onClick={() => go('#contact')}
              className="hidden md:flex"
              style={{
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                fontFamily: 'var(--font-sans)',
                borderRadius: 'var(--r-full)',
                border: 'none',
                cursor: 'pointer',
                background: 'var(--orange)',
                color: '#fff',
                boxShadow: '0 2px 16px rgba(249,115,22,0.3)',
                whiteSpace: 'nowrap',
              }}
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.97 }}
            >
              Hire me
            </motion.button>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                width: 36, height: 36,
                borderRadius: 'var(--r-full)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                cursor: 'pointer',
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    menuOpen
                      ? i === 0 ? { rotate: 45,  y: 10 }
                      : i === 1 ? { opacity: 0,  scaleX: 0 }
                      :           { rotate: -45, y: -10 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'block',
                    width: 16, height: 1.5,
                    borderRadius: 2,
                    background: 'var(--text)',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.96, y: -8  }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden"
              style={{
                position: 'fixed',
                top: 72, left: 12, right: 12,
                zIndex: 40,
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow-xl)',
                overflow: 'hidden',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <nav aria-label="Mobile navigation" style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href
                  return (
                    <button
                      key={link.label}
                      onClick={() => go(link.href)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        fontFamily: 'var(--font-sans)',
                        borderRadius: 'var(--r-lg)',
                        border: isActive ? '1px solid rgba(249,115,22,0.25)' : '1px solid transparent',
                        cursor: 'pointer',
                        background: isActive ? 'rgba(249,115,22,0.08)' : 'transparent',
                        color: isActive ? 'var(--orange)' : 'var(--muted)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {link.label}
                    </button>
                  )
                })}
                <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <button
                    onClick={() => go('#contact')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-sans)',
                      borderRadius: 'var(--r-lg)',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'var(--orange)',
                      color: '#fff',
                      boxShadow: '0 2px 12px rgba(249,115,22,0.25)',
                    }}
                  >
                    Hire me
                  </button>
                </div>
              </nav>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="md:hidden"
              style={{
                position: 'fixed', inset: 0, zIndex: 30,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

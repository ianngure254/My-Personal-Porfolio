import { useState, type ChangeEvent, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'
import Section from '@/components/layout/Section'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import { siteMetadata } from '@/data/meta'

interface ContactProps {}
interface FormState { name: string; email: string; message: string }
type Status = 'idle' | 'loading' | 'success' | 'error'

const LINKS = [
  {
    label: 'Email',
    value: siteMetadata.email,
    href: `mailto:${siteMetadata.email}`,
    accent: 'var(--cyan)',
    bg: 'rgba(34,211,238,0.08)',
    border: 'rgba(34,211,238,0.25)',
    hoverBorder: 'rgba(34,211,238,0.5)',
    hoverGlow: '0 8px 32px rgba(34,211,238,0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/ianngure',
    href: siteMetadata.linkedin,
    external: true,
    accent: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.2)',
    hoverBorder: 'rgba(96,165,250,0.5)',
    hoverGlow: '0 8px 32px rgba(96,165,250,0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/ianngure254',
    href: siteMetadata.github,
    external: true,
    accent: 'var(--violet)',
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.2)',
    hoverBorder: 'rgba(167,139,250,0.5)',
    hoverGlow: '0 8px 32px rgba(167,139,250,0.15)',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
]

const ContactSection = (_props: ContactProps) => {
  const prefersReduced = useReducedMotion()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const validate = (): boolean => {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')

    try {
      const formData = new FormData()
      formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY as string)
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('message', form.message)
      formData.append('subject', `Portfolio contact from ${form.name}`)

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json() as { success: boolean }

      if (data.success) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name as keyof FormState]) setErrors((p) => ({ ...p, [name]: undefined }))
  }

  const inputClass = (field: keyof FormState) =>
    ['contact-input', errors[field] ? 'contact-input--error' : ''].join(' ').trim()

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's work together"
        description="Have a project in mind or want to discuss an opportunity? I'd love to hear from you."
      />

      <div className="contact-grid">

        {/* Left: info panel */}
        <motion.div
          className="contact-info"
          variants={prefersReduced ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={prefersReduced ? undefined : fadeUp}>
            <p style={{
              fontSize: '0.9375rem',
              lineHeight: 1.85,
              color: 'var(--muted)',
              marginBottom: '1.25rem',
            }}>
              Currently available for{' '}
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>freelance projects</span>
              {' '}and{' '}
              <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>remote full-time roles</span>.
              {' '}Response time is typically within 24 hours.
            </p>

            <div className="contact-chip">
              <motion.span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'var(--emerald)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
                animate={prefersReduced ? {} : { opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                aria-hidden="true"
              />
              <span style={{
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--muted)',
              }}>
                Usually responds within{' '}
                <span style={{ color: 'var(--emerald)', fontWeight: 700 }}>24h</span>
              </span>
            </div>
          </motion.div>

          <motion.ul
            className="contact-links"
            variants={prefersReduced ? undefined : staggerContainer}
            aria-label="Contact channels"
          >
            {LINKS.map(({ label, value, href, icon, accent, bg, border, hoverBorder, hoverGlow, external }) => (
              <motion.li key={label} variants={prefersReduced ? undefined : fadeUp}>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className="contact-link"
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = hoverBorder
                    e.currentTarget.style.boxShadow = `var(--shadow-md), ${hoverGlow}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  }}
                >
                  <span
                    className="contact-link__icon"
                    style={{ background: bg, borderColor: border, color: accent }}
                  >
                    {icon}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="contact-link__label">{label}</p>
                    <p className="contact-link__value">{value}</p>
                  </div>
                  <svg
                    style={{ color: 'var(--muted-2)', flexShrink: 0 }}
                    width="14" height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right: form */}
        <motion.div
          variants={prefersReduced ? undefined : fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {status === 'success' ? (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              role="status"
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(52,211,153,0.12)',
                border: '1.5px solid rgba(52,211,153,0.3)',
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--emerald)' }} aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-strong)', marginBottom: '0.5rem' }}>
                Message sent!
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--muted)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
                Thanks — I'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--cyan)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Contact form"
              className="contact-form-card"
            >
              <div className="contact-field-row">
                {(['name', 'email'] as const).map((field) => (
                  <div key={field}>
                    <label htmlFor={`cf-${field}`} className="contact-label">
                      {field === 'name' ? 'Name' : 'Email'}
                    </label>
                    <input
                      id={`cf-${field}`}
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      autoComplete={field}
                      value={form[field]}
                      onChange={onChange}
                      placeholder={field === 'name' ? 'Your name' : 'your@email.com'}
                      className={inputClass(field)}
                      aria-describedby={errors[field] ? `${field}-err` : undefined}
                      aria-invalid={!!errors[field]}
                    />
                    {errors[field] && (
                      <p id={`${field}-err`} className="contact-error-msg" role="alert">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="cf-message" className="contact-label">Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Tell me about your project or opportunity..."
                  className={inputClass('message')}
                  style={{ resize: 'none' }}
                  aria-describedby={errors.message ? 'msg-err' : undefined}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <p id="msg-err" className="contact-error-msg" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === 'error' && (
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--error)',
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid rgba(248,113,113,0.25)',
                    background: 'rgba(248,113,113,0.06)',
                    lineHeight: 1.6,
                  }}
                  role="alert"
                >
                  Something went wrong. Email me directly at{' '}
                  <a href={`mailto:${siteMetadata.email}`} style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>
                    {siteMetadata.email}
                  </a>.
                </p>
              )}

              <Button
                label={status === 'loading' ? 'Sending…' : 'Send Message'}
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'loading'}
                className="w-full"
              />
            </form>
          )}
        </motion.div>

      </div>
    </Section>
  )
}

export default ContactSection

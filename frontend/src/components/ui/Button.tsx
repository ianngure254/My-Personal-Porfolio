import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  label: string
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  external?: boolean
}

const sizeMap = {
  sm: { padding: '0.375rem 1rem',   fontSize: '0.75rem',  gap: '0.375rem' },
  md: { padding: '0.5rem 1.25rem',  fontSize: '0.8125rem',gap: '0.5rem'   },
  lg: { padding: '0.75rem 1.75rem', fontSize: '0.875rem', gap: '0.5rem'   },
}

const Button = ({
  label,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  disabled = false,
  type = 'button',
  className = '',
  external = false,
}: ButtonProps) => {
  const { padding, fontSize, gap } = sizeMap[size]

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap,
    padding,
    fontSize,
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    borderRadius: 'var(--r-full)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    transition: 'box-shadow 0.2s ease, filter 0.2s ease',
    outline: 'none',
    userSelect: 'none',
  }

  const variantStyle: React.CSSProperties =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, var(--cyan) 0%, var(--emerald) 100%)',
          color: '#fff',
          boxShadow: '0 2px 16px rgba(34,211,238,0.3), 0 1px 4px rgba(0,0,0,0.3)',
        }
      : variant === 'outline'
      ? {
          background: 'transparent',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }
      : {
          background: 'transparent',
          color: 'var(--muted)',
        }

  const style = { ...baseStyle, ...variantStyle }

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      {label}
      {icon && iconPosition === 'right' && icon}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        style={style}
        className={className}
        whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
        whileTap={{ scale: 0.97 }}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      whileHover={{ scale: 1.04, filter: 'brightness(1.08)' }}
      whileTap={{ scale: 0.97 }}
    >
      {content}
    </motion.button>
  )
}

export default Button

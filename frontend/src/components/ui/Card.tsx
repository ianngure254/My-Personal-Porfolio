import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card = ({ children, className = '', hover = false, onClick }: CardProps) => (
  <motion.div
    onClick={onClick}
    className={`card ${className}`}
    style={{ cursor: onClick ? 'pointer' : 'default' }}
    whileHover={hover ? { y: -3 } : undefined}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
)

export default Card

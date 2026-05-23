import { motion } from 'framer-motion'
import { fadeUp } from '@/animations/variants'
import type { CSSProperties, ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}

const Section = ({ id, children, className = '', style }: SectionProps) => (
  <motion.section
    id={id}
    style={style}
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.05 }}
    className={`section relative ${className}`}
  >
    <div className="mx-auto max-w-6xl w-full">{children}</div>
  </motion.section>
)

export default Section

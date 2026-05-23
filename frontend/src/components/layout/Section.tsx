import { motion } from 'framer-motion'
import { fadeUp } from '@/animations/variants'
import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  children: ReactNode
  className?: string
}

const Section = ({ id, children, className = '' }: SectionProps) => (
  <motion.section
    id={id}
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

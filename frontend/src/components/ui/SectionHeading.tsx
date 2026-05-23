import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/animations/variants'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

const SectionHeading = ({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) => {
  const isCenter = align === 'center'

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`mb-14 md:mb-20 ${isCenter ? 'text-center' : 'text-left'}`}
    >
      {/* Eyebrow */}
      <motion.div
        variants={fadeUp}
        className={`mb-4 flex items-center gap-3 ${isCenter ? 'justify-center' : ''}`}
      >
        <span style={{ height: '2px', width: '8px', borderRadius: '2px', background: 'linear-gradient(90deg, var(--orange), transparent)' }} aria-hidden="true" />
        <span
          className="text-xs font-mono font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'var(--orange)' }}
        >
          {eyebrow}
        </span>
        <span style={{ height: '2px', width: '8px', borderRadius: '2px', background: 'linear-gradient(90deg, transparent, var(--orange))' }} aria-hidden="true" />
      </motion.div>

      {/* Title */}
      <motion.h2
        variants={fadeUp}
        className="text-3xl font-extrabold md:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
        style={{ color: 'var(--text-strong)', letterSpacing: '-0.03em' }}
      >
        {title}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-5 text-base md:text-lg leading-relaxed ${isCenter ? 'mx-auto max-w-xl' : ''}`}
          style={{ color: 'var(--muted)' }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}

export default SectionHeading

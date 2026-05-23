import { useInView } from 'framer-motion'
import { useRef } from 'react'

export const useScrollReveal = (amount = 0.15) => {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount })
  return { ref, isInView }
}

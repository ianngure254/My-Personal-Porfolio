import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '@/animations/variants'
import PageWrapper from '@/components/layout/PageWrapper'

const NotFound = () => {
  return (
    <PageWrapper>
      <motion.div
        className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <span className="text-8xl font-bold gradient-text">404</span>
        <h1 className="mt-4 text-2xl font-semibold text-(--color-text)">
          Page not found
        </h1>
        <p className="mt-2 mb-8 text-(--color-muted)">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-full text-sm font-medium text-white bg-(--color-primary) transition-opacity hover:opacity-80"
        >
          Back to home
        </Link>
      </motion.div>
    </PageWrapper>
  )
}

export default NotFound

import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/Whatsapp'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  children: ReactNode
}

const PageWrapper = ({ children }: PageWrapperProps) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      color: 'var(--text)',
    }}
  >
    <Navbar />
    <AnimatePresence mode="wait">
      <main style={{ flex: 1, paddingTop: 64 }}>{children}</main>
    </AnimatePresence>
    <Footer />
    <WhatsAppButton />
  </div>
)

export default PageWrapper

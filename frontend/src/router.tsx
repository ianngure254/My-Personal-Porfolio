import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="gradient-text text-sm font-mono">Loading...</span>
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loader />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: '/projects/:slug',
    element: (
      <Suspense fallback={<Loader />}>
        <div>Project Detail — Phase 3</div>
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
])

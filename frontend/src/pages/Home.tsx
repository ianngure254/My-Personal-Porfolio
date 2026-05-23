import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { pageVariants } from '@/animations/variants'
import PageWrapper from '@/components/layout/PageWrapper'
import { siteMetadata } from '@/data/meta'
import HeroSection from '@/sections/Hero/HeroSection'
import AboutSection from '@/sections/About/AboutSection'
import SkillsSection from '@/sections/Skills/SkillsSection'
import ProjectsSection from '@/sections/Projects/ProjectsSection'
import ExperienceSection from '@/sections/Experience/ExperienceSection'
import ContactSection from '@/sections/Contact/ContactSection'

const Home = () => {
  return (
    <PageWrapper>
      <Helmet>
        <title>{siteMetadata.title}</title>
        <meta name="description" content={siteMetadata.description} />
        <meta property="og:title" content={siteMetadata.title} />
        <meta property="og:description" content={siteMetadata.description} />
        <meta property="og:image" content={siteMetadata.ogImage} />
        <meta property="og:url" content={siteMetadata.url} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: siteMetadata.name,
            jobTitle: 'Full-Stack JavaScript Developer',
            url: siteMetadata.url,
            email: siteMetadata.email,
            sameAs: [siteMetadata.github, siteMetadata.linkedin],
          })}
        </script>
      </Helmet>

      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </motion.div>
    </PageWrapper>
  )
}

export default Home

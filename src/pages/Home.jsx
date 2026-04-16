import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import Materials from '../sections/Materials'
import Value from '../sections/Value'
import CTA from '../sections/CTA'
import GalleryPreview from '../sections/GalleryPreview'

export default function Home() {
  const location = useLocation()

  useEffect(() => {
    const target = location.state?.scrollTo
    if (target) {
      setTimeout(() => {
        const el = document.getElementById(target)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [location.state])

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Materials />
      <Value />
      <CTA />
      <GalleryPreview />
    </>
  )
}

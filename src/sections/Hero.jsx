import { Link } from 'react-router-dom'
import useMediaQuery from '../hooks/useMediaQuery'
import BackgroundLoopVideo from '../components/BackgroundLoopVideo'

export default function Hero() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const videoSrc = isMobile ? '/assets/hero_mobile.mp4' : '/assets/hero_web.mp4'
  const previewSrc = '/assets/hero_web_preview.png'

  const scrollToAbout = () => {
    const el = document.getElementById('about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-screen min-h-[680px] overflow-hidden flex items-center bg-st-dark">
      <BackgroundLoopVideo
        key={videoSrc}
        src={videoSrc}
        previewSrc={previewSrc}
        previewAlt=""
        className="video-bg"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/35 z-[1]" />

      <div className="relative z-10 st-shell w-full pt-24 sm:pt-28">
        <div className="max-w-3xl lg:max-w-[50rem]" style={{ animation: 'slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-bold text-white leading-[1.05] mb-10 sm:mb-11 tracking-tight">
            Bring Your Ideas
            <br />
            <span className="text-st-yellow">to Life</span>
          </h1>
          <p className="st-copy-prominent text-white/90 mb-14 max-w-2xl sm:max-w-3xl">
            Professional 3D printing and prototyping — from engineering concepts to artistic visions, all under one roof.
          </p>
          <div className="flex flex-wrap gap-5 sm:gap-6">
            <Link to="/quote" className="st-btn st-btn-primary text-lg px-9 sm:px-10" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
              Get a Quote
            </Link>
            <Link to="/materials" className="st-btn st-btn-outline-light text-lg px-9 sm:px-10">
              View Materials
            </Link>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none"
        aria-label="Scroll down"
        style={{ animation: 'bounce-scroll 2s ease-in-out infinite' }}
      >
        <span className="text-white/60 text-xs tracking-[0.2em] uppercase">Scroll</span>
        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>
    </section>
  )
}

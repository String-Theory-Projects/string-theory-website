import useMediaQuery from '../hooks/useMediaQuery'
import { useScrollRevealAll } from '../hooks/useScrollReveal'

export default function About() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const containerRef = useScrollRevealAll()

  return (
    <section id="about" className="relative w-full min-h-[82vh] flex items-center overflow-hidden" ref={containerRef}>
      <video
        key={isMobile ? 'about-mobile' : 'about-web'}
        className="video-bg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src={isMobile ? '/assets/about_mobile.mp4' : '/assets/about_web.mp4'}
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-black/65 z-[1]" />

      <div className="relative z-10 st-shell py-28 lg:py-36 w-full">
        <div className="flex flex-col gap-10 lg:gap-12 max-w-4xl">
          <span className="reveal st-section-kicker text-st-light-blue px-4 py-1.5 rounded-full">
            About Us
          </span>

          <h2 className="reveal text-3xl sm:text-4xl lg:text-[3.35rem] font-bold text-white leading-tight" style={{ transitionDelay: '0.1s' }}>
            String Theory is a hybrid prototyping studio and 3D-printing service dedicated to helping people bring ideas to life.
          </h2>

          <p className="reveal st-copy-prominent text-white/85 max-w-3xl" style={{ transitionDelay: '0.2s' }}>
            Whether those ideas are engineering concepts, artistic visions, or just fun, unserious objects —
            we turn imagination into tangible reality with precision and care.
          </p>

          <button
            onClick={() => {
              const el = document.getElementById('services')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="reveal st-btn st-btn-primary text-base sm:text-lg px-9 sm:px-10 w-fit"
            style={{ transitionDelay: '0.3s' }}
          >
            Explore Our Services
          </button>
        </div>
      </div>
    </section>
  )
}

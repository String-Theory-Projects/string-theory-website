import { Link } from 'react-router-dom'
import { useScrollRevealAll } from '../hooks/useScrollReveal'

export default function CTA() {
  const containerRef = useScrollRevealAll()

  return (
    <section className="bg-st-white py-16 sm:py-20 lg:py-24 border-t border-slate-200/80" ref={containerRef}>
      <div className="st-shell max-w-5xl">
        <div className="st-page-header">
          <span className="reveal st-section-kicker text-st-red !mb-2 sm:!mb-3">
          Ready to Start?
          </span>

          <h2 className="reveal text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-st-black leading-tight mb-6 sm:mb-7" style={{ transitionDelay: '0.1s' }}>
            Let&apos;s Build Something
            <span className="text-st-blue"> Amazing</span>
          </h2>

          <p className="reveal st-copy-prominent text-st-black/80 mb-8 sm:mb-9 max-w-2xl mx-auto text-center" style={{ transitionDelay: '0.2s' }}>
            From a quick prototype to a production run - we offer unbeatable prices without compromising on quality.
            No minimums, no hassle. Just great prints.
          </p>
        </div>

        <div className="reveal st-page-header bg-white rounded-2xl px-8 py-8 sm:px-10 sm:py-9 gap-4 border border-slate-200/80 shadow-sm" style={{ transitionDelay: '0.3s' }}>
          <Link to="/quote" className="st-btn st-btn-primary text-base sm:text-lg px-9 sm:px-10" style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}>
            Get Instant Quote
          </Link>
          <p className="text-sm sm:text-base font-bold text-st-black/70 text-center max-w-xl">
            Upload your file &middot; Pick your settings &middot; Get a price in seconds
          </p>
        </div>
      </div>
    </section>
  )
}

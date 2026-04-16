import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollRevealAll } from '../hooks/useScrollReveal'

const FEATURED_MATERIALS = [
  {
    name: 'PLA',
    tagline: 'The Versatile Standard',
    description: 'Ideal for prototypes, models, and artistic prints. Easy to work with and available in a wide range of colours.',
    images: [
      '/assets/Samples/PLA/PLA - 2.png',
      '/assets/Samples/PLA/PLA -3.png',
      '/assets/Samples/PLA/PLA - 4.png',
      '/assets/Samples/PLA/PLA - 5.png',
      '/assets/Samples/PLA/PLA-1.jpg',
    ],
  },
  {
    name: 'PETG',
    tagline: 'Tough & Transparent',
    description: 'Excellent layer adhesion, chemical resistance, and durability. Perfect for functional parts and outdoor applications.',
    images: ['/assets/Samples/PETG/PETG - 1.png'],
  },
  {
    name: 'TPU',
    tagline: 'Flexible & Resilient',
    description: 'Rubber-like flexibility with outstanding impact resistance. Great for phone cases, gaskets, and wearables.',
    images: [
      '/assets/Samples/TPU/TPU - 1.png',
      '/assets/Samples/TPU/TPU - 2.png',
    ],
  },
  {
    name: 'ABS',
    tagline: 'Industrial Strength',
    description: 'Tough, heat-resistant engineering plastic. Ideal for functional prototypes, automotive parts, and enclosures.',
    images: ['/assets/Samples/ABS/ABS - 1.png'],
  },
]

function MaterialCard({ name, tagline, description, images }) {
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="group relative h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[4/3] overflow-hidden bg-st-black">
        {images.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt={`${name} sample ${idx + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: idx === currentIdx ? 1 : 0 }}
            loading="lazy"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-st-dark/80 via-transparent to-transparent" />

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIdx ? 'bg-white w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-10 sm:p-12 lg:p-14">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
          <h3 className="text-2xl sm:text-[1.65rem] font-bold text-white">{name}</h3>
          <span className="text-xs font-semibold uppercase tracking-wider text-st-blue bg-st-blue/15 px-3.5 py-1.5 rounded-full">
            {tagline}
          </span>
        </div>
        <p className="st-copy-prominent text-white/80">{description}</p>
      </div>
    </div>
  )
}

export default function Materials() {
  const containerRef = useScrollRevealAll()

  return (
    <section
      id="materials"
      className="bg-st-dark border-t border-white/10 pt-14 sm:pt-16 lg:pt-18 pb-16 sm:pb-20 lg:pb-24"
      ref={containerRef}
    >
      <div className="st-shell-services">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7 sm:gap-9 lg:gap-12 mb-10 sm:mb-12 lg:mb-14">
          <div>
            <span className="reveal st-section-kicker text-st-yellow">
              Premium Materials
            </span>
            <h2 className="reveal text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-white leading-tight" style={{ transitionDelay: '0.1s' }}>
              We Keep Top Notch Materials
            </h2>
          </div>
          <Link to="/materials" className="reveal st-btn st-btn-yellow text-lg px-9" style={{ transitionDelay: '0.2s' }}>
            See Full Catalog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {FEATURED_MATERIALS.map((material, i) => (
            <div key={material.name} className="reveal" style={{ transitionDelay: `${0.15 + i * 0.12}s` }}>
              <MaterialCard {...material} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

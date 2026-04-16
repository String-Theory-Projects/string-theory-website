import { Link } from 'react-router-dom'
import { useScrollRevealAll } from '../hooks/useScrollReveal'

const ALL_MATERIALS = [
  {
    name: 'PLA',
    fullName: 'Polylactic Acid',
    description: 'The most popular 3D printing material. Great for prototypes, models, and decorative prints. Easy to print with excellent detail resolution.',
    properties: ['Easy to print', 'Great detail', 'Eco-friendly', 'Wide colour range'],
    image: '/assets/Samples/PLA/PLA - 2.png',
  },
  {
    name: 'PETG',
    fullName: 'Polyethylene Terephthalate Glycol',
    description: 'A strong and durable material with excellent layer adhesion and chemical resistance. Great for functional parts and outdoor use.',
    properties: ['Chemical resistant', 'Durable', 'Semi-transparent', 'UV resistant'],
    image: '/assets/Samples/PETG/PETG - 1.png',
  },
  {
    name: 'TPU',
    fullName: 'Thermoplastic Polyurethane',
    description: 'A flexible, rubber-like material with outstanding impact resistance. Perfect for phone cases, gaskets, wearables, and anything that needs to bend.',
    properties: ['Flexible', 'Impact resistant', 'Abrasion resistant', 'Rubber-like'],
    image: '/assets/Samples/TPU/TPU - 1.png',
  },
  {
    name: 'ABS',
    fullName: 'Acrylonitrile Butadiene Styrene',
    description: 'A tough, heat-resistant engineering plastic. Ideal for functional prototypes, automotive parts, and enclosures that need to withstand stress.',
    properties: ['Heat resistant', 'Tough', 'Lightweight', 'Post-processable'],
    image: '/assets/Samples/ABS/ABS - 1.png',
  },
  {
    name: 'ASA',
    fullName: 'Acrylonitrile Styrene Acrylate',
    description: 'Similar to ABS but with superior UV and weather resistance. The ideal choice for outdoor functional parts and fixtures.',
    properties: ['UV resistant', 'Weatherproof', 'Strong', 'Heat resistant'],
    image: '/assets/Samples/ABS/ABS - 1.png',
  },
]

export default function MaterialsCatalog() {
  const containerRef = useScrollRevealAll()

  return (
    <div className="min-h-screen bg-st-dark pt-28 lg:pt-32 pb-24" ref={containerRef}>
      <div className="st-shell">
        {/* Header */}
        <div className="st-page-header st-heading-wrap">
          <span className="reveal st-section-kicker text-st-yellow">
            Materials Catalog
          </span>
          <h1 className="reveal text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8" style={{ transitionDelay: '0.1s' }}>
            Our Materials
          </h1>
          <p className="reveal text-lg sm:text-xl text-white/65 max-w-2xl mx-auto leading-relaxed text-center" style={{ transitionDelay: '0.2s' }}>
            We stock a carefully curated selection of premium filaments. Each material has unique strengths —
            we&apos;ll help you pick the right one for your project.
          </p>
        </div>

        {/* Materials grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 lg:gap-14">
          {ALL_MATERIALS.map((mat, i) => (
            <div
              key={mat.name}
              className="reveal group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-500"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
            >
              <div className="flex flex-col sm:flex-row min-h-[400px]">
                <div className="sm:w-[44%] aspect-square sm:aspect-auto overflow-hidden">
                  <img
                    src={mat.image}
                    alt={mat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                <div className="sm:w-[56%] p-10 sm:p-12 lg:p-14 flex flex-col justify-center">
                  <h2 className="text-4xl font-bold text-white mb-3">{mat.name}</h2>
                  <p className="text-sm sm:text-base text-st-blue font-medium mb-7">{mat.fullName}</p>
                  <p className="st-copy-prominent text-white/80 mb-9">{mat.description}</p>

                  <div className="flex flex-wrap gap-2.5">
                    {mat.properties.map((prop) => (
                      <span
                        key={prop}
                        className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-white/75 bg-white/8 px-3.5 py-1.5 rounded-full"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center mt-20" style={{ transitionDelay: '0.5s' }}>
          <p className="text-white/50 text-lg mb-8">
            Not sure which material is right for you?
          </p>
          <Link to="/quote" className="st-btn st-btn-yellow text-lg px-10">
            Get a Quote — We&apos;ll Help You Choose
          </Link>
        </div>
      </div>
    </div>
  )
}

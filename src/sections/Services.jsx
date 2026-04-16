import { useScrollRevealAll } from '../hooks/useScrollReveal'

const SERVICES = [
  {
    title: 'Engineering & Architectural',
    description: 'Precision prototypes for mechanical parts, enclosures, architectural models, and structural components — engineered to spec.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="36" height="36" rx="2" />
        <line x1="6" y1="18" x2="42" y2="18" />
        <line x1="18" y1="18" x2="18" y2="42" />
        <circle cx="30" cy="30" r="6" />
      </svg>
    ),
    iconBg: 'bg-st-blue/15',
    iconColor: 'text-st-blue',
  },
  {
    title: 'Functional',
    description: 'Custom jigs, fixtures, tools, and end-use parts built for real-world performance. Designed tough, printed tougher.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" />
        <path d="M4 14l20 10m0 0l20-10M24 24v20" />
      </svg>
    ),
    iconBg: 'bg-st-green/15',
    iconColor: 'text-st-green',
  },
  {
    title: 'Gifts & Personal',
    description: 'Unique, personalised items — from custom phone cases to figurines and keepsakes. Make something truly one-of-a-kind.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="22" width="36" height="22" rx="2" />
        <rect x="2" y="16" width="44" height="8" rx="2" />
        <line x1="24" y1="16" x2="24" y2="44" />
        <path d="M24 16c-4-8-12-8-12-2s8 2 12 2" />
        <path d="M24 16c4-8 12-8 12-2s-8 2-12 2" />
      </svg>
    ),
    iconBg: 'bg-st-red/15',
    iconColor: 'text-st-red',
  },
  {
    title: 'Artistic',
    description: 'Sculptures, decor, wearable art, and creative projects. We help artists push boundaries with additive manufacturing.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="20" />
        <path d="M16 28c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <circle cx="18" cy="18" r="2" fill="currentColor" />
        <circle cx="30" cy="18" r="2" fill="currentColor" />
        <circle cx="14" cy="26" r="2" fill="currentColor" />
        <circle cx="34" cy="26" r="2" fill="currentColor" />
        <circle cx="24" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    iconBg: 'bg-st-yellow/15',
    iconColor: 'text-st-yellow',
  },
]

export default function Services() {
  const containerRef = useScrollRevealAll()

  return (
    <section
      id="services"
      className="bg-st-dark border-t border-white/10 pt-14 sm:pt-16 lg:pt-18 pb-16 sm:pb-20 lg:pb-24"
      ref={containerRef}
    >
      <div className="st-shell-services">
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <span className="reveal st-section-kicker text-st-blue">
            Our Services
          </span>
          <h2 className="reveal text-4xl sm:text-5xl lg:text-[3.35rem] font-bold text-white leading-tight" style={{ transitionDelay: '0.1s' }}>
            The Possibilities Are Endless
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {SERVICES.map(({ title, description, icon, iconBg, iconColor }, i) => (
            <div
              key={title}
              className="reveal group relative rounded-2xl border border-white/14 bg-white/5 backdrop-blur-sm px-6 py-7 sm:px-7 sm:py-8 lg:px-8 lg:py-9 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 cursor-default min-h-0"
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className={`w-16 h-16 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="text-[1.5rem] font-bold text-white mb-5">{title}</h3>
              <p className="st-copy-prominent text-white/80">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useScrollRevealAll } from '../hooks/useScrollReveal'

const VALUES = [
  {
    title: 'Cutting Edge Printers',
    description: 'We invest in the latest 3D printing technology so every print is sharp, consistent, and reliable — layer after layer.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="16" width="32" height="20" rx="2" />
        <path d="M10 16V8a2 2 0 012-2h16a2 2 0 012 2v8" />
        <path d="M16 28h8" />
        <circle cx="20" cy="24" r="2" />
      </svg>
    ),
  },
  {
    title: 'Durable, High Quality Materials',
    description: 'From PLA to TPU and beyond — we stock premium filaments that deliver strength, finish, and longevity.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 4l16 8v16l-16 8L4 28V12l16-8z" />
        <path d="M20 20l16-8M20 20v16M20 20L4 12" />
      </svg>
    ),
  },
  {
    title: 'Bespoke Service',
    description: 'Every project is unique. We tailor the process to your needs — from material selection to finishing touches.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="16" />
        <path d="M20 12v8l6 4" />
        <circle cx="20" cy="20" r="3" />
        <path d="M10 10l4 4M26 10l-4 4M10 30l4-4M26 30l-4-4" />
      </svg>
    ),
  },
  {
    title: 'Experienced Advisory',
    description: 'Not sure where to start? Our team helps you choose the right material, settings, and approach for your idea.',
    icon: (
      <svg className="w-7 h-7" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 34V6a2 2 0 012-2h20a2 2 0 012 2v28l-12-6-12 6z" />
        <path d="M16 14h8M16 20h5" />
      </svg>
    ),
  },
]

export default function Value() {
  const containerRef = useScrollRevealAll()

  return (
    <section className="relative bg-gradient-to-br from-st-blue via-st-blue to-blue-900 st-section-lg overflow-hidden border-t border-white/10" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative st-shell">
        <div className="st-heading-wrap">
          <span className="reveal st-section-kicker text-white/60">
            Why Choose Us
          </span>
          <h2 className="reveal text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-white leading-tight max-w-2xl" style={{ transitionDelay: '0.1s' }}>
            Why Choose String Theory
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {VALUES.map(({ title, description, icon }, i) => (
            <div
              key={title}
              className="reveal group st-card flex gap-8 bg-white/8 backdrop-blur-sm hover:bg-white/12 transition-all duration-500 min-h-[248px]"
              style={{ transitionDelay: `${0.15 + i * 0.1}s` }}
            >
              <div className="shrink-0 w-16 h-16 rounded-xl bg-white/15 text-white flex items-center justify-center group-hover:bg-white/25 transition-colors duration-300">
                {icon}
              </div>
              <div>
                <h3 className="text-[1.4rem] font-bold text-white mb-5">{title}</h3>
                <p className="st-copy-prominent text-white/80">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'

const ALL_GALLERY = [
  { src: '/assets/gallery/cycloidal.png', alt: 'Cycloidal drive' },
  { src: '/assets/gallery/phone_cases.jpeg', alt: 'Custom phone cases' },
  { src: '/assets/gallery/flowerpot.jpeg', alt: 'Decorative flowerpot' },
  { src: '/assets/gallery/robotics.jpeg', alt: 'Robotics components' },
  { src: '/assets/gallery/arctos_print.jpeg', alt: 'Arctos print' },
  { src: '/assets/gallery/jake.JPG', alt: 'Character figurine' },
  { src: '/assets/gallery/yotei_controller.jpeg', alt: 'Custom controller' },
  { src: '/assets/gallery/17Pro_custom_phonecase.jpeg', alt: '17 Pro custom phone case' },
  { src: '/assets/gallery/cycloidal_gears.jpeg', alt: 'Cycloidal gears' },
  { src: '/assets/gallery/pluto_phonecase.jpeg', alt: 'Pluto phone case' },
  { src: '/assets/gallery/AP_phonecase.jpeg', alt: 'AP phone case' },
  { src: '/assets/gallery/arctos_parts.jpeg', alt: 'Arctos robot parts' },
  { src: '/assets/gallery/arctos_parts_2.jpeg', alt: 'Arctos parts close-up' },
  { src: '/assets/gallery/button.jpeg', alt: 'Custom button' },
  { src: '/assets/gallery/converyor.JPG', alt: 'Conveyor system' },
  { src: '/assets/gallery/conveyor_2.JPG', alt: 'Conveyor detail' },
  { src: '/assets/gallery/eyes.JPG', alt: 'Printed eyes' },
  { src: '/assets/gallery/feeder_cycloidal.JPG', alt: 'Feeder cycloidal mechanism' },
  { src: '/assets/gallery/perforated_phonecase.jpeg', alt: 'Perforated phone case' },
]

function GalleryImage({ src, alt, idx }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        ref={ref}
        className="gallery-item rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer break-inside-avoid mb-3 sm:mb-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.05 + idx * 0.04}s`,
        }}
        onClick={() => setSelected(true)}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setSelected(false)}
          style={{ animation: 'fade-in 0.3s ease-out' }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            style={{ animation: 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <button
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer border-none"
            onClick={() => setSelected(false)}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-st-white pt-20 sm:pt-24 lg:pt-24 pb-12 sm:pb-14 lg:pb-16">
      <div className="st-shell">
        {/* Header */}
        <div className="st-page-header mb-8 sm:mb-10 lg:mb-11">
          <span className="st-section-kicker text-st-green !mb-2 sm:!mb-3">
            Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-bold text-st-black mb-4 sm:mb-5 text-center">
            Our Work
          </h1>
          <p className="text-base sm:text-lg text-st-black/65 max-w-2xl mx-auto leading-relaxed text-center">
            A selection of prints from our studio — from engineering prototypes to artistic creations and everything in between.
          </p>
        </div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 lg:gap-5 [column-fill:_balance]">
          {ALL_GALLERY.map((img, i) => (
            <GalleryImage key={img.src} {...img} idx={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

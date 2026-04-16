import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const GALLERY_IMAGES = [
  { src: '/assets/gallery/cycloidal.png', alt: 'Cycloidal drive' },
  { src: '/assets/gallery/phone_cases.jpeg', alt: 'Custom phone cases' },
  { src: '/assets/gallery/flowerpot.jpeg', alt: 'Decorative flowerpot' },
  { src: '/assets/gallery/robotics.jpeg', alt: 'Robotics components' },
  { src: '/assets/gallery/arctos_print.jpeg', alt: 'Arctos print' },
  { src: '/assets/gallery/jake.JPG', alt: 'Character figurine' },
  { src: '/assets/gallery/yotei_controller.jpeg', alt: 'Custom controller' },
  { src: '/assets/gallery/17Pro_custom_phonecase.jpeg', alt: 'Custom phone case' },
  { src: '/assets/gallery/cycloidal_gears.jpeg', alt: 'Cycloidal gears' },
  { src: '/assets/gallery/pluto_phonecase.jpeg', alt: 'Pluto phone case' },
  { src: '/assets/gallery/eyes.JPG', alt: 'Printed eyes' },
  { src: '/assets/gallery/converyor.JPG', alt: 'Conveyor parts' },
]

function GalleryItem({ src, alt, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Link
      ref={ref}
      to="/gallery"
      className="gallery-item block rounded-2xl overflow-hidden relative group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.92)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover aspect-[5/4] sm:aspect-[4/3] transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-st-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  )
}

const PREVIEW_COUNT = 8

export default function GalleryPreview() {
  const previewImages = GALLERY_IMAGES.slice(0, PREVIEW_COUNT)

  return (
    <section id="gallery" className="bg-st-white border-t border-slate-200/80 py-10 sm:py-12 lg:py-14">
      <div className="st-shell">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-9 lg:mb-10">
          <div>
            <span className="st-section-kicker text-st-green !mb-2 sm:!mb-3">
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-st-black leading-tight">
              From Our Print Bed to You
            </h2>
          </div>
          <Link to="/gallery" className="shrink-0 st-btn st-btn-outline-dark text-base sm:text-lg px-7 sm:px-8 text-center w-full sm:w-auto">
            View Full Gallery
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4">
          {previewImages.map((img, i) => (
            <GalleryItem key={img.src} {...img} delay={0.05 + i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  )
}

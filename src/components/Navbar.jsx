import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Materials', target: 'materials' },
  { label: 'Gallery', target: 'gallery' },
  { label: 'Contact', target: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (target) => {
    setMenuOpen(false)
    if (isHome) {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: target } })
    }
  }

  const showSolid = scrolled || !isHome

  return (
    <nav className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 w-full z-50 transition-all duration-500 ${showSolid ? 'nav-solid' : 'nav-transparent'}`}>
      <div className="w-full pl-6 pr-6 sm:pl-10 sm:pr-10 lg:pl-14 lg:pr-14 xl:pl-16 xl:pr-16 flex items-center justify-between h-18 lg:h-22">
        <Link to="/" className="flex items-center gap-2 shrink-0" style={{ marginLeft: '44px' }}>
          <img
            src={showSolid ? '/assets/logos/Horizontal Black.svg' : '/assets/logos/Horizontal White.svg'}
            alt="String Theory"
            className="h-8 lg:h-9"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8 xl:gap-10" style={{ marginRight: '44px' }}>
          {NAV_LINKS.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => handleNavClick(target)}
              className={`text-[16px] font-medium tracking-wide transition-colors duration-300 cursor-pointer bg-transparent border-none ${
                showSolid ? 'text-st-black hover:text-st-blue' : 'text-white/90 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
          <Link to="/quote" className="st-btn st-btn-primary ml-2 text-[15px] px-7">
            Get a Quote
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col justify-center gap-1.5 w-8 h-8 cursor-pointer bg-transparent border-none"
          style={{ marginRight: '24px' }}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-full rounded transition-all duration-300 ${showSolid ? 'bg-st-black' : 'bg-white'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-full rounded transition-all duration-300 ${showSolid ? 'bg-st-black' : 'bg-white'} ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-full rounded transition-all duration-300 ${showSolid ? 'bg-st-black' : 'bg-white'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <div className={`lg:hidden fixed inset-0 top-18 bg-white transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-8 pt-18 px-8">
          {NAV_LINKS.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => handleNavClick(target)}
              className="text-2xl font-semibold text-st-black hover:text-st-blue transition-colors cursor-pointer bg-transparent border-none"
            >
              {label}
            </button>
          ))}
          <Link to="/quote" className="mt-6 st-btn st-btn-primary text-lg px-10">
            Get a Quote
          </Link>
        </div>
      </div>
    </nav>
  )
}

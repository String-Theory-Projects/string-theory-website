import { Link, useLocation, useNavigate } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Services', target: 'services' },
  { label: 'Materials', target: 'materials' },
  { label: 'Gallery', target: 'gallery' },
]

export default function Footer() {
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  const handleNavClick = (target) => {
    if (isHome) {
      const el = document.getElementById(target)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: target } })
    }
  }

  return (
    <footer id="contact" className="bg-st-yellow relative overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-st-red via-st-blue to-st-green" />

      <div className="st-shell" style={{ paddingTop: '7.5rem', paddingBottom: '7.5rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start" style={{ gap: '4.25rem' }}>
          <div className="lg:col-span-7">
            <span className="st-section-kicker text-st-black/60" style={{ marginBottom: '1.6rem' }}>Let&apos;s Build Together</span>
            <img
              src="/assets/logos/Horizontal Black.svg"
              alt="String Theory"
              className="h-10 sm:h-11"
              style={{ marginBottom: '2.2rem' }}
            />
            <p className="text-st-black/75 text-lg sm:text-[1.35rem] leading-relaxed max-w-2xl" style={{ marginBottom: '2.6rem' }}>
              If you can think it, we can make it. Bringing your ideas to life through precision 3D printing and prototyping.
            </p>
            <div className="flex flex-wrap" style={{ gap: '1.1rem' }}>
              <Link to="/quote" className="st-btn st-btn-primary text-base sm:text-lg px-11">
                Get Instant Quote
              </Link>
              <a
                href="https://wa.me/2348160080202"
                target="_blank"
                rel="noopener noreferrer"
                className="st-btn bg-[#25D366] border-[#25D366] text-white text-base sm:text-lg px-11 hover:bg-[#1ebe5d]"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl p-10 sm:p-11 lg:p-12">
              <h4 className="text-sm font-bold uppercase tracking-widest text-st-black" style={{ marginBottom: '1.5rem' }}>Get in Touch</h4>
              <ul className="text-st-black/80 text-base sm:text-lg" style={{ display: 'grid', gap: '1rem' }}>
                <li>
                  <a href="mailto:stringtheoryltd@gmail.com" className="hover:text-st-black transition-colors">
                    stringtheoryltd@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+2348160080202" className="hover:text-st-black transition-colors">
                    +234 (0) 816 008 0202
                  </a>
                </li>
                <li>Abuja, Nigeria</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-start" style={{ marginTop: '4.5rem', gap: '3.8rem' }}>
          <div className="lg:col-span-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-st-black" style={{ marginBottom: '1.4rem' }}>Quick Links</h4>
            <div className="flex flex-wrap" style={{ columnGap: '2.6rem', rowGap: '1rem' }}>
              {QUICK_LINKS.map(({ label, target }) => (
                <button
                  key={target}
                  onClick={() => handleNavClick(target)}
                  className="text-st-black/80 hover:text-st-black text-lg sm:text-xl transition-colors cursor-pointer bg-transparent border-none"
                >
                  {label}
                </button>
              ))}
              <Link to="/quote" className="text-st-black/80 hover:text-st-black text-lg sm:text-xl transition-colors">
                Quote
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-st-black" style={{ marginBottom: '1.4rem' }}>Follow Us</h4>
            <div className="flex flex-wrap" style={{ gap: '1rem' }}>
              <a
                href="https://www.instagram.com/stringtheory3dp?igsh=amc2NDRidmw1dGxt&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-st-black/80 hover:text-st-black transition-colors rounded-full px-6 py-3.5"
              >
                <span className="w-8 h-8 rounded-full bg-st-black text-st-yellow flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                Instagram
              </a>
              <a
                href="https://x.com/stringtheory3dp?s=21&t=wZrOf3KZQlsszoJ8PDZg-w"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-st-black/80 hover:text-st-black transition-colors rounded-full px-6 py-3.5"
              >
                <span className="w-8 h-8 rounded-full bg-st-black text-st-yellow flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/></svg>
                </span>
                X (Twitter)
              </a>
              <a
                href="https://www.linkedin.com/company/string-theory-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-st-black/80 hover:text-st-black transition-colors rounded-full px-6 py-3.5"
              >
                <span className="w-8 h-8 rounded-full bg-st-black text-st-yellow flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM7.119 20.452H3.555V9h3.564v11.452z"/></svg>
                </span>
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-st-black/15 flex flex-col md:flex-row justify-between items-center gap-5" style={{ marginTop: '4.5rem', paddingTop: '2rem', paddingBottom: '0.5rem' }}>
          <p className="text-sm sm:text-base text-st-black/60 text-center md:text-left">
            &copy; {new Date().getFullYear()} String Theory. All rights reserved.
          </p>
          <div className="flex gap-5 sm:gap-8 text-sm sm:text-base text-st-black/60">
            <a href="#" className="hover:text-st-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-st-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

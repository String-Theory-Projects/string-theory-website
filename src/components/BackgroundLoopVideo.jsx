import { useEffect, useRef } from 'react'

/**
 * Muted, inline background loop for mobile + in-app browsers.
 * Programmatic play + attribute hardening; no controls / PiP / AirPlay affordances.
 */
export default function BackgroundLoopVideo({ src, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const arm = () => {
      el.muted = true
      el.defaultMuted = true
      el.setAttribute('muted', '')
      el.setAttribute('playsinline', '')
      el.setAttribute('webkit-playsinline', 'true')
      el.setAttribute('x-webkit-airplay', 'deny')
    }

    const tryPlay = () => {
      arm()
      const p = el.play()
      if (p != null && typeof p.then === 'function') {
        p.catch(() => {})
      }
    }

    arm()
    tryPlay()

    const onVisible = () => {
      if (document.visibilityState === 'visible') tryPlay()
    }

    const unlock = () => {
      tryPlay()
      document.removeEventListener('touchstart', unlock, true)
      document.removeEventListener('click', unlock, true)
    }

    el.addEventListener('loadeddata', tryPlay)
    el.addEventListener('canplay', tryPlay)
    el.addEventListener('canplaythrough', tryPlay)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('pageshow', tryPlay)

    document.addEventListener('touchstart', unlock, { passive: true, capture: true })
    document.addEventListener('click', unlock, true)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) tryPlay()
      },
      { threshold: 0.01, rootMargin: '48px' }
    )
    io.observe(el)

    return () => {
      el.removeEventListener('loadeddata', tryPlay)
      el.removeEventListener('canplay', tryPlay)
      el.removeEventListener('canplaythrough', tryPlay)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('pageshow', tryPlay)
      document.removeEventListener('touchstart', unlock, true)
      document.removeEventListener('click', unlock, true)
      io.disconnect()
    }
  }, [src])

  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      defaultMuted
      preload="auto"
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

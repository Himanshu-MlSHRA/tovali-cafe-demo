import { useCallback, useEffect, useState } from 'react'
import { getLenis, gsap, reduced, scrollToId, startLenis, ScrollTrigger } from './lib/motion'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import { CrossMarquee, ExpandImage } from './sections/Showcase'
import Intro from './sections/Intro'
import Menu from './sections/Menu'
import Signature from './sections/Signature'
import Day from './sections/Day'
import Gallery from './sections/Gallery'
import Booking from './sections/Booking'
import Footer from './sections/Footer'
import { BookButton } from './components/ui'

export default function App() {
  const [ready, setReady] = useState(false)
  const done = useCallback(() => setReady(true), [])

  // smooth scroll stays paused while the preloader is up
  useEffect(() => { startLenis()?.stop() }, [])

  // fonts and lazy images change section heights; re-measure the pinned sections when they land
  useEffect(() => {
    let id = 0
    const refresh = () => { cancelAnimationFrame(id); id = requestAnimationFrame(() => ScrollTrigger.refresh()) }
    document.fonts?.ready.then(refresh)
    window.addEventListener('load', refresh)
    return () => { cancelAnimationFrame(id); window.removeEventListener('load', refresh) }
  }, [])

  // after load: headings made of .char letters rise in when they scroll into view
  useEffect(() => {
    if (!ready) return
    getLenis()?.start()
    ScrollTrigger.refresh()
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('#menu h2').forEach((h) => {
        gsap.from(h.querySelectorAll('.char'), {
          yPercent: 110, stagger: 0.03, duration: 1, ease: 'power4.out',
          scrollTrigger: { trigger: h, start: 'top 85%' },
        })
      })
      gsap.utils.toArray('#book h2, #visit h2, #day h2').forEach((h) => {
        gsap.from(h, { y: 80, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } })
      })
    })
    return () => ctx.revert()
  }, [ready])

  // in-page links go through the smooth scroller
  useEffect(() => {
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented) return
      const id = a.getAttribute('href').slice(1)
      if (!id) return
      e.preventDefault()
      scrollToId(id)
    }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [])

  // phone: a booking bar that appears once the hero has gone
  const [bar, setBar] = useState(false)
  useEffect(() => {
    const on = () => {
      const book = document.getElementById('book')
      const r = book?.getBoundingClientRect()
      const inBook = r && r.top < window.innerHeight && r.bottom > 0
      setBar(window.scrollY > window.innerHeight * 0.9 && !inBook)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div className="grain">
      <a href="#book" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-paper focus:px-4 focus:py-2 focus:rounded-full">Skip to booking</a>
      <Preloader onDone={done} />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <ExpandImage />
        <Intro />
        <CrossMarquee />
        <Menu />
        <Signature />
        <Day />
        <Gallery />
        <Booking />
      </main>
      <Footer />
      <div className={`sm:hidden fixed inset-x-0 bottom-0 z-40 p-3 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-500 ${bar ? 'translate-y-0' : 'translate-y-full'}`}>
        <BookButton className="w-full" />
      </div>
    </div>
  )
}

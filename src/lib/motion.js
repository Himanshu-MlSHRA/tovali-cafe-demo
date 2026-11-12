import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null
export function startLenis() {
  if (reduced() || lenis) return lenis
  lenis = new Lenis({ duration: 1.15, smoothWheel: true, easing: (t) => 1 - Math.pow(1 - t, 4) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export const getLenis = () => lenis

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.6 })
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

// split a string into per-character spans (keeps spaces)
export function chars(text) {
  return [...text].map((c, i) => (c === ' ' ? ' ' : { c, i }))
}

export { gsap, ScrollTrigger }

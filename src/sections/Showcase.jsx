import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { img } from '../data/menu'
import { Star } from '../components/ui'

// A photo that opens from a small rounded window to full-bleed as you scroll,
// with the marquee bands crossing over it.
export function ExpandImage() {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=120%', scrub: 1, pin: true },
      })
      tl.fromTo('.xi-frame', { clipPath: 'inset(18% 26% 18% 26% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none' })
        .fromTo('.xi-img', { scale: 1.45 }, { scale: 1, ease: 'none' }, 0)
        .fromTo('.xi-word-l', { xPercent: 0 }, { xPercent: -60, opacity: 0, ease: 'none' }, 0)
        .fromTo('.xi-word-r', { xPercent: 0 }, { xPercent: 60, opacity: 0, ease: 'none' }, 0)
        .fromTo('.xi-caption', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0.6)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-cream" aria-label="Fresh croissants and coffee">
      <div className="xi-frame absolute inset-0 overflow-hidden" style={{ clipPath: reduced() ? 'none' : undefined }}>
        <img className="xi-img w-full h-full object-cover" src={img('f170663639', null)} alt="A croissant and a cup of black coffee on bright saucers" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-5 md:px-10 pointer-events-none font-display uppercase text-[16vw] md:text-[11vw] leading-none text-ink" aria-hidden="true">
        <span className="xi-word-l">Fresh</span><span className="xi-word-r">daily</span>
      </div>
      <div className="xi-caption absolute bottom-8 md:bottom-12 left-5 md:left-10 right-5 md:right-10 text-paper flex flex-col md:flex-row md:items-end justify-between gap-4">
        <p className="font-display uppercase text-5xl md:text-8xl leading-[.9]">Out of the oven<br />at 7:00 & 11:00</p>
        <p className="max-w-sm text-lg text-paper/90">Every croissant is laminated over three days with French butter. When they’re gone, they’re gone.</p>
      </div>
    </section>
  )
}

export function Marquee({ items, className = '', reverse = false, speed = 40 }) {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const track = root.current.querySelector('.marquee')
      const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration: speed, ease: 'none', repeat: -1 })
      // scrolling speeds the band up and skews it, then it settles back
      const skewTo = gsap.quickTo(track, 'skewX', { duration: 0.4 })
      const settle = gsap.delayedCall(0.15, () => skewTo(0)).pause()
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current, start: 'top bottom', end: 'bottom top',
          onUpdate: (self) => {
            const v = self.getVelocity()
            skewTo(gsap.utils.clamp(-8, 8, v / -300))
            gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(v) / 400, 4), duration: 0.2, overwrite: true })
            gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.2 })
            // settle back once scrolling stops, otherwise the band can stay skewed
            settle.restart(true)
          },
        },
      })
    }, root)
    return () => ctx.revert()
  }, [reverse, speed])

  const row = (
    <div className="flex items-center shrink-0">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-6 md:gap-10 px-3 md:px-5">
          <span className="font-display uppercase text-5xl md:text-7xl leading-none whitespace-nowrap">{t}</span>
          <Star className="w-7 h-7 md:w-10 md:h-10 text-mustard shrink-0" />
        </span>
      ))}
    </div>
  )
  return (
    <div ref={root} className={`overflow-hidden py-4 md:py-6 ${className}`} aria-hidden="true">
      <div className="marquee">{row}{row}</div>
    </div>
  )
}

export function CrossMarquee() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-cream" aria-hidden="true">
      <Marquee className="bg-tomato text-paper -rotate-3 scale-110" items={['Fresh croissants', 'Masala chai', 'Shoyu ramen', 'Pesto rigatoni', 'Tiramisu']} />
      <Marquee className="bg-ink text-cream rotate-2 scale-110 -mt-6 md:-mt-10" reverse speed={50} items={['Coffee', 'Chai', 'Noodles', 'Pasta', 'Sweets']} />
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { DAY, img } from '../data/menu'

// Desktop: pinned, scrolls sideways through the day. Phone: stacked cards that slide in.
export default function Day() {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const track = root.current.querySelector('.day-track')
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: 1, pin: true, invalidateOnRefresh: true },
      })
      gsap.utils.toArray('.day-card').forEach((card) => {
        gsap.fromTo(card.querySelector('img'), { xPercent: -12, scale: 1.2 }, {
          xPercent: 12, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        })
        gsap.from(card.querySelector('.day-time'), {
          yPercent: 100, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 75%' },
        })
      })
      gsap.to('.day-progress', {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${dist()}`, scrub: true },
      })
    })
    mm.add('(max-width: 1023px)', () => {
      gsap.utils.toArray('.day-card').forEach((card, i) => {
        gsap.from(card, { x: i % 2 ? 80 : -80, opacity: 0, rotate: i % 2 ? 4 : -4, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 85%' } })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="day" ref={root} className="relative bg-ink text-cream overflow-hidden lg:h-[100svh]" aria-labelledby="day-h">
      <div className="day-track flex flex-col lg:flex-row lg:h-full lg:items-center gap-10 lg:gap-16 px-5 md:px-10 py-24 lg:py-0 lg:w-max">
        <div className="lg:w-[38vw] shrink-0">
          <p className="text-sm font-semibold uppercase tracking-[.18em] text-mustard mb-5">7:30 to 22:00</p>
          <h2 id="day-h" className="font-display uppercase text-[18vw] lg:text-[8.5vw] leading-[.85]">A day at <span className="text-tomato">Tovali</span></h2>
          <p className="mt-6 max-w-sm text-lg text-cream/75">From the first croissant to the last plate of pasta. Keep scrolling, the day moves with you.</p>
        </div>
        {DAY.map((d, i) => (
          <article key={d.time} className={`day-card relative shrink-0 lg:w-[34vw] ${i % 2 ? 'lg:translate-y-14' : 'lg:-translate-y-10'}`}>
            <div className="overflow-hidden rounded-[28px] aspect-[4/5] lg:aspect-[4/4.6]" data-cursor="Drag on">
              <img src={img(d.photo, 960)} alt={d.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute top-5 left-5 overflow-hidden">
              <p className="day-time font-display text-6xl md:text-7xl text-paper drop-shadow-[0_4px_20px_rgba(0,0,0,.45)]">{d.time}</p>
            </div>
            <h3 className="mt-5 font-display uppercase text-3xl md:text-4xl">{d.title}</h3>
            <p className="mt-2 max-w-md text-cream/75">{d.text}</p>
          </article>
        ))}
        <div className="hidden lg:block w-[10vw] shrink-0" />
      </div>
      <div className="hidden lg:block absolute bottom-8 left-10 right-10 h-[2px] bg-cream/15">
        <div className="day-progress h-full bg-mustard origin-left scale-x-0" />
      </div>
    </section>
  )
}

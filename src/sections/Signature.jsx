import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { img } from '../data/menu'
import { BookButton } from '../components/ui'

// Pinned: "NOODLES" set huge, the bowl spins up from the middle and the letters fly apart.
export default function Signature() {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray('.sig-l')
      const mid = (letters.length - 1) / 2
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=160%', scrub: 1, pin: true, invalidateOnRefresh: true },
      })
      tl.fromTo('.sig-bowl', { scale: 0.25, rotate: -120 }, { scale: 1, rotate: 0, ease: 'power2.out' })
        .to(letters, { x: (i) => (i - mid) * window.innerWidth * 0.11, y: (i) => (i % 2 ? -1 : 1) * 60, rotate: (i) => (i - mid) * 8, opacity: 0.12, ease: 'power2.in' }, 0)
        .fromTo('.sig-info', { opacity: 0, y: 60 }, { opacity: 1, y: 0 }, 0.55)
        .fromTo('.sig-steam path', { strokeDashoffset: 120 }, { strokeDashoffset: 0, stagger: 0.05 }, 0.4)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-tomato text-paper" aria-labelledby="sig-h">
      <h2 id="sig-h" className="sr-only">Signature dish: shoyu ramen</h2>
      <div className="absolute inset-0 flex items-center justify-center font-display uppercase text-[23vw] leading-none select-none" aria-hidden="true">
        {'NOODLES'.split('').map((c, i) => <span key={i} className="sig-l inline-block">{c}</span>)}
      </div>
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <svg className="sig-steam absolute -top-24 left-1/2 -translate-x-1/2 w-40 h-28 text-paper/80" viewBox="0 0 160 110" fill="none" aria-hidden="true">
            {[40, 80, 120].map((x) => (
              <path key={x} d={`M${x} 105c-14-18 14-30 0-50s14-30 0-50`} stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="120" />
            ))}
          </svg>
          <img src={img('f141427772', null)} alt="A bowl of shoyu ramen with sliced pork, soft eggs and nori"
            className="sig-bowl w-[78vw] max-w-[560px] aspect-square object-cover rounded-full border-[10px] border-paper shadow-[0_40px_80px_-20px_rgba(0,0,0,.55)]" />
        </div>
      </div>
      <div className="sig-info absolute bottom-6 md:bottom-12 inset-x-5 md:inset-x-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <p className="font-serif italic text-3xl md:text-5xl">The signature</p>
          <p className="font-display uppercase text-4xl md:text-7xl leading-[.9]">Shoyu ramen · $16.50</p>
        </div>
        <div className="md:text-right">
          <p className="max-w-sm md:ml-auto text-paper/90 text-lg mb-4">Pork bones simmered for 18 hours, hand-pulled noodles, a jammy egg and chashu torched to order.</p>
          <BookButton variant="btn-ink" />
        </div>
      </div>
    </section>
  )
}

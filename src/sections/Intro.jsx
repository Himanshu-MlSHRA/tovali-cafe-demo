import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { img } from '../data/menu'

// A statement whose words fill from pale to ink as you scroll, with small photos set into the line.
const PARTS = [
  'We open at 7:30 with', { pic: 'f150900594' }, 'warm croissants and a pot of', { pic: 'f12700779' },
  'masala chai. By noon the broth has been going for eighteen hours, the', { pic: 'f141427772' },
  'noodles go in, and fresh pasta comes off the board.', { pic: 'f127967731' }, 'Same room, same people, one long tasty day.',
]

export default function Intro() {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.iw', { opacity: 0.14 }, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.intro-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })
      gsap.from('.ip', {
        scale: 0, rotate: -20, ease: 'back.out(2)', stagger: 0.15, duration: 0.8,
        scrollTrigger: { trigger: '.intro-text', start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative py-28 md:py-44 bg-cream">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 grid md:grid-cols-12 gap-8">
        <p className="md:col-span-3 text-sm font-semibold uppercase tracking-[.18em] flex items-center gap-3">
          <span className="h-[2px] w-10 bg-tomato" /> The day at Tovali
        </p>
        <p className="intro-text md:col-span-9 text-[2rem] leading-[1.15] md:text-[3.6rem] md:leading-[1.08] font-medium tracking-[-0.02em]">
          {PARTS.map((p, i) =>
            typeof p === 'string'
              ? p.split(' ').map((w, j) => <span key={`${i}-${j}`} className="iw">{w} </span>)
              : (
                <span key={i} className="ip inline-block align-middle mx-1 -mt-2 h-[.95em] w-[1.9em] rounded-full overflow-hidden border-2 border-ink" aria-hidden="true">
                  <img src={img(p.pic, 500)} alt="" className="w-full h-full object-cover" />
                </span>
              ),
          )}
        </p>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { HOURS, img } from '../data/menu'
import { BookButton, Star } from '../components/ui'
import { Marquee } from './Showcase'

function JumpWord({ word }) {
  const ref = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.jw', {
        yPercent: 100, stagger: 0.06, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const jump = (e) => {
    if (reduced()) return
    gsap.fromTo(e.currentTarget, { y: 0 }, { y: '-14%', duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 })
    gsap.fromTo(e.currentTarget, { color: '#F0B23A' }, { color: '#F3EBDD', duration: 1.2, ease: 'power1.out' })
  }
  return (
    <div ref={ref} className="overflow-hidden" aria-hidden="true">
      <p className="font-display uppercase text-[30vw] leading-[.8] tracking-[-0.02em] flex justify-between">
        {word.split('').map((c, i) => <span key={i} className="jw inline-block" onPointerEnter={jump}>{c}</span>)}
      </p>
    </div>
  )
}

export default function Footer() {
  return (
    <footer id="visit" className="relative bg-ink text-cream rounded-t-[40px] md:rounded-t-[64px] overflow-hidden">
      <Marquee className="bg-mustard text-ink mt-0" speed={35} items={['Come hungry', 'Leave happy', 'Open every day', 'Walk-ins welcome']} />
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 pt-20 md:pt-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-mustard mb-5">Visit us</p>
            <h2 className="font-display uppercase text-6xl md:text-8xl leading-[.88]">Williamsburg,<br />Brooklyn</h2>
            <a href="https://www.openstreetmap.org/search?query=Williamsburg%20Brooklyn" target="_blank" rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 text-lg font-semibold" data-cursor="Map">
              <span className="relative">See the area<span className="absolute left-0 -bottom-1 h-[2px] w-full bg-mustard origin-left scale-x-100 transition-transform duration-500 group-hover:scale-x-0 group-hover:origin-right" /></span> ↗
            </a>
            <div className="mt-10"><BookButton variant="btn-red" /></div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-[.18em] text-mustard mb-5">Hours</h3>
            <dl className="space-y-4 text-lg">
              {HOURS.map((h) => (
                <div key={h.days} className="flex justify-between border-b border-cream/15 pb-4"><dt>{h.days}</dt><dd className="tabular-nums">{h.time}</dd></div>
              ))}
              <div className="flex justify-between border-b border-cream/15 pb-4"><dt>Kitchen</dt><dd className="tabular-nums">from 11:30</dd></div>
            </dl>
          </div>
          <div className="lg:col-span-3">
            <div className="relative aspect-square max-w-[280px] rounded-full overflow-hidden border-4 border-cream/20 animate-[spin_30s_linear_infinite] motion-reduce:animate-none">
              <img src={img('f95172125', 500)} alt="Latte art in a cup, seen from above" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28"><JumpWord word="Tovali" /></div>

        <div className="py-8 flex flex-col md:flex-row gap-3 justify-between text-sm text-cream/60 border-t border-cream/15">
          <span className="flex items-center gap-2"><Star className="w-4 h-4 text-tomato" />© 2026 Tovali · All-day cafe</span>
          <a href="/credits.html" className="hover:text-cream underline-offset-4 hover:underline">Photographs via Wikimedia Commons</a>
        </div>
      </div>
    </footer>
  )
}

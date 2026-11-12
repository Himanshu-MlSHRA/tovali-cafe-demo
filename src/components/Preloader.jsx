import { useEffect, useRef, useState } from 'react'
import { gsap, reduced } from '../lib/motion'

// Red curtain with a 0-100 counter and the name rising letter by letter, then it lifts away.
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const wrap = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    // no animation wanted: skip the curtain entirely instead of leaving it on screen
    if (reduced()) { if (wrap.current) wrap.current.style.display = 'none'; onDone(); return }
    document.documentElement.style.overflow = 'hidden'
    const counter = { v: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = ''
          if (wrap.current) wrap.current.style.display = 'none'
          onDone()
        },
      })
      tl.from('.pl-char', { yPercent: 110, duration: 0.9, stagger: 0.06, ease: 'power4.out' })
        .to(counter, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => setN(Math.round(counter.v)) }, 0)
        .to('.pl-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
        .to('.pl-char', { yPercent: -110, duration: 0.6, stagger: 0.04, ease: 'power3.in' }, '+=0.15')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.15')
        .to('.pl-under', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.85')
    }, wrap)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div ref={wrap}>
      <div className="pl-under fixed inset-0 z-[89] bg-mustard" aria-hidden="true" />
      <div ref={root} className="fixed inset-0 z-[90] bg-tomato text-paper flex flex-col justify-between p-6 md:p-10" role="status" aria-label="Loading">
        <div className="pl-meta flex justify-between text-sm font-semibold uppercase tracking-widest">
          <span>Williamsburg, Brooklyn</span><span>Est. kitchen</span>
        </div>
        <div className="overflow-hidden">
          <h2 className="font-display uppercase leading-[.82] text-[24vw] md:text-[20vw] tracking-tight flex" aria-label="Tovali">
            {'TOVALI'.split('').map((c, i) => <span key={i} className="pl-char inline-block" aria-hidden="true">{c}</span>)}
          </h2>
        </div>
        <div className="pl-meta">
          <div className="flex items-end justify-between font-display text-6xl md:text-8xl">
            <span>{String(n).padStart(3, '0')}</span>
            <span className="font-serif italic text-2xl md:text-4xl normal-case">coffee · chai · noodles</span>
          </div>
          <div className="mt-4 h-[3px] bg-paper/25"><div className="pl-bar h-full bg-paper origin-left scale-x-0" /></div>
        </div>
      </div>
    </div>
  )
}

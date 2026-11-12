import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, reduced } from '../lib/motion'
import { img } from '../data/menu'
import { Badge, BookButton, Split, Star } from '../components/ui'

const STICKERS = [
  { id: 'f95172125', cls: 'top-[33%] right-[5%] w-20 md:top-[16%] md:right-[6%] md:w-44', depth: 40, rot: 12 },
  { id: 'f22852463', cls: 'top-[12%] right-[24%] w-20 md:w-28 hidden lg:block', depth: -30, rot: -10 },
  { id: 'f68491603', cls: 'top-[44%] right-[4%] w-24 md:w-36 hidden md:block', depth: 55, rot: 8 },
]

export default function Hero({ ready }) {
  const root = useRef(null)

  // entrance, once the preloader has lifted
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      if (reduced()) return
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.hero-line .char', { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.025 })
        .from('.hero-pill', { width: 0, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.15 }, 0.35)
        .from('.hero-serif', { yPercent: 100, opacity: 0, duration: 1 }, 0.55)
        .from('.hero-sticker', { scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.8)', stagger: 0.12 }, 0.6)
        .from('.hero-fade', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.8)
    }, root)
    return () => ctx.revert()
  }, [ready])

  // mouse parallax on the stickers + scroll drift
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.hero-sticker')
      const setters = items.map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
        d: Number(el.dataset.depth),
      }))
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        setters.forEach((s) => { s.x(nx * s.d); s.y(ny * s.d) })
      }
      window.addEventListener('pointermove', move)
      items.forEach((el) => {
        gsap.to(el.querySelector('img'), {
          yPercent: -25 * Math.sign(Number(el.dataset.depth)), rotate: '+=25', ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })
      })
      gsap.to('.hero-type', {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => window.removeEventListener('pointermove', move)
    }, root)
    return () => ctx.revert()
  }, [])

  const big = 'font-display uppercase leading-[.86] tracking-[-0.01em] text-[15.5vw] md:text-[12.4vw]'

  return (
    <section id="top" ref={root} className="relative min-h-[100svh] pt-[96px] md:pt-[110px] pb-10 overflow-hidden">
      {STICKERS.map((s) => (
        <div key={s.id} className={`hero-sticker absolute z-10 ${s.cls}`} data-depth={s.depth} aria-hidden="true">
          <img src={img(s.id, 500)} alt="" className="aspect-square w-full rounded-full object-cover border-[5px] border-paper shadow-[0_20px_50px_-15px_rgba(30,20,16,.45)]"
            style={{ transform: `rotate(${s.rot}deg)` }} />
        </div>
      ))}

      <div className="mx-auto max-w-[1440px] px-5 md:px-10 relative">
        <div className="hero-fade flex items-center justify-between text-[13px] md:text-sm font-semibold uppercase tracking-[.18em] mb-6 md:mb-8">
          <span className="flex items-center gap-2"><span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full rounded-full bg-tomato opacity-60 animate-ping motion-reduce:animate-none" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tomato" /></span>All-day cafe · Williamsburg</span>
          <span className="hidden md:inline">7:30 — 22:00 daily</span>
        </div>

        <h1 className="hero-type relative" aria-label="Croissants, chai and noodles till late. An all-day cafe in Williamsburg, Brooklyn.">
          <span className={`hero-line ${big} block`} aria-hidden="true"><Split text="Croissants," /></span>
          <span className={`hero-line ${big} flex items-center gap-[2vw]`} aria-hidden="true">
            <span className="hero-pill inline-block h-[.78em] w-[2.3em] rounded-full overflow-hidden align-middle shrink-0">
              <img src={img('f170663639', 960)} alt="" className="w-full h-full object-cover" />
            </span>
            <Split text="chai" />
            <span className="hero-serif font-serif italic normal-case text-tomato text-[.62em] leading-none translate-y-[.05em]">&amp;</span>
          </span>
          <span className={`hero-line ${big} flex items-center gap-[2vw] flex-wrap`} aria-hidden="true">
            <Split text="Noodles" />
            <span className="hero-pill inline-block h-[.78em] w-[1.5em] rounded-full overflow-hidden shrink-0">
              <img src={img('f141427772', 960)} alt="" className="w-full h-full object-cover" />
            </span>
            <span className="hero-serif font-serif italic normal-case text-tomato text-[.5em] leading-none">till late.</span>
          </span>
        </h1>

        <div className="mt-8 md:mt-12 grid md:grid-cols-12 gap-8 items-end">
          <p className="hero-fade md:col-span-5 text-lg md:text-xl leading-relaxed max-w-md">
            Flaky croissants and masala chai from 7:30. From 11:30 the kitchen takes over with
            <span className="font-serif italic text-2xl"> slurpable ramen </span> and fresh pasta.
          </p>
          <div className="hero-fade md:col-span-4 flex flex-wrap gap-3">
            <BookButton />
            <a href="#menu" className="btn btn-line" data-cursor="Menu"><span>See the menu</span></a>
          </div>
          <div className="hero-fade md:col-span-3 flex md:justify-end">
            <Badge className="w-28 h-28 md:w-36 md:h-36 text-ink">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-tomato" />
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { gsap, reduced } from '../lib/motion'
import { img } from '../data/menu'

const COLS = [
  ['f188972205', 'f95172125', 'f81737031'],
  ['f56500845', 'f178360146', 'f79977114'],
  ['f68491603', 'm189498721', 'f22852463'],
  ['f73985481', 'f80955894', 'm61713028'],
]
const SPEED = [-18, 14, -26, 10]

export default function Gallery() {
  const root = useRef(null)
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.g-col').forEach((col, i) => {
        gsap.fromTo(col, { yPercent: -SPEED[i] / 2 }, {
          yPercent: SPEED[i], ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
      gsap.from('.g-title .char', {
        yPercent: 110, stagger: 0.03, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.g-title', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="gallery" ref={root} className="relative py-24 md:py-32 bg-cream overflow-hidden" aria-labelledby="g-h">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <h2 id="g-h" className="g-title font-display uppercase text-[16vw] md:text-[9vw] leading-[.85] text-center" aria-label="Pull up a chair">
          <span className="line-mask" aria-hidden="true">{'Pull up'.split('').map((c, i) => <span key={i} className="char">{c === ' ' ? ' ' : c}</span>)}</span>
          <span className="line-mask font-serif italic normal-case text-tomato" aria-hidden="true">{'a chair'.split('').map((c, i) => <span key={i} className="char">{c === ' ' ? ' ' : c}</span>)}</span>
        </h2>
        <div className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 h-[120vh] md:h-[140vh] overflow-hidden">
          {COLS.map((col, i) => (
            <div key={i} className={`g-col flex flex-col gap-3 md:gap-6 ${i > 1 ? 'hidden lg:flex' : ''}`}>
              {col.map((id, j) => (
                <div key={id} className={`overflow-hidden rounded-[22px] md:rounded-[28px] ${j === 1 ? 'aspect-[3/4]' : 'aspect-square'}`} data-cursor="Tovali">
                  <img src={img(id, 960)} alt="" className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-110" loading="lazy" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { MENU, img } from '../data/menu'
import { Split } from '../components/ui'

function Card({ item, i }) {
  const ref = useRef(null)
  const still = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 18 })
  const move = (e) => {
    if (still || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const leave = () => { mx.set(0); my.set(0) }

  return (
    <motion.article
      ref={ref} layout
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerMove={move} onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="group relative" data-cursor="Yum">
      <div className="relative aspect-[4/4.2] rounded-[28px] bg-tan overflow-hidden">
        <motion.img src={img(item.photo, 960)} alt={item.name}
          className="absolute inset-[9%] w-[82%] h-[82%] object-cover rounded-full shadow-[0_30px_40px_-20px_rgba(30,20,16,.6)] transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-[8deg]"
          loading="lazy" />
        {item.tag && (
          <span className="absolute top-4 left-4 rounded-full bg-mustard px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-ink">{item.tag}</span>
        )}
        <span className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-paper font-display text-lg translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          ${item.price.split('.')[0]}
        </span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-display uppercase text-2xl md:text-[28px] leading-none tracking-tight">{item.name}</h3>
        <span className="font-semibold text-lg tabular-nums">${item.price}</span>
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{item.desc}</p>
    </motion.article>
  )
}

export default function Menu() {
  const [active, setActive] = useState(MENU[0].key)
  const cat = MENU.find((m) => m.key === active)

  return (
    <section id="menu" className="relative py-24 md:py-36 bg-paper rounded-t-[40px] md:rounded-t-[64px] -mt-10 z-10">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-tomato mb-4">The menu</p>
            <h2 className="font-display uppercase text-[17vw] md:text-[9vw] leading-[.85] tracking-tight">
              <Split text="Eat all" /><br /><span className="font-serif italic normal-case text-tomato">day</span> <Split text="long" />
            </h2>
          </div>
          <div role="tablist" aria-label="Menu categories" className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 md:mx-0 md:px-0 [scrollbar-width:none]">
            {MENU.map((m) => (
              <button key={m.key} role="tab" aria-selected={active === m.key} aria-controls="menu-panel" onClick={() => setActive(m.key)}
                className={`relative shrink-0 rounded-full px-5 h-12 text-[15px] font-semibold transition-colors ${active === m.key ? 'text-paper' : 'text-ink hover:bg-tan'}`}>
                {active === m.key && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-tomato" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div id="menu-panel" role="tabpanel" aria-label={cat.label} className="mt-14 md:mt-20">
          <AnimatePresence mode="popLayout">
            <motion.div key={active} className={`grid gap-x-6 gap-y-14 sm:grid-cols-2 ${cat.items.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
              {cat.items.map((item, i) => <Card key={item.name} item={item} i={i} />)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

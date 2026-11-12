import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getLenis, scrollToId } from '../lib/motion'
import { BookButton, Star } from './ui'

const LINKS = [
  { id: 'menu', label: 'Menu' },
  { id: 'day', label: 'Our day' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'visit', label: 'Visit' },
]

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const on = () => {
      const y = window.scrollY
      setSolid(y > 40)
      setHidden(y > last && y > 400)
      last = y
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // only touch the scroll lock when the menu actually opens or closes, so the
  // first render doesn't unlock the page while the preloader is still up
  const touched = useRef(false)
  useEffect(() => {
    const l = getLenis()
    if (open) { touched.current = true; l?.stop(); document.documentElement.style.overflow = 'hidden' }
    else if (touched.current) { l?.start(); document.documentElement.style.overflow = '' }
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (id) => (e) => { e.preventDefault(); setOpen(false); setTimeout(() => scrollToId(id), open ? 450 : 0) }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open ? '-translate-y-full' : ''} ${solid && !open ? 'bg-cream/85 backdrop-blur-md border-b border-ink/10' : ''}`}>
        <div className="mx-auto max-w-[1440px] px-5 md:px-10 h-[72px] flex items-center justify-between">
          <a href="#top" onClick={go('top')} className={`font-display text-3xl uppercase tracking-tight flex items-center gap-2 relative z-[70] ${open ? 'text-paper' : ''}`} data-cursor="Top">
            <Star className="w-5 h-5 text-tomato" /> Tovali
          </a>
          <nav aria-label="Main" className="hidden lg:flex items-center gap-9">
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} onClick={go(l.id)} className="group relative text-[15px] font-semibold">
                {l.label}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-tomato origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 relative z-[70]">
            <div className="hidden sm:block"><BookButton className="h-12 px-6" /></div>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu"
              className={`lg:hidden h-12 w-12 rounded-full grid place-items-center ${open ? 'bg-paper text-tomato' : 'bg-ink text-paper'}`}
              aria-label={open ? 'Close menu' : 'Open menu'}>
              <span className="relative block w-5 h-3">
                <span className={`absolute left-0 h-[2px] w-5 bg-current transition-all duration-300 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-[2px] w-5 bg-current transition-all duration-300 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" className="fixed inset-0 z-[45] bg-tomato text-paper flex flex-col justify-end p-6 pb-10"
            initial={{ clipPath: 'circle(0% at 92% 36px)' }} animate={{ clipPath: 'circle(150% at 92% 36px)' }}
            exit={{ clipPath: 'circle(0% at 92% 36px)' }} transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}>
            <nav aria-label="Mobile">
              {[{ id: 'top', label: 'Home' }, ...LINKS, { id: 'book', label: 'Book a table' }].map((l, i) => (
                <div key={l.id} className="overflow-hidden">
                  <motion.a href={`#${l.id}`} onClick={go(l.id)}
                    className="block font-display uppercase text-[15vw] sm:text-7xl leading-[1.02]"
                    initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}>
                    {l.label}
                  </motion.a>
                </div>
              ))}
            </nav>
            <motion.p className="mt-8 text-paper/80 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              Williamsburg, Brooklyn · Open daily from 7:30
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

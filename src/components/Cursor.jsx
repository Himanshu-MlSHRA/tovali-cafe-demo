import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1 })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })
    // stay hidden until the pointer first moves, instead of sitting in the top-left corner
    gsap.set([dot.current, ring.current], { opacity: 0 })
    let shown = false
    const move = (e) => {
      if (!shown) {
        shown = true
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY })
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })
      }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
    }
    const leaveDoc = () => { shown = false; gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 }) }
    document.documentElement.addEventListener('pointerleave', leaveDoc)
    const over = (e) => {
      const t = e.target.closest('[data-cursor]')
      setLabel(t ? t.getAttribute('data-cursor') : '')
      ring.current.classList.toggle('is-big', !!t)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leaveDoc)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">{label}</div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

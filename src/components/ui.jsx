import { useEffect, useId, useRef } from 'react'
import { gsap, scrollToId } from '../lib/motion'

// Text split into characters inside a mask, so each letter can rise in.
export function Split({ text, className = '', charClass = '' }) {
  return (
    <span className={`line-mask ${className}`} aria-label={text} role="text">
      {[...text].map((c, i) =>
        c === ' ' ? <span key={i} aria-hidden="true"> </span> : (
          <span key={i} aria-hidden="true" className={`char ${charClass}`}>{c}</span>
        ),
      )}
    </span>
  )
}

// Pulls toward the pointer a little; springs back on leave.
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [strength])
  return <div ref={ref} className={`inline-block ${className}`}>{children}</div>
}

export function Arrow({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BookButton({ className = '', variant = 'btn-red', children = 'Book a table' }) {
  return (
    <Magnetic className={className.includes('w-full') ? 'w-full' : ''}>
      <a href="#book" data-cursor="Book" className={`btn ${variant} ${className}`}
        onClick={(e) => { e.preventDefault(); scrollToId('book') }}>
        <span>{children}<Arrow /></span>
      </a>
    </Magnetic>
  )
}

// Star / sparkle used in marquees and badges
export function Star({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}

// Rotating circular text badge
export function Badge({ text = 'Baked fresh every morning • Chai on the stove • ', className = '', children }) {
  const id = `badge-${useId().replace(/:/g, '')}`
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
        <defs><path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
        {/* textLength stretches the words to exactly one lap so the ends meet instead of overlapping */}
        <text className="fill-current" style={{ font: '600 13px "Inter Tight"', letterSpacing: '1px', textTransform: 'uppercase' }}>
          <textPath href={`#${id}`} textLength={Math.floor(2 * Math.PI * 78) - 2} lengthAdjust="spacing">{text}</textPath>
        </text>
      </svg>
      {children}
    </div>
  )
}

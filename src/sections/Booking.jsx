import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TABLES } from '../data/menu'
import FloorPlan from './FloorPlan'
import { Arrow, Star } from '../components/ui'
import { scrollToId } from '../lib/motion'

const TIMES = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

// Demo availability: a fixed pattern per date and time, so it looks real and stays consistent.
// To go live, replace with a fetch to the cafe's booking system that returns booked table ids.
function bookedFor(day, time) {
  const out = new Set()
  TABLES.forEach((t) => {
    let h = 2166136261
    for (const c of `${day}|${time}|${t.id}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) }
    if ((h >>> 0) % 100 < 36) out.add(t.id)
  })
  return out
}

function useLayout() {
  const q = '(max-width: 767px)'
  const [tall, setTall] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setTall(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return tall ? 'tall' : 'wide'
}

const pad = (n) => String(n).padStart(2, '0')
const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i)
  return {
    // local date, not UTC, so "Today" is right late in the evening too
    key: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    weekend: d.getDay() === 0 || d.getDay() === 6,
    top: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' }),
    num: d.getDate(),
    long: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  }
})

const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
// Weekends open at 8:30, and today's slots that have already gone can't be booked.
function slotOpen(dayKey, t) {
  const d = days.find((x) => x.key === dayKey)
  if (!d) return false
  if (d.weekend && mins(t) < mins('8:30')) return false
  if (d.key === days[0].key) {
    const now = new Date()
    if (mins(t) <= now.getHours() * 60 + now.getMinutes()) return false
  }
  return true
}
const openTimes = (dayKey) => TIMES.filter((t) => slotOpen(dayKey, t))
const firstDay = days.find((d) => openTimes(d.key).length) || days[1]

function Chip({ on, children, ...p }) {
  return (
    <button type="button" aria-pressed={on} {...p}
      className={`relative rounded-2xl border-2 transition-colors duration-300 ${on ? 'border-tomato text-paper' : p.disabled ? 'border-ink/10 bg-paper/50 text-ink/30 line-through cursor-not-allowed' : 'border-ink/15 hover:border-ink bg-paper'} ${p.className || ''}`}>
      {on && <motion.span layoutId={p['data-group']} className="absolute inset-0 -m-[2px] rounded-2xl bg-tomato" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
      <span className="relative">{children}</span>
    </button>
  )
}

export default function Booking() {
  const layout = useLayout()
  const [day, setDay] = useState(firstDay.key)
  const [time, setTime] = useState(() => (slotOpen(firstDay.key, '19:00') ? '19:00' : openTimes(firstDay.key)[0]))
  const [party, setParty] = useState(2)
  const [picked, setPicked] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', note: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const booked = useMemo(() => bookedFor(day, time), [day, time])
  const freeCount = TABLES.filter((t) => !booked.has(t.id) && t.seats >= party).length
  const table = TABLES.find((t) => t.id === picked)

  // switching day can make the chosen time impossible (past, or before weekend opening)
  useEffect(() => {
    if (!slotOpen(day, time)) setTime(openTimes(day)[0])
  }, [day, time])

  useEffect(() => {
    if (picked && (booked.has(picked) || TABLES.find((t) => t.id === picked).seats < party)) setPicked(null)
  }, [booked, party, picked])

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!slotOpen(day, time)) er.table = 'That time has already passed. Pick a later one.'
    else if (!picked) er.table = 'Pick a free table on the plan.'
    if (!form.name.trim()) er.name = 'Write the name for the booking.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = 'Write an email address, like name@example.com.'
    setErrors(er)
    if (Object.keys(er).length) return
    // Demo: show the ticket. To go live, POST { day, time, party, picked, ...form } to the cafe's booking endpoint here.
    setDone({ code: `TOV-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, day: days.find((d) => d.key === day).long, time, party, table, ...form, name: form.name.trim(), email: form.email.trim() })
    // the ticket is much shorter than the form; bring it into view
    requestAnimationFrame(() => scrollToId('book'))
  }

  return (
    <section id="book" className="relative py-24 md:py-36 bg-cream" aria-labelledby="book-h">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <h2 id="book-h" className="font-display uppercase text-[17vw] md:text-[8.5vw] leading-[.85]">
            Pick your <span className="font-serif italic normal-case text-tomato">table</span>
          </h2>
          <p className="max-w-sm text-lg">Choose a day and time, see which tables are free right now, and tap the one you want.</p>
        </div>

        <div className="relative rounded-[32px] md:rounded-[48px] bg-tan p-4 sm:p-6 md:p-10 overflow-hidden">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div key="flow" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }}>
                {/* controls */}
                <div className="lg:col-span-4 space-y-8 min-w-0">
                  <fieldset className="min-w-0">
                    <legend className="text-sm font-bold uppercase tracking-[.16em] mb-3 flex items-center gap-2"><span className="grid place-items-center w-6 h-6 rounded-full bg-ink text-paper text-xs">1</span>Day</legend>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
                      {days.map((d) => (
                        <Chip key={d.key} on={day === d.key} disabled={!openTimes(d.key).length} onClick={() => setDay(d.key)} data-group="day-chip" className="shrink-0 w-[68px] h-[76px]" aria-label={d.long}>
                          <span className="block text-[12px] font-semibold uppercase tracking-wider opacity-80">{d.top}</span>
                          <span className="block font-display text-3xl leading-tight">{d.num}</span>
                        </Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="min-w-0">
                    <legend className="text-sm font-bold uppercase tracking-[.16em] mb-3 flex items-center gap-2"><span className="grid place-items-center w-6 h-6 rounded-full bg-ink text-paper text-xs">2</span>Time</legend>
                    <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-4 gap-2">
                      {TIMES.map((t) => (
                        <Chip key={t} on={time === t} disabled={!slotOpen(day, t)} onClick={() => setTime(t)} data-group="time-chip" className="h-12 font-semibold tabular-nums">{t}</Chip>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="min-w-0">
                    <legend className="text-sm font-bold uppercase tracking-[.16em] mb-3 flex items-center gap-2"><span className="grid place-items-center w-6 h-6 rounded-full bg-ink text-paper text-xs">3</span>Guests</legend>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setParty((p) => Math.max(1, p - 1))} aria-label="Fewer guests" className="w-14 h-14 rounded-full border-2 border-ink text-2xl font-bold hover:bg-ink hover:text-paper transition-colors">−</button>
                      <div className="w-20 text-center overflow-hidden h-16" aria-live="polite">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={party} className="block font-display text-6xl leading-[1.1]"
                            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }}>{party}</motion.span>
                        </AnimatePresence>
                      </div>
                      <button type="button" onClick={() => setParty((p) => Math.min(6, p + 1))} aria-label="More guests" className="w-14 h-14 rounded-full border-2 border-ink text-2xl font-bold hover:bg-ink hover:text-paper transition-colors">+</button>
                    </div>
                  </fieldset>
                </div>

                {/* plan */}
                <div className="lg:col-span-8 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <p className="text-sm font-bold uppercase tracking-[.16em] flex items-center gap-2"><span className="grid place-items-center w-6 h-6 rounded-full bg-ink text-paper text-xs">4</span>Your table</p>
                    <motion.p key={`${day}${time}${party}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-[15px] font-semibold" aria-live="polite">
                      {freeCount ? <><span className="text-tomato">{freeCount} of {TABLES.length}</span> tables free for {party} at {time}</> : <>Fully booked at {time}. Try another time.</>}
                    </motion.p>
                  </div>
                  <div className="rounded-[24px] bg-paper p-2 md:p-4 shadow-[0_30px_60px_-30px_rgba(30,20,16,.35)]">
                    <FloorPlan layout={layout} booked={booked} party={party} picked={picked} onPick={setPicked} slotKey={`${day}-${time}`} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium" aria-hidden="true">
                    <span className="flex items-center gap-2"><i className="w-4 h-4 rounded-full border-2 border-ink bg-paper" />Free</span>
                    <span className="flex items-center gap-2"><i className="w-4 h-4 rounded-full bg-tomato" />Your table</span>
                    <span className="flex items-center gap-2"><i className="w-4 h-4 rounded-full border-2 border-dashed border-ink bg-tan" />Booked</span>
                    <span className="flex items-center gap-2 opacity-50"><i className="w-4 h-4 rounded-full border-2 border-ink bg-paper" />Too small</span>
                  </div>

                  <form onSubmit={submit} noValidate className="mt-8">
                    <AnimatePresence>
                      {table && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <p className="font-display uppercase text-3xl md:text-4xl mb-5">
                            Table {table.id} <span className="font-serif italic normal-case text-tomato">· {table.zone.toLowerCase()}, {table.seats} seats</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {errors.table && <p className="mb-4 text-tomato font-semibold" role="alert">{errors.table}</p>}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[['name', 'Name', 'text', 'name'], ['email', 'Email', 'email', 'email']].map(([k, label, type, ac]) => (
                        <div key={k}>
                          <label htmlFor={`b-${k}`} className="block text-sm font-semibold mb-2">{label}</label>
                          <input id={`b-${k}`} type={type} autoComplete={ac} value={form[k]} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `b-${k}-e` : undefined}
                            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                            className="w-full h-14 rounded-2xl border-2 border-ink/15 bg-paper px-4 text-base outline-none focus:border-ink transition-colors" />
                          {errors[k] && <p id={`b-${k}-e`} className="mt-1.5 text-sm text-tomato font-semibold">{errors[k]}</p>}
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label htmlFor="b-note" className="block text-sm font-semibold mb-2">Anything we should know? <span className="font-normal text-ink/60">(optional)</span></label>
                        <input id="b-note" type="text" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Birthday, high chair, allergies…"
                          className="w-full h-14 rounded-2xl border-2 border-ink/15 bg-paper px-4 text-base outline-none focus:border-ink transition-colors" />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-red w-full sm:w-auto mt-6 h-16 px-10 text-base" data-cursor="Book">
                      <span>Book table {table ? table.id : ''} for {party}<Arrow /></span>
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div key="ticket" className="py-6 md:py-12 grid place-items-center text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="relative w-full max-w-md rounded-[28px] bg-paper p-8 md:p-10 shadow-[0_40px_80px_-30px_rgba(30,20,16,.5)]"
                  initial={{ rotateX: 90, y: 80 }} animate={{ rotateX: 0, y: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                  style={{ transformPerspective: 1000 }}>
                  {[...Array(10)].map((_, i) => (
                    <motion.span key={i} className="absolute left-1/2 top-1/2 text-mustard" aria-hidden="true"
                      initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                      animate={{ x: Math.cos(i * 0.63) * 220, y: Math.sin(i * 0.63) * 180, scale: [0, 1.2, 0], rotate: 180 }}
                      transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}>
                      <Star className="w-6 h-6" />
                    </motion.span>
                  ))}
                  <p className="text-sm font-bold uppercase tracking-[.2em] text-tomato">Request received</p>
                  <p className="font-display uppercase text-5xl md:text-6xl mt-3 leading-[.9]">See you soon, {done.name.split(' ')[0]}</p>
                  <div className="my-7 border-t-2 border-dashed border-ink/20" />
                  <dl className="grid grid-cols-2 gap-y-4 text-left">
                    <dt className="text-ink/60 text-sm">Day</dt><dd className="font-semibold text-right">{done.day}</dd>
                    <dt className="text-ink/60 text-sm">Time</dt><dd className="font-semibold text-right">{done.time}</dd>
                    <dt className="text-ink/60 text-sm">Guests</dt><dd className="font-semibold text-right">{done.party}</dd>
                    <dt className="text-ink/60 text-sm">Table</dt><dd className="font-semibold text-right">{done.table.id} · {done.table.zone}</dd>
                    <dt className="text-ink/60 text-sm">Ref</dt><dd className="font-display text-xl text-right tracking-wider">{done.code}</dd>
                  </dl>
                  <div className="my-7 border-t-2 border-dashed border-ink/20" />
                  <p className="text-[15px] text-ink/75">We’ll email <b>{done.email}</b> to confirm within the hour.</p>
                </motion.div>
                <button type="button" onClick={() => { setDone(null); setPicked(null) }} className="btn btn-line mt-8"><span>Book another table</span></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

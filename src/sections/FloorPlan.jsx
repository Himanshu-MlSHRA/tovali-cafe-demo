import { motion, useReducedMotion } from 'framer-motion'
import { TABLES } from '../data/menu'

const SIZE = { 2: { r: 34 }, 3: { r: 38 }, 4: { w: 120, h: 72 }, 5: { w: 136, h: 80 }, 6: { w: 176, h: 78 } }

function chairs(t, pos) {
  const out = []
  if (t.round) {
    const r = SIZE[t.seats].r + 16
    for (let k = 0; k < t.seats; k++) {
      const a = (Math.PI * 2 * k) / t.seats - Math.PI / 2
      out.push({ x: pos.x + Math.cos(a) * r, y: pos.y + Math.sin(a) * r, a: (a * 180) / Math.PI + 90 })
    }
    return out
  }
  const { w, h } = SIZE[t.seats]
  const top = Math.ceil(t.seats / 2)
  const bottom = t.seats - top
  const row = (n, y, a) => {
    for (let k = 0; k < n; k++) out.push({ x: pos.x - w / 2 + ((k + 0.5) * w) / n, y, a })
  }
  row(top, pos.y - h / 2 - 15, 0)
  row(bottom, pos.y + h / 2 + 15, 180)
  return out
}

export default function FloorPlan({ layout, booked, party, picked, onPick, slotKey }) {
  const still = useReducedMotion()
  const tall = layout === 'tall'
  const vb = tall ? '0 0 400 650' : '0 0 800 540'

  return (
    <svg viewBox={vb} className="w-full h-auto select-none" role="group" aria-label="Floor plan of the room. Choose a free table.">
      <defs>
        <pattern id="tiles" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#FBF6EC" />
          <path d="M0 0h24v24" fill="none" stroke="#1E1410" strokeOpacity=".06" />
        </pattern>
        <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0B23A" stopOpacity=".45" />
          <stop offset="1" stopColor="#F0B23A" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* room */}
      <rect x="8" y="8" width={tall ? 384 : 784} height={tall ? 634 : 524} rx="26" fill="url(#tiles)" stroke="#1E1410" strokeWidth="4" />
      {/* window + sunlight */}
      <line x1="40" y1="8" x2={tall ? 360 : 600} y2="8" stroke="#7FB3C8" strokeWidth="8" strokeLinecap="round" />
      <motion.rect x="40" y="12" width={tall ? 320 : 560} height="150" fill="url(#sun)"
        animate={still ? {} : { opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
      <text x="44" y="34" className="fill-ink/60" style={{ font: '600 12px "Inter Tight"', letterSpacing: 2 }}>WINDOW · STREET SIDE</text>

      {/* counter + kitchen */}
      {tall ? (
        <g>
          <rect x="250" y="615" width="130" height="20" rx="8" fill="#1E1410" />
          <text x="315" y="629" textAnchor="middle" fill="#F3EBDD" style={{ font: '600 11px "Inter Tight"', letterSpacing: 2 }}>COUNTER</text>
        </g>
      ) : (
        <g>
          <rect x="660" y="60" width="100" height="300" rx="14" fill="#1E1410" />
          <text x="710" y="210" textAnchor="middle" fill="#F3EBDD" style={{ font: '400 22px Anton', letterSpacing: 3 }} transform="rotate(90 710 210)">COUNTER</text>
          <rect x="660" y="380" width="100" height="120" rx="14" fill="#A3241A" />
          <text x="710" y="447" textAnchor="middle" fill="#FBF6EC" style={{ font: '400 18px Anton', letterSpacing: 2 }}>KITCHEN</text>
        </g>
      )}
      {/* door */}
      <path d={tall ? 'M8 610 v-60' : 'M8 500 v-60'} stroke="#F3EBDD" strokeWidth="8" />
      <path d={tall ? 'M8 550 a60 60 0 0 1 60 60' : 'M8 440 a60 60 0 0 1 60 60'} fill="none" stroke="#1E1410" strokeOpacity=".35" strokeWidth="2" strokeDasharray="5 5" />
      <text x="20" y={tall ? 636 : 526} className="fill-ink/60" style={{ font: '600 12px "Inter Tight"', letterSpacing: 2 }}>DOOR</text>
      {/* plants */}
      {(tall ? [[205, 615], [372, 40]] : [[455, 505], [30, 260]]).map(([x, y], i) => (
        <g key={i} aria-hidden="true">
          <circle cx={x} cy={y} r="16" fill="#5E6B3A" /><circle cx={x + 10} cy={y - 8} r="9" fill="#7C8B4A" /><circle cx={x - 9} cy={y + 6} r="8" fill="#7C8B4A" />
        </g>
      ))}

      {/* tables */}
      <g key={slotKey}>
        {TABLES.map((t, i) => {
          const pos = tall ? t.tall : t.wide
          const isBooked = booked.has(t.id)
          const tooSmall = t.seats < party
          const off = isBooked || tooSmall
          const sel = picked === t.id
          const fill = sel ? '#A3241A' : isBooked ? '#E7D9C2' : '#FBF6EC'
          const ink = sel ? '#FBF6EC' : '#1E1410'
          const state = isBooked ? 'booked' : tooSmall ? `too small for ${party}` : sel ? 'your table' : 'free'
          const size = SIZE[t.seats]
          return (
            <motion.g key={t.id}
              role="button" tabIndex={off ? -1 : 0} aria-pressed={sel} aria-disabled={off}
              aria-label={`Table ${t.id}, ${t.zone}, ${t.seats} seats, ${state}`}
              onClick={() => !off && onPick(sel ? null : t.id)}
              onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !off) { e.preventDefault(); onPick(sel ? null : t.id) } }}
              initial={still ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: tooSmall && !isBooked ? 0.35 : 1 }}
              whileHover={off || still ? undefined : { scale: 1.08 }}
              whileTap={off ? undefined : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: still ? 0 : i * 0.04 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center', cursor: off ? 'not-allowed' : 'pointer', outline: 'none' }}
              className="group focus-visible:[&>.focus]:opacity-100" data-cursor={off ? undefined : 'Pick'}>
              {chairs(t, pos).map((c, k) => (
                <rect key={k} x={c.x - 11} y={c.y - 7} width="22" height="14" rx="6"
                  transform={`rotate(${c.a} ${c.x} ${c.y})`} fill={sel ? '#6E140C' : isBooked ? '#CDBFA8' : '#1E1410'} />
              ))}
              {sel && !still && (
                <motion.circle cx={pos.x} cy={pos.y} r={t.round ? size.r + 6 : size.w / 2} fill="none" stroke="#A3241A" strokeWidth="3"
                  initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              )}
              {t.round
                ? <circle cx={pos.x} cy={pos.y} r={size.r} fill={fill} stroke="#1E1410" strokeWidth="3" strokeDasharray={isBooked ? '6 5' : undefined} />
                : <rect x={pos.x - size.w / 2} y={pos.y - size.h / 2} width={size.w} height={size.h} rx="12" fill={fill} stroke="#1E1410" strokeWidth="3" strokeDasharray={isBooked ? '6 5' : undefined} />}
              <circle className="focus opacity-0 transition-opacity" cx={pos.x} cy={pos.y} r={(t.round ? size.r : size.w / 2) + 18} fill="none" stroke="#F0B23A" strokeWidth="4" />
              <text x={pos.x} y={pos.y - 2} textAnchor="middle" fill={ink} style={{ font: '400 22px Anton' }}>{t.id}</text>
              <text x={pos.x} y={pos.y + 16} textAnchor="middle" fill={ink} fillOpacity=".75" style={{ font: '600 11px "Inter Tight"' }}>
                {isBooked ? 'BOOKED' : `${t.seats} SEATS`}
              </text>
            </motion.g>
          )
        })}
      </g>
    </svg>
  )
}

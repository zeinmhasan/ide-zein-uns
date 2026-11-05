import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCheck, Eye, EyeOff, CirclePlay, RotateCcw } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { wasteClasses } from '../../data/calorific'
import { forecastSeries, kelurahan } from '../../lib/forecast'
import { mulberry32, nf } from '../../lib/rng'
import { Badge, Card } from '../ui/primitives'

/* ------------------------------------------------------------------ */
/* M1 Forecast chart                                                   */
/* ------------------------------------------------------------------ */

export function ForecastChart() {
  const [k, setK] = useState(kelurahan[0].name)
  const data = useMemo(() => forecastSeries(k), [k])
  const next = data[28]
  const ritase = next.p50 ? Math.ceil(next.p50 / 3.5) : 0
  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="kel" className="text-sm font-medium">
            Kelurahan
          </label>
          <select id="kel" value={k} onChange={(e) => setK(e.target.value)} className="rounded-lg border border-line bg-paper px-3 py-1.5 text-sm">
            {kelurahan.map((x) => (
              <option key={x.name}>{x.name}</option>
            ))}
          </select>
        </div>
        <Badge kind="ilustrasi">ILUSTRASI · data sintetis</Badge>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid)" vertical={false} />
            <XAxis dataKey="label" interval={6} tick={{ fill: 'var(--ink-soft)', fontSize: 10.5, fontFamily: 'JetBrains Mono' }} stroke="var(--line)" />
            <YAxis tick={{ fill: 'var(--ink-soft)', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="var(--line)" unit=" t" domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => {
                if (Array.isArray(v)) return [`${v[0]}–${v[1]} ton`, 'P10–P90']
                return [`${v} ton`, name === 'actual' ? 'Aktual' : 'Forecast P50']
              }}
            />
            <Area dataKey="band" stroke="none" fill="var(--teal)" fillOpacity={0.16} isAnimationActive={false} />
            <Line dataKey="actual" stroke="var(--ink)" strokeWidth={1.8} dot={false} isAnimationActive={false} />
            <Line dataKey="p50" stroke="var(--teal)" strokeWidth={2.2} strokeDasharray="5 4" dot={{ r: 2.5, fill: 'var(--teal)' }} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 bg-ink" /> 28 hari aktual
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-5 border-t-2 border-dashed border-teal" /> forecast P50 7 hari
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-5 rounded-sm bg-teal/20" /> pita P10–P90
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 font-mono">
        <div>
          <div className="text-[11px] text-ink-soft">BESOK (P50)</div>
          <div className="num text-lg font-semibold">{nf(next.p50 ?? 0, 1)} t</div>
        </div>
        <div>
          <div className="text-[11px] text-ink-soft">P10–P90</div>
          <div className="num text-lg font-semibold">
            {nf(next.band?.[0] ?? 0, 1)}–{nf(next.band?.[1] ?? 0, 1)}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-ink-soft">RITASE*</div>
          <div className="num text-lg font-semibold">{ritase}</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-ink-soft">*Ritase = ceil(tonase ÷ kapasitas efektif armada), di sini 3,5 t/truk [ASUMSI]. Ada lonjakan +25% pada satu hari libur fiktif.</p>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* M3 WhatsApp mock                                                    */
/* ------------------------------------------------------------------ */

type Msg = { from: 'bot' | 'me'; text: string; time: string; buttons?: string[]; warn?: boolean }

const baseMsgs: Msg[] = [
  {
    from: 'bot',
    time: '19.30',
    text: 'ARUS · Jadwal Besok (Kamis, 10 Des)\nTruk: AD 8123 XX · Kel. Mangkubumen\nRitase 1: slot 06.40–06.55 → berangkat ±06.15\nRitase 2: slot 09.20–09.35',
    buttons: ['Berangkat', 'Tunda', 'Kendala'],
  },
  { from: 'me', time: '06.14', text: 'Berangkat' },
  { from: 'bot', time: '06.14', text: 'Siap. Tunjukkan QR ini di gerbang ya 👇\n[QR check-in · AD 8123 XX · R1]' },
]
const changeMsg: Msg = {
  from: 'bot',
  time: '10.15',
  warn: true,
  text: '⚠️ Perubahan jadwal\nKapasitas bongkar turun (1 alat berat perbaikan).\nRitase 2 kamu digeser ke 10.05–10.20.\nMohon tidak berangkat sebelum 09.40 agar tidak antre di jalan warga.',
  buttons: ['Oke', 'Kendala'],
}

export function WhatsAppMock() {
  const [msgs, setMsgs] = useState<Msg[]>(baseMsgs)
  const [typing, setTyping] = useState(false)
  const reduce = useReducedMotion()
  const timer = useRef<number>(0)
  const played = msgs.length > baseMsgs.length

  const play = () => {
    if (played) {
      setMsgs(baseMsgs)
      return
    }
    setTyping(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(
      () => {
        setTyping(false)
        setMsgs((m) => [...m, changeMsg])
      },
      reduce ? 0 : 1600,
    )
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-[320px_1fr]">
      <div className="mx-auto w-full max-w-[320px] rounded-[2.2rem] border-[10px] border-ink bg-ink shadow-xl">
        <div className="overflow-hidden rounded-[1.6rem]">
          <div className="flex items-center gap-3 bg-[#0b5c53] px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 font-display text-sm font-bold">AR</div>
            <div>
              <div className="text-sm font-semibold">ARUS · DLH Surakarta</div>
              <div className="text-[11px] opacity-75">{typing ? 'mengetik…' : 'akun bisnis'}</div>
            </div>
          </div>
          <div className="flex h-[440px] flex-col justify-end gap-2 overflow-hidden bg-[#e9e2d6] p-3 dark:bg-[#0f1a17]" aria-live="polite">
            <AnimatePresence initial={false}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i + m.time}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`max-w-[86%] ${m.from === 'me' ? 'self-end' : 'self-start'}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 text-[12.5px] leading-snug whitespace-pre-line shadow-sm ${
                      m.from === 'me' ? 'bg-[#d4f5c4] text-[#13261a] dark:bg-[#1d4d3c] dark:text-[#e3f4e8]' : m.warn ? 'bg-[#fff3d6] text-[#2a1d03] dark:bg-[#3a2f14] dark:text-[#f8eccd]' : 'bg-white text-[#1d2327] dark:bg-[#1f2c33] dark:text-[#e7ecee]'
                    }`}
                  >
                    {m.text}
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-60">
                      {m.time} {m.from === 'me' && <CheckCheck size={12} />}
                    </div>
                  </div>
                  {m.buttons && (
                    <div className="mt-1 grid gap-1" style={{ gridTemplateColumns: `repeat(${m.buttons.length}, 1fr)` }}>
                      {m.buttons.map((b) => (
                        <span key={b} className="rounded-md bg-white py-1.5 text-center text-[11.5px] font-semibold text-[#0b7a6c] shadow-sm dark:bg-[#1f2c33] dark:text-[#5fd3c2]">
                          {b}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="self-start rounded-lg bg-white px-3 py-2 shadow-sm dark:bg-[#1f2c33]">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="animate-blink h-1.5 w-1.5 rounded-full bg-[#7a8a90]" style={{ animationDelay: `${d * 0.2}s` }} />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Sopir tidak perlu memasang aplikasi baru. Jadwal H-1 datang lewat WhatsApp, lengkap dengan saran jam berangkat dan tombol balas cepat. Saat kapasitas bongkar berubah, hanya sopir yang terdampak yang menerima pesan baru.
        </p>
        <button onClick={play} disabled={typing} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-paper disabled:opacity-60">
          {played ? <RotateCcw size={16} /> : <CirclePlay size={16} />}
          {played ? 'Ulangi dari awal' : 'Putar skenario: alat rusak jam 10.15'}
        </button>
        <p className="mt-3 text-xs text-ink-soft">Prototipe boleh memakai Telegram Bot API sebagai cadangan. Plat dan nama kelurahan di mockup ini hanya contoh.</p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* M4 Gate vision mock                                                 */
/* ------------------------------------------------------------------ */

const COLS = 7
const ROWS = 4
const BED = { x: 60, y: 50, w: 520, h: 250 }
const CLASS_WEIGHTS = [
  ['ORG_B', 38],
  ['ORG_K', 7],
  ['PLS_L', 16],
  ['PLS_K', 5],
  ['KRT', 12],
  ['KAIN', 4],
  ['KRT_KLT', 2],
  ['INERT', 6],
  ['RES', 10],
] as const

function buildCells() {
  const rng = mulberry32(2026)
  const pts: { x: number; y: number }[][] = []
  for (let r = 0; r <= ROWS; r++) {
    const row: { x: number; y: number }[] = []
    for (let c = 0; c <= COLS; c++) {
      const edgeX = c === 0 || c === COLS
      const edgeY = r === 0 || r === ROWS
      row.push({
        x: BED.x + (c / COLS) * BED.w + (edgeX ? 0 : (rng() - 0.5) * 46),
        y: BED.y + (r / ROWS) * BED.h + (edgeY ? 0 : (rng() - 0.5) * 36),
      })
    }
    pts.push(row)
  }
  const total = CLASS_WEIGHTS.reduce((s, [, w]) => s + w, 0)
  const pick = () => {
    let u = rng() * total
    for (const [c, w] of CLASS_WEIGHTS) {
      u -= w
      if (u <= 0) return c
    }
    return 'RES'
  }
  const cells: { d: string; cls: string; cx: number; cy: number; area: number; specks: { x: number; y: number; r: number }[] }[] = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const a = pts[r][c]
      const b = pts[r][c + 1]
      const d2 = pts[r + 1][c + 1]
      const e = pts[r + 1][c]
      const cx = (a.x + b.x + d2.x + e.x) / 4
      const cy = (a.y + b.y + d2.y + e.y) / 4
      const area = Math.abs((a.x * b.y - b.x * a.y + b.x * d2.y - d2.x * b.y + d2.x * e.y - e.x * d2.y + e.x * a.y - a.x * e.y) / 2)
      const specks = Array.from({ length: 7 }, () => ({ x: cx + (rng() - 0.5) * 50, y: cy + (rng() - 0.5) * 34, r: 2 + rng() * 5 }))
      cells.push({ d: `M${a.x} ${a.y} L${b.x} ${b.y} L${d2.x} ${d2.y} L${e.x} ${e.y} Z`, cls: pick(), cx, cy, area, specks })
    }
  return cells
}

export function GateVisionMock() {
  const [mask, setMask] = useState(true)
  const cells = useMemo(buildCells, [])
  const byCode = Object.fromEntries(wasteClasses.map((w) => [w.code, w]))
  const areaTot = cells.reduce((s, c) => s + c.area, 0)
  const comp = wasteClasses
    .map((w) => ({ ...w, pct: (cells.filter((c) => c.cls === w.code).reduce((s, c) => s + c.area, 0) / areaTot) * 100 }))
    .filter((w) => w.pct > 0)
    .sort((a, b) => b.pct - a.pct)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="font-mono text-xs text-ink-soft">CAM-01 · TOP VIEW · AD 8123 XX</div>
          <button onClick={() => setMask((m) => !m)} aria-pressed={mask} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium hover:bg-paper-2">
            {mask ? <EyeOff size={15} /> : <Eye size={15} />} {mask ? 'Sembunyikan mask' : 'Tampilkan mask'}
          </button>
        </div>
        <svg viewBox="0 0 640 350" className="h-auto w-full bg-[#2b2a27]" role="img" aria-label="Ilustrasi foto bak truk dari atas dengan overlay segmentasi berwarna per kelas sampah.">
          <rect x={BED.x - 14} y={BED.y - 14} width={BED.w + 28} height={BED.h + 28} rx={8} fill="#4a4d4f" />
          <rect x={BED.x + BED.w + 14} y={BED.y + 50} width={34} height={150} rx={6} fill="#5d6164" />
          <clipPath id="bed">
            <rect x={BED.x} y={BED.y} width={BED.w} height={BED.h} rx={3} />
          </clipPath>
          <g clipPath="url(#bed)">
            {cells.map((c, i) => (
              <g key={i}>
                <path d={c.d} fill={byCode[c.cls].raw} />
                {c.specks.map((s, j) => (
                  <circle key={j} cx={s.x} cy={s.y} r={s.r} fill={j % 2 ? '#00000030' : '#ffffff22'} />
                ))}
              </g>
            ))}
            <motion.g initial={false} animate={{ opacity: mask ? 1 : 0 }} transition={{ duration: 0.35 }}>
              {cells.map((c, i) => (
                <g key={i}>
                  <path d={c.d} fill={byCode[c.cls].color} fillOpacity={0.62} stroke="#fff" strokeOpacity={0.85} strokeWidth={1.2} />
                  <text x={c.cx} y={c.cy + 3} textAnchor="middle" fill="#fff" fontSize={9.5} fontFamily="JetBrains Mono" fontWeight={600}>
                    {c.cls}
                  </text>
                </g>
              ))}
            </motion.g>
          </g>
          <text x={BED.x} y={BED.y + BED.h + 34} fill="#cfcac0" fontSize={10} fontFamily="JetBrains Mono">
            {mask ? 'YOLO-seg · mask per fraksi' : 'foto mentah'} · fill ratio ±0,85
          </text>
        </svg>
        <div className="flex items-center justify-between px-4 py-2.5">
          <Badge kind="ilustrasi">ILUSTRASI · bukan foto asli</Badge>
          <span className="text-[11px] text-ink-soft">Foto lapangan menyusul</span>
        </div>
      </Card>
      <div>
        <div className="font-mono text-[11px] tracking-widest text-ink-soft">FRAKSI LUAS PIKSEL</div>
        <ul className="mt-3 space-y-2">
          {comp.map((w) => (
            <li key={w.code}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm" style={{ background: w.color }} />
                  <span className="font-mono text-xs">{w.code}</span>
                  <span className="text-ink-soft">{w.name}</span>
                </span>
                <span className="num font-mono text-xs">{w.pct.toFixed(0)}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-paper-2">
                <div className="h-full rounded-full" style={{ width: `${w.pct}%`, background: w.color }} />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">
          Fraksi luas lalu dikonversi ke fraksi massa dengan faktor densitas per kelas: <span className="font-mono">w = a·ρ / Σ(a·ρ)</span>. Faktor ρ dikalibrasi dari sampel yang ditimbang per fraksi.
        </p>
      </div>
    </div>
  )
}

export function ClassLegend() {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-paper-2 text-left font-mono text-[11px] text-ink-soft">
          <tr>
            <th className="px-4 py-2.5">KODE</th>
            <th className="px-4 py-2.5">KELAS</th>
            <th className="px-4 py-2.5">CONTOH</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {wasteClasses.map((w) => (
            <tr key={w.code}>
              <td className="px-4 py-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold">
                  <span className="h-3 w-3 rounded-sm" style={{ background: w.color }} /> {w.code}
                </span>
              </td>
              <td className="px-4 py-2">{w.name}</td>
              <td className="px-4 py-2 text-ink-soft">{w.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

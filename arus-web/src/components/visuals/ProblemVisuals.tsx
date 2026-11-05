import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Flame, Landmark, Mountain, Sparkles, Truck, Users, Zap, type LucideIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { problemTree, stats, timeline, type TimelineCategory } from '../../data/content'
import { nf } from '../../lib/rng'
import { Card, Src } from '../ui/primitives'

/* ------------------------------------------------------------------ */
/* Stat tiles                                                          */
/* ------------------------------------------------------------------ */

function CountUp({ to, decimals = 0, grouping = true }: { to: number; decimals?: number; grouping?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setV(to)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const dur = 1300
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur)
      const e = 1 - Math.pow(1 - p, 3)
      setV(to * e)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, to])
  const text = grouping ? nf(v, decimals) : v.toFixed(decimals)
  return <span ref={ref}>{text}</span>
}

const toneText = { coral: 'text-coral', amber: 'text-amber', olive: 'text-olive', slate: 'text-slate' } as const
const toneBar = { coral: 'bg-coral', amber: 'bg-amber', olive: 'bg-olive', slate: 'bg-slate' } as const

export function StatTiles() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="relative bg-card p-6 md:p-7"
        >
          <span className={`absolute top-0 left-6 h-1 w-10 ${toneBar[s.tone]}`} />
          <div className={`num font-mono text-[2.6rem] font-semibold leading-none tracking-tight md:text-5xl ${toneText[s.tone]}`}>
            {s.prefix}
            <CountUp to={s.value} decimals={s.decimals} grouping={!s.noGrouping} />
            {s.unit && <span className="ml-1.5 text-lg font-medium text-ink-soft md:text-xl">{s.unit}</span>}
          </div>
          <div className="mt-4 font-display text-[17px] font-semibold">
            {s.label}
            <Src id={s.sourceId} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">{s.note}</p>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

const catMeta: Record<TimelineCategory, { icon: LucideIcon; tone: string; label: string }> = {
  tpa: { icon: Mountain, tone: 'slate', label: 'TPA' },
  api: { icon: Flame, tone: 'coral', label: 'Kebakaran' },
  antrean: { icon: Truck, tone: 'coral', label: 'Antrean' },
  pltsa: { icon: Zap, tone: 'amber', label: 'PLTSa' },
  warga: { icon: Users, tone: 'olive', label: 'Warga' },
  kebijakan: { icon: Landmark, tone: 'slate', label: 'Kebijakan' },
  arus: { icon: Sparkles, tone: 'teal', label: 'ARUS' },
}

export function Timeline() {
  const scroller = useRef<HTMLDivElement>(null)
  const scrollBy = (d: number) => scroller.current?.scrollBy({ left: d, behavior: 'smooth' })
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-soft">
          {Object.entries(catMeta).map(([k, m]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <m.icon size={13} strokeWidth={1.75} className={`text-${m.tone}`} /> {m.label}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => scrollBy(-340)} aria-label="Geser ke kiri" className="h-9 w-9 rounded-full border border-line hover:bg-paper-2">
            ←
          </button>
          <button onClick={() => scrollBy(340)} aria-label="Geser ke kanan" className="h-9 w-9 rounded-full border border-line hover:bg-paper-2">
            →
          </button>
        </div>
      </div>
      <div ref={scroller} className="no-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
        <ol className="relative flex w-max gap-4 pt-8">
          <div className="absolute top-[13px] right-0 left-0 h-px bg-line" aria-hidden />
          {timeline.map((e) => {
            const m = catMeta[e.category]
            const isArus = e.category === 'arus'
            return (
              <li key={e.date + e.title} className="relative w-64 shrink-0 snap-start">
                <span className={`absolute -top-[27px] left-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-paper bg-${m.tone} text-paper`}>
                  <m.icon size={13} strokeWidth={2} />
                </span>
                <div className={`h-full rounded-xl border p-4 ${isArus ? 'border-teal bg-teal/8' : 'border-line bg-card'}`}>
                  <div className={`num font-mono text-xs font-semibold text-${m.tone}`}>{e.date}</div>
                  <div className="mt-1.5 font-display text-base font-semibold leading-snug">
                    {e.title}
                    <Src id={e.sourceId} />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{e.desc}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Problem tree                                                        */
/* ------------------------------------------------------------------ */

export function ProblemTree() {
  const [root, setRoot] = useState('A1')
  const sel = problemTree.roots.find((r) => r.id === root)!
  return (
    <div className="relative">
      <div className="mb-3 font-mono text-[11px] tracking-widest text-coral">GEJALA · YANG TERLIHAT</div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {problemTree.symptoms.map((s) => (
          <div key={s.title} className="rounded-xl border border-coral/40 bg-coral/8 p-4">
            <div className="font-display font-semibold text-coral">
              {s.title}
              <Src id={s.sourceId} />
            </div>
            <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden h-12 w-full lg:block" aria-hidden>
        {[12.5, 37.5, 62.5, 87.5].map((x) => (
          <path key={x} d={`M${x} 0 C${x} 25, 50 15, 50 40`} fill="none" className="stroke-line" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mx-auto my-4 h-8 w-px bg-line lg:hidden" />

      <div className="mx-auto max-w-2xl rounded-2xl bg-ink p-6 text-center text-paper">
        <div className="font-mono text-[11px] tracking-widest opacity-60">MASALAH INTI</div>
        <p className="mt-2 font-display text-lg leading-snug font-semibold md:text-xl">{problemTree.core}</p>
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden h-12 w-full lg:block" aria-hidden>
        {[10, 30, 50, 70, 90].map((x) => (
          <path key={x} d={`M50 0 C50 25, ${x} 15, ${x} 40`} fill="none" className="stroke-slate" strokeWidth={0.8} vectorEffect="non-scaling-stroke" opacity={0.6} />
        ))}
      </svg>
      <div className="mx-auto my-4 h-8 w-px bg-line lg:hidden" />

      <div className="mb-3 font-mono text-[11px] tracking-widest text-slate">AKAR MASALAH · YANG TIDAK TERLIHAT (klik untuk penjelasan)</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {problemTree.roots.map((r) => (
          <button
            key={r.id}
            onClick={() => setRoot(r.id)}
            onMouseEnter={() => setRoot(r.id)}
            aria-pressed={root === r.id}
            className={`rounded-xl border p-3.5 text-left transition-colors ${
              root === r.id ? 'border-slate bg-slate text-paper' : 'border-slate/30 bg-card hover:border-slate'
            }`}
          >
            <div className={`font-mono text-xs font-semibold ${root === r.id ? 'opacity-80' : 'text-slate'}`}>{r.id}</div>
            <div className="mt-1 text-sm leading-snug font-semibold">{r.title}</div>
          </button>
        ))}
      </div>
      <motion.div key={sel.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-line bg-card p-4 text-[15px] leading-relaxed" aria-live="polite">
        <span className="font-mono text-sm font-semibold text-slate">{sel.id} · </span>
        {sel.text}
      </motion.div>

      <div className="mt-10 mb-3 font-mono text-[11px] tracking-widest text-ink-soft">DAMPAK</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {problemTree.impacts.map((d) => (
          <Card key={d.title} className="p-4">
            <div className={`font-display font-semibold text-${d.tone}`}>{d.title}</div>
            <p className="mt-1 text-sm text-ink-soft">{d.text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Bottleneck pipe                                                     */
/* ------------------------------------------------------------------ */

const ARRIVAL_PER_H = 30 // kedatangan puncak kloter pagi [ILUSTRASI]
const PROD = 10 // truk/jam per alat [ASUMSI]

export function BottleneckPipe() {
  const [alat, setAlat] = useState(2)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const reduce = useReducedMotion()
  const st = useRef({ queue: 6, served: [] as { id: number; x: number; y: number }[], arrive: 0, svc: 0, id: 0 })
  const [, setTick] = useState(0)
  const alatRef = useRef(alat)
  alatRef.current = alat

  useEffect(() => {
    if (reduce) {
      const cap = alat * PROD
      st.current.queue = cap >= ARRIVAL_PER_H ? 0 : Math.min(48, Math.round((ARRIVAL_PER_H - cap) * 1.6))
      setTick((t) => t + 1)
      return
    }
    if (!inView) return
    let raf = 0
    let last = performance.now()
    // 1 detik layar = 6 menit simulasi
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = st.current
      const simH = dt * 0.1
      s.arrive += ARRIVAL_PER_H * simH
      while (s.arrive >= 1) {
        s.arrive -= 1
        if (s.queue < 60) s.queue++
      }
      s.svc += alatRef.current * PROD * simH
      while (s.svc >= 1 && s.queue > 0) {
        s.svc -= 1
        s.queue--
        s.served.push({ id: s.id++, x: 610, y: 120 + (Math.random() - 0.5) * 14 })
      }
      if (s.queue === 0) s.svc = Math.min(s.svc, 1)
      s.served.forEach((p) => (p.x += 220 * dt))
      s.served = s.served.filter((p) => p.x < 1000)
      setTick((t) => (t + 1) % 1e6)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, alat])

  const cap = alat * PROD
  const neck = 10 + alat * 14
  const q = st.current.queue
  const cols = 14
  const dots = Array.from({ length: Math.min(q, 56) }, (_, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    return { x: 520 - c * 30, y: 120 + (r - 1.5) * 22 }
  })

  return (
    <div ref={ref}>
      <Card className="overflow-hidden">
        <svg viewBox="0 0 1000 240" className="h-auto w-full" role="img" aria-label={`Pipa aliran truk. Kapasitas bongkar ${cap} truk per jam dengan ${alat} alat berat, kedatangan puncak ${ARRIVAL_PER_H} truk per jam. Antrean saat ini ${q} truk.`}>
          <path
            d={`M40 50 H470 C530 50 540 ${120 - neck} 590 ${120 - neck} H640 C690 ${120 - neck} 700 50 760 50 H960 V190 H760 C700 190 690 ${120 + neck} 640 ${120 + neck} H590 C540 ${120 + neck} 530 190 470 190 H40 Z`}
            className="fill-paper-2 stroke-ink-soft"
            strokeWidth={1.5}
            style={{ transition: 'd 0.5s ease' }}
          />
          <text x={52} y={40} className="fill-ink-soft font-mono" fontSize={11}>
            KEDATANGAN ±{ARRIVAL_PER_H} TRUK/JAM (KLOTER PAGI)
          </text>
          <text x={615} y={36} textAnchor="middle" className="fill-ink font-mono" fontSize={11} fontWeight={600}>
            AREA BONGKAR
          </text>
          {/* ekskavator */}
          {Array.from({ length: 4 }, (_, i) => (
            <g key={i} transform={`translate(${563 + i * 18},214)`} opacity={i < alat ? 1 : 0.18}>
              <rect x={-6} y={-6} width={12} height={9} rx={1.5} className="fill-amber" />
              <path d="M5 -4 L11 -12 L15 -6" fill="none" className="stroke-amber" strokeWidth={2} />
            </g>
          ))}
          {dots.map((d, i) => (
            <rect key={i} x={d.x - 9} y={d.y - 6} width={18} height={12} rx={2.5} className="fill-coral" />
          ))}
          {st.current.served.map((p) => (
            <rect key={p.id} x={p.x - 9} y={p.y - 6} width={18} height={12} rx={2.5} className="fill-teal" />
          ))}
          <text x={960} y={40} textAnchor="end" className="fill-ink-soft font-mono" fontSize={11}>
            TERBONGKAR →
          </text>
        </svg>
        <div className="grid gap-5 border-t border-line p-5 md:grid-cols-[1fr_auto] md:items-center">
          <label className="block">
            <span className="flex items-center justify-between text-sm font-medium">
              Alat berat aktif <span className="num font-mono text-teal">{alat} unit</span>
            </span>
            <input type="range" min={1} max={4} step={1} value={alat} onChange={(e) => setAlat(+e.target.value)} className="mt-2 w-full" aria-label="Jumlah alat berat aktif" />
            <span className="mt-1 flex justify-between font-mono text-[10px] text-ink-soft">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </span>
          </label>
          <div className="flex gap-6 font-mono text-sm">
            <div>
              <div className="text-[11px] text-ink-soft">KAPASITAS</div>
              <div className={`num text-xl font-semibold ${cap < ARRIVAL_PER_H ? 'text-coral' : 'text-teal'}`}>{cap} truk/jam</div>
            </div>
            <div>
              <div className="text-[11px] text-ink-soft">ANTREAN</div>
              <div className="num text-xl font-semibold">
                {q} truk <span className="text-sm font-normal text-ink-soft">≈ {nf((q * 15) / 1000, 2)} km</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <p className="mt-3 text-xs text-ink-soft">
        Geser jumlah alat berat. Saat kapasitas di bawah laju kedatangan, antrean di depan leher pipa terus bertambah, sebanyak apa pun truknya. Produktivitas 10 truk/jam per alat dan 15 m per truk adalah asumsi.
      </p>
    </div>
  )
}

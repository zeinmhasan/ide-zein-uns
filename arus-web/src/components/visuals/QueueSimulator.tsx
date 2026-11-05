import { useReducedMotion } from 'framer-motion'
import { GitCompareArrows, Play, RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fmtClock, nf } from '../../lib/rng'
import { SIM, queueAt, simulate, type ArrivalMode, type Disruption, type SimResult } from '../../lib/simulation'
import { Badge, ScrollX, Segmented } from '../ui/primitives'

const DEFAULTS = { ritase: 120, alat: 2, prod: 10, disruption: 'alat' as Disruption, mode: 'bergelombang' as ArrivalMode }

const disruptionLabel: Record<Disruption, string> = {
  none: 'Tidak ada',
  alat: '1 alat rusak jam 10.15',
  zona: 'Zona utara tertutup jam 10.15 (−30%)',
}

function Slider({ label, value, min, max, step = 1, onChange, unit, badge }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit: string; badge?: boolean }) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-2 text-sm font-medium">
        <span className="flex items-center gap-1.5">
          {label} {badge && <Badge kind="asumsi" />}
        </span>
        <span className="num font-mono text-teal">
          {value} {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2 w-full" aria-label={label} />
    </label>
  )
}

const ROAD = { x0: 40, x1: 960, maxM: 3000 }
const mToX = (m: number) => ROAD.x1 - (Math.min(m, ROAD.maxM) / ROAD.maxM) * (ROAD.x1 - ROAD.x0)

function Lane({ y, q, tone, label }: { y: number; q: number; tone: 'coral' | 'teal'; label: string }) {
  const m = q * SIM.mPerTruck
  const xEnd = mToX(m)
  const n = Math.min(q, 60)
  const span = ROAD.x1 - 14 - xEnd
  return (
    <g>
      <rect x={ROAD.x0} y={y - 11} width={ROAD.x1 - ROAD.x0} height={22} rx={3} className="fill-line" />
      <rect x={xEnd} y={y - 11} width={Math.max(0, ROAD.x1 - xEnd)} height={22} className={`fill-${tone}`} opacity={0.18} style={{ transition: 'x .15s linear, width .15s linear' }} />
      {Array.from({ length: n }, (_, i) => {
        const x = ROAD.x1 - 14 - (n <= 1 ? 0 : (i / (n - 1)) * span)
        return <rect key={i} x={x - 5} y={y - 4} width={10} height={8} rx={1.5} className={`fill-${tone}`} />
      })}
      <text x={ROAD.x0} y={y - 18} className="fill-ink-soft font-mono" fontSize={11}>
        {label}
      </text>
      <text x={ROAD.x1} y={y - 18} textAnchor="end" className={`fill-${tone} font-mono`} fontSize={12} fontWeight={700}>
        {q} truk · {m >= ROAD.maxM ? '> 3' : nf(m / 1000, 2)} km{q > 60 ? `  (ikon 60, +${q - 60})` : ''}
      </text>
    </g>
  )
}

function RoadView({ runs, t }: { runs: { r: SimResult; tone: 'coral' | 'teal'; label: string }[]; t: number }) {
  const h = 70 + runs.length * 62
  const ticks = [0, 500, 1000, 1500, 2000, 2500, 3000]
  return (
    <svg viewBox={`0 0 1000 ${h}`} className="h-auto w-full" role="img" aria-label={`Antrean truk pada pukul ${fmtClock(t)}: ${runs.map((x) => `${x.label} ${queueAt(x.r, t)} truk`).join(', ')}.`}>
      {/* permukiman di 1–2 km */}
      <rect x={mToX(2000)} y={6} width={mToX(1000) - mToX(2000)} height={h - 40} rx={6} className="fill-coral" opacity={0.06} />
      <text x={(mToX(2000) + mToX(1000)) / 2} y={22} textAnchor="middle" className="fill-coral font-mono" fontSize={10.5} letterSpacing={1}>
        RUMAH WARGA
      </text>
      {runs.map((x, i) => (
        <Lane key={x.label} y={62 + i * 62} q={queueAt(x.r, t)} tone={x.tone} label={x.label} />
      ))}
      {/* gerbang */}
      <rect x={ROAD.x1} y={30} width={8} height={h - 60} className="fill-ink" />
      <text x={ROAD.x1 + 4} y={h - 14} textAnchor="end" className="fill-ink font-mono" fontSize={10} fontWeight={600}>
        GERBANG
      </text>
      {ticks.map((m) => (
        <g key={m}>
          <line x1={mToX(m)} x2={mToX(m)} y1={h - 34} y2={h - 28} className="stroke-ink-soft" />
          <text x={mToX(m)} y={h - 16} textAnchor="middle" className="fill-ink-soft font-mono" fontSize={10}>
            {m === 0 ? '' : m < 1000 ? `${m} m` : `${nf(m / 1000, m % 1000 ? 1 : 0)} km`}
          </text>
        </g>
      ))}
    </svg>
  )
}

function pct(a: number, b: number) {
  if (a <= 0) return '—'
  const d = ((b - a) / a) * 100
  return `${d > 0 ? '+' : '−'}${nf(Math.abs(d), 0)}%`
}

export function QueueSimulator() {
  const [p, setP] = useState(DEFAULTS)
  const [compare, setCompare] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [cursor, setCursor] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const raf = useRef(0)

  const wave = useMemo(() => simulate({ ...p, mode: 'bergelombang' }), [p])
  const slot = useMemo(() => simulate({ ...p, mode: 'slot' }), [p])
  const single = p.mode === 'slot' ? slot : wave
  const endT = Math.max(SIM.end, compare ? Math.max(wave.endT, slot.endT) : single.endT)

  const peakT = useMemo(() => {
    const r = compare ? wave : single
    let best = r.series[0]
    for (const s of r.series) if (s.q > best.q) best = s
    return best.t
  }, [compare, wave, single])
  const t = cursor ?? peakT

  const data = useMemo(() => {
    const out: { t: number; wave?: number; slot?: number }[] = []
    for (let m = SIM.start; m <= endT; m += 5) {
      const row: { t: number; wave?: number; slot?: number } = { t: m }
      if (compare || p.mode === 'bergelombang') row.wave = queueAt(wave, m)
      if (compare || p.mode === 'slot') row.slot = queueAt(slot, m)
      out.push(row)
    }
    return out
  }, [wave, slot, compare, p.mode, endT])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const run = () => {
    cancelAnimationFrame(raf.current)
    if (reduce) {
      setCursor(endT)
      return
    }
    setPlaying(true)
    const t0 = performance.now()
    const dur = 8000
    const tick = (now: number) => {
      const f = Math.min(1, (now - t0) / dur)
      setCursor(SIM.start + f * (endT - SIM.start))
      if (f < 1) raf.current = requestAnimationFrame(tick)
      else setPlaying(false)
    }
    raf.current = requestAnimationFrame(tick)
  }
  const reset = () => {
    cancelAnimationFrame(raf.current)
    setPlaying(false)
    setCursor(null)
    setP(DEFAULTS)
    setCompare(true)
  }
  const set = <K extends keyof typeof DEFAULTS>(k: K, v: (typeof DEFAULTS)[K]) => {
    setP((s) => ({ ...s, [k]: v }))
    if (!playing) setCursor(null)
  }

  const runs = compare
    ? [
        { r: wave, tone: 'coral' as const, label: 'BERGELOMBANG (KONDISI SEKARANG)' },
        { r: slot, tone: 'teal' as const, label: 'SLOT ARUS' },
      ]
    : [{ r: single, tone: p.mode === 'slot' ? ('teal' as const) : ('coral' as const), label: p.mode === 'slot' ? 'SLOT ARUS' : 'BERGELOMBANG (KONDISI SEKARANG)' }]

  const metrics: { label: string; get: (r: SimResult) => number; fmt: (v: number) => string }[] = [
    { label: 'Rata-rata tunggu', get: (r) => r.avgWait, fmt: (v) => `${nf(v, 0)} mnt` },
    { label: 'Antrean maksimum', get: (r) => r.maxQueue, fmt: (v) => `${nf(v, 0)} truk · ${nf((v * SIM.mPerTruck) / 1000, 2)} km` },
    { label: 'BBM idle terbuang', get: (r) => r.fuelL, fmt: (v) => `${nf(v, 0)} L` },
    { label: 'Jam kerja hilang', get: (r) => r.hoursLost, fmt: (v) => `${nf(v, 0)} jam` },
  ]

  return (
    <div className="rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div className="font-display text-lg font-semibold">Simulator antrean gerbang TPA</div>
        <Badge kind="simulasi" />
      </div>
      <div className="grid lg:grid-cols-[300px_1fr]">
        {/* kontrol */}
        <div className="space-y-5 border-b border-line p-5 lg:border-r lg:border-b-0">
          <Slider label="Ritase per hari" value={p.ritase} min={60} max={200} step={5} unit="ritase" onChange={(v) => set('ritase', v)} />
          <Slider label="Alat berat aktif" value={p.alat} min={1} max={4} unit="unit" onChange={(v) => set('alat', v)} />
          <Slider label="Produktivitas per alat" value={p.prod} min={6} max={16} unit="truk/jam" onChange={(v) => set('prod', v)} badge />
          <label className="block">
            <span className="text-sm font-medium">Skenario gangguan</span>
            <select value={p.disruption} onChange={(e) => set('disruption', e.target.value as Disruption)} className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm">
              {(Object.keys(disruptionLabel) as Disruption[]).map((k) => (
                <option key={k} value={k}>
                  {disruptionLabel[k]}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="text-sm font-medium">Mode kedatangan</span>
            <div className="mt-2">
              <Segmented
                label="Mode kedatangan"
                value={p.mode}
                onChange={(v) => {
                  set('mode', v)
                  setCompare(false)
                }}
                options={[
                  { value: 'bergelombang', label: 'Bergelombang' },
                  { value: 'slot', label: 'Slot ARUS' },
                ]}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={run} disabled={playing} className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3.5 py-2 text-sm font-semibold text-on-accent disabled:opacity-60">
              <Play size={15} /> Jalankan
            </button>
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-paper-2">
              <RotateCcw size={15} /> Reset
            </button>
            <button
              onClick={() => setCompare((c) => !c)}
              aria-pressed={compare}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${compare ? 'border-ink bg-ink text-paper' : 'border-line hover:bg-paper-2'}`}
            >
              <GitCompareArrows size={15} /> Bandingkan
            </button>
          </div>
          <div className="rounded-xl bg-paper-2 p-4 text-sm leading-relaxed">
            <span className="font-semibold">Coba ini:</span> set alat berat = 1, mode bergelombang, gangguan "1 alat rusak". Antrean yang terbentuk mirip kejadian 9 Februari 2026. Lalu ganti ke <span className="font-semibold text-teal">Slot ARUS</span>.
          </div>
        </div>

        {/* output */}
        <div className="min-w-0 p-5">
          <div className="mb-2 flex items-baseline justify-between">
            <div className="font-mono text-xs text-ink-soft">POSISI ANTREAN PADA PUKUL</div>
            <div className="num font-mono text-2xl font-semibold">{fmtClock(t)}</div>
          </div>
          <ScrollX minWidth={620}>
            <RoadView runs={runs} t={t} />
          </ScrollX>

          <div className="mt-6 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--grid)" vertical={false} />
                <XAxis dataKey="t" type="number" domain={[SIM.start, endT]} ticks={[300, 420, 540, 660, 780, 900, 1020, 1140, 1260, 1380].filter((x) => x <= endT)} tickFormatter={fmtClock} interval="preserveStartEnd" minTickGap={14} tick={{ fill: 'var(--ink-soft)', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="var(--line)" />
                <YAxis tick={{ fill: 'var(--ink-soft)', fontSize: 11, fontFamily: 'JetBrains Mono' }} stroke="var(--line)" allowDecimals={false} />
                <Tooltip
                  labelFormatter={(v) => `Pukul ${fmtClock(Number(v))}`}
                  formatter={(v, name) => [`${v} truk`, name === 'wave' ? 'Bergelombang' : 'Slot ARUS']}
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }}
                />
                {p.disruption !== 'none' && <ReferenceLine x={SIM.disruptAt} stroke="var(--coral)" strokeDasharray="4 4" label={{ value: 'gangguan 10.15', fill: 'var(--coral)', fontSize: 10, position: 'insideTopRight' }} />}
                <ReferenceLine x={t} stroke="var(--ink)" strokeWidth={1} />
                {data[0]?.wave !== undefined && <Area type="monotone" dataKey="wave" stroke="var(--coral)" fill="var(--coral)" fillOpacity={0.18} strokeWidth={2} isAnimationActive={false} />}
                {data[0]?.slot !== undefined && <Area type="monotone" dataKey="slot" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.22} strokeWidth={2} isAnimationActive={false} />}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 text-center font-mono text-[11px] text-ink-soft">Panjang antrean (truk) sepanjang hari</div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((m) => {
              const a = m.get(wave)
              const b = m.get(slot)
              return (
                <div key={m.label} className="rounded-xl border border-line p-4">
                  <div className="text-xs text-ink-soft">{m.label}</div>
                  {compare ? (
                    <>
                      <div className="num mt-1.5 font-mono text-sm text-coral">{m.fmt(a)}</div>
                      <div className="num font-mono text-sm text-teal">{m.fmt(b)}</div>
                      <div className="num mt-2 font-mono text-xl font-semibold">{pct(a, b)}</div>
                    </>
                  ) : (
                    <div className={`num mt-1.5 font-mono text-lg font-semibold ${p.mode === 'slot' ? 'text-teal' : 'text-coral'}`}>{m.fmt(m.get(single))}</div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 space-y-1 text-xs leading-relaxed text-ink-soft">
            {(compare || p.mode === 'slot') && slot.deferred > 0 && (
              <p className="text-amber">
                Slot ARUS: {slot.deferred} ritase tidak muat sebelum 21.00 dan diusulkan ditunda ke besok. Sistem juga mengirim peringatan "kapasitas kurang" ke Kepala UPTD.
              </p>
            )}
            {(compare || p.mode === 'bergelombang') && wave.unservedAtClose > 0 && <p className="text-coral">Bergelombang: {wave.unservedAtClose} truk masih antre sampai tengah malam.</p>}
            <p>
              Model: kedatangan per menit 05.00–21.00, waktu bongkar lognormal (cv 0,3), antrean FIFO, seed tetap 42. Bergelombang: 60% kloter 06.30–08.30, 40% kloter 10.30–12.30. Slot ARUS: slot 15 menit diisi sampai 90% kapasitas; jadwal setelah 10.45 dihitung ulang dengan kapasitas baru. Asumsi: 15 m per truk, 2 L/jam BBM idle, sisa 50% kapasitas jika alat tunggal rusak.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

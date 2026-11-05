import { motion } from 'framer-motion'
import { TriangleExclamationPoint, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { fmtClock, nf } from '../../lib/rng'
import { Badge } from '../ui/primitives'

const SLOTS = 24 // 06.00–12.00, 15 menit
const ALAT = ['Ekskavator 1', 'Ekskavator 2', 'Ekskavator 3']
const BREAK_SLOT = 17 // 10.15
const N_BLOCKS = 57
const KEL_COLORS = ['var(--teal)', 'var(--amber)', 'var(--olive)', 'var(--slate)', '#7A5CC2']
const KEL = ['Mangkubumen', 'Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon']

type Placement = { id: number; alat: number; slot: number; moved: boolean; deferred: boolean }

function schedule(broken: boolean[]): Placement[] {
  const base: Placement[] = Array.from({ length: N_BLOCKS }, (_, i) => ({ id: i, alat: i % 3, slot: Math.floor(i / 3), moved: false, deferred: false }))
  const active = [0, 1, 2].filter((a) => !broken[a])
  const occupied = new Set<string>()
  const toMove: Placement[] = []
  for (const b of base) {
    if (broken[b.alat] && b.slot >= BREAK_SLOT) toMove.push(b)
    else occupied.add(`${b.alat}:${b.slot}`)
  }
  for (const b of toMove.sort((x, y) => x.slot - y.slot || x.alat - y.alat)) {
    let placed = false
    for (let s = Math.max(BREAK_SLOT, b.slot); s < SLOTS && !placed; s++)
      for (const a of active) {
        if (!occupied.has(`${a}:${s}`)) {
          occupied.add(`${a}:${s}`)
          b.alat = a
          b.slot = s
          b.moved = true
          placed = true
          break
        }
      }
    if (!placed) {
      b.deferred = true
      b.moved = true
    }
  }
  return base
}

const districts = [
  { name: 'Banjarsari', d: 'M40 22 L170 14 L176 108 L120 124 L48 110 Z', cx: 105, cy: 68, ton: 118, grade: 'B' },
  { name: 'Jebres', d: 'M170 14 L272 30 L286 140 L202 150 L176 108 Z', cx: 228, cy: 82, ton: 96, grade: 'C-org' },
  { name: 'Laweyan', d: 'M20 112 L120 124 L130 202 L30 190 Z', cx: 75, cy: 158, ton: 84, grade: 'B' },
  { name: 'Serengan', d: 'M120 124 L176 108 L186 196 L130 202 Z', cx: 153, cy: 160, ton: 42, grade: 'A' },
  { name: 'Ps. Kliwon', d: 'M176 108 L202 150 L286 140 L262 216 L186 196 Z', cx: 228, cy: 176, ton: 61, grade: 'C-org' },
]

export function DashboardMock() {
  const [broken, setBroken] = useState([false, false, false])
  const plan = useMemo(() => schedule(broken), [broken])
  const nBroken = broken.filter(Boolean).length
  const moved = plan.filter((p) => p.moved).length
  const deferred = plan.filter((p) => p.deferred).length
  const [hover, setHover] = useState<string | null>(null)

  const kpi = [
    { label: 'Truk antre', value: nBroken === 0 ? '3' : nBroken === 1 ? '5' : '11', tone: nBroken ? 'text-coral' : 'text-ink' },
    { label: 'Tunggu rata-rata', value: nBroken === 0 ? '6 mnt' : nBroken === 1 ? '11 mnt' : '34 mnt', tone: nBroken ? 'text-coral' : 'text-ink' },
    { label: 'Ton masuk hari ini', value: '214 t', tone: 'text-ink' },
    { label: 'Grade A hari ini', value: '38 t', tone: 'text-amber' },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
      {/* bar aplikasi */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-paper-2 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-coral/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-olive/60" />
          </span>
          <span className="ml-2 font-mono text-xs text-ink-soft">ARUS · Dashboard UPTD TPA Putri Cempo · Kamis 10 Des, 10.16</span>
        </div>
        <Badge kind="ilustrasi">MOCKUP · ANGKA ILUSTRASI</Badge>
      </div>

      <div className="grid gap-4 p-4 md:p-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {kpi.map((k) => (
            <div key={k.label} className="rounded-xl border border-line bg-paper p-3.5">
              <div className="text-[11px] text-ink-soft">{k.label}</div>
              <div className={`num mt-1 font-mono text-2xl font-semibold ${k.tone}`}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
          {/* Gantt */}
          <div className="self-start rounded-xl border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-display text-sm font-semibold">Timeline slot hari ini</div>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Status alat berat">
                {ALAT.map((a, i) => (
                  <button
                    key={a}
                    onClick={() => setBroken((b) => b.map((v, j) => (j === i ? !v : v)))}
                    aria-pressed={broken[i]}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${broken[i] ? 'border-coral bg-coral text-on-accent' : 'border-line bg-card hover:border-ink'}`}
                  >
                    {broken[i] ? <TriangleExclamationPoint size={12} /> : <Wrench size={12} />}
                    {a.replace('Ekskavator ', 'Eks. ')} {broken[i] ? 'rusak' : 'aktif'}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[92px_1fr] gap-2">
                  <div />
                  <div className="relative h-4 font-mono text-[10px] text-ink-soft">
                    {[0, 4, 8, 12, 16, 20].map((s) => (
                      <span key={s} className="absolute -translate-x-1/2" style={{ left: `${(s / SLOTS) * 100}%` }}>
                        {fmtClock(360 + s * 15)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-[92px_1fr] gap-2">
                  <div className="space-y-2">
                    {ALAT.map((a, i) => (
                      <div key={a} className={`flex h-8 items-center text-xs font-medium ${broken[i] ? 'text-coral' : ''}`}>
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="relative" style={{ height: ALAT.length * 40 - 8 }}>
                    {ALAT.map((a, i) => (
                      <div key={a} className="absolute inset-x-0 h-8 rounded-md bg-paper-2" style={{ top: i * 40 }}>
                        {broken[i] && (
                          <div
                            className="absolute inset-y-0 right-0 rounded-r-md"
                            style={{ left: `${(BREAK_SLOT / SLOTS) * 100}%`, background: 'repeating-linear-gradient(-45deg, color-mix(in oklab, var(--coral) 28%, transparent) 0 5px, transparent 5px 10px)' }}
                          />
                        )}
                      </div>
                    ))}
                    <div className="absolute top-[-6px] bottom-[-6px] w-px bg-coral" style={{ left: `${(BREAK_SLOT / SLOTS) * 100}%` }} />
                    {plan
                      .filter((p) => !p.deferred)
                      .map((p) => (
                        <motion.div
                          key={p.id}
                          className="absolute h-8 p-[2px]"
                          style={{ width: `${100 / SLOTS}%` }}
                          initial={false}
                          animate={{ left: `${(p.slot / SLOTS) * 100}%`, top: p.alat * 40 }}
                          transition={{ type: 'spring', stiffness: 140, damping: 20 }}
                          title={`${KEL[p.id % 5]} · slot ${fmtClock(360 + p.slot * 15)}`}
                        >
                          <div className={`h-full w-full rounded-[4px] ${p.moved ? 'ring-2 ring-amber' : ''}`} style={{ background: KEL_COLORS[p.id % 5], opacity: p.slot < BREAK_SLOT - 1 ? 0.45 : 0.9 }} />
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-soft">
              {KEL.map((k, i) => (
                <span key={k} className="inline-flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: KEL_COLORS[i] }} />
                  {k}
                </span>
              ))}
              <span className="inline-flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-sm ring-2 ring-amber" /> digeser
              </span>
            </div>
            <div className="mt-3 rounded-lg bg-card px-3 py-2 text-xs" aria-live="polite">
              {nBroken === 0 && 'Semua alat aktif. Klik salah satu ekskavator untuk mensimulasikan kerusakan pukul 10.15.'}
              {nBroken > 0 && nBroken < 3 && (
                <>
                  <span className="font-semibold text-coral">Jadwal disusun ulang.</span> {moved} blok slot digeser ke alat lain; notifikasi WhatsApp dikirim ke {moved * 2} sopir terdampak.
                  {deferred > 0 && ` ${deferred} blok tidak muat sebelum 12.00 dan diusulkan ke sore.`}
                </>
              )}
              {nBroken === 3 && <span className="font-semibold text-coral">Kapasitas bongkar 0. Semua ritase setelah 10.15 ditunda; peringatan dikirim ke Kepala UPTD.</span>}
            </div>
          </div>

          {/* Peta + rapor */}
          <div className="grid gap-4">
            <div className="rounded-xl border border-line bg-paper p-4">
              <div className="font-display text-sm font-semibold">Peta forecast besok</div>
              <svg viewBox="0 0 300 230" className="mt-2 h-auto w-full" role="img" aria-label="Peta abstrak lima kecamatan Surakarta dengan intensitas warna sesuai forecast tonase besok.">
                {districts.map((d) => (
                  <g key={d.name} onMouseEnter={() => setHover(d.name)} onMouseLeave={() => setHover(null)}>
                    <path d={d.d} fill="var(--teal)" fillOpacity={0.15 + (d.ton / 120) * 0.65} className="stroke-card" strokeWidth={2.5} />
                    <text x={d.cx} y={d.cy} textAnchor="middle" className="fill-ink font-mono" fontSize={9.5} fontWeight={600}>
                      {d.name}
                    </text>
                    <text x={d.cx} y={d.cy + 12} textAnchor="middle" className="fill-ink font-mono" fontSize={9}>
                      {d.ton} t
                    </text>
                  </g>
                ))}
              </svg>
              <div className="h-4 text-[11px] text-ink-soft">{hover ? `${hover}: mutu rata-rata grade ${districts.find((d) => d.name === hover)?.grade}` : 'Arahkan kursor ke wilayah untuk melihat mutu rata-rata.'}</div>
            </div>
            <div className="rounded-xl border border-line bg-paper p-4">
              <div className="font-display text-sm font-semibold">Rapor pasokan PLTSa</div>
              <div className="mt-3 space-y-2">
                {[
                  { g: 'A', t: 38, c: 'bg-amber' },
                  { g: 'B', t: 46, c: 'bg-teal' },
                  { g: 'C-org', t: 104, c: 'bg-olive' },
                  { g: 'C-res', t: 26, c: 'bg-slate' },
                ].map((r) => (
                  <div key={r.g} className="grid grid-cols-[46px_1fr_44px] items-center gap-2 text-xs">
                    <span className="font-mono font-semibold">{r.g}</span>
                    <span className="h-2.5 rounded-full bg-paper-2">
                      <span className={`block h-full rounded-full ${r.c}`} style={{ width: `${(r.t / 104) * 100}%` }} />
                    </span>
                    <span className="num text-right font-mono">{nf(r.t)} t</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

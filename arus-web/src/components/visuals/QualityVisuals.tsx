import { motion } from 'framer-motion'
import { Scale } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { fractions, presets, type Composition, type FractionKey } from '../../data/calorific'
import { assess, gradeInfo, normalize, totalOf, type Grade } from '../../lib/calorific'
import { nf } from '../../lib/rng'
import { Badge, Card, Src } from '../ui/primitives'

const gradeBg: Record<Grade, string> = {
  A: 'bg-amber text-on-amber',
  B: 'bg-teal text-on-accent',
  'C-org': 'bg-olive text-on-accent',
  'C-res': 'bg-slate text-on-accent',
}

/* ------------------------------------------------------------------ */
/* M5 Calorific calculator                                             */
/* ------------------------------------------------------------------ */

function Gauge({ mj }: { mj: number }) {
  const max = 25
  const pos = Math.min(1, mj / max) * 100
  return (
    <div>
      <div className="relative py-2">
        <div className="relative h-4 overflow-hidden rounded-full">
          <div className="absolute inset-y-0 left-0 bg-slate" style={{ width: `${(7 / max) * 100}%` }} />
          <div className="absolute inset-y-0 bg-olive" style={{ left: `${(7 / max) * 100}%`, width: `${(5 / max) * 100}%` }} />
          <div className="absolute inset-y-0 right-0 bg-amber" style={{ left: `${(12 / max) * 100}%` }} />
        </div>
        <motion.div
          className="absolute top-0 h-8 w-1.5 -translate-x-1/2 rounded-full bg-ink ring-2 ring-card"
          initial={false}
          animate={{ left: `${pos}%` }}
          transition={{ type: 'spring', stiffness: 160, damping: 22 }}
          role="img"
          aria-label={`Penanda nilai kalor ${mj.toFixed(1)} MJ/kg`}
        />
      </div>
      <div className="relative mt-1 h-4 font-mono text-[10px] text-ink-soft">
        {[0, 7, 12, 25].map((v) => (
          <span key={v} className="absolute -translate-x-1/2" style={{ left: `${(v / max) * 100}%` }}>
            {v}
          </span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
        <span className="text-slate">&lt; 7 · timbun</span>
        <span className="text-center text-olive">7–12 · perlu pra-olah</span>
        <span className="text-right text-amber">≥ 12 · kandidat PLTSa</span>
      </div>
    </div>
  )
}

export function CalorificCalculator() {
  const [comp, setComp] = useState<Composition>(presets[0].comp)
  const [preset, setPreset] = useState<string | null>(presets[0].id)
  const r = useMemo(() => assess(comp), [comp])
  const total = totalOf(comp)
  const rawMj = fractions.reduce((s, f) => s + (comp[f.key] / 100) * f.e, 0) / 1000

  const setFrac = (k: FractionKey, v: number) => {
    setComp((c) => ({ ...c, [k]: v }))
    setPreset(null)
  }
  const pie = r.contrib.filter((c) => c.share > 0)
  const energy = r.contrib.filter((c) => c.kj > 0).map((c) => ({ ...c, eShare: (c.kj / Math.max(1, r.kj)) * 100 }))

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
        <span className="mr-1 text-sm font-medium">Preset:</span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setComp(p.comp)
              setPreset(p.id)
            }}
            aria-pressed={preset === p.id}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${preset === p.id ? 'border-ink bg-ink text-paper' : 'border-line hover:bg-paper-2'}`}
          >
            {p.label}
            {p.illustrative && <span className={`font-mono text-[9px] ${preset === p.id ? 'opacity-70' : 'text-ink-soft'}`}>ILUSTRASI</span>}
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="border-b border-line p-5 lg:border-r lg:border-b-0">
          <div className="space-y-3.5">
            {fractions.map((f) => (
              <label key={f.key} className="block">
                <span className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm" style={{ background: f.color }} />
                    {f.label}
                    <span className="font-mono text-[10px] text-ink-soft">{nf(f.e)} kJ/kg</span>
                  </span>
                  <span className="num font-mono text-xs font-semibold">{nf(comp[f.key], 0)}%</span>
                </span>
                <input type="range" min={0} max={100} value={comp[f.key]} onChange={(e) => setFrac(f.key, +e.target.value)} className="mt-1 w-full" style={{ ['--thumb' as string]: f.color }} aria-label={`Persentase ${f.label}`} />
              </label>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-paper-2 px-4 py-3">
            <div className="font-mono text-sm">
              Total <span className={`num font-semibold ${Math.round(total) === 100 ? 'text-teal' : 'text-coral'}`}>{nf(total, 0)}%</span>
              {Math.round(total) !== 100 && <span className="ml-2 text-xs text-ink-soft">(dihitung sebagai 100%)</span>}
            </div>
            <button
              onClick={() => setComp((c) => normalize(c))}
              disabled={Math.round(total) === 100 || total === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-sm font-medium disabled:opacity-40"
            >
              <Scale size={14} /> Normalisasi
            </button>
          </div>
        </div>

        <div className="space-y-6 p-5">
          <div className="grid items-center gap-5 sm:grid-cols-[160px_1fr]">
            <div className="relative mx-auto h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="share" nameKey="label" innerRadius={50} outerRadius={76} stroke="var(--card)" strokeWidth={2} isAnimationActive={false}>
                    {pie.map((c) => (
                      <Cell key={c.key} fill={c.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-[10px] text-ink-soft">KOMPOSISI</span>
                <span className="font-mono text-[10px] text-ink-soft">massa</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-widest text-ink-soft">ESTIMASI NILAI KALOR (LHV)</div>
              <div className="num mt-1 font-mono text-5xl font-semibold tracking-tight">
                {nf(r.mj, 1)}
                <span className="ml-1.5 text-lg font-medium text-ink-soft">MJ/kg</span>
              </div>
              <div className="num font-mono text-sm text-ink-soft">≈ {nf(r.kcal, 0)} kkal/kg</div>
              {Math.round(total) !== 100 && total > 0 && (
                <div className="mt-1 text-xs text-ink-soft">
                  Tanpa normalisasi (total {nf(total, 0)}%): <span className="num font-mono">{nf(rawMj, 1)} MJ/kg</span>
                </div>
              )}
            </div>
          </div>

          <Gauge mj={r.mj} />

          <div className="rounded-xl border border-line p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2.5 py-1 font-mono text-sm font-bold ${gradeBg[r.grade]}`}>{gradeInfo[r.grade].label}</span>
              <span className="text-sm font-medium">→ {gradeInfo[r.grade].dest}</span>
              <Badge kind="ilustrasi">AMBANG ILUSTRASI</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{r.reason}</p>
            <p className="mt-1 text-xs text-ink-soft">Kelas kadar air (kasar, dari % organik basah): {r.water}.</p>
          </div>

          <div>
            <div className="mb-2 font-mono text-[11px] tracking-widest text-ink-soft">PORSI BERAT vs PORSI ENERGI</div>
            <div className="space-y-2">
              <div>
                <div className="mb-1 text-[11px] text-ink-soft">Berat</div>
                <div className="flex h-5 overflow-hidden rounded-md">
                  {pie.map((c) => (
                    <div key={c.key} style={{ width: `${c.share}%`, background: c.color }} title={`${c.label} ${nf(c.share, 0)}%`} />
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-[11px] text-ink-soft">Energi</div>
                <div className="flex h-5 overflow-hidden rounded-md">
                  {energy.map((c) => (
                    <div key={c.key} style={{ width: `${c.eShare}%`, background: c.color }} title={`${c.label} ${nf(c.eShare, 0)}% energi`} />
                  ))}
                </div>
              </div>
            </div>
            {(() => {
              const pl = energy.find((e) => e.key === 'plastik')
              const plW = r.normalized.plastik
              return pl && plW > 0 ? (
                <p className="mt-2 text-sm">
                  Plastik hanya <span className="font-semibold">{nf(plW, 0)}% berat</span>, tetapi menyumbang <span className="font-semibold text-amber">{nf(pl.eShare, 0)}% energi</span>.
                </p>
              ) : null
            })()}
          </div>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-ink-soft">
        {preset === 'solo' && (
          <span className="mb-1 block text-ink">
            Catatan preset Solo: angka komposisi dari sumber <Src id="S4" /> berjumlah 105%, bukan 100%. Dihitung mentah hasilnya ±9,3 MJ/kg (seperti contoh di bagian AI); setelah dinormalisasi ke 100% hasilnya 8,9 MJ/kg.
          </span>
        )}
        Rumus: LHV = Σ (persen_i/100 × E_i), dengan komposisi dinormalisasi ke 100%. Nilai E_i adalah referensi literatur (as-discarded, Tchobanoglous et al. 1993) dan perlu kalibrasi lokal lewat uji bomb calorimeter. Sampah organik Indonesia cenderung lebih basah, jadi nilai sebenarnya bisa lebih rendah.
      </p>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* M6 Grade decision tree                                              */
/* ------------------------------------------------------------------ */

const exampleTrucks: { plat: string; src: string; comp: Composition }[] = [
  { plat: 'AD 8123 XX', src: 'Kel. Mangkubumen · perumahan', comp: { orgB: 68, orgK: 4, kayu: 0, kertas: 8, plastik: 12, tekstil: 2, karet: 0, inert: 2, residu: 4 } },
  { plat: 'AD 8456 YY', src: 'Kawasan perkantoran', comp: { orgB: 22, orgK: 3, kayu: 2, kertas: 33, plastik: 30, tekstil: 3, karet: 0, inert: 2, residu: 5 } },
  { plat: 'AD 8790 ZZ', src: 'Sisa renovasi & sapuan jalan', comp: { orgB: 18, orgK: 10, kayu: 0, kertas: 4, plastik: 6, tekstil: 0, karet: 0, inert: 38, residu: 24 } },
]

const steps = [
  { q: 'Organik basah ≥ 60%?', yes: 'C-org' as Grade },
  { q: 'Kalor < 7 MJ/kg dan dominan inert/residu?', yes: 'C-res' as Grade },
  { q: 'Kalor ≥ 12 MJ/kg, organik basah < 40%, kadar air ≠ Basah?', yes: 'A' as Grade },
]

export function GradeDecisionTree() {
  const [sel, setSel] = useState(0)
  const results = useMemo(() => exampleTrucks.map((t) => ({ ...t, r: assess(t.comp) })), [])
  const cur = results[sel].r
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card className="p-5">
        <div className="mb-4 font-mono text-[11px] tracking-widest text-ink-soft">MESIN ATURAN M6 · AMBANG ILUSTRASI</div>
        <ol className="space-y-0">
          {steps.map((s, i) => {
            const reached = cur.step >= i + 1
            const hit = cur.step === i + 1
            return (
              <li key={s.q} className="relative pl-10">
                <span className={`absolute top-3 left-0 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs font-semibold ${reached ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft'}`}>{i + 1}</span>
                {i < steps.length && <span className={`absolute top-10 bottom-0 left-[13px] w-px ${cur.step > i + 1 ? 'bg-ink' : 'bg-line'}`} />}
                <div className="flex flex-wrap items-center gap-3 py-3">
                  <div className={`rounded-lg border px-3 py-2 text-sm font-medium ${reached ? 'border-ink' : 'border-line text-ink-soft'}`}>{s.q}</div>
                  <span className="font-mono text-xs text-ink-soft">ya →</span>
                  <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-opacity ${gradeBg[s.yes]} ${hit ? 'opacity-100 ring-2 ring-ink ring-offset-2 ring-offset-card' : 'opacity-35'}`}>{s.yes}</span>
                  <span className="text-xs text-ink-soft">{gradeInfo[s.yes].dest}</span>
                </div>
              </li>
            )
          })}
          <li className="relative pl-10">
            <span className={`absolute top-3 left-0 flex h-7 w-7 items-center justify-center rounded-full border font-mono text-xs ${cur.step === 4 ? 'border-ink bg-ink text-paper' : 'border-line text-ink-soft'}`}>↳</span>
            <div className="flex flex-wrap items-center gap-3 py-3">
              <span className="text-sm text-ink-soft">selain itu →</span>
              <span className={`rounded-md px-2.5 py-1 font-mono text-xs font-bold ${gradeBg.B} ${cur.step === 4 ? 'ring-2 ring-ink ring-offset-2 ring-offset-card' : 'opacity-35'}`}>B</span>
              <span className="text-xs text-ink-soft">{gradeInfo.B.dest}</span>
            </div>
          </li>
        </ol>
        <p className="mt-3 border-t border-line pt-3 text-xs text-ink-soft">Ambang wajib dikonfirmasi ke operator PLTSa dan bisa dikonfigurasi admin (M8.2). Operator dapat meng-override grade dengan alasan; override menjadi data pelatihan.</p>
      </Card>
      <div className="space-y-3">
        <div className="font-mono text-[11px] tracking-widest text-ink-soft">CONTOH 3 TRUK · DATA FIKTIF</div>
        {results.map((t, i) => (
          <button key={t.plat} onClick={() => setSel(i)} aria-pressed={sel === i} className={`w-full rounded-xl border p-4 text-left transition-colors ${sel === i ? 'border-ink bg-card' : 'border-line hover:bg-card'}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{t.plat}</span>
              <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${gradeBg[t.r.grade]}`}>{t.r.grade}</span>
            </div>
            <div className="mt-0.5 text-xs text-ink-soft">{t.src}</div>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full">
              {fractions.map((f) => (t.comp[f.key] ? <div key={f.key} style={{ width: `${t.comp[f.key]}%`, background: f.color }} /> : null))}
            </div>
            <div className="mt-2 font-mono text-xs">
              {nf(t.r.mj, 1)} MJ/kg · org. basah {t.comp.orgB}% · air {t.r.water.toLowerCase()}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

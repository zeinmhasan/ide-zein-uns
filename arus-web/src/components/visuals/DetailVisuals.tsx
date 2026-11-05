import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  BellRing,
  CalendarClock,
  ChartLine,
  ChevronLeft,
  ChevronRight,
  Database,
  Gauge,
  MessageCircle,
  Minus,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  ScanLine,
  TriangleExclamationPoint,
  Truck,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { dayFlow, type DayScene } from '../../data/content'
import { bmc, plan, tkt } from '../../data/project'
import { Badge, Card } from '../ui/primitives'

/* ------------------------------------------------------------------ */
/* Satu hari bersama ARUS                                              */
/* ------------------------------------------------------------------ */

const sceneMeta: Record<DayScene, { icon: LucideIcon; tone: string; caption: string; night?: boolean }> = {
  forecast: { icon: ChartLine, tone: 'teal', caption: 'Forecast besok: ±412 t · 117 ritase', night: true },
  check: { icon: Wrench, tone: 'slate', caption: '3 ekskavator aktif · zona utara terbuka', night: true },
  schedule: { icon: CalendarClock, tone: 'teal', caption: '117 ritase → slot 15 menit sesuai kapasitas', night: true },
  send: { icon: MessageCircle, tone: 'teal', caption: '117 pesan jadwal terkirim', night: true },
  remind: { icon: BellRing, tone: 'amber', caption: 'Pengingat ke 24 sopir ritase pertama', night: true },
  depart: { icon: Truck, tone: 'teal', caption: 'AD 8123 XX: "Berangkat"' },
  gate: { icon: ScanLine, tone: 'slate', caption: 'QR ✓ · 8.420 kg bruto · foto bak ✓' },
  grade: { icon: Gauge, tone: 'amber', caption: 'Grade A → Bunker PLTSa' },
  broken: { icon: TriangleExclamationPoint, tone: 'coral', caption: 'Ekskavator 2: RUSAK' },
  reschedule: { icon: RefreshCw, tone: 'teal', caption: '14 ritase digeser · 14 notifikasi terkirim' },
  report: { icon: Zap, tone: 'amber', caption: 'Grade A hari ini: 38 t' },
  retrain: { icon: Database, tone: 'slate', caption: 'Laporan harian + data ke antrean retraining', night: true },
}

export function DayStepper() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  const [auto, setAuto] = useState(false)
  const step = dayFlow[i]
  const meta = sceneMeta[step.scene]
  useEffect(() => {
    if (!auto) return
    const id = window.setInterval(() => setI((x) => (x + 1) % dayFlow.length), 3400)
    return () => window.clearInterval(id)
  }, [auto])
  const go = (d: number) => {
    setAuto(false)
    setI((x) => (x + d + dayFlow.length) % dayFlow.length)
  }
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-[1fr_1fr]">
        <div className="flex flex-col justify-between p-6 md:p-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
              LANGKAH {String(i + 1).padStart(2, '0')} / {dayFlow.length} · <span className="text-teal">{step.modules}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="num mt-4 font-mono text-5xl font-semibold tracking-tight md:text-6xl">{step.time}</div>
                <p className="mt-4 text-lg leading-relaxed">{step.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <button onClick={() => go(-1)} aria-label="Langkah sebelumnya" className="h-10 w-10 rounded-full border border-line hover:bg-paper-2">
              <ChevronLeft size={18} className="mx-auto" />
            </button>
            <button onClick={() => go(1)} aria-label="Langkah berikutnya" className="h-10 w-10 rounded-full border border-line hover:bg-paper-2">
              <ChevronRight size={18} className="mx-auto" />
            </button>
            {!reduce && (
              <button onClick={() => setAuto((a) => !a)} aria-pressed={auto} className="ml-2 inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-paper">
                {auto ? <Pause size={15} /> : <Play size={15} />} {auto ? 'Jeda' : 'Putar otomatis'}
              </button>
            )}
          </div>
          <div className="mt-6 flex gap-1" role="tablist" aria-label="Langkah">
            {dayFlow.map((s, j) => (
              <button
                key={s.time}
                role="tab"
                aria-selected={j === i}
                aria-label={`${s.time}: ${s.text}`}
                onClick={() => {
                  setAuto(false)
                  setI(j)
                }}
                className={`h-1.5 flex-1 rounded-full transition-colors ${j === i ? 'bg-teal' : j < i ? 'bg-teal/40' : 'bg-line'}`}
              />
            ))}
          </div>
        </div>
        <div className={`relative flex min-h-[300px] items-center justify-center overflow-hidden ${meta.night ? 'bg-[#1b2530]' : 'blueprint'}`}>
          {meta.night && (
            <div className="absolute inset-0" aria-hidden>
              {[...Array(14)].map((_, k) => (
                <span key={k} className="absolute h-0.5 w-0.5 rounded-full bg-white/60" style={{ left: `${(k * 37) % 100}%`, top: `${(k * 23) % 60}%` }} />
              ))}
              <span className="absolute top-8 right-10 h-8 w-8 rounded-full bg-[#f3e6c4] shadow-[0_0_30px_#f3e6c4aa]" />
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div key={i} className="relative z-10 flex flex-col items-center px-6 text-center" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}>
              <div className={`flex h-28 w-28 items-center justify-center rounded-3xl bg-${meta.tone} text-paper shadow-lg ${step.scene === 'broken' ? 'animate-blink' : ''}`}>
                <meta.icon size={52} strokeWidth={1.5} />
              </div>
              <div className={`mt-5 rounded-lg px-3 py-2 font-mono text-sm ${meta.night ? 'bg-white/10 text-white' : 'bg-card text-ink shadow-sm'}`}>{meta.caption}</div>
              <Badge kind="ilustrasi" className="mt-3">
                ANGKA ILUSTRASI
              </Badge>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Sequence diagram                                                    */
/* ------------------------------------------------------------------ */

const parts = [
  { id: 'S', label: 'Sopir', sub: 'WhatsApp' },
  { id: 'B', label: 'Bot ARUS', sub: '' },
  { id: 'G', label: 'Gerbang', sub: 'QR + timbang + kamera' },
  { id: 'AI', label: 'Layanan AI', sub: '' },
  { id: 'O', label: 'Layar operator', sub: '' },
  { id: 'D', label: 'Dashboard DLH', sub: '' },
]
const msgs: [string, string, string][] = [
  ['B', 'S', 'Jadwal slot + QR check-in'],
  ['S', 'B', '[Berangkat]'],
  ['S', 'G', 'Tiba, tunjukkan QR'],
  ['G', 'G', 'Catat berat bruto'],
  ['G', 'AI', 'Foto bak + berat + ID truk'],
  ['AI', 'AI', 'Segmentasi → fraksi massa → kalor → kadar air → grade'],
  ['AI', 'O', 'Grade A, arahkan ke bunker PLTSa'],
  ['AI', 'D', 'Simpan penilaian mutu'],
  ['G', 'D', 'Waktu tiba, waktu tunggu, berat netto'],
]

function Arrowhead({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" className="fill-ink" />
    </marker>
  )
}

export function SequenceDiagram() {
  const X = (id: string) => 80 + parts.findIndex((p) => p.id === id) * 160
  const y0 = 92
  const dy = 46
  const H = y0 + msgs.length * dy + 30
  return (
    <svg viewBox={`0 0 960 ${H}`} className="h-auto w-full min-w-[760px]" role="img" aria-label="Diagram sequence kedatangan truk di gerbang: bot mengirim jadwal, sopir berangkat dan tiba, gerbang mencatat berat dan mengirim foto ke layanan AI, AI menilai mutu lalu memberi arahan ke layar operator dan menyimpan ke dashboard.">
      <defs>
        <Arrowhead id="sq" />
      </defs>
      {parts.map((p) => (
        <g key={p.id}>
          <line x1={X(p.id)} x2={X(p.id)} y1={56} y2={H - 10} className="stroke-line" strokeDasharray="4 4" strokeWidth={1.2} />
          <rect x={X(p.id) - 68} y={10} width={136} height={46} rx={8} className="fill-card stroke-ink" strokeWidth={1.2} />
          <text x={X(p.id)} y={p.sub ? 30 : 38} textAnchor="middle" className="fill-ink font-display" fontSize={13} fontWeight={600}>
            {p.label}
          </text>
          {p.sub && (
            <text x={X(p.id)} y={46} textAnchor="middle" className="fill-ink-soft font-mono" fontSize={9}>
              {p.sub}
            </text>
          )}
        </g>
      ))}
      {msgs.map(([a, b, t], i) => {
        const y = y0 + i * dy
        const xa = X(a)
        const xb = X(b)
        const n = i + 1
        if (a === b) {
          return (
            <g key={i}>
              <path d={`M${xa} ${y} h34 v18 h-30`} fill="none" className="stroke-ink" strokeWidth={1.3} markerEnd="url(#sq)" />
              <rect x={xa + 40} y={y - 4} width={t.length * 6.1 + 30} height={18} rx={4} className="fill-card" />
              <text x={xa + 44} y={y + 9} className="fill-ink font-sans" fontSize={11.5}>
                <tspan className="fill-teal font-mono" fontWeight={700}>
                  {n}{' '}
                </tspan>
                {t}
              </text>
            </g>
          )
        }
        const mid = (xa + xb) / 2
        return (
          <g key={i}>
            <line x1={xa} x2={xb + (xb > xa ? -2 : 2)} y1={y + 10} y2={y + 10} className="stroke-ink" strokeWidth={1.3} markerEnd="url(#sq)" />
            <text x={mid} y={y + 3} textAnchor="middle" className="fill-ink font-sans" fontSize={11.5}>
              <tspan className="fill-teal font-mono" fontWeight={700}>
                {n}{' '}
              </tspan>
              {t}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Re-scheduling flow                                                  */
/* ------------------------------------------------------------------ */

function FBox({ x, y, w, h = 46, text, tone = 'card' }: { x: number; y: number; w: number; h?: number; text: string[]; tone?: 'card' | 'coral' | 'teal' | 'amber' }) {
  const cls = { card: 'fill-card stroke-ink', coral: 'fill-coral stroke-coral', teal: 'fill-teal stroke-teal', amber: 'fill-amber stroke-amber' }[tone]
  const txt = tone === 'card' ? 'fill-ink' : tone === 'amber' ? 'fill-on-amber' : 'fill-paper'
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={9} className={cls} strokeWidth={1.2} />
      {text.map((t, i) => (
        <text key={i} x={x + w / 2} y={y + h / 2 + 4 + (i - (text.length - 1) / 2) * 15} textAnchor="middle" className={`${txt} font-sans`} fontSize={12} fontWeight={500}>
          {t}
        </text>
      ))}
    </g>
  )
}

export function RescheduleFlow() {
  return (
    <svg viewBox="0 0 860 520" className="h-auto w-full min-w-[680px]" role="img" aria-label="Alur gangguan kapasitas: alat rusak atau zona longsor, operator ubah status, kapasitas per slot dihitung ulang. Jika slot cukup, ritase digeser seminimal mungkin; jika tidak, truk multi-ritase diprioritaskan dan sisanya ditunda, plus peringatan ke Kepala UPTD. Lalu notifikasi dikirim ke sopir terdampak.">
      <defs>
        <Arrowhead id="rf" />
      </defs>
      <g className="stroke-ink" strokeWidth={1.3} fill="none">
        <path d="M430 56 V84" markerEnd="url(#rf)" />
        <path d="M430 130 V158" markerEnd="url(#rf)" />
        <path d="M430 204 V226" markerEnd="url(#rf)" />
        <path d="M360 270 H200 V318" markerEnd="url(#rf)" />
        <path d="M500 270 H640 V318" markerEnd="url(#rf)" />
        <path d="M200 372 V430 H350" markerEnd="url(#rf)" />
        <path d="M600 386 V430 H512" markerEnd="url(#rf)" />
        <path d="M720 386 V420" markerEnd="url(#rf)" />
      </g>
      <FBox x={290} y={10} w={280} text={['Alat berat rusak / zona longsor']} tone="coral" />
      <FBox x={290} y={84} w={280} text={['Operator ubah status di dashboard']} />
      <FBox x={290} y={158} w={280} text={['Hitung ulang kapasitas per slot']} />
      <polygon points="430,226 500,270 430,314 360,270" className="fill-paper-2 stroke-ink" strokeWidth={1.2} />
      <text x={430} y={267} textAnchor="middle" className="fill-ink font-sans" fontSize={11.5} fontWeight={600}>
        Slot tersisa
      </text>
      <text x={430} y={282} textAnchor="middle" className="fill-ink font-sans" fontSize={11.5} fontWeight={600}>
        cukup?
      </text>
      <text x={300} y={262} className="fill-teal font-mono" fontSize={11} fontWeight={700}>
        YA
      </text>
      <text x={530} y={262} className="fill-coral font-mono" fontSize={11} fontWeight={700}>
        TIDAK
      </text>
      <FBox x={80} y={318} w={240} h={54} text={['Geser ritase', 'seminimal mungkin']} />
      <FBox x={540} y={318} w={260} h={68} text={['Prioritaskan truk multi-ritase,', 'tunda sisanya ke sore / besok']} />
      <FBox x={350} y={408} w={160} h={46} text={['Kirim notifikasi', 'ke sopir terdampak']} tone="teal" />
      <FBox x={600} y={420} w={240} h={60} text={['Peringatan ke Kepala UPTD:', 'kapasitas kurang X truk']} tone="amber" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* State machine ritase                                                */
/* ------------------------------------------------------------------ */

export function StateMachine() {
  const s = (x: number, y: number, label: string, tone: 'card' | 'teal' | 'coral' = 'card') => (
    <g key={label}>
      <rect x={x - 62} y={y - 20} width={124} height={40} rx={20} className={tone === 'card' ? 'fill-card stroke-ink' : tone === 'teal' ? 'fill-teal stroke-teal' : 'fill-coral/15 stroke-coral'} strokeWidth={1.3} />
      <text x={x} y={y + 4.5} textAnchor="middle" className={`${tone === 'teal' ? 'fill-paper' : 'fill-ink'} font-sans`} fontSize={12.5} fontWeight={600}>
        {label}
      </text>
    </g>
  )
  const lbl = (x: number, y: number, t: string, anchor: 'middle' | 'start' | 'end' = 'middle') => (
    <text x={x} y={y} textAnchor={anchor} className="fill-ink-soft font-mono" fontSize={10}>
      {t}
    </text>
  )
  return (
    <svg viewBox="0 0 960 380" className="h-auto w-full min-w-[760px]" role="img" aria-label="Siklus hidup satu ritase: Dijadwalkan, Dikirim, Berangkat, Tiba, Ditimbang, Dinilai, Dibongkar, Selesai. Dari Dikirim bisa kembali ke Dijadwalkan saat re-schedule. Dari Berangkat bisa ke Kendala lalu kembali ke Dijadwalkan.">
      <defs>
        <Arrowhead id="sm" />
      </defs>
      <g className="stroke-ink" strokeWidth={1.3} fill="none">
        <path d="M58 180 H96" markerEnd="url(#sm)" />
        <path d="M222 180 H276" markerEnd="url(#sm)" />
        <path d="M400 180 H454" markerEnd="url(#sm)" />
        <path d="M578 180 H632" markerEnd="url(#sm)" />
        <path d="M756 180 H800 V300 H756" markerEnd="url(#sm)" />
        <path d="M632 300 H578" markerEnd="url(#sm)" />
        <path d="M454 300 H400" markerEnd="url(#sm)" />
        <path d="M276 300 H222" markerEnd="url(#sm)" />
        <path d="M98 300 H60" markerEnd="url(#sm)" />
        <path d="M338 160 C338 110 160 110 160 158" markerEnd="url(#sm)" strokeDasharray="4 3" />
        <path d="M516 160 V96" markerEnd="url(#sm)" />
        <path d="M454 76 C300 40 180 70 160 158" markerEnd="url(#sm)" strokeDasharray="4 3" />
      </g>
      <circle cx={46} cy={180} r={10} className="fill-ink" />
      <circle cx={46} cy={300} r={12} className="fill-none stroke-ink" strokeWidth={1.5} />
      <circle cx={46} cy={300} r={7} className="fill-ink" />
      {s(160, 180, 'Dijadwalkan')}
      {s(338, 180, 'Dikirim')}
      {s(516, 180, 'Berangkat')}
      {s(694, 180, 'Tiba')}
      {s(694, 300, 'Ditimbang')}
      {s(516, 300, 'Dinilai', 'teal')}
      {s(338, 300, 'Dibongkar')}
      {s(160, 300, 'Selesai')}
      {s(516, 76, 'Kendala', 'coral')}
      {lbl(250, 150, 'bot kirim')}
      {lbl(428, 150, 'tekan Berangkat')}
      {lbl(606, 150, 'scan QR')}
      {lbl(606, 340, 'foto + AI')}
      {lbl(428, 340, 'arahkan zona')}
      {lbl(250, 340, 'timbang tara (keluar)')}
      {lbl(250, 106, 're-schedule')}
      {lbl(524, 132, 'lapor kendala', 'start')}
      {lbl(330, 46, 'jadwal ulang')}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* ERD                                                                 */
/* ------------------------------------------------------------------ */

const C = [20, 250, 480, 710, 940]
const BW = 170
const boxH = (n: number) => 26 + n * 18 + 8
type Ent = { name: string; x: number; y: number; fields: [string, string, ('PK' | 'FK')?][] }
const ents: Ent[] = [
  { name: 'KELURAHAN', x: C[0], y: 20, fields: [['id', 'int', 'PK'], ['nama', 'string'], ['penduduk', 'int'], ['batas', 'geometry']] },
  { name: 'FORECAST', x: C[0], y: 200, fields: [['id', 'int', 'PK'], ['kelurahan_id', 'int', 'FK'], ['tanggal', 'date'], ['p10', 'float'], ['p50', 'float'], ['p90', 'float']] },
  { name: 'ALAT_BERAT', x: C[0], y: 390, fields: [['id', 'int', 'PK'], ['jenis', 'string'], ['produktivitas', 'float']] },
  { name: 'TRUK', x: C[1], y: 20, fields: [['id', 'int', 'PK'], ['plat', 'string'], ['kapasitas_m3', 'float'], ['kelurahan_id', 'int', 'FK']] },
  { name: 'SOPIR', x: C[1], y: 200, fields: [['id', 'int', 'PK'], ['nama', 'string'], ['no_wa', 'string']] },
  { name: 'STATUS_ALAT', x: C[1], y: 390, fields: [['id', 'int', 'PK'], ['alat_id', 'int', 'FK'], ['status', 'string'], ['waktu', 'datetime']] },
  { name: 'RITASE', x: C[2], y: 20, fields: [['id', 'int', 'PK'], ['truk_id', 'int', 'FK'], ['sopir_id', 'int', 'FK'], ['urutan', 'int'], ['status', 'string'], ['slot_mulai', 'datetime']] },
  { name: 'SLOT', x: C[2], y: 230, fields: [['id', 'int', 'PK'], ['mulai', 'datetime'], ['selesai', 'datetime'], ['kapasitas', 'int']] },
  { name: 'SESI_TIMBANG', x: C[3], y: 20, fields: [['id', 'int', 'PK'], ['ritase_id', 'int', 'FK'], ['waktu_tiba', 'datetime'], ['waktu_masuk', 'datetime'], ['berat_bruto', 'float'], ['berat_tara', 'float']] },
  { name: 'FOTO_MUATAN', x: C[3], y: 230, fields: [['id', 'int', 'PK'], ['sesi_id', 'int', 'FK'], ['url', 'string'], ['kualitas', 'string']] },
  { name: 'PENILAIAN_MUTU', x: C[4], y: 20, fields: [['id', 'int', 'PK'], ['sesi_id', 'int', 'FK'], ['komposisi', 'json'], ['lhv_mj_kg', 'float'], ['kelas_air', 'string'], ['grade', 'string'], ['override', 'bool'], ['zona_id', 'int', 'FK']] },
  { name: 'ZONA', x: C[4], y: 250, fields: [['id', 'int', 'PK'], ['nama', 'string'], ['jenis', 'string']] },
  { name: 'STATUS_ZONA', x: C[4], y: 390, fields: [['id', 'int', 'PK'], ['zona_id', 'int', 'FK'], ['status', 'string'], ['waktu', 'datetime']] },
]
const rels: { p: [number, number, number, number]; name: string; a: string; b: string }[] = [
  { p: [190, 60, 250, 60], name: 'memiliki', a: '1', b: 'N' },
  { p: [420, 60, 480, 60], name: 'menjalankan', a: '1', b: 'N' },
  { p: [420, 244, 480, 150], name: 'mengemudikan', a: '1', b: 'N' },
  { p: [565, 162, 565, 230], name: 'ditempatkan', a: '1', b: '1' },
  { p: [650, 60, 710, 60], name: 'menghasilkan', a: '1', b: '0..1' },
  { p: [795, 162, 795, 230], name: 'memiliki', a: '1', b: 'N' },
  { p: [880, 60, 940, 60], name: 'dinilai', a: '1', b: '0..1' },
  { p: [1025, 198, 1025, 250], name: 'diarahkan ke', a: 'N', b: '1' },
  { p: [1025, 338, 1025, 390], name: 'mencatat', a: '1', b: 'N' },
  { p: [190, 434, 250, 434], name: 'mencatat', a: '1', b: 'N' },
  { p: [105, 126, 105, 200], name: 'diprediksi', a: '1', b: 'N' },
]

export function Erd() {
  const [scale, setScale] = useState(0.85)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(null)
  const W = 1130
  const Hh = 510
  return (
    <div className="rounded-2xl border border-line bg-card">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-ink-soft">ERD · seret untuk menggeser</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))} aria-label="Perkecil" className="h-8 w-8 rounded-md border border-line hover:bg-paper-2">
            <Minus size={14} className="mx-auto" />
          </button>
          <span className="num w-12 text-center font-mono text-xs">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((s) => Math.min(1.8, +(s + 0.15).toFixed(2)))} aria-label="Perbesar" className="h-8 w-8 rounded-md border border-line hover:bg-paper-2">
            <Plus size={14} className="mx-auto" />
          </button>
          <button onClick={() => setScale(0.85)} aria-label="Reset zoom" className="h-8 w-8 rounded-md border border-line hover:bg-paper-2">
            <RotateCcw size={13} className="mx-auto" />
          </button>
        </div>
      </div>
      <div
        ref={box}
        className="blueprint h-[440px] cursor-grab overflow-auto active:cursor-grabbing"
        onPointerDown={(e) => {
          const el = box.current
          if (!el) return
          drag.current = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop }
        }}
        onPointerMove={(e) => {
          const el = box.current
          const d = drag.current
          if (!el || !d) return
          el.scrollLeft = d.l - (e.clientX - d.x)
          el.scrollTop = d.t - (e.clientY - d.y)
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <svg width={W * scale} height={Hh * scale} viewBox={`0 0 ${W} ${Hh}`} role="img" aria-label="Entity relationship diagram: kelurahan memiliki truk, truk menjalankan ritase, sopir mengemudikan ritase, ritase ditempatkan pada slot dan menghasilkan sesi timbang, sesi timbang memiliki foto muatan dan dinilai dalam penilaian mutu yang diarahkan ke zona. Alat berat dan zona mencatat status. Kelurahan diprediksi dalam forecast.">
          {rels.map((r, i) => {
            const [x1, y1, x2, y2] = r.p
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            const horiz = y1 === y2
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-teal" strokeWidth={1.5} />
                <rect x={mx - r.name.length * 3 - 4} y={horiz ? my - 22 : my - 8} width={r.name.length * 6 + 8} height={15} rx={3} className="fill-paper" />
                <text x={mx} y={horiz ? my - 11 : my + 3} textAnchor="middle" className="fill-teal font-mono" fontSize={9.5}>
                  {r.name}
                </text>
                <text x={horiz ? x1 + 5 : x1 + 6} y={horiz ? y1 + 13 : y1 + 13} className="fill-ink-soft font-mono" fontSize={9.5} fontWeight={700}>
                  {r.a}
                </text>
                <text x={horiz ? x2 - 5 : x2 + 6} y={horiz ? y2 + 13 : y2 - 5} textAnchor={horiz ? 'end' : 'start'} className="fill-ink-soft font-mono" fontSize={9.5} fontWeight={700}>
                  {r.b}
                </text>
              </g>
            )
          })}
          {ents.map((e) => (
            <g key={e.name} transform={`translate(${e.x},${e.y})`}>
              <rect width={BW} height={boxH(e.fields.length)} rx={7} className="fill-card stroke-ink" strokeWidth={1.2} />
              <path d={`M0 7 a7 7 0 0 1 7 -7 h${BW - 14} a7 7 0 0 1 7 7 v19 h-${BW} z`} className="fill-ink" />
              <text x={10} y={17.5} className="fill-paper font-mono" fontSize={11} fontWeight={700}>
                {e.name}
              </text>
              {e.fields.map(([f, t, k], i) => (
                <g key={f} transform={`translate(0,${26 + 4 + i * 18})`}>
                  <text x={10} y={13} className="fill-ink font-mono" fontSize={10.5}>
                    {f}
                  </text>
                  <text x={BW - 10} y={13} textAnchor="end" className={`${k ? 'fill-teal' : 'fill-ink-soft'} font-mono`} fontSize={9.5} fontWeight={k ? 700 : 400}>
                    {k ? `${k} · ` : ''}
                    {t}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tangga TKT                                                          */
/* ------------------------------------------------------------------ */

export function TktLadder() {
  return (
    <div className="grid items-end gap-3 md:grid-cols-4">
      {tkt.map((t, i) => {
        const now = t.level === 3
        const target = t.level === 4 || t.level === 5
        return (
          <motion.div
            key={t.level}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`relative flex flex-col rounded-2xl border p-5 ${now ? 'border-ink bg-ink text-paper' : target ? 'border-teal bg-teal/10' : 'border-line bg-card'}`}
            style={{ minHeight: 170 + i * 46 }}
          >
            {(now || target) && (
              <span className={`absolute -top-3 left-5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold ${now ? 'bg-amber text-on-amber' : 'bg-teal text-on-accent'}`}>{now ? 'POSISI SAAT INI' : 'TARGET HACKATHON'}</span>
            )}
            <div className="num font-mono text-5xl font-semibold">TKT {t.level}</div>
            <div className="mt-3 font-display font-semibold leading-snug">{t.title}</div>
            <p className={`mt-auto pt-3 text-sm leading-relaxed ${now ? 'opacity-80' : 'text-ink-soft'}`}>{t.proof}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Gantt rencana kerja                                                 */
/* ------------------------------------------------------------------ */

const day = (s: string) => new Date(s + 'T00:00:00').getTime() / 86400000
export function PlanGantt() {
  const start = day('2026-11-09')
  const end = day('2026-12-07')
  const span = end - start
  const pos = (s: string) => ((day(s) - start) / span) * 100
  const weeks = ['2026-11-09', '2026-11-16', '2026-11-23', '2026-11-30', '2026-12-07']
  const fmt = (s: string) => {
    const d = new Date(s + 'T00:00:00')
    return `${d.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()]}`
  }
  return (
    <Card className="overflow-x-auto p-5">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[220px_1fr] gap-3">
          <div />
          <div className="relative h-5 font-mono text-[10.5px] text-ink-soft">
            {weeks.slice(0, -1).map((w) => (
              <span key={w} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pos(w)}%` }}>
                {fmt(w)}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {plan.map((p) => (
            <div key={p.task} className="grid grid-cols-[220px_1fr] items-center gap-3">
              <div className="text-sm">
                <span className="mr-2 font-mono text-[10px] text-ink-soft uppercase">{p.section}</span>
                {p.task}
              </div>
              <div className="relative h-7 rounded-md bg-paper-2">
                {weeks.map((w) => (
                  <span key={w} className="absolute inset-y-0 w-px bg-line" style={{ left: `${pos(w)}%` }} />
                ))}
                {p.kind === 'milestone' ? (
                  <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-amber" style={{ left: `${pos(p.start) + 100 / span / 2}%` }} title={fmt(p.start)} />
                ) : (
                  <span
                    className={`absolute inset-y-1 rounded ${p.kind === 'crit' ? 'bg-coral' : 'bg-teal'}`}
                    style={{ left: `${pos(p.start)}%`, width: `${((day(p.end) - day(p.start) + 1) / span) * 100}%` }}
                    title={`${fmt(p.start)} – ${fmt(p.end)}`}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[220px_1fr] items-center gap-3 border-t border-dashed border-line pt-3">
            <div className="text-sm">
              <span className="mr-2 font-mono text-[10px] text-ink-soft uppercase">Inkubasi</span>
              Pilot di TPA
            </div>
            <div className="flex h-7 items-center rounded-md bg-olive/15 px-3 font-mono text-xs text-olive">Jan – Mei 2027 → menuju TKT 6</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Business Model Canvas                                               */
/* ------------------------------------------------------------------ */

function Block({ area, title, items, accent = false }: { area: string; title: string; items: string[]; accent?: boolean }): ReactNode {
  return (
    <div style={{ gridArea: area }} className={`rounded-xl border p-4 ${accent ? 'border-teal bg-teal/8' : 'border-line bg-card'}`}>
      <div className={`font-mono text-[10.5px] font-semibold tracking-widest uppercase ${accent ? 'text-teal' : 'text-ink-soft'}`}>{title}</div>
      <ul className="mt-2.5 space-y-1.5 text-sm leading-snug">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-soft" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BmcGrid() {
  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-10 lg:[grid-template-areas:'p_p_a_a_v_v_r_r_s_s'_'p_p_k_k_v_v_c_c_s_s'_'x_x_x_x_x_y_y_y_y_y']">
      <Block area="p" title="Mitra utama" items={bmc.partners} />
      <Block area="a" title="Aktivitas utama" items={bmc.activities} />
      <Block area="k" title="Sumber daya utama" items={bmc.resources} />
      <Block area="v" title="Proposisi nilai" items={bmc.value} accent />
      <Block area="r" title="Hubungan pelanggan" items={bmc.relationships} />
      <Block area="c" title="Saluran" items={bmc.channels} />
      <Block area="s" title="Segmen pelanggan" items={bmc.segments} />
      <Block area="x" title="Struktur biaya" items={bmc.costs} />
      <Block area="y" title="Aliran pendapatan" items={bmc.revenue} />
    </div>
  )
}

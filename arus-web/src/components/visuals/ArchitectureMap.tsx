import { useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { moduleById } from '../../data/modules'
import { Badge, Kicker } from '../ui/primitives'

type Node = { id: string; x: number; y: number; w: number; title: string; sub: string; tone: 'teal' | 'amber' | 'ink' | 'slate' | 'olive'; target?: string }

const H = 54
const nodes: Node[] = [
  { id: 'K', x: 10, y: 120, w: 130, title: 'Kelurahan', sub: 'volume & armada', tone: 'ink' },
  { id: 'ALAT', x: 10, y: 210, w: 130, title: 'Status alat', sub: 'alat berat & zona', tone: 'ink' },
  { id: 'M1', x: 175, y: 120, w: 170, title: 'M1 Forecast', sub: 'volume per kelurahan', tone: 'teal', target: 'M1' },
  { id: 'M2', x: 175, y: 210, w: 170, title: 'M2 Penjadwal', sub: 'digital twin + slot', tone: 'teal', target: 'M2' },
  { id: 'M3', x: 175, y: 300, w: 170, title: 'M3 Bot WhatsApp', sub: 'jadwal ke sopir', tone: 'teal', target: 'M3' },
  { id: 'QR', x: 395, y: 120, w: 150, title: 'Check-in QR', sub: 'truk tiba', tone: 'slate', target: 'GATE' },
  { id: 'TB', x: 395, y: 210, w: 150, title: 'Jembatan timbang', sub: 'berat bruto/tara', tone: 'slate', target: 'GATE' },
  { id: 'CAM', x: 395, y: 300, w: 150, title: 'Kamera bak', sub: 'foto muatan', tone: 'slate', target: 'GATE' },
  { id: 'M4', x: 595, y: 120, w: 170, title: 'M4 Segmentasi', sub: 'komposisi muatan', tone: 'amber', target: 'M4' },
  { id: 'M5', x: 595, y: 210, w: 170, title: 'M5 Kalor & air', sub: 'MJ/kg · kelas air', tone: 'amber', target: 'M5' },
  { id: 'M6', x: 595, y: 300, w: 170, title: 'M6 Grade & routing', sub: 'A / B / C', tone: 'amber', target: 'M6' },
  { id: 'O1', x: 815, y: 120, w: 205, title: 'PLTSa / pra-olah RDF', sub: 'grade A · B', tone: 'amber', target: 'M6' },
  { id: 'O2', x: 815, y: 210, w: 205, title: 'Olah organik', sub: 'kompos / maggot', tone: 'olive', target: 'M6' },
  { id: 'O3', x: 815, y: 300, w: 205, title: 'Zona timbun', sub: 'residu', tone: 'slate', target: 'M6' },
  { id: 'M7', x: 175, y: 405, w: 590, title: 'M7 Dashboard DLH & rapor pasokan PLTSa', sub: 'ringkasan real-time · peta GIS · Gantt slot · status alat', tone: 'ink', target: 'M7' },
]

const edges: { d: string; dashed?: boolean }[] = [
  { d: 'M140 147 H175' },
  { d: 'M140 237 H175' },
  { d: 'M260 174 V210' },
  { d: 'M260 264 V300' },
  { d: 'M345 327 H370 V147 H395' },
  { d: 'M470 174 V210' },
  { d: 'M470 264 V300' },
  { d: 'M545 327 H570 V147 H595' },
  { d: 'M680 174 V210' },
  { d: 'M680 264 V300' },
  { d: 'M765 327 H790 V147 H815' },
  { d: 'M790 237 H815' },
  { d: 'M790 327 H815' },
  { d: 'M260 372 V405' },
  { d: 'M470 372 V405' },
  { d: 'M680 372 V405' },
  { d: 'M175 432 H157 V110 H260 V120', dashed: true },
]

const clusters = [
  { x: 165, w: 190, label: 'OTAK ALIRAN', tone: 'teal' },
  { x: 385, w: 170, label: 'GERBANG TPA', tone: 'slate' },
  { x: 585, w: 190, label: 'OTAK MUTU', tone: 'amber' },
  { x: 805, w: 225, label: 'TUJUAN MUATAN', tone: 'olive' },
]

const gateInfo = {
  tag: 'GERBANG · TITIK UKUR',
  name: 'Gerbang TPA: QR, timbang, kamera',
  summary:
    'Satu titik yang dilewati semua truk. Check-in QR mencatat waktu tiba, jembatan timbang mencatat berat, dan kamera memotret bak saat truk berhenti di timbangan. Tidak ada klik tambahan untuk operator.',
}

export function ArchitectureMap() {
  const [sel, setSel] = useState('M2')
  const reduce = useReducedMotion()
  const info = sel === 'GATE' ? null : moduleById[sel]

  const toneFill = (t: Node['tone'], on: boolean) => {
    if (!on) return 'fill-card'
    return { teal: 'fill-teal', amber: 'fill-amber', ink: 'fill-ink', slate: 'fill-slate', olive: 'fill-olive' }[t]
  }
  const toneStroke = (t: Node['tone']) => ({ teal: 'stroke-teal', amber: 'stroke-amber', ink: 'stroke-ink', slate: 'stroke-slate', olive: 'stroke-olive' })[t]

  return (
    <div className="grid gap-4">
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <svg viewBox="0 66 1040 404" className="h-auto w-full min-w-[760px]" role="img" aria-label="Diagram arsitektur ARUS: data kelurahan masuk ke otak aliran (forecast, penjadwal, bot), truk melewati gerbang (QR, timbang, kamera), foto masuk ke otak mutu (segmentasi, kalor, grade), lalu muatan diarahkan ke PLTSa, olah organik, atau zona timbun. Semua data bermuara di dashboard dan dipakai melatih ulang forecast.">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" className="fill-ink-soft" />
            </marker>
          </defs>
          {clusters.map((c) => (
            <g key={c.label}>
              <rect x={c.x} y={80} width={c.w} height={292} rx={14} className={`fill-${c.tone}/8 stroke-${c.tone}`} strokeDasharray="5 5" strokeWidth={1} opacity={0.9} />
              <text x={c.x + 12} y={102} className={`fill-${c.tone} font-mono`} fontSize={11} fontWeight={600} letterSpacing={1.5}>
                {c.label}
              </text>
            </g>
          ))}
          {edges.map((e, i) => (
            <path key={i} d={e.d} fill="none" className="stroke-ink-soft" strokeWidth={1.3} strokeDasharray={e.dashed ? '4 4' : undefined} markerEnd="url(#arr)" opacity={0.75} />
          ))}
          <text transform="translate(152,402) rotate(-90)" className="fill-ink-soft font-mono" fontSize={9.5}>
            data harian melatih ulang
          </text>
          {!reduce &&
            edges.map((e, i) => (
              <circle key={`p${i}`} r={3} className={e.dashed ? 'fill-ink-soft' : 'fill-teal'}>
                <animateMotion dur={`${2.2 + (i % 4) * 0.35}s`} repeatCount="indefinite" path={e.d} begin={`${(i * 0.37) % 2}s`} />
              </circle>
            ))}
          {nodes.map((n) => {
            const on = n.target === sel
            const clickable = !!n.target
            return (
              <g
                key={n.id}
                transform={`translate(${n.x},${n.y})`}
                onClick={() => n.target && setSel(n.target)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && n.target) {
                    e.preventDefault()
                    setSel(n.target)
                  }
                }}
                tabIndex={clickable ? 0 : -1}
                role={clickable ? 'button' : undefined}
                aria-label={clickable ? `${n.title}: lihat ringkasan` : undefined}
                aria-pressed={clickable ? on : undefined}
                className={clickable ? 'cursor-pointer outline-none' : ''}
              >
                <rect width={n.w} height={H} rx={10} className={`${toneFill(n.tone, on)} ${toneStroke(n.tone)}`} strokeWidth={on ? 0 : 1.3} />
                <text x={14} y={23} className={`${on ? (n.tone === 'amber' ? 'fill-on-amber' : 'fill-paper') : 'fill-ink'} font-display`} fontSize={14} fontWeight={600}>
                  {n.title}
                </text>
                <text x={14} y={41} className={`${on ? (n.tone === 'amber' ? 'fill-on-amber' : 'fill-paper') : 'fill-ink-soft'} font-mono`} fontSize={10.5} opacity={on ? 0.85 : 1}>
                  {n.sub}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <aside className="grid gap-x-8 gap-y-3 rounded-2xl border border-line bg-card p-6 md:grid-cols-[1fr_auto] md:items-end" aria-live="polite"><div>
        <Kicker>{info ? info.tag : gateInfo.tag}</Kicker>
        <h3 className="mt-2 font-display text-xl leading-snug font-semibold">{info ? info.name : gateInfo.name}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{info ? info.summary : gateInfo.summary}</p>
        {info && (
          <>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(['P0', 'P1', 'P2'] as const).map((p) => {
                const n = info.features.filter((f) => f.priority === p).length
                return n ? (
                  <Badge key={p} kind={p}>
                    {p} · {n} fitur
                  </Badge>
                ) : null
              })}
            </div>
            <a href={`#${info.id.toLowerCase()}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline">
              Lihat detail {info.id} <ArrowRight size={15} />
            </a>
          </>
        )}
        </div><p className="text-xs text-ink-soft md:max-w-[200px] md:text-right">Klik kotak modul pada diagram untuk melihat ringkasannya.</p>
      </aside>
    </div>
  )
}

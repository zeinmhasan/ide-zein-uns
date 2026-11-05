import { useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type Mode = 'tanpa' | 'dengan'
type BranchKey = 'pltsa' | 'organik' | 'timbun'
type Truck = { id: number; x: number; phase: 'road' | 'gate' | 'branch'; svc: number; prog: number; branch: BranchKey; grade: string }

const GATE_X = 560
const ROAD_Y = 236
const SPLIT = { x: 660, y: ROAD_Y }
const ENDS: Record<BranchKey, { x: number; y: number }> = {
  pltsa: { x: 930, y: 96 },
  organik: { x: 930, y: ROAD_Y },
  timbun: { x: 930, y: 352 },
}
const SPEED = 150
const SPACING = 44
const GRADE_CYCLE: { grade: string; branch: BranchKey }[] = [
  { grade: 'A', branch: 'pltsa' },
  { grade: 'C-org', branch: 'organik' },
  { grade: 'B', branch: 'pltsa' },
  { grade: 'C-org', branch: 'organik' },
  { grade: 'C-res', branch: 'timbun' },
  { grade: 'A', branch: 'pltsa' },
  { grade: 'C-org', branch: 'organik' },
]
const PARAMS = {
  tanpa: { interval: 0.62, service: 2.4, maxQueue: 13 },
  dengan: { interval: 1.55, service: 0.95, maxQueue: 99 },
}

function branchPoint(b: BranchKey, prog: number) {
  // segmen 1: gerbang → titik cabang, segmen 2: titik cabang → ujung
  const p0 = { x: GATE_X, y: ROAD_Y }
  const e = ENDS[b]
  const l1 = SPLIT.x - p0.x
  const l2 = Math.hypot(e.x - SPLIT.x, e.y - SPLIT.y)
  const d = prog * (l1 + l2)
  if (d <= l1) return { x: p0.x + d, y: ROAD_Y, angle: 0 }
  const f = (d - l1) / l2
  return { x: SPLIT.x + (e.x - SPLIT.x) * f, y: SPLIT.y + (e.y - SPLIT.y) * f, angle: (Math.atan2(e.y - SPLIT.y, e.x - SPLIT.x) * 180) / Math.PI }
}
function branchLen(b: BranchKey) {
  const e = ENDS[b]
  return SPLIT.x - GATE_X + Math.hypot(e.x - SPLIT.x, e.y - SPLIT.y)
}

class Sim {
  trucks: Truck[] = []
  spawn = 0
  nextId = 1
  gradeIdx = 0
  step(dt: number, mode: Mode) {
    const P = PARAMS[mode]
    const roadTrucks = this.trucks.filter((t) => t.phase !== 'branch').sort((a, b) => b.x - a.x)
    this.spawn -= dt
    if (this.spawn <= 0 && roadTrucks.length < P.maxQueue) {
      const last = roadTrucks[roadTrucks.length - 1]
      if (!last || last.x > -40 + SPACING) {
        this.trucks.push({ id: this.nextId++, x: -40, phase: 'road', svc: 0, prog: 0, branch: 'timbun', grade: '' })
        this.spawn = P.interval
      }
    }
    roadTrucks.forEach((t, i) => {
      const target = GATE_X - i * SPACING
      if (t.x < target) t.x = Math.min(target, t.x + SPEED * dt)
      if (i === 0 && t.x >= GATE_X - 0.5) {
        t.phase = 'gate'
        t.svc += dt
        if (t.svc >= P.service) {
          t.phase = 'branch'
          if (mode === 'dengan') {
            const g = GRADE_CYCLE[this.gradeIdx++ % GRADE_CYCLE.length]
            t.grade = g.grade
            t.branch = g.branch
          } else {
            t.grade = ''
            t.branch = 'timbun'
          }
        }
      }
    })
    for (const t of this.trucks) if (t.phase === 'branch') t.prog += (SPEED * dt) / branchLen(t.branch)
    this.trucks = this.trucks.filter((t) => t.prog < 1)
  }
  queueCount() {
    return this.trucks.filter((t) => t.phase === 'road' && t.x > GATE_X - 13 * SPACING - 10).length
  }
}

function TruckShape({ x, y, angle, tone, grade }: { x: number; y: number; angle: number; tone: string; grade: string }) {
  const gradeTone = grade === 'A' || grade === 'B' ? 'fill-amber' : grade === 'C-org' ? 'fill-olive' : 'fill-slate'
  return (
    <g transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}>
      <g transform={`rotate(${angle.toFixed(1)})`}>
        <rect x={-30} y={-14} width={32} height={20} rx={2.5} className={tone} />
        <rect x={-27} y={-11} width={26} height={3} rx={1} className="fill-paper" opacity={0.35} />
        <path d="M4 -9 h9 l5 6 v9 h-14 z" className="fill-ink" />
        <rect x={7} y={-6.5} width={5} height={4} className="fill-paper" opacity={0.7} />
        <circle cx={-22} cy={8} r={4} className="fill-ink" />
        <circle cx={-8} cy={8} r={4} className="fill-ink" />
        <circle cx={11} cy={8} r={4} className="fill-ink" />
      </g>
      {grade && (
        <g transform="translate(-8,-30)">
          <rect x={-16} y={-9} width={32} height={16} rx={4} className={gradeTone} />
          <text x={0} y={3} textAnchor="middle" className={`${gradeTone === 'fill-amber' ? 'fill-on-amber' : 'fill-paper'} font-mono`} fontSize={9.5} fontWeight={700}>
            {grade}
          </text>
        </g>
      )}
    </g>
  )
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} className="stroke-ink-soft" fill="none" strokeWidth={1.5}>
      <path d="M0 0 L16 -14 L32 0 V22 H0 Z" className="fill-paper-2" />
      <rect x={12} y={9} width={8} height={13} />
    </g>
  )
}

export function HeroScene({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px' })
  const reduce = useReducedMotion()
  const simRef = useRef<Sim>(null)
  if (!simRef.current) simRef.current = new Sim()
  const [, setTick] = useState(0)
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    const sim = simRef.current!
    if (reduce) {
      // render statis: majukan simulasi tanpa animasi
      sim.trucks = []
      for (let i = 0; i < 26 * 30; i++) sim.step(1 / 30, mode)
      setTick((t) => t + 1)
      return
    }
    if (!inView) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      sim.step(dt, modeRef.current)
      setTick((t) => (t + 1) % 1e6)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, mode])

  const sim = simRef.current
  const q = sim.queueCount()
  const km = mode === 'tanpa' ? Math.min(2, q * 0.155) : 0
  const atGate = sim.trucks.some((t) => t.phase === 'gate')
  const lastGraded = [...sim.trucks].filter((t) => t.phase === 'branch' && t.grade).sort((a, b) => a.prog - b.prog)[0]
  const tanpa = mode === 'tanpa'

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox="0 30 1000 400"
        className="h-auto w-full"
        role="img"
        aria-label={
          tanpa
            ? 'Ilustrasi tanpa ARUS: truk datang serentak dan menumpuk di depan gerbang TPA hingga antrean mencapai sekitar 2 km; semua muatan berakhir di timbunan.'
            : 'Ilustrasi dengan ARUS: truk datang berjarak sesuai slot, dipindai kamera di gerbang, diberi grade, lalu bercabang ke PLTSa, olah organik, atau zona timbun.'
        }
      >
        {/* rumah warga di sepanjang jalan */}
        <g opacity={0.9}>
          <House x={40} y={168} />
          <House x={96} y={172} s={0.8} />
          <House x={170} y={166} />
          <House x={250} y={170} s={0.85} />
          <House x={330} y={168} />
          <text x={40} y={142} className="fill-ink-soft font-mono" fontSize={11} letterSpacing={1}>
            RUMAH WARGA · JATIREJO
          </text>
        </g>

        {/* jalan utama */}
        <line x1={-10} y1={ROAD_Y + 12} x2={GATE_X} y2={ROAD_Y + 12} className="stroke-line" strokeWidth={34} />
        <line x1={-10} y1={ROAD_Y + 12} x2={GATE_X} y2={ROAD_Y + 12} className="stroke-paper" strokeWidth={1.5} strokeDasharray="10 12" />

        {/* cabang */}
        {(Object.keys(ENDS) as BranchKey[]).map((b) => {
          const e = ENDS[b]
          const dim = tanpa && b !== 'timbun'
          return (
            <g key={b} opacity={dim ? 0.25 : 1}>
              <path d={`M${GATE_X} ${ROAD_Y + 12} H${SPLIT.x} L${e.x} ${e.y + 12}`} fill="none" className="stroke-line" strokeWidth={26} strokeLinejoin="round" />
            </g>
          )
        })}

        {/* tujuan */}
        {(
          [
            { k: 'pltsa', label: 'PLTSa', sub: 'pra-olah RDF', tone: 'amber' },
            { k: 'organik', label: 'Olah organik', sub: 'kompos/maggot', tone: 'olive' },
            { k: 'timbun', label: 'Zona timbun', sub: 'residu', tone: 'slate' },
          ] as const
        ).map(({ k, label, sub, tone }) => {
          const e = ENDS[k]
          const dim = tanpa && k !== 'timbun'
          return (
            <g key={k} transform={`translate(${e.x + 18},${e.y + 12})`} opacity={dim ? 0.3 : 1}>
              <circle r={26} className={`fill-${tone}`} />
              {k === 'pltsa' && <path d="M3 -15 L-8 3 H0 L-3 15 L9 -3 H1 Z" className="fill-paper" />}
              {k === 'organik' && (
                <path d="M-10 10 C-10 -6 0 -14 12 -13 C12 0 4 10 -10 10 Z M-10 10 L4 -4" className="fill-paper stroke-olive" strokeWidth={1.5} />
              )}
              {k === 'timbun' && (
                <g className="fill-none stroke-paper" strokeWidth={2.2} strokeLinejoin="round">
                  <path d="M0 -12 L12 -6 L0 0 L-12 -6 Z" />
                  <path d="M-12 0 L0 6 L12 0" />
                  <path d="M-12 6 L0 12 L12 6" />
                </g>
              )}
              <text x={0} y={44} textAnchor="middle" className="fill-ink font-display" fontSize={13} fontWeight={600}>
                {label}
              </text>
              <text x={0} y={58} textAnchor="middle" className="fill-ink-soft font-mono" fontSize={9.5}>
                {sub}
              </text>
            </g>
          )
        })}

        {/* gerbang */}
        <g transform={`translate(${GATE_X + 10},0)`}>
          <rect x={-6} y={168} width={10} height={100} className="fill-ink" />
          <rect x={44} y={168} width={10} height={100} className="fill-ink" />
          <rect x={-14} y={156} width={76} height={16} rx={2} className={tanpa ? 'fill-slate' : 'fill-teal'} />
          <text x={24} y={168} textAnchor="middle" className="fill-paper font-mono" fontSize={9} fontWeight={600} letterSpacing={1}>
            {tanpa ? 'TPA' : 'ARUS'}
          </text>
          {/* jembatan timbang */}
          <rect x={-22} y={262} width={92} height={6} className="fill-ink-soft" opacity={0.6} />
          {!tanpa && (
            <g>
              <line x1={58} y1={156} x2={58} y2={124} className="stroke-ink" strokeWidth={3} />
              <rect x={44} y={112} width={28} height={16} rx={3} className="fill-ink" />
              <circle cx={50} cy={120} r={4} className="fill-teal" />
              {atGate && (
                <polygon points="46,128 20,250 80,250" className="fill-teal animate-blink" opacity={0.22} />
              )}
            </g>
          )}
        </g>

        {/* layar operator */}
        {!tanpa && (
          <g transform="translate(600,40)">
            <rect width={190} height={52} rx={8} className="fill-ink" />
            <text x={12} y={20} className="fill-paper font-mono" fontSize={9.5} opacity={0.65}>
              LAYAR OPERATOR
            </text>
            <text x={12} y={39} className="fill-paper font-mono" fontSize={12} fontWeight={600}>
              {lastGraded ? `Grade ${lastGraded.grade} → ${lastGraded.branch === 'pltsa' ? 'Bunker PLTSa' : lastGraded.branch === 'organik' ? 'Olah organik' : 'Zona timbun'}` : 'Menunggu truk…'}
            </text>
          </g>
        )}

        {/* truk */}
        {sim.trucks.map((t) => {
          if (t.phase === 'branch') {
            const p = branchPoint(t.branch, t.prog)
            return <TruckShape key={t.id} x={p.x} y={p.y} angle={p.angle} tone={tanpa ? 'fill-slate' : 'fill-teal'} grade={t.grade} />
          }
          return <TruckShape key={t.id} x={t.x} y={ROAD_Y} angle={0} tone={tanpa ? 'fill-coral' : 'fill-teal'} grade="" />
        })}

        {/* penghitung antrean */}
        <g transform="translate(20,300)">
          <rect width={250} height={62} rx={10} className={tanpa ? 'fill-coral' : 'fill-teal'} opacity={0.12} />
          <text x={16} y={24} className="fill-ink-soft font-mono" fontSize={10.5} letterSpacing={1}>
            {tanpa ? 'ANTREAN DI JALAN WARGA' : 'KEDATANGAN TERJADWAL'}
          </text>
          <text x={16} y={50} className={`${tanpa ? 'fill-coral' : 'fill-teal'} font-mono`} fontSize={22} fontWeight={700}>
            {tanpa ? `±${km.toFixed(1).replace('.', ',')} km` : 'slot 15 menit'}
          </text>
        </g>
      </svg>
    </div>
  )
}

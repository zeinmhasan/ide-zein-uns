import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { glossaryMap } from '../../data/project'
import { sourceById } from '../../data/sources'

type BadgeKind = 'P0' | 'P1' | 'P2' | 'asumsi' | 'ilustrasi' | 'target' | 'simulasi' | 'hipotesis' | 'fiktif' | 'tag'

const badgeStyle: Record<BadgeKind, string> = {
  P0: 'bg-coral text-on-accent',
  P1: 'bg-amber text-on-amber',
  P2: 'bg-slate/15 text-slate border border-slate/30',
  asumsi: 'badge-asumsi',
  ilustrasi: 'bg-ink-soft/15 text-ink-soft border border-ink-soft/30',
  target: 'bg-teal/12 text-teal border border-teal/30',
  simulasi: 'badge-asumsi',
  hipotesis: 'bg-olive/15 text-olive border border-olive/30',
  fiktif: 'bg-ink-soft/15 text-ink-soft border border-ink-soft/30',
  tag: 'bg-card text-ink-soft border border-line',
}

const badgeLabel: Partial<Record<BadgeKind, string>> = {
  asumsi: 'ASUMSI',
  ilustrasi: 'ILUSTRASI',
  target: 'TARGET · belum tervalidasi',
  simulasi: 'SIMULASI · ASUMSI',
  hipotesis: 'HIPOTESIS',
  fiktif: 'NAMA FIKTIF',
}

export function Badge({ kind, children, className = '' }: { kind: BadgeKind; children?: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none tracking-wide whitespace-nowrap ${badgeStyle[kind]} ${className}`}
    >
      {children ?? badgeLabel[kind] ?? kind}
    </span>
  )
}

/** Rujukan sumber inline, mis. [S7]. */
export function Src({ id }: { id?: string }) {
  if (!id) return null
  const s = sourceById[id]
  if (!s) return null
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={s.title}
      className="ml-0.5 inline-block align-super font-mono text-[10px] font-medium text-teal no-underline hover:underline"
    >
      [{id}]
    </a>
  )
}

/** Istilah glosarium dengan tooltip. */
export function Term({ k, children }: { k: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLSpanElement>(null)
  const def = glossaryMap[k]
  useEffect(() => {
    if (!open) return
    const onDoc = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [open])
  if (!def) return <>{children ?? k}</>
  return (
    <span ref={ref} className="relative inline-block">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="cursor-help underline decoration-dotted decoration-ink-soft/60 underline-offset-4"
      >
        {children ?? k}
      </span>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-40 mb-2 w-64 max-w-[78vw] -translate-x-1/2 rounded-lg border border-line bg-ink px-3 py-2 text-left text-xs font-normal leading-relaxed text-paper shadow-lg"
        >
          <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-wider opacity-70">{k}</span>
          {def}
        </span>
      )}
    </span>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-card ${className}`}>{children}</div>
}

export function Kicker({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft ${className}`}>{children}</div>
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full border border-line bg-paper-2 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            value === o.value ? 'bg-ink text-paper shadow-sm' : 'text-ink-soft hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div role="tablist" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          onClick={() => onChange(t.id)}
          className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
            active === t.id ? 'border-teal text-ink' : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/** Wadah untuk diagram lebar: bisa di-scroll horizontal di layar sempit. */
export function ScrollX({ children, minWidth = 720, className = '' }: { children: ReactNode; minWidth?: number; className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div style={{ minWidth }}>{children}</div>
    </div>
  )
}

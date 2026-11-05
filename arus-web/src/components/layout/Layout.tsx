import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { BookOpen, Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { nav } from '../../data/content'
import { glossary } from '../../data/project'
import { Kicker } from '../ui/primitives'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" className="fill-teal" />
      <path d="M6 11h9c4 0 5 2 7 5" className="stroke-paper" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M6 16h16" className="stroke-paper" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 21h9c4 0 5-2 7-5" className="stroke-paper" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="25" cy="16" r="2.6" className="fill-amber" />
    </svg>
  )
}

export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-teal" />
}

function useActiveSection() {
  const [active, setActive] = useState(nav[0].id)
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return active
}

function NavList({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <ol className="space-y-0.5">
      {nav.map((n, i) => {
        const on = n.id === active
        return (
          <li key={n.id}>
            <a
              href={`#${n.id}`}
              onClick={onNavigate}
              aria-current={on ? 'true' : undefined}
              className={`group flex items-baseline gap-3 rounded-lg px-3 py-1.5 text-[13.5px] transition-colors ${
                on ? 'bg-teal/10 font-semibold text-ink' : 'text-ink-soft hover:bg-paper-2 hover:text-ink'
              }`}
            >
              <span className={`num font-mono text-[10.5px] ${on ? 'text-teal' : 'text-ink-soft/70'}`}>{String(i + 1).padStart(2, '0')}</span>
              {n.label}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

function ThemeButton({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-paper-2 hover:text-ink"
    >
      {dark ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
    </button>
  )
}

export function Shell({ children }: { children: ReactNode }) {
  const active = useActiveSection()
  const [drawer, setDrawer] = useState(false)
  const [gloss, setGloss] = useState(false)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('arus-theme', next ? 'dark' : 'light')
    } catch {
      /* storage tidak tersedia */
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false)
        setGloss(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <ProgressBar />
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-paper lg:flex">
        <a href="#beranda" className="flex items-center gap-3 px-6 pt-7 pb-6">
          <Logo className="h-9 w-9" />
          <div>
            <div className="font-display text-xl font-bold leading-none tracking-tight">ARUS</div>
            <div className="mt-1 text-[11px] text-ink-soft">Atur Ritase, Ukur Sampah</div>
          </div>
        </a>
        <nav aria-label="Daftar bab" className="flex-1 overflow-y-auto px-3 pb-4">
          <NavList active={active} />
        </nav>
        <div className="flex items-center gap-2 border-t border-line px-4 py-4">
          <button
            onClick={() => setGloss(true)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-line text-sm font-medium text-ink-soft hover:bg-paper-2 hover:text-ink"
          >
            <BookOpen size={15} strokeWidth={1.75} /> Glosarium
          </button>
          <ThemeButton dark={dark} toggle={toggleTheme} />
        </div>
      </aside>

      {/* Top bar mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/90 px-4 py-2.5 backdrop-blur lg:hidden">
        <a href="#beranda" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight">ARUS</span>
        </a>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGloss(true)}
            aria-label="Buka glosarium"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-soft"
          >
            <BookOpen size={16} strokeWidth={1.75} />
          </button>
          <ThemeButton dark={dark} toggle={toggleTheme} />
          <button
            onClick={() => setDrawer(true)}
            aria-label="Buka daftar bab"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-paper"
          >
            <Menu size={17} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawer(false)}
            />
            <motion.nav
              aria-label="Daftar bab"
              className="fixed inset-y-0 right-0 z-50 w-[82vw] max-w-xs overflow-y-auto bg-paper px-3 py-5 shadow-2xl lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="mb-4 flex items-center justify-between px-3">
                <Kicker>Daftar bab</Kicker>
                <button onClick={() => setDrawer(false)} aria-label="Tutup" className="p-1 text-ink-soft">
                  <X size={18} />
                </button>
              </div>
              <NavList active={active} onNavigate={() => setDrawer(false)} />
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gloss && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setGloss(false)}
            />
            <motion.aside
              role="dialog"
              aria-label="Glosarium"
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto border-l border-line bg-paper shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="sticky top-0 flex items-center justify-between border-b border-line bg-paper px-6 py-4">
                <div>
                  <Kicker>Glosarium</Kicker>
                  <div className="font-display text-xl font-semibold">Istilah yang sering muncul</div>
                </div>
                <button onClick={() => setGloss(false)} aria-label="Tutup glosarium" className="p-1 text-ink-soft hover:text-ink">
                  <X size={20} />
                </button>
              </div>
              <dl className="divide-y divide-line px-6">
                {glossary.map((g) => (
                  <div key={g.term} className="py-3.5">
                    <dt className="font-mono text-sm font-semibold text-teal">{g.term}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{g.def}</dd>
                  </div>
                ))}
              </dl>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-64">{children}</main>
    </>
  )
}

export function Section({
  id,
  num,
  kicker,
  title,
  lead,
  children,
  blueprint = false,
}: {
  id: string
  num: string
  kicker: string
  title: ReactNode
  lead?: ReactNode
  children: ReactNode
  blueprint?: boolean
}) {
  return (
    <section id={id} className={`scroll-mt-14 border-t border-line py-20 md:py-28 lg:scroll-mt-0 ${blueprint ? 'blueprint' : ''}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-10">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-teal">
            {num} · {kicker}
          </div>
          <h2 className="mt-3 max-w-3xl font-display text-[2rem] font-semibold leading-[1.08] tracking-tight text-balance md:text-5xl">{title}</h2>
          {lead && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">{lead}</p>}
        </motion.header>
        <div className="mt-12 md:mt-14">{children}</div>
      </div>
    </section>
  )
}

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

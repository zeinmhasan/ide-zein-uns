import { motion } from 'framer-motion'
import { ArrowDown, FileSpreadsheet, MapPin } from 'lucide-react'
import { useState } from 'react'
import { insights, problemTree } from '../data/content'
import { meta } from '../data/meta'
import { Reveal, Section } from '../components/layout/Layout'
import { Badge, Card, Segmented, Src, Term } from '../components/ui/primitives'
import { HeroScene } from '../components/visuals/HeroScene'
import { BottleneckPipe, ProblemTree, StatTiles, Timeline } from '../components/visuals/ProblemVisuals'

export function Hero() {
  const [mode, setMode] = useState<'tanpa' | 'dengan'>('tanpa')
  return (
    <section id="beranda" className="blueprint relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 md:px-10 md:pt-20 md:pb-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-wrap gap-2">
            <Badge kind="tag">{meta.event}</Badge>
            <Badge kind="tag">{meta.track}</Badge>
          </div>
          <div className="mt-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-ink-soft">
            <MapPin size={13} /> TPA PUTRI CEMPO · SURAKARTA
          </div>
          <h1 className="mt-3 font-display text-[5.5rem] leading-[0.85] font-bold tracking-[-0.04em] md:text-[9rem]">ARUS</h1>
          <p className="mt-4 font-display text-xl font-medium tracking-tight md:text-2xl" aria-label={meta.acronymText}>
            {meta.acronym.map((a, i) => (
              <span key={i}>
                <span className="text-teal">{a.letter}</span>
                {a.rest}
                {i < meta.acronym.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <p className="font-display text-3xl leading-tight font-semibold tracking-tight text-balance md:text-[2.6rem]">Satu gerbang, seluruh sampah kota.</p>
              <p className="mt-3 text-lg text-amber md:text-xl">
                <span className="font-semibold">{meta.tagline}</span>
              </p>
            </div>
            <p className="text-[16px] leading-relaxed text-ink-soft">{meta.oneLiner}</p>
          </div>
        </motion.div>

        <div className="mt-10 rounded-3xl border border-line bg-card/80 p-3 shadow-sm backdrop-blur-sm md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-2">
            <Segmented
              label="Bandingkan kondisi"
              value={mode}
              onChange={setMode}
              options={[
                { value: 'tanpa', label: 'Tanpa ARUS' },
                { value: 'dengan', label: 'Dengan ARUS' },
              ]}
            />
            <span className="text-xs text-ink-soft">{mode === 'tanpa' ? 'Truk datang serentak, menumpuk di jalan warga, semua berakhir di timbunan.' : 'Truk datang sesuai slot, dinilai di gerbang, lalu diarahkan.'}</span>
          </div>
          <HeroScene mode={mode} />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-stretch">
          {meta.whyName.map((w) => (
            <Card key={w.title} className="p-5">
              <div className="font-mono text-[11px] tracking-widest text-teal">KENAPA "ARUS"? · {w.title.toUpperCase()}</div>
              <p className="mt-2 text-[15px] leading-relaxed">{w.text}</p>
            </Card>
          ))}
          <a href="#angka" className="group flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-5 font-semibold text-paper">
            Mulai dari masalahnya <ArrowDown size={18} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export function Angka() {
  return (
    <Section
      id="angka"
      num="02"
      kicker="Kenapa ini penting"
      title="Angka-angka Putri Cempo"
      lead={
        <>
          <Term k="TPA">TPA</Term> Putri Cempo adalah satu-satunya TPA Kota Surakarta dan sudah melewati batas kapasitasnya sejak 2007. Setiap hari, ratusan ton sampah masuk lewat satu gerbang yang sama.
        </>
      }
    >
      <StatTiles />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="flex gap-4 p-5">
          <MapPin className="mt-0.5 shrink-0 text-amber" size={20} strokeWidth={1.75} />
          <p className="text-[15px] leading-relaxed">
            Surakarta adalah <span className="font-semibold">1 dari 12 kota</span> yang ditunjuk sebagai percontohan <Term k="PLTSa">PLTSa</Term>. Masalah serupa dihadapi kota percontohan lain.
            <Src id="S18" />
          </p>
        </Card>
        <Card className="flex gap-4 p-5">
          <FileSpreadsheet className="mt-0.5 shrink-0 text-coral" size={20} strokeWidth={1.75} />
          <p className="text-[15px] leading-relaxed">
            Pencatatan retribusi sampah masih memakai <span className="font-semibold">Excel</span>, dan lokasi TPS, TPA, serta data persampahan belum terintegrasi dalam GIS.
            <Src id="S13" />
          </p>
        </Card>
      </div>
    </Section>
  )
}

export function Linimasa() {
  return (
    <Section id="linimasa" num="03" kicker="Linimasa krisis" title="Dua dekade, krisis yang terus berulang" lead="Overload, kebakaran, PLTSa yang mandek, antrean, dan protes warga. Geser untuk menelusuri peristiwanya.">
      <Timeline />
    </Section>
  )
}

export function Masalah() {
  return (
    <Section id="masalah" num="04" kicker="Pohon masalah" title="Antrean hanyalah gejala" lead="Yang terlihat di berita adalah daunnya. Akar masalahnya ada pada cara aliran truk dan mutu muatan dikelola di satu titik masuk.">
      <ProblemTree />
      <Reveal className="mt-14">
        <figure className="rounded-2xl border-l-4 border-teal bg-card p-6 md:p-8">
          <div className="font-mono text-[11px] tracking-widest text-teal">PROBLEM STATEMENT</div>
          <blockquote className="mt-3 font-display text-lg leading-relaxed md:text-xl">{problemTree.statement}</blockquote>
        </figure>
      </Reveal>
    </Section>
  )
}

export function Insight() {
  return (
    <Section id="insight" num="05" kicker="Insight kunci" title="Leher botolnya ada di area bongkar" lead="Menambah atau mengurangi truk tidak menyelesaikan antrean. Yang menentukan adalah berapa truk yang bisa dibongkar per jam, dan angka itu berubah setiap kali alat berat rusak.">
      <BottleneckPipe />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {insights.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.05}>
            <Card className="h-full p-6">
              <div className="font-mono text-3xl font-semibold text-teal">{s.n}</div>
              <h3 className="mt-3 font-display text-xl leading-snug font-semibold">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {s.text}
                <Src id={s.sourceId} />
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

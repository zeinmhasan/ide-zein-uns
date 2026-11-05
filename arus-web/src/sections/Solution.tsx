import { ArrowRight, Check, Star } from 'lucide-react'
import type { ReactNode } from 'react'
import { personas, valueProps } from '../data/content'
import { masterData, modules, type Module } from '../data/modules'
import { energyAngles } from '../data/project'
import { Reveal, Section } from '../components/layout/Layout'
import { Badge, Card, Kicker, Term } from '../components/ui/primitives'
import { ArchitectureMap } from '../components/visuals/ArchitectureMap'
import { DashboardMock } from '../components/visuals/DashboardMock'
import { ClassLegend, ForecastChart, GateVisionMock, WhatsAppMock } from '../components/visuals/ModuleVisuals'
import { CalorificCalculator, GradeDecisionTree } from '../components/visuals/QualityVisuals'
import { QueueSimulator } from '../components/visuals/QueueSimulator'

export function Solusi() {
  return (
    <Section
      id="solusi"
      num="06"
      kicker="Solusinya"
      title="Dua otak, satu gerbang"
      blueprint
      lead="ARUS memasang kecerdasan di titik yang dilewati semua truk. Otak aliran mengatur kapan truk datang. Otak mutu menilai apa yang dibawa. Keduanya bermuara di satu dashboard, dan data hariannya dipakai melatih ulang model."
    >
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card className="border-teal/40 p-6">
          <Kicker className="text-teal">Otak aliran · Flow brain</Kicker>
          <p className="mt-2 text-[15px] leading-relaxed">
            Forecast volume → <Term k="Digital twin">digital twin</Term> antrean → optimasi <Term k="Slot">slot</Term> → bot WhatsApp sopir → jadwal ulang otomatis saat kapasitas berubah.
          </p>
        </Card>
        <Card className="border-amber/50 p-6">
          <Kicker className="text-amber">Otak mutu · Quality brain</Kicker>
          <p className="mt-2 text-[15px] leading-relaxed">
            Foto bak + berat timbang → <Term k="Segmentasi">segmentasi</Term> komposisi → estimasi <Term k="Nilai kalor">nilai kalor</Term> & kelas kadar air → <Term k="Grade">grade</Term> A/B/C → rekomendasi tujuan muatan.
          </p>
        </Card>
      </div>

      <ArchitectureMap />

      <h3 className="mt-16 font-display text-2xl font-semibold">Sebelum → sesudah</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {valueProps.map((v, i) => (
          <Reveal key={v.who} delay={i * 0.04}>
            <Card className="h-full p-5">
              <div className="font-mono text-[11px] tracking-widest text-ink-soft uppercase">{v.who}</div>
              <p className="mt-3 text-sm text-coral line-through decoration-coral/40">{v.before}</p>
              <div className="mt-2 flex gap-2 text-[15px] font-medium">
                <ArrowRight size={16} className="mt-1 shrink-0 text-teal" />
                {v.after}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold">Siapa yang dibantu</h3>
        <Badge kind="fiktif">PERSONA · NAMA FIKTIF</Badge>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {personas.map((p) => (
          <Card key={p.name} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-full bg-${p.tone} font-display font-bold text-paper`}>{p.name.replace(/^(Pak|Mas|Mbak|Ir\.) /, '')[0]}</div>
              <div>
                <div className="font-display font-semibold">
                  {p.name}, {p.age}
                </div>
                <div className="text-sm text-ink-soft">{p.role}</div>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm leading-relaxed">
              <div>
                <dt className="inline font-semibold">Tujuan: </dt>
                <dd className="inline text-ink-soft">{p.goal}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-coral">Masalah: </dt>
                <dd className="inline text-ink-soft">{p.pain}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-teal">Butuh: </dt>
                <dd className="inline text-ink-soft">{p.need}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <h3 className="mt-16 font-display text-2xl font-semibold">Di mana sisi energinya?</h3>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {energyAngles.map((e, i) => (
          <Card key={e.title} className="p-5">
            <div className="font-mono text-sm font-semibold text-amber">0{i + 1}</div>
            <div className="mt-2 font-display font-semibold">{e.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{e.text}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

function FeatureTable({ m }: { m: Module }) {
  return (
    <div className="self-start overflow-hidden rounded-xl border border-line">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-line">
          {m.features.map((f) => (
            <tr key={f.id} className="bg-card">
              <td className="w-16 py-2.5 pl-4 align-top font-mono text-xs text-ink-soft">{f.id}</td>
              <td className="py-2.5 pr-3 leading-snug">{f.text}</td>
              <td className="w-12 py-2.5 pr-4 text-right align-top">
                <Badge kind={f.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const hasNumber = (s: string) => /[≤≥<>]\s?\d/.test(s)

function ModuleBlock({ m, visual, visualTitle }: { m: Module; visual?: ReactNode; visualTitle?: string }) {
  const tone = m.brain === 'aliran' ? 'text-teal' : m.brain === 'mutu' ? 'text-amber' : 'text-slate'
  return (
    <article id={m.id.toLowerCase()} className="scroll-mt-20 border-t border-line pt-12 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`font-mono text-xs font-semibold tracking-widest ${tone}`}>{m.tag}</span>
        {m.star && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber px-2 py-0.5 font-mono text-[10px] font-bold text-on-amber">
            <Star size={11} fill="currentColor" /> INTI DEEPTECH
          </span>
        )}
      </div>
      <h3 className="mt-2 font-display text-2xl leading-tight font-semibold md:text-3xl">{m.name}</h3>
      <p className="mt-2 max-w-3xl text-[16px] leading-relaxed text-ink-soft">{m.goal}</p>

      <div className={`mt-6 grid gap-6 ${m.story ? 'lg:grid-cols-[1.25fr_1fr]' : ''}`}>
        <FeatureTable m={m} />
        {m.story && (
          <div className="space-y-4">
            <Card className="p-5">
              <Kicker>User story</Kicker>
              <p className="mt-2 font-display text-[16px] leading-relaxed italic">"{m.story}"</p>
            </Card>
            {m.acceptance && (
              <Card className="p-5">
                <Kicker>Acceptance criteria (MVP)</Kicker>
                <ul className="mt-3 space-y-2.5 text-sm leading-snug">
                  {m.acceptance.map((a) => (
                    <li key={a} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-teal" />
                      <span>
                        {a} {hasNumber(a) && <Badge kind="target" className="ml-1 align-middle" />}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
      {visual && (
        <div className="mt-8">
          {visualTitle && <div className="mb-3 font-mono text-[11px] tracking-widest text-ink-soft uppercase">{visualTitle}</div>}
          {visual}
        </div>
      )}
    </article>
  )
}

export function Modul() {
  const visuals: Record<string, { v: ReactNode; t: string }> = {
    M1: { v: <ForecastChart />, t: 'Contoh keluaran forecast' },
    M2: { v: <QueueSimulator />, t: 'Coba sendiri: simulator antrean' },
    M3: { v: <WhatsAppMock />, t: 'Mockup chat sopir' },
    M4: {
      v: (
        <div className="space-y-6">
          <GateVisionMock />
          <ClassLegend />
        </div>
      ),
      t: 'Ilustrasi segmentasi bak truk & taksonomi label',
    },
    M5: { v: <CalorificCalculator />, t: 'Coba sendiri: kalkulator nilai kalor' },
    M6: { v: <GradeDecisionTree />, t: 'Pohon keputusan grade' },
    M7: { v: <DashboardMock />, t: 'Mockup dashboard: coba matikan satu ekskavator' },
    M8: {
      v: (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {masterData.map((d) => (
            <Card key={d.title} className="p-4">
              <div className="font-display font-semibold">{d.title}</div>
              <p className="mt-1 text-sm text-ink-soft">{d.fields}</p>
            </Card>
          ))}
        </div>
      ),
      t: 'Master data & konfigurasi',
    },
  }
  return (
    <Section id="modul" num="07" kicker="Bedah modul" title="Delapan modul, satu alur" lead="Prioritas P0 wajib ada di demo hackathon, P1 sebaiknya ada, P2 dikerjakan di fase inkubasi. Setiap modul dilengkapi visual yang bisa dicoba.">
      <nav aria-label="Modul" className="no-scrollbar -mx-4 mb-12 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {modules.map((m) => (
          <a key={m.id} href={`#${m.id.toLowerCase()}`} className="shrink-0 rounded-full border border-line bg-card px-3.5 py-1.5 text-sm hover:border-ink">
            <span className="mr-1.5 font-mono text-xs font-semibold text-teal">{m.id}</span>
            {m.short}
          </a>
        ))}
      </nav>
      <div className="space-y-16">
        {modules.map((m) => (
          <ModuleBlock key={m.id} m={m} visual={visuals[m.id]?.v} visualTitle={visuals[m.id]?.t} />
        ))}
      </div>
    </Section>
  )
}

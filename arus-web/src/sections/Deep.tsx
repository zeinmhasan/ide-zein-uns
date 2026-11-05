import { CircleCheck, ExternalLink, Lock, ShieldCheck, Target, TriangleExclamationPoint, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { referenceTable } from '../data/calorific'
import { meta } from '../data/meta'
import { dataSources, kpis, mvp, nfr, nonGoals, northStar, privacy, risks, techStack, type DataStatus } from '../data/project'
import { sources } from '../data/sources'
import { Logo, Reveal, Section } from '../components/layout/Layout'
import { Badge, Card, Kicker, ScrollX, Src, Tabs, Term } from '../components/ui/primitives'
import { BmcGrid, DayStepper, Erd, PlanGantt, RescheduleFlow, SequenceDiagram, StateMachine, TktLadder } from '../components/visuals/DetailVisuals'
import { nf } from '../lib/rng'

export function Sehari() {
  return (
    <Section id="sehari" num="08" kicker="Satu hari bersama ARUS" title="Dari forecast malam hari sampai rapor sore" lead="Begini ARUS bekerja dalam satu hari operasional, termasuk saat ekskavator rusak di tengah hari.">
      <DayStepper />
    </Section>
  )
}

export function Alur() {
  const [tab, setTab] = useState('seq')
  return (
    <Section id="alur" num="09" kicker="Alur detail" title="Tiga diagram yang menjelaskan sistemnya" lead="Urutan kedatangan truk di gerbang, cara sistem menanggapi gangguan kapasitas, dan siklus hidup satu ritase.">
      <Tabs
        tabs={[
          { id: 'seq', label: 'Kedatangan di gerbang' },
          { id: 'res', label: 'Gangguan kapasitas' },
          { id: 'state', label: 'Siklus hidup ritase' },
        ]}
        active={tab}
        onChange={setTab}
      />
      <Card className="mt-6 p-4 md:p-6">
        {tab === 'seq' && (
          <ScrollX minWidth={760}>
            <SequenceDiagram />
          </ScrollX>
        )}
        {tab === 'res' && (
          <ScrollX minWidth={680}>
            <RescheduleFlow />
          </ScrollX>
        )}
        {tab === 'state' && (
          <ScrollX minWidth={760}>
            <StateMachine />
          </ScrollX>
        )}
      </Card>
      <p className="mt-3 text-sm text-ink-soft">
        {tab === 'seq' && 'Dari check-in sampai grade tampil di layar operator, targetnya di bawah 5 detik per truk.'}
        {tab === 'res' && 'Hanya ritase berstatus Dijadwalkan/Dikirim yang boleh digeser. Ada penalti perubahan supaya sopir tidak dioper-oper.'}
        {tab === 'state' && 'Setiap ritase punya status yang jelas, sehingga sistem tahu mana yang masih bisa dijadwalkan ulang.'}
      </p>
      <Card className="mt-8 p-6">
        <Kicker>Siklus perbaikan model</Kicker>
        <ol className="mt-3 grid gap-4 text-sm leading-relaxed md:grid-cols-3">
          <li>
            <span className="font-mono font-semibold text-teal">1 ·</span> Foto dengan confidence rendah atau yang di-override operator masuk antrean labeling.
          </li>
          <li>
            <span className="font-mono font-semibold text-teal">2 ·</span> Foto dilabel dengan CVAT / Label Studio sesuai taksonomi M4.
          </li>
          <li>
            <span className="font-mono font-semibold text-teal">3 ·</span> Retraining mingguan, dievaluasi pada test set tetap, dan di-deploy hanya jika lebih baik.
          </li>
        </ol>
      </Card>
    </Section>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <pre className="overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12.5px] leading-relaxed text-paper">{children}</pre>
}

function AiCard({ tag, title, children }: { tag: string; title: string; children: ReactNode }) {
  return (
    <Card className="p-6">
      <Kicker className="text-teal">{tag}</Kicker>
      <h3 className="mt-2 font-display text-xl font-semibold">{title}</h3>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed">{children}</div>
    </Card>
  )
}

export function DiBalikAI() {
  return (
    <Section id="ai" num="10" kicker="Di balik AI-nya" title="Optimasi, simulasi, visi komputer, dan sedikit termodinamika" blueprint lead="Bagian ini membedah model dan algoritma di setiap otak ARUS: apa targetnya, fitur apa yang dipakai, dan bagaimana mengukurnya.">
      <div className="grid gap-5 lg:grid-cols-2">
        <AiCard tag="M1 · Forecast" title="LightGBM global dengan quantile loss">
          <p>
            Target <span className="font-mono text-sm">y[k,d]</span> = tonase kelurahan <i>k</i> pada hari <i>d</i>. Satu model untuk semua kelurahan (fitur ID kelurahan) menghasilkan <Term k="P10/P50/P90">P10/P50/P90</Term>. Baseline pembanding: seasonal naive dan Prophet.
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <b>Kalender:</b> hari dalam minggu, libur nasional, cuti bersama, Ramadan, H±Lebaran, tahun baru
            </li>
            <li>
              <b>Lokal:</b> hari pasaran Jawa (Legi/Pahing/Pon/Wage/Kliwon) <Badge kind="hipotesis">HIPOTESIS · diuji</Badge>, event kota
            </li>
            <li>
              <b>Cuaca:</b> curah hujan H-1/H (sampah basah lebih berat)
            </li>
            <li>
              <b>Lag:</b> tonase H-1, H-7, rata-rata 7 & 28 hari
            </li>
            <li>
              <b>Statis:</b> jumlah penduduk, jumlah pasar
            </li>
          </ul>
          <p className="text-sm text-ink-soft">
            Evaluasi: <Term k="MAPE">MAPE</Term> & pinball loss pada backtest rolling-origin. Saat data belum ada: data sintetis + data lapangan 1–2 minggu, disempurnakan setelah data DLH tersedia.
          </p>
        </AiCard>

        <AiCard tag="M2 · Penjadwalan" title="Kapasitas bongkar + optimasi CP-SAT">
          <Code>
            {`Cap[s] = floor( Σ_alat_aktif produktivitas [truk/jam]
                × durasi_slot [jam]
                × faktor_akses_zona[s]
                × faktor_cuaca[s] )`}
          </Code>
          <div className="flex flex-wrap gap-2 text-xs">
            <span>
              produktivitas awal 10 truk/jam <Badge kind="asumsi" />
            </span>
            <span>
              faktor cuaca hujan lebat 0,8 <Badge kind="asumsi" />
            </span>
          </div>
          <Code>
            {`var   x[t,s] ∈ {0,1}   // ritase t di slot s
min   Σ_t ( w_tunggu·tunggu_t
          + w_dev·|slot_t − slot_pref_t| )
      + w_tunda · Σ ritase_tertunda
s.t.  setiap ritase tepat 1 slot (atau "tertunda")
      Σ_t x[t,s] ≤ Cap[s]                 ∀ s
      slot(t_k+1) ≥ slot(t_k) + waktu_putar(kel)
      jam operasional gerbang
      bobot lebih tinggi untuk truk multi-ritase`}
          </Code>
          <p className="text-sm text-ink-soft">
            Solver: <Term k="CP-SAT">CP-SAT</Term> (Google OR-Tools). Saat re-scheduling, hanya ritase berstatus Dijadwalkan/Dikirim yang boleh digeser, dan ada penalti perubahan.
          </p>
        </AiCard>

        <AiCard tag="M2 · Digital twin" title="Antrean M/G/c di SimPy">
          <p>
            c = jumlah alat berat aktif. Waktu bongkar stokastik (lognormal). Kedatangan diambil dari jadwal, atau dari pola bergelombang untuk baseline. <Term k="Digital twin">Digital twin</Term> ini dipakai untuk uji skenario what-if sebelum keputusan diambil.
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>Keluaran: waktu tunggu per truk, panjang antrean per menit</li>
            <li>
              Panjang antrean = truk × 15 m <Badge kind="asumsi" />
            </li>
            <li>
              BBM idle = jam tunggu × 2 L/jam <Badge kind="asumsi" />
            </li>
          </ul>
        </AiCard>

        <AiCard tag="M4 · Segmentasi" title="YOLO-seg, fine-tune di foto bak truk">
          <ul className="space-y-1.5 text-sm">
            <li>
              <b>Arsitektur:</b> YOLOv8/YOLO11-seg (cepat, mudah deploy); SAM sebagai alat bantu labeling
            </li>
            <li>
              <b>Pretraining:</b> dataset sampah publik (mis. TACO), lalu fine-tune dengan foto bak truk Putri Cempo
            </li>
            <li>
              <b>Data:</b> ≥ 300 foto berlabel untuk MVP <Badge kind="target" />
            </li>
            <li>
              <b>Metrik:</b> <Term k="mIoU">mIoU</Term> per kelas; MAE fraksi komposisi (poin persen) vs pemilahan manual
            </li>
            <li>
              <b>Deploy:</b> server UPTD atau cloud; opsi edge di HP Android/mini-PC dengan antrean offline
            </li>
          </ul>
        </AiCard>
      </div>

      <Card className="mt-5 p-6">
        <Kicker className="text-amber">M5 · Estimasi nilai kalor</Kicker>
        <h3 className="mt-2 font-display text-xl font-semibold">Dari piksel ke MJ/kg</h3>
        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 text-[15px] leading-relaxed">
            <ol className="space-y-2">
              <li>
                <b>1.</b> Fraksi luas piksel <span className="font-mono text-sm">a_i</span> → fraksi massa <span className="font-mono text-sm">w_i = a_i·ρ_i / Σ(a_j·ρ_j)</span>, dengan ρ dikalibrasi dari sampel yang ditimbang per fraksi.
              </li>
              <li>
                <b>2.</b> <span className="font-mono text-sm">LHV_mix = k_lokal × Σ w_i·E_i</span>
              </li>
              <li>
                <b>3.</b> <span className="font-mono text-sm">k_lokal</span> = faktor koreksi hasil regresi terhadap uji lab (awal 1,0). Nilai literatur berasal dari sampah negara lain; sampah organik Indonesia cenderung lebih basah.
              </li>
              <li>
                <b>4.</b> <span className="font-mono text-sm">kkal/kg = MJ/kg × 1000 / 4,184</span>
              </li>
            </ol>
            <Code>
              {`Organik 71% × 4.650   = 3.302
Kertas   7% × 16.750  = 1.173
Plastik 13% × 32.600  = 4.238
Kain     2% × 17.450  =   349
Karet    1% × 23.250  =   233
Kaca     2% × 140     =     3
Logam    2% × 700     =    14
Lain     7% × 0       =     0
─────────────────────────────
LHV_mix ≈ 9.310 kJ/kg ≈ 9,3 MJ/kg
        (≈ 2.225 kkal/kg) sebelum koreksi lokal

// catatan: angka komposisi sumber berjumlah 105%;
// jika dinormalisasi ke 100% → ±8,9 MJ/kg`}
            </Code>
            <div className="flex items-center gap-2">
              <Badge kind="ilustrasi" />
              <span className="text-xs text-ink-soft">
                Komposisi Solo 2023 <Src id="S4" />
              </span>
            </div>
          </div>
          <div>
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead className="bg-paper-2 text-left font-mono text-[11px] text-ink-soft">
                  <tr>
                    <th className="px-4 py-2.5">FRAKSI</th>
                    <th className="px-4 py-2.5">KELAS</th>
                    <th className="px-4 py-2.5 text-right">E_i (kJ/kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {referenceTable.map((r) => (
                    <tr key={r.fraksi}>
                      <td className="px-4 py-2">{r.fraksi}</td>
                      <td className="px-4 py-2 font-mono text-xs">{r.kelas}</td>
                      <td className="num px-4 py-2 text-right font-mono">{nf(r.e)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-ink-soft">
              Nilai default literatur, as-discarded (Tchobanoglous et al., 1993) <Src id="S19" />
            </p>
            <div className="mt-5 rounded-xl border-l-4 border-amber bg-amber/10 p-4 text-[15px] leading-relaxed">
              Campuran rata-rata Solo ada di ±9 MJ/kg dan didominasi organik basah. Muatan tertentu (pasar kering, perkantoran, komersial) bisa jauh lebih tinggi; contoh muatan kaya kalori mencapai ±16,2 MJ/kg. ARUS membuat perbedaan ini <b>terlihat dan bisa dipisahkan</b> di gerbang.
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <AiCard tag="M5 · Kadar air" title="Klasifikasi kasar: Basah / Sedang / Kering">
          <ul className="space-y-1.5 text-sm">
            <li>
              <b>Fitur:</b> densitas curah (kg/m³), % organik basah, curah hujan 24 jam, sumber (pasar/perumahan), jam pengangkutan
            </li>
            <li>
              <b>Model:</b> gradient boosting / logistic regression 3 kelas
            </li>
            <li>
              <b>Label:</b> uji kadar air oven 105 °C pada sampel, bekerja sama dengan lab kampus
            </li>
          </ul>
        </AiCard>
        <div className="rounded-2xl border-2 border-dashed border-coral/50 bg-coral/5 p-6">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-coral">
            <TriangleExclamationPoint size={15} /> JUJUR SOAL BATAS
          </div>
          <p className="mt-3 text-[15px] leading-relaxed">
            Kadar air <b>tidak bisa</b> dibaca dari foto saja. ARUS menggabungkan berat timbang, estimasi volume (densitas), dan fitur lain, menargetkan kelas kasar (bukan persen presisi), lalu mengkalibrasinya dengan uji oven.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-semibold">Tech stack produk</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {techStack.map((t) => (
                  <tr key={t.layer}>
                    <td className="w-40 px-4 py-2.5 align-top font-mono text-xs text-ink-soft">{t.layer}</td>
                    <td className="px-4 py-2.5">{t.choice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold">Kebutuhan non-fungsional</h3>
          <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {nfr.map((t) => (
                  <tr key={t.aspect}>
                    <td className="w-32 px-4 py-2.5 align-top font-mono text-xs text-ink-soft">{t.aspect}</td>
                    <td className="px-4 py-2.5">{t.need}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  )
}

const statusStyle: Record<DataStatus, string> = {
  Tersedia: 'bg-olive/15 text-olive border-olive/40',
  Diajukan: 'bg-amber/15 text-amber border-amber/40',
  Belum: 'bg-ink-soft/10 text-ink-soft border-ink-soft/30',
}

export function DataErd() {
  return (
    <Section id="data" num="11" kicker="Data & ERD" title="Data apa yang dibutuhkan, dan dari mana" lead="Setiap sumber data punya rencana cadangan, sehingga pengembangan tidak berhenti menunggu satu sumber.">
      <ScrollX minWidth={720} className="rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-paper-2 text-left font-mono text-[11px] text-ink-soft">
            <tr>
              <th className="px-4 py-3">DATA</th>
              <th className="px-4 py-3">SUMBER</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">RENCANA JIKA TIDAK ADA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {dataSources.map((d) => (
              <tr key={d.data}>
                <td className="px-4 py-3 font-medium">{d.data}</td>
                <td className="px-4 py-3 text-ink-soft">{d.from}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyle[d.status]}`}>{d.status}</span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{d.fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollX>
      <h3 className="mt-14 mb-4 font-display text-2xl font-semibold">Model data</h3>
      <Erd />
      <Card className="mt-8 grid gap-5 p-6 md:grid-cols-[auto_1fr]">
        <ShieldCheck className="text-teal" size={28} strokeWidth={1.5} />
        <div>
          <div className="font-display text-lg font-semibold">Privasi & etika data</div>
          <ul className="mt-3 grid gap-2.5 text-[15px] sm:grid-cols-2">
            {privacy.map((p) => (
              <li key={p} className="flex gap-2.5">
                <Lock size={15} className="mt-1 shrink-0 text-ink-soft" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </Section>
  )
}

export function Metrik() {
  return (
    <Section id="metrik" num="12" kicker="Metrik & target" title="Bagaimana keberhasilan diukur" lead="Satu north star metric yang mengikat aliran dan mutu, plus KPI per bagian sistem.">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-ink p-7 text-paper md:p-10">
          <Target className="absolute -top-6 -right-6 text-paper opacity-[0.07]" size={180} strokeWidth={1} />
          <div className="font-mono text-[11px] tracking-[0.2em] text-amber">NORTH STAR METRIC</div>
          <p className="mt-4 max-w-3xl font-display text-2xl leading-snug font-semibold md:text-3xl">{northStar}</p>
        </div>
      </Reveal>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.kpi} className="flex flex-col p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] tracking-widest text-teal uppercase">{k.cat}</span>
              <Badge kind="target" />
            </div>
            <div className="mt-3 font-display text-lg font-semibold">{k.kpi}</div>
            <div className="num mt-1 font-mono text-xl font-semibold text-teal">{k.target}</div>
            <div className="mt-auto pt-3 text-xs text-ink-soft">Cara ukur: {k.how}</div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function Roadmap() {
  return (
    <Section id="roadmap" num="13" kicker="Roadmap & TKT" title="Dari bukti konsep ke pilot di TPA" lead={<><Term k="TKT">TKT</Term> 3 saat ini, TKT 4–5 saat hackathon, dan pilot terintegrasi (TKT 6) di masa inkubasi 2027.</>}>
      <TktLadder />
      <h3 className="mt-16 mb-4 font-display text-2xl font-semibold">Rencana kerja</h3>
      <PlanGantt />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <Kicker className="text-teal">Lingkup MVP (P0)</Kicker>
          <ul className="mt-4 space-y-3 text-[15px]">
            {mvp.map((m) => (
              <li key={m} className="flex gap-3">
                <CircleCheck size={18} className="mt-0.5 shrink-0 text-teal" /> {m}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <Kicker>Di luar lingkup</Kicker>
          <ul className="mt-4 space-y-3 text-[15px] text-ink-soft">
            {nonGoals.map((m) => (
              <li key={m} className="flex gap-3">
                <X size={18} className="mt-0.5 shrink-0 text-coral" /> {m}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  )
}

export function Bisnis() {
  return (
    <Section id="bisnis" num="14" kicker="Bisnis & risiko" title="Mudah direplikasi, karena nilainya ada di software" lead="Pilot bersama problem owner, lalu replikasi ke kota percontohan PLTSa lain. Hardware gerbang murah, sedangkan model dan datanya yang bernilai.">
      <BmcGrid />
      <Card className="mt-6 border-teal/40 p-6">
        <Kicker className="text-teal">Argumen hilirisasi</Kicker>
        <p className="mt-2 text-[15px] leading-relaxed">
          DLH sudah menyatakan rencana penjadwalan truk <Src id="S9" />. Ada 12 kota percontohan PLTSa yang menghadapi masalah serupa <Src id="S18" />. Hardware gerbang murah dan nilai utamanya ada di software, sehingga mudah direplikasi.
        </p>
      </Card>
      <h3 className="mt-14 mb-4 font-display text-2xl font-semibold">Risiko & mitigasi</h3>
      <ScrollX minWidth={720} className="rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-paper-2 text-left font-mono text-[11px] text-ink-soft">
            <tr>
              <th className="px-4 py-3">RISIKO</th>
              <th className="px-4 py-3">DAMPAK</th>
              <th className="px-4 py-3">MITIGASI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {risks.map((r) => (
              <tr key={r.risk}>
                <td className="px-4 py-3 align-top font-medium">{r.risk}</td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex items-center gap-1.5 text-coral">
                    <TriangleExclamationPoint size={14} /> {r.impact}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-ink-soft">{r.mitigation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollX>
    </Section>
  )
}

export function Sumber() {
  return (
    <Section id="sumber" num="15" kicker="Sumber" title="Rujukan" lead="Setiap angka faktual di halaman ini ditandai kode sumbernya. Angka berlabel ASUMSI, ILUSTRASI, atau TARGET bukan data resmi DLH.">
      <ol className="grid gap-2 md:grid-cols-2">
        {sources.map((s) => (
          <li key={s.id}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="group flex h-full gap-3 rounded-xl border border-line bg-card p-4 hover:border-teal">
              <span className="font-mono text-xs font-semibold text-teal">{s.id}</span>
              <span className="flex-1 text-sm leading-snug">{s.title}</span>
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-ink-soft group-hover:text-teal" />
            </a>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <div>
            <div className="font-display text-lg font-bold">ARUS</div>
            <div className="text-sm text-ink-soft">{meta.acronymText}</div>
          </div>
        </div>
        <div className="max-w-xl text-sm leading-relaxed text-ink-soft md:text-right">
          {meta.event} · {meta.track}
          <br />
          Problem owner: {meta.problemOwner}. Angka berlabel ASUMSI, ILUSTRASI, atau TARGET bukan data resmi DLH.
        </div>
      </div>
    </footer>
  )
}

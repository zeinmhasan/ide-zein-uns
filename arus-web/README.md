# ARUS · Atur Ritase, Ukur Sampah

Situs satu halaman untuk ide **ARUS**: penjadwalan adaptif dan penilaian mutu muatan berbasis AI di gerbang TPA Putri Cempo, untuk menstabilkan pasokan PLTSa (UNS Innovation Hackathon 2026, Energy Track, Sub-tema B).

Stack: Vite + React + TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Lucide.

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # hasil statis di dist/
npm run preview   # cek hasil build
```

Hasil `dist/` bisa langsung di-deploy ke Vercel, Netlify, atau GitHub Pages (`base: './'` sudah diatur di `vite.config.ts`).

## Mengedit konten

Semua teks dan angka ada di `src/data/`, bukan di komponen:

| File | Isi |
|---|---|
| `meta.ts` | Nama, akronim, tagline, ringkasan |
| `content.ts` | Navigasi, stat tiles, linimasa, pohon masalah, insight, stakeholder, persona, alur satu hari |
| `modules.ts` | M1–M8: fitur + prioritas, user story, acceptance criteria |
| `calorific.ts` | Tabel nilai kalor, fraksi kalkulator, preset, taksonomi kelas sampah |
| `project.ts` | Sumber data, privasi, KPI, TKT, rencana kerja, MVP, tech stack, BMC, risiko, glosarium |
| `sources.ts` | Daftar rujukan S1–S19 (dipakai komponen `<Src id="S7" />`) |

Logika interaktif ada di `src/lib/`:

- `simulation.ts`: engine simulator antrean (time-step 1 menit, seed tetap 42)
- `calorific.ts`: perhitungan LHV, kelas kadar air, dan aturan grade M6
- `forecast.ts`: data forecast sintetis (ILUSTRASI)
- `rng.ts`: PRNG ber-seed dan helper format angka

## Struktur

```
src/
  components/
    layout/Layout.tsx     sidebar TOC, progress bar, glosarium, Section
    ui/primitives.tsx     Badge, Src, Term (tooltip glosarium), Tabs, dll.
    visuals/              HeroScene, QueueSimulator, CalorificCalculator,
                          ArchitectureMap, DashboardMock, ERD, dll.
  sections/               Intro.tsx, Solution.tsx, Deep.tsx
  data/                   konten (lihat tabel di atas)
  lib/                    engine simulasi & kalkulator
```

## Catatan angka

- Angka berlabel **ASUMSI**, **ILUSTRASI**, **SIMULASI**, atau **TARGET** bukan data resmi DLH.
- Preset "Rata-rata Solo 2023" memakai komposisi sumber [S4] yang totalnya 105%. Kalkulator menormalisasi ke 100% (8,9 MJ/kg) dan juga menampilkan nilai tanpa normalisasi (9,3 MJ/kg, seperti contoh perhitungan).
- Foto berita tidak dipakai. Foto lapangan bisa ditaruh di `public/photos/`.

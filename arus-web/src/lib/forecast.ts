import { mulberry32, normal } from './rng'

// Data sintetis [ILUSTRASI]: angka fiktif untuk menjelaskan bentuk keluaran M1.
export const kelurahan = [
  { name: 'Mangkubumen', base: 14 },
  { name: 'Banjarsari', base: 24 },
  { name: 'Jebres', base: 21 },
  { name: 'Laweyan', base: 17 },
  { name: 'Pasar Kliwon', base: 11 },
]

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']

export type ForecastPoint = {
  label: string
  actual?: number
  p50?: number
  band?: [number, number]
  holiday?: boolean
}

export function forecastSeries(name: string): ForecastPoint[] {
  const k = kelurahan.find((x) => x.name === name) ?? kelurahan[0]
  const rng = mulberry32(k.base * 97 + name.length)
  const start = new Date(2026, 9, 12) // Senin 12 Okt 2026
  const holidayIdx = 31 // "hari libur" fiktif di jendela forecast
  const out: ForecastPoint[] = []
  for (let i = 0; i < 35; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dow = d.getDay()
    const dayEff = dow === 1 ? 1.08 : dow === 0 ? 0.9 : 1
    const hol = i === holidayIdx || i === 18 ? 1.25 : 1
    const expected = k.base * dayEff * hol
    const label = `${DAYS[dow]} ${d.getDate()} ${MONTHS[d.getMonth()]}`
    if (i < 28) {
      const actual = expected * (1 + normal(rng) * 0.06)
      out.push({ label, actual: +actual.toFixed(1), holiday: hol > 1 })
    } else {
      const h = i - 27
      const spread = 0.08 + h * 0.012
      const p50 = expected
      out.push({ label, p50: +p50.toFixed(1), band: [+(p50 * (1 - spread)).toFixed(1), +(p50 * (1 + spread)).toFixed(1)], holiday: hol > 1 })
    }
  }
  // sambungkan garis forecast dengan titik aktual terakhir
  const last = out[27]
  last.p50 = last.actual
  last.band = [last.actual!, last.actual!]
  return out
}

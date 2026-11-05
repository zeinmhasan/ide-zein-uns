import { fractions, type Composition } from '../data/calorific'

export type Grade = 'A' | 'B' | 'C-org' | 'C-res'
export type WaterClass = 'Basah' | 'Sedang' | 'Kering'

export const gradeInfo: Record<Grade, { label: string; dest: string; tone: 'amber' | 'teal' | 'olive' | 'slate' }> = {
  A: { label: 'Grade A', dest: 'PLTSa / pra-olah RDF', tone: 'amber' },
  B: { label: 'Grade B', dest: 'Pra-olah (pengeringan/biodrying) lalu PLTSa', tone: 'teal' },
  'C-org': { label: 'Grade C-org', dest: 'Olah organik (kompos/maggot)', tone: 'olive' },
  'C-res': { label: 'Grade C-res', dest: 'Zona timbun', tone: 'slate' },
}

export function totalOf(c: Composition) {
  return Object.values(c).reduce((s, v) => s + v, 0)
}

export function normalize(c: Composition): Composition {
  const tot = totalOf(c)
  if (tot <= 0) return c
  const out = { ...c }
  for (const k of Object.keys(out) as (keyof Composition)[]) out[k] = (c[k] / tot) * 100
  return out
}

/** LHV campuran (kJ/kg) dari komposisi yang sudah dinormalisasi ke 100%. */
export function lhv(c: Composition) {
  const n = normalize(c)
  const contrib = fractions.map((f) => ({ ...f, share: n[f.key], kj: (n[f.key] / 100) * f.e }))
  const kj = contrib.reduce((s, x) => s + x.kj, 0)
  return { kj, mj: kj / 1000, kcal: kj / 4.184, contrib, normalized: n }
}

/** Kelas kadar air kasar dari % organik basah [ILUSTRASI]. */
export function waterClass(orgB: number): WaterClass {
  if (orgB >= 50) return 'Basah'
  if (orgB >= 30) return 'Sedang'
  return 'Kering'
}

/** Aturan grade M6 (ambang [ILUSTRASI], wajib dikonfirmasi ke operator PLTSa). */
export function gradeOf(mj: number, orgB: number, inertRes: number, water: WaterClass): { grade: Grade; reason: string; step: number } {
  if (orgB >= 60) return { grade: 'C-org', reason: `Organik basah ${orgB.toFixed(0)}% (≥ 60%) → arahkan ke olah organik.`, step: 1 }
  if (mj < 7 && inertRes >= 40)
    return { grade: 'C-res', reason: `Kalor ${mj.toFixed(1)} MJ/kg (< 7) dan didominasi inert/residu ${inertRes.toFixed(0)}% → zona timbun.`, step: 2 }
  if (mj >= 12 && orgB < 40 && water !== 'Basah')
    return { grade: 'A', reason: `Kalor ${mj.toFixed(1)} MJ/kg (≥ 12), organik basah ${orgB.toFixed(0)}% (< 40%), kadar air ${water.toLowerCase()} → kandidat PLTSa.`, step: 3 }
  return { grade: 'B', reason: `Kalor ${mj.toFixed(1)} MJ/kg dengan organik basah ${orgB.toFixed(0)}% → perlu pra-olah sebelum ke PLTSa.`, step: 4 }
}

export function assess(c: Composition) {
  const r = lhv(c)
  const orgB = r.normalized.orgB
  const inertRes = r.normalized.inert + r.normalized.residu
  const water = waterClass(orgB)
  return { ...r, water, ...gradeOf(r.mj, orgB, inertRes, water) }
}

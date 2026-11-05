export type Rng = () => number

/** PRNG ber-seed (mulberry32) supaya hasil simulasi bisa diulang. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function normal(rng: Rng): number {
  let u = 0
  let v = 0
  while (u === 0) u = rng()
  while (v === 0) v = rng()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

export function lognormal(rng: Rng, mean: number, cv: number): number {
  const s2 = Math.log(1 + cv * cv)
  const mu = Math.log(mean) - s2 / 2
  return Math.exp(mu + Math.sqrt(s2) * normal(rng))
}

export function fmtClock(min: number): string {
  const m = Math.max(0, Math.round(min))
  const h = Math.floor(m / 60) % 24
  const mm = m % 60
  return `${String(h).padStart(2, '0')}.${String(mm).padStart(2, '0')}`
}

export const nf = (v: number, d = 0) =>
  v.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d })

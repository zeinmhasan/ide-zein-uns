import { lognormal, mulberry32, normal } from './rng'

export type ArrivalMode = 'bergelombang' | 'slot'
export type Disruption = 'none' | 'alat' | 'zona'

export interface SimParams {
  ritase: number
  alat: number
  prod: number // truk/jam per alat [ASUMSI]
  disruption: Disruption
  mode: ArrivalMode
  seed?: number
}

export interface SimResult {
  series: { t: number; q: number }[]
  avgWait: number
  maxWait: number
  maxQueue: number
  queueKm: number
  fuelL: number
  hoursLost: number
  served: number
  deferred: number
  unservedAtClose: number
  endT: number
}

export const SIM = {
  start: 300, // 05.00
  end: 1260, // 21.00
  hardEnd: 1440, // 24.00
  disruptAt: 615, // 10.15
  replanLead: 30, // ritase yang slotnya < 30 menit setelah gangguan sudah di jalan
  slotMin: 15,
  slotFrom: 360, // 06.00
  planBuffer: 0.9, // penjadwal hanya mengisi 90% kapasitas sebagai buffer
  mPerTruck: 15, // [ASUMSI]
  idleLph: 2.0, // [ASUMSI]
  waveSd: 35,
  waveCenters: [450, 690], // 07.30 & 11.30
  waveShare: 0.6,
}

/** Kapasitas bongkar aktual pada menit t. */
export function capacityAt(t: number, p: SimParams) {
  let servers = p.alat
  let factor = 1
  if (t >= SIM.disruptAt) {
    if (p.disruption === 'alat') {
      if (p.alat > 1) servers = p.alat - 1
      else factor = 0.5 // hanya tersisa loader cadangan [ASUMSI]
    }
    if (p.disruption === 'zona') factor = 0.7
  }
  return { servers, factor }
}

function arrivalsWave(p: SimParams, rng: () => number) {
  const n1 = Math.round(p.ritase * SIM.waveShare)
  const arr: number[] = []
  for (let i = 0; i < p.ritase; i++) {
    const c = i < n1 ? SIM.waveCenters[0] : SIM.waveCenters[1]
    const t = c + normal(rng) * SIM.waveSd
    arr.push(Math.min(SIM.end, Math.max(SIM.start, t)))
  }
  return { arr: arr.sort((a, b) => a - b), deferred: 0 }
}

function arrivalsSlot(p: SimParams, rng: () => number) {
  const arr: number[] = []
  let cum = 0
  let assigned = 0
  for (let s = SIM.slotFrom; s < SIM.end && assigned < p.ritase; s += SIM.slotMin) {
    // Sebelum gangguan diketahui (+ lead time), jadwal memakai kapasitas rencana awal.
    const known = s >= SIM.disruptAt + SIM.replanLead
    const { servers, factor } = known ? capacityAt(s, p) : { servers: p.alat, factor: 1 }
    cum += servers * factor * p.prod * (SIM.slotMin / 60) * SIM.planBuffer
    while (assigned < Math.floor(cum) && assigned < p.ritase) {
      arr.push(s + rng() * SIM.slotMin)
      assigned++
    }
  }
  return { arr: arr.sort((a, b) => a - b), deferred: p.ritase - assigned }
}

export function simulate(p: SimParams): SimResult {
  const rng = mulberry32(p.seed ?? 42)
  const svcRng = mulberry32((p.seed ?? 42) + 7)
  const { arr, deferred } = p.mode === 'slot' ? arrivalsSlot(p, rng) : arrivalsWave(p, rng)

  const busy: number[] = Array(p.alat).fill(SIM.start)
  const waiting: number[] = []
  const waits: number[] = []
  const series: { t: number; q: number }[] = []
  let ai = 0
  let maxQueue = 0
  let lastT = SIM.end

  for (let t = SIM.start; t <= SIM.hardEnd; t++) {
    while (ai < arr.length && arr[ai] < t + 1) waiting.push(arr[ai++])
    const { servers, factor } = capacityAt(t, p)
    const mean = 60 / (p.prod * factor)
    for (let i = 0; i < servers; i++) {
      while (waiting.length) {
        const start = Math.max(busy[i], waiting[0], t)
        if (start >= t + 1) break
        const a = waiting.shift()!
        waits.push(start - a)
        busy[i] = start + lognormal(svcRng, mean, 0.3)
      }
    }
    const q = waiting.length
    if (q > maxQueue) maxQueue = q
    series.push({ t, q })
    if (t >= SIM.end && ai >= arr.length && q === 0) {
      lastT = t
      break
    }
    lastT = t
  }
  const unservedAtClose = waiting.length
  for (const a of waiting) waits.push(SIM.hardEnd - a)

  const sum = waits.reduce((s, w) => s + w, 0)
  const n = Math.max(1, waits.length)
  return {
    series,
    avgWait: sum / n,
    maxWait: waits.length ? Math.max(...waits) : 0,
    maxQueue,
    queueKm: (maxQueue * SIM.mPerTruck) / 1000,
    fuelL: (sum / 60) * SIM.idleLph,
    hoursLost: sum / 60,
    served: waits.length - unservedAtClose,
    deferred,
    unservedAtClose,
    endT: lastT,
  }
}

export function queueAt(r: SimResult, t: number) {
  const i = Math.round(t) - SIM.start
  if (i < 0) return 0
  if (i >= r.series.length) return 0
  return r.series[i].q
}

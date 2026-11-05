// Nilai kalor referensi per fraksi (as-discarded, kJ/kg), Tchobanoglous et al. 1993 [S19]
export const referenceTable = [
  { fraksi: 'Sisa makanan', kelas: 'ORG_B', e: 4650 },
  { fraksi: 'Sampah halaman/daun', kelas: 'ORG_K', e: 6500 },
  { fraksi: 'Kayu', kelas: 'ORG_K (kayu)', e: 18600 },
  { fraksi: 'Kertas', kelas: 'KRT', e: 16750 },
  { fraksi: 'Kardus', kelas: 'KRT', e: 16300 },
  { fraksi: 'Plastik', kelas: 'PLS_L / PLS_K', e: 32600 },
  { fraksi: 'Tekstil', kelas: 'KAIN', e: 17450 },
  { fraksi: 'Karet', kelas: 'KRT_KLT', e: 23250 },
  { fraksi: 'Kaca', kelas: 'INERT', e: 140 },
  { fraksi: 'Kaleng/logam', kelas: 'INERT', e: 700 },
  { fraksi: 'Residu/lain-lain', kelas: 'RES', e: 0 },
]

export type FractionKey = 'orgB' | 'orgK' | 'kayu' | 'kertas' | 'plastik' | 'tekstil' | 'karet' | 'inert' | 'residu'

export const fractions: { key: FractionKey; label: string; e: number; color: string }[] = [
  { key: 'orgB', label: 'Organik basah', e: 4650, color: '#6B8E23' },
  { key: 'orgK', label: 'Organik kering/daun', e: 6500, color: '#A68A3D' },
  { key: 'kayu', label: 'Kayu', e: 18600, color: '#8B5A2B' },
  { key: 'kertas', label: 'Kertas & kardus', e: 16500, color: '#C9A66B' },
  { key: 'plastik', label: 'Plastik', e: 32600, color: '#3B82C4' },
  { key: 'tekstil', label: 'Tekstil', e: 17450, color: '#C2577F' },
  { key: 'karet', label: 'Karet', e: 23250, color: '#5C5C66' },
  { key: 'inert', label: 'Kaca & logam', e: 420, color: '#8FA3B0' },
  { key: 'residu', label: 'Residu', e: 0, color: '#A39684' },
]

export type Composition = Record<FractionKey, number>

const zero: Composition = { orgB: 0, orgK: 0, kayu: 0, kertas: 0, plastik: 0, tekstil: 0, karet: 0, inert: 0, residu: 0 }

export const presets: { id: string; label: string; illustrative: boolean; comp: Composition; note?: string }[] = [
  {
    id: 'solo',
    label: 'Rata-rata Solo 2023',
    illustrative: false,
    comp: { ...zero, orgB: 71, kertas: 7, plastik: 13, tekstil: 2, karet: 1, inert: 4, residu: 7 },
    note: 'Komposisi TPA Putri Cempo 2023 [S4]; seluruh organik dianggap organik basah.',
  },
  { id: 'pasar', label: 'Muatan pasar basah', illustrative: true, comp: { ...zero, orgB: 80, plastik: 10, kertas: 5, residu: 5 } },
  { id: 'kantor', label: 'Muatan perkantoran/komersial', illustrative: true, comp: { ...zero, orgB: 25, kertas: 35, plastik: 30, tekstil: 3, residu: 7 } },
  { id: 'kaya', label: 'Muatan kaya kalori', illustrative: true, comp: { ...zero, orgB: 30, plastik: 30, kertas: 25, tekstil: 5, residu: 10 } },
]

// Taksonomi label untuk segmentasi (M4)
export const wasteClasses = [
  { code: 'ORG_B', name: 'Organik basah', example: 'sisa makanan, sayur, buah', color: '#6B8E23', raw: '#5a4a32' },
  { code: 'ORG_K', name: 'Organik kering', example: 'daun kering, ranting, kayu', color: '#A68A3D', raw: '#8a7550' },
  { code: 'PLS_L', name: 'Plastik lunak', example: 'kresek, sachet, kemasan', color: '#3B82C4', raw: '#b9bcc0' },
  { code: 'PLS_K', name: 'Plastik keras', example: 'botol, ember, wadah', color: '#7A5CC2', raw: '#9aa6ad' },
  { code: 'KRT', name: 'Kertas & kardus', example: 'kardus, koran, kertas', color: '#C9A66B', raw: '#b59a72' },
  { code: 'KAIN', name: 'Tekstil', example: 'kain, pakaian', color: '#C2577F', raw: '#7d6a6e' },
  { code: 'KRT_KLT', name: 'Karet & kulit', example: 'sandal, ban kecil', color: '#5C5C66', raw: '#3d3a38' },
  { code: 'INERT', name: 'Kaca, logam, tanah, batu', example: 'botol kaca, kaleng, puing', color: '#8FA3B0', raw: '#7f7b74' },
  { code: 'RES', name: 'Residu', example: 'campuran halus, popok', color: '#A39684', raw: '#6e6458' },
]

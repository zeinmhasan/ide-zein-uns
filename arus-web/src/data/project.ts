// Data, metrik, roadmap, bisnis, risiko, glosarium.

export type DataStatus = 'Tersedia' | 'Diajukan' | 'Belum'

export const dataSources: { data: string; from: string; status: DataStatus; fallback: string }[] = [
  { data: 'Log timbang per truk (waktu, berat, asal)', from: 'UPTD TPA / DLH', status: 'Diajukan', fallback: 'Pencatatan manual 1–2 minggu di gerbang' },
  { data: 'Daftar armada & kelurahan', from: 'DLH', status: 'Diajukan', fallback: 'Wawancara koordinator kelurahan' },
  { data: 'Jumlah & status alat berat', from: 'UPTD TPA', status: 'Diajukan', fallback: 'Asumsi + wawancara operator' },
  { data: 'Foto bak truk', from: 'Diambil di gerbang (izin DLH)', status: 'Belum', fallback: 'Foto di depo/TPS3R kelurahan' },
  { data: 'Uji kalor & kadar air sampel', from: 'Lab kampus (bomb calorimeter, oven)', status: 'Belum', fallback: 'Sampel kecil (≥ 20) untuk kalibrasi' },
  { data: 'Cuaca', from: 'Open-Meteo / BMKG (publik)', status: 'Tersedia', fallback: '—' },
  { data: 'Kalender libur & pasaran', from: 'Publik', status: 'Tersedia', fallback: '—' },
  { data: 'Batas kelurahan (GIS)', from: 'Geoportal / OSM', status: 'Tersedia', fallback: '—' },
  { data: 'Spesifikasi bahan baku PLTSa', from: 'Operator PLTSa', status: 'Diajukan', fallback: 'Ambang ilustrasi' },
]

export const privacy = [
  'Tidak menyimpan wajah. Kamera diarahkan ke bak, bukan kabin.',
  'Nomor WA sopir hanya untuk notifikasi, akses dibatasi peran.',
  'Plat nomor dipetakan ke ID truk internal.',
  'Data operasional milik DLH dan hanya dipakai sesuai izin.',
]

export const northStar =
  'Ton muatan layak bakar (grade A) yang teridentifikasi dan diarahkan ke PLTSa per hari, dengan waktu tunggu truk rata-rata di bawah ambang yang disepakati DLH.'

export const kpis = [
  { cat: 'Aliran', kpi: 'Waktu tunggu rata-rata', how: 'Simulasi skenario Feb 2026, lalu data nyata', target: 'turun ≥ 40%' },
  { cat: 'Aliran', kpi: 'Panjang antrean maksimum', how: 'Simulasi', target: 'turun ≥ 50%' },
  { cat: 'Energi', kpi: 'BBM idle terbuang (L/hari)', how: 'Jam tunggu × konsumsi idle', target: 'turun sebanding waktu tunggu' },
  { cat: 'Forecast', kpi: 'MAPE agregat kota', how: 'Backtest rolling-origin', target: '≤ 15%' },
  { cat: 'Visi', kpi: 'MAE komposisi (poin %)', how: 'vs pemilahan manual', target: '≤ 10 poin' },
  { cat: 'Mutu', kpi: 'Error estimasi kalor', how: 'vs uji lab', target: '≤ 20%' },
  { cat: 'Mutu', kpi: 'Presisi grade A', how: 'vs penilaian lab/operator', target: '≥ 80%' },
  { cat: 'Adopsi', kpi: '% sopir merespons bot', how: 'Log bot', target: '≥ 70% saat uji coba' },
  { cat: 'Operasi', kpi: 'Waktu proses gerbang per truk', how: 'Log', target: 'tidak bertambah dibanding manual' },
]

export const tkt = [
  { level: 3, title: 'Proof of concept analitis & eksperimental', proof: 'Simulasi antrean mereproduksi skenario Feb 2026; model segmentasi pada dataset publik; kalkulator kalor.' },
  { level: 4, title: 'Validasi komponen di lab', proof: 'Model fine-tuned pada foto muatan asli; kalibrasi kalor dengan sampel lab.' },
  { level: 5, title: 'Validasi komponen di lingkungan relevan', proof: 'Uji coba gerbang (foto + timbang) dan bot ke sebagian sopir selama beberapa hari.' },
  { level: 6, title: 'Demo sistem di lingkungan relevan', proof: 'Pilot terintegrasi di TPA (masa inkubasi 2027).' },
]

export const plan: { section: string; task: string; start: string; end: string; kind?: 'milestone' | 'crit' }[] = [
  { section: 'Riset', task: 'Wawancara sopir & operator, foto sampel awal', start: '2026-11-09', end: '2026-11-19' },
  { section: 'Riset', task: 'Sesi bersama problem owner (DLH)', start: '2026-11-20', end: '2026-11-20', kind: 'milestone' },
  { section: 'Build MVP', task: 'M2 simulator + optimizer', start: '2026-11-21', end: '2026-12-01' },
  { section: 'Build MVP', task: 'M4 labeling + fine-tune', start: '2026-11-21', end: '2026-12-02' },
  { section: 'Build MVP', task: 'M3 bot + M7 dashboard', start: '2026-11-23', end: '2026-12-02' },
  { section: 'Build MVP', task: 'Uji lab kalor sampel', start: '2026-11-25', end: '2026-12-01' },
  { section: 'Build MVP', task: 'Integrasi end-to-end', start: '2026-12-01', end: '2026-12-03' },
  { section: 'Demo', task: 'Hackathon', start: '2026-12-04', end: '2026-12-06', kind: 'crit' },
]

export const mvp = [
  'Simulator + optimizer: dengan/tanpa ARUS, termasuk tombol "alat berat rusak"',
  'Bot WhatsApp/Telegram: kirim jadwal & notifikasi perubahan',
  'Aplikasi gerbang: foto + berat → penilaian mutu',
  'Model segmentasi fine-tuned + estimasi kalor + grade',
  'Dashboard: ringkasan, Gantt slot, status alat, rapor PLTSa',
  'Laporan validasi: akurasi komposisi pada sampel nyata, hasil kalibrasi lab',
]

export const nonGoals = [
  'Tidak membangun mesin pemilah fisik, conveyor, atau insinerator',
  'Tidak mengganti sistem PLTSa atau mengatur operasi pembangkit',
  'Tidak mendeteksi metana dari satelit (resolusi satelit gratis jauh lebih besar dari luas TPA)',
  'Tidak memasang GPS di truk (cukup lokasi HP sopir, opsional)',
  'Tidak menangani retribusi/pembayaran pada MVP',
]

export const techStack = [
  { layer: 'Backend API', choice: 'Python + FastAPI' },
  { layer: 'Database', choice: 'PostgreSQL + PostGIS; Redis untuk antrean tugas' },
  { layer: 'Optimasi & simulasi', choice: 'Google OR-Tools (CP-SAT), SimPy' },
  { layer: 'Forecast', choice: 'LightGBM, statsmodels/Prophet (baseline)' },
  { layer: 'Computer vision', choice: 'PyTorch, Ultralytics YOLO-seg; labeling CVAT / Label Studio' },
  { layer: 'Messaging', choice: 'WhatsApp Business Cloud API (prototipe: Telegram Bot API)' },
  { layer: 'Dashboard', choice: 'Next.js/React + Tailwind + MapLibre + Recharts' },
  { layer: 'Aplikasi gerbang', choice: 'PWA (kamera HP + input berat), mode offline (IndexedDB)' },
  { layer: 'Deploy', choice: 'Docker; VPS/cloud kampus' },
]

export const nfr = [
  { aspect: 'Kecepatan', need: 'Penilaian mutu < 5 detik per truk; re-scheduling < 30 detik' },
  { aspect: 'Ketersediaan', need: 'Aplikasi gerbang tetap mencatat saat offline (sinkron belakangan)' },
  { aspect: 'Lingkungan', need: 'Kamera tahan debu/hujan; prosedur pembersihan lensa; mode cahaya rendah' },
  { aspect: 'Kemudahan', need: 'Operator maksimal 1 tap per truk. Sopir cukup WhatsApp.' },
  { aspect: 'Skalabilitas', need: '≥ 300 ritase/hari; bisa direplikasi ke TPA kota lain' },
  { aspect: 'Keamanan', need: 'Autentikasi per peran, HTTPS, log audit' },
  { aspect: 'Biaya', need: 'Hardware MVP murah (HP Android/kamera IP + mini-PC)' },
  { aspect: 'Keterjelasan', need: 'Setiap grade disertai alasan (komposisi dominan, estimasi kalor)' },
]

export const bmc = {
  partners: ['DLH Surakarta', 'UNS (lab & inkubator UNS Innovation Hub)', 'Operator PLTSa'],
  activities: ['Pengembangan model', 'Integrasi sistem', 'Labeling data', 'Dukungan lapangan'],
  resources: ['Model AI & data berlabel', 'Tim engineering', 'Kemitraan lab uji'],
  value: ['Antrean turun', 'Jadwal adaptif', 'Data mutu bahan bakar', 'Bukti kuantitatif untuk anggaran'],
  relationships: ['Pendampingan implementasi', 'Pelatihan operator', 'Dukungan teknis'],
  channels: ['Pilot via problem owner (DLH Surakarta)', 'Replikasi ke kota percontohan PLTSa lain'],
  segments: ['DLH kota/kabupaten pengelola TPA (B2G)', 'Operator PLTSa/PSEL (B2B)'],
  costs: ['Server/cloud', 'Hardware gerbang', 'Labeling', 'Uji lab', 'SDM'],
  revenue: ['Langganan SaaS per gerbang/TPA', 'Paket implementasi (hardware + setup)', 'Layanan data mutu untuk operator PLTSa'],
}

export const risks = [
  { risk: 'Data timbang DLH tidak tersedia/tidak digital', impact: 'Forecast lemah', mitigation: 'Catat manual 1–2 minggu; data sintetis terkalibrasi; nilai sistem terlihat saat data mulai terkumpul' },
  { risk: 'Izin memotret di TPA tidak keluar', impact: 'Tidak ada foto asli', mitigation: 'Ambil foto di depo kelurahan/TPS3R' },
  { risk: 'Kamera kotor, gelap, hujan', impact: 'Akurasi turun', mitigation: 'Augmentasi data, quality check foto, SOP pembersihan, cadangan foto HP' },
  { risk: 'Sopir tidak mau ikut jadwal', impact: 'Efek berkurang', mitigation: 'Libatkan koordinator kelurahan; tunjukkan waktu tunggu yang hilang; mulai dari kelurahan sukarela' },
  { risk: 'Estimasi kalor meleset', impact: 'Grade salah', mitigation: 'Kalibrasi lab, tampilkan interval, override operator dijadikan data latih' },
  { risk: 'Ambang grade tidak sesuai mesin PLTSa', impact: 'Rekomendasi kurang relevan', mitigation: 'Ambang bisa dikonfigurasi; dikonfirmasi ke operator PLTSa' },
  { risk: 'Tidak ada lahan untuk memisahkan aliran', impact: 'Routing hanya rekomendasi', mitigation: 'Fase 1 fokus ke data & penjadwalan; routing fisik di fase pilot' },
]

export const energyAngles = [
  { title: 'Mutu pasokan PLTSa', text: 'Muatan layak bakar teridentifikasi dan diarahkan, sehingga pasokan bahan bakar pembangkit lebih stabil.' },
  { title: 'BBM truk tidak terbuang', text: 'Waktu idle di antrean turun, begitu juga solar yang terbakar tanpa hasil.' },
  { title: 'Metana berkurang', text: 'Organik basah dialihkan ke olah organik, bukan ke timbunan yang menghasilkan metana.' },
]

export const glossary: { term: string; def: string }[] = [
  { term: 'TPA', def: 'Tempat Pemrosesan Akhir sampah.' },
  { term: 'PLTSa', def: 'Pembangkit Listrik Tenaga Sampah. Disebut juga PSEL (Pengolahan Sampah menjadi Energi Listrik).' },
  { term: 'RDF', def: 'Refuse-Derived Fuel: bahan bakar dari sampah yang sudah dipilah dan diolah.' },
  { term: 'Nilai kalor', def: 'Energi yang dilepas saat bahan dibakar (MJ/kg atau kkal/kg). LHV = lower heating value.' },
  { term: 'Ritase', def: 'Satu perjalanan pulang-pergi truk mengangkut sampah.' },
  { term: 'Kloter', def: 'Gelombang keberangkatan truk.' },
  { term: 'Open dumping', def: 'Sampah ditimbun terbuka tanpa pengolahan atau penutupan.' },
  { term: 'TPS3R', def: 'Tempat Pengolahan Sampah Reduce-Reuse-Recycle.' },
  { term: 'Digital twin', def: 'Model simulasi yang meniru sistem nyata untuk menguji skenario.' },
  { term: 'CP-SAT', def: 'Solver optimasi kendala dari Google OR-Tools.' },
  { term: 'Segmentasi', def: 'Model computer vision yang memberi label per piksel/objek pada gambar.' },
  { term: 'mIoU', def: 'mean Intersection over Union, metrik akurasi segmentasi.' },
  { term: 'MAPE', def: 'Mean Absolute Percentage Error, metrik error forecast.' },
  { term: 'TKT', def: 'Tingkat Kesiapterapan Teknologi (skala 1–9).' },
  { term: 'Bomb calorimeter', def: 'Alat lab pengukur nilai kalor.' },
  { term: 'Slot', def: 'Jendela waktu kedatangan 15 menit di gerbang TPA yang dialokasikan untuk satu ritase.' },
  { term: 'Grade', def: 'Kelas mutu muatan: A (layak PLTSa), B (perlu pra-olah), C-org (olah organik), C-res (timbun).' },
  { term: 'P10/P50/P90', def: 'Kuantil prediksi. P50 = nilai tengah; 80% kemungkinan nilai aktual berada di antara P10 dan P90.' },
  { term: 'Choke point', def: 'Titik sempit yang dilalui seluruh aliran, sehingga ideal untuk mengukur dan mengatur.' },
]

export const glossaryMap = Object.fromEntries(glossary.map((g) => [g.term, g.def])) as Record<string, string>

export type Priority = 'P0' | 'P1' | 'P2'
export type Module = {
  id: string
  name: string
  tag: string
  short: string
  brain: 'aliran' | 'mutu' | 'data'
  goal: string
  summary: string
  features: { id: string; text: string; priority: Priority }[]
  story?: string
  acceptance?: string[]
  star?: boolean
}

export const modules: Module[] = [
  {
    id: 'M1',
    name: 'Forecast Volume Sampah per Kelurahan',
    short: 'Forecast',
    tag: 'M1 · FORECAST',
    brain: 'aliran',
    goal: 'Memprediksi tonase dan jumlah ritase tiap kelurahan untuk besok dan 7 hari ke depan.',
    summary: 'Memprediksi tonase dan ritase tiap kelurahan (P10/P50/P90) untuk besok dan 7 hari ke depan.',
    features: [
      { id: 'M1.1', text: 'Prediksi tonase harian per kelurahan dengan interval (P10/P50/P90)', priority: 'P0' },
      { id: 'M1.2', text: 'Prediksi jumlah ritase per kelurahan (tonase ÷ kapasitas armada)', priority: 'P0' },
      { id: 'M1.3', text: 'Peringatan "hari padat" bila total P90 > kapasitas bongkar', priority: 'P1' },
      { id: 'M1.4', text: 'Penjelasan faktor (feature importance), misalnya "naik karena H+1 Lebaran & hujan"', priority: 'P1' },
      { id: 'M1.5', text: 'Retraining mingguan otomatis dari data timbang', priority: 'P2' },
    ],
    story: 'Sebagai Kepala UPTD, saya ingin tahu besok akan ada berapa ton sampah dari tiap kelurahan, supaya saya bisa menyiapkan alat berat dan zona.',
    acceptance: [
      'Model menghasilkan prediksi untuk semua kelurahan yang ada di data latih',
      'Backtest menunjukkan MAPE agregat kota ≤ 15%',
      'Tampil di dashboard sebagai peta choropleth + tabel',
    ],
  },
  {
    id: 'M2',
    name: 'Digital Twin Gerbang & Penjadwal Slot Sadar Kapasitas',
    short: 'Penjadwal slot',
    tag: 'M2 · OPTIMASI',
    brain: 'aliran',
    star: true,
    goal: 'Menyusun jadwal kedatangan setiap ritase agar jumlah truk per slot tidak melebihi kapasitas bongkar, dan menyusun ulang jadwal saat kapasitas berubah.',
    summary: 'Inti deeptech: digital twin antrean + optimasi CP-SAT yang menjadwalkan slot sesuai kapasitas bongkar real-time.',
    features: [
      { id: 'M2.1', text: 'Model kapasitas bongkar per slot = f(alat berat aktif, produktivitas, zona aktif, cuaca)', priority: 'P0' },
      { id: 'M2.2', text: 'Optimasi slot (CP-SAT/MILP): minimalkan total waktu tunggu dan deviasi dari jam yang diinginkan', priority: 'P0' },
      { id: 'M2.3', text: 'Prioritas truk multi-ritase (sesuai kebijakan DLH)', priority: 'P0' },
      { id: 'M2.4', text: 'Re-scheduling otomatis saat status alat/zona berubah (target < 30 detik)', priority: 'P0' },
      { id: 'M2.5', text: 'Simulator what-if (SimPy): "1 ekskavator rusak", "zona utara tertutup"', priority: 'P0' },
      { id: 'M2.6', text: 'Rekomendasi kebutuhan alat berat ("tambah 1 unit menurunkan antrean X%")', priority: 'P1' },
      { id: 'M2.7', text: 'Buffer area tunggu di luar permukiman (titik tunggu alternatif)', priority: 'P2' },
    ],
    story: 'Sebagai Kepala UPTD, ketika satu ekskavator rusak jam 10.15, saya ingin cukup menekan satu tombol dan semua sopir yang belum berangkat otomatis mendapat jadwal baru.',
    acceptance: [
      'Mereproduksi skenario 9 Feb 2026 di simulator (kedatangan bergelombang + kapasitas turun) dan menunjukkan antrean terbentuk',
      'Dengan penjadwal, waktu tunggu rata-rata pada skenario yang sama turun ≥ 40% (simulasi)',
      'Re-scheduling selesai < 30 detik untuk ≤ 300 ritase/hari',
    ],
  },
  {
    id: 'M3',
    name: 'Bot WhatsApp Sopir',
    short: 'Bot WhatsApp',
    tag: 'M3 · PESAN',
    brain: 'aliran',
    goal: 'Mengirim slot dan pembaruan jadwal ke sopir tanpa aplikasi baru.',
    summary: 'Jadwal H-1, tombol balas cepat, dan notifikasi perubahan jadwal lewat WhatsApp.',
    features: [
      { id: 'M3.1', text: 'Kirim jadwal H-1 (jam slot + saran jam berangkat)', priority: 'P0' },
      { id: 'M3.2', text: 'Tombol balas cepat: "Berangkat", "Tunda", "Kendala"', priority: 'P0' },
      { id: 'M3.3', text: 'Notifikasi perubahan jadwal saat re-scheduling', priority: 'P0' },
      { id: 'M3.4', text: 'QR check-in truk dikirim di chat (dipindai di gerbang)', priority: 'P1' },
      { id: 'M3.5', text: 'Check-in berbasis lokasi HP (geofence 1 km dari TPA)', priority: 'P2' },
      { id: 'M3.6', text: 'Ringkasan harian ke koordinator kelurahan', priority: 'P1' },
    ],
  },
  {
    id: 'M4',
    name: 'Kamera Gerbang & Segmentasi Komposisi',
    short: 'Kamera & segmentasi',
    tag: 'M4 · VISI',
    brain: 'mutu',
    goal: 'Memperkirakan komposisi muatan dari foto bak truk.',
    summary: 'Foto bak truk di jembatan timbang disegmentasi per fraksi sampah, lalu dikonversi ke fraksi massa.',
    features: [
      { id: 'M4.1', text: 'Foto bak (top/oblique) otomatis saat truk di timbangan; cadangan: HP operator', priority: 'P0' },
      { id: 'M4.2', text: 'Segmentasi instance/semantic per fraksi sampah', priority: 'P0' },
      { id: 'M4.3', text: 'Konversi luas piksel → fraksi massa dengan faktor densitas per kelas (dikalibrasi)', priority: 'P0' },
      { id: 'M4.4', text: 'Estimasi tingkat isi bak (fill ratio) → volume muatan', priority: 'P1' },
      { id: 'M4.5', text: 'Quality check foto (blur, gelap, terhalang) + minta foto ulang', priority: 'P1' },
      { id: 'M4.6', text: 'Active learning: foto dengan confidence rendah masuk antrean labeling', priority: 'P2' },
    ],
  },
  {
    id: 'M5',
    name: 'Estimasi Nilai Kalor & Kelas Kadar Air',
    short: 'Kalor & kadar air',
    tag: 'M5 · KALOR',
    brain: 'mutu',
    goal: 'Menerjemahkan komposisi dan berat menjadi estimasi nilai kalor (MJ/kg) dan kelas kadar air.',
    summary: 'Komposisi × nilai kalor referensi per fraksi, dikoreksi uji lab lokal; kadar air diklasifikasi Basah/Sedang/Kering.',
    features: [
      { id: 'M5.1', text: 'Estimasi nilai kalor campuran dari komposisi × nilai referensi per fraksi', priority: 'P0' },
      { id: 'M5.2', text: 'Kalibrasi faktor koreksi lokal dari uji lab (bomb calorimeter) sampel', priority: 'P0' },
      { id: 'M5.3', text: 'Densitas curah = berat netto ÷ volume estimasi (kapasitas bak × fill ratio)', priority: 'P1' },
      { id: 'M5.4', text: 'Klasifikasi kadar air Basah/Sedang/Kering (densitas, % organik basah, hujan 24 jam)', priority: 'P1' },
      { id: 'M5.5', text: 'Interval ketidakpastian estimasi', priority: 'P2' },
    ],
  },
  {
    id: 'M6',
    name: 'Grade & Routing Muatan',
    short: 'Grade & routing',
    tag: 'M6 · GRADE',
    brain: 'mutu',
    goal: 'Memberi grade dan rekomendasi tujuan untuk tiap muatan.',
    summary: 'Mesin aturan memberi grade A / B / C-org / C-res dan mengarahkan muatan ke PLTSa, olah organik, atau zona timbun.',
    features: [
      { id: 'M6.1', text: 'Mesin aturan grade (ambang bisa dikonfigurasi admin)', priority: 'P0' },
      { id: 'M6.2', text: 'Tampilan arahan zona di layar operator ("Arahkan ke: Bunker PLTSa")', priority: 'P0' },
      { id: 'M6.3', text: 'Override manual operator + alasan (jadi data pelatihan)', priority: 'P1' },
      { id: 'M6.4', text: 'Rapor mutu per kelurahan/sumber (mingguan)', priority: 'P1' },
      { id: 'M6.5', text: 'Skema insentif berbasis mutu untuk TPS3R/kelurahan', priority: 'P2' },
    ],
  },
  {
    id: 'M7',
    name: 'Dashboard DLH & Rapor Pasokan PLTSa',
    short: 'Dashboard',
    tag: 'M7 · DASHBOARD',
    brain: 'data',
    goal: 'Satu layar untuk keputusan DLH: antrean, alat berat, peta, jadwal, dan mutu pasokan PLTSa.',
    summary: 'Ringkasan real-time, status alat berat yang memicu re-scheduling, peta GIS, Gantt slot, dan rapor pasokan PLTSa.',
    features: [
      { id: 'M7.1', text: 'Ringkasan real-time: truk antre, waktu tunggu rata-rata, ton masuk hari ini', priority: 'P0' },
      { id: 'M7.2', text: 'Status alat berat & zona (toggle aktif/rusak) yang memicu re-scheduling', priority: 'P0' },
      { id: 'M7.3', text: 'Peta GIS kelurahan: forecast vs aktual, mutu rata-rata', priority: 'P0' },
      { id: 'M7.4', text: 'Timeline slot (Gantt) hari ini', priority: 'P0' },
      { id: 'M7.5', text: 'Rapor pasokan PLTSa: ton grade A/B/C per hari, tren', priority: 'P0' },
      { id: 'M7.6', text: 'Simulator what-if (dari M2.5)', priority: 'P1' },
      { id: 'M7.7', text: 'Laporan PDF harian/mingguan otomatis', priority: 'P1' },
      { id: 'M7.8', text: 'Estimasi BBM idle terbuang & jam kerja hilang', priority: 'P1' },
    ],
  },
  {
    id: 'M8',
    name: 'Admin & Master Data',
    short: 'Admin',
    tag: 'M8 · ADMIN',
    brain: 'data',
    goal: 'Mengelola data induk dan konfigurasi sistem.',
    summary: 'Master kelurahan, truk, sopir, alat berat, zona; konfigurasi ambang grade dan jam operasional.',
    features: [
      { id: 'M8.1', text: 'Master kelurahan, truk (plat, tipe, kapasitas bak m³), sopir (WA), alat berat, zona', priority: 'P0' },
      { id: 'M8.2', text: 'Konfigurasi ambang grade, durasi slot, jam operasional', priority: 'P0' },
      { id: 'M8.3', text: 'Manajemen pengguna & peran (admin, kepala UPTD, operator timbang, viewer PLTSa)', priority: 'P1' },
      { id: 'M8.4', text: 'Audit log', priority: 'P2' },
    ],
  },
]

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<string, Module>

export const masterData = [
  { title: 'Kelurahan', fields: 'nama, penduduk, batas wilayah (GIS)' },
  { title: 'Truk', fields: 'plat, tipe, kapasitas bak (m³), kelurahan' },
  { title: 'Sopir', fields: 'nama, nomor WhatsApp, truk' },
  { title: 'Alat berat', fields: 'jenis, produktivitas (truk/jam), status' },
  { title: 'Zona', fields: 'nama, jenis (bunker PLTSa / organik / timbun), status akses' },
  { title: 'Konfigurasi', fields: 'ambang grade, durasi slot, jam operasional gerbang' },
  { title: 'Pengguna & peran', fields: 'admin, kepala UPTD, operator timbang, viewer PLTSa' },
  { title: 'Audit log', fields: 'siapa mengubah apa dan kapan' },
]

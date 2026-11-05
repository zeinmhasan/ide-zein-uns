// Konten naratif: angka, linimasa, pohon masalah, insight, stakeholder, alur harian.
// Edit teks di sini tanpa menyentuh komponen.

export const nav = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'angka', label: 'Angka Putri Cempo' },
  { id: 'linimasa', label: 'Linimasa krisis' },
  { id: 'masalah', label: 'Pohon masalah' },
  { id: 'insight', label: 'Insight kunci' },
  { id: 'solusi', label: 'Dua otak, satu gerbang' },
  { id: 'modul', label: 'Bedah modul' },
  { id: 'sehari', label: 'Satu hari bersama ARUS' },
  { id: 'alur', label: 'Alur detail' },
  { id: 'ai', label: 'Di balik AI-nya' },
  { id: 'data', label: 'Data & ERD' },
  { id: 'metrik', label: 'Metrik & target' },
  { id: 'roadmap', label: 'Roadmap & TKT' },
  { id: 'bisnis', label: 'Bisnis & risiko' },
  { id: 'sumber', label: 'Sumber' },
]

export type Stat = {
  value: number
  decimals?: number
  prefix?: string
  unit: string
  label: string
  note: string
  sourceId: string
  tone: 'coral' | 'amber' | 'olive' | 'slate'
  noGrouping?: boolean
}

export const stats: Stat[] = [
  { value: 400.7, decimals: 1, unit: 'ton/hari', label: 'Sampah masuk TPA (2024)', note: '144.249 ton sepanjang 2024, data DLH', sourceId: 'S3', tone: 'slate' },
  { value: 2, prefix: '±', unit: 'km', label: 'Antrean truk, 9 Feb 2026', note: 'Seratusan truk antre dari pagi sampai malam', sourceId: 'S7', tone: 'coral' },
  { value: 71, unit: '%', label: 'Porsi sampah organik', note: 'Komposisi TPA Putri Cempo 2023', sourceId: 'S4', tone: 'olive' },
  { value: 545, prefix: '±', unit: 'ton/hari', label: 'Kebutuhan sampah PLTSa 5 MW', note: 'Rancangan PLTSa tahap 1', sourceId: 'S5', tone: 'amber' },
  { value: 28, prefix: '±', unit: 'm', label: 'Tinggi gunungan sampah (2023)', note: 'Metode bergeser ke open dumping', sourceId: 'S1', tone: 'slate' },
  { value: 2007, unit: '', label: 'Tahun mulai overload', note: 'TPA satu-satunya di Kota Surakarta, ±17 ha', sourceId: 'S1', tone: 'coral', noGrouping: true },
]

export type TimelineCategory = 'tpa' | 'api' | 'antrean' | 'pltsa' | 'warga' | 'kebijakan' | 'arus'

export const timeline: { date: string; title: string; desc: string; category: TimelineCategory; sourceId?: string }[] = [
  { date: '1986/1987', title: 'TPA mulai beroperasi', desc: 'Putri Cempo dibuka sebagai satu-satunya TPA Kota Surakarta, luas ±17 ha.', category: 'tpa', sourceId: 'S1' },
  { date: '2007', title: 'TPA overload', desc: 'Kapasitas terlampaui; praktik bergeser dari sanitary landfill ke open dumping.', category: 'tpa', sourceId: 'S1' },
  { date: '2019', title: 'Pembangunan PLTSa dimulai', desc: 'Pembangkit listrik tenaga sampah mulai dibangun di kawasan TPA.', category: 'pltsa', sourceId: 'S1' },
  { date: 'Sep 2023', title: 'Kebakaran TPA (±2 ha)', desc: 'Timbunan terbakar; kebakaran di TPA terus berulang.', category: 'api', sourceId: 'S2' },
  { date: '2023', title: 'Gunungan ±28 m, PLTSa diresmikan', desc: 'Gunungan sampah mencapai ±28 m. PLTSa 5 MW diresmikan.', category: 'pltsa', sourceId: 'S1' },
  { date: '2024', title: '144.249 ton masuk TPA', desc: 'Rata-rata ±400,7 ton per hari melewati satu gerbang yang sama.', category: 'tpa', sourceId: 'S3' },
  { date: 'Okt 2024', title: 'Warga protes ke Balai Kota', desc: 'Warga Mojosongo memprotes dampak limbah PLTSa.', category: 'warga', sourceId: 'S17' },
  { date: 'Nov 2025', title: 'PLTSa dilaporkan mandek', desc: 'Kebutuhan RDF ±500 ton/hari tidak tercapai; bahan baku tidak sesuai kebutuhan mesin.', category: 'pltsa', sourceId: 'S6' },
  { date: '15 Jan 2026', title: 'Wamen LH meninjau', desc: 'Operasional PLTSa didapati belum optimal.', category: 'kebijakan', sourceId: 'S15' },
  { date: '8 Feb 2026', title: 'Blokade akses truk', desc: 'Warga Jatirejo memblokade akses truk; titik timbun hanya ±20 m dari rumah warga.', category: 'warga', sourceId: 'S11' },
  { date: '9 Feb 2026', title: 'Antrean truk ±2 km', desc: 'Alat berat rusak sehingga truk masuk bergantian. Petugas antre dari pagi sampai malam.', category: 'antrean', sourceId: 'S7' },
  { date: '10 Feb 2026', title: 'Rencana penjadwalan truk', desc: 'Wali Kota minta maaf; DLH merencanakan penjadwalan berdasarkan volume tiap kelurahan.', category: 'kebijakan', sourceId: 'S9' },
  { date: 'Agt 2026', title: 'Target darurat sampah tuntas', desc: 'DPRD Solo menargetkan penanganan darurat sampah tuntas akhir 2026.', category: 'kebijakan', sourceId: 'S16' },
  { date: '2 Sep 2026', title: 'Kebakaran besar TPA', desc: 'Belasan hektare timbunan terbakar; pengelolaan metana jadi sorotan.', category: 'api', sourceId: 'S2' },
  { date: '16 Sep 2026', title: 'Masa transisi pemulihan', desc: 'Pengelolaan gas metana disebut sebagai kunci langkah berikutnya.', category: 'kebijakan', sourceId: 'S14' },
  { date: '4–6 Des 2026', title: 'ARUS di UNS Innovation Hackathon', desc: 'Prototipe terintegrasi didemokan: forecast, jadwal, bot sopir, penilaian mutu, dashboard.', category: 'arus' },
]

export const problemTree = {
  symptoms: [
    { title: 'Antrean ±2 km', text: 'Sopir menunggu dari pagi sampai malam.', sourceId: 'S7' },
    { title: 'Jalan warga tertutup', text: 'Bau dan akses tertutup memicu protes dan blokade.', sourceId: 'S11' },
    { title: 'PLTSa tidak stabil', text: 'Pembangkit tidak beroperasi stabil karena bahan baku.', sourceId: 'S6' },
    { title: 'Kebakaran berulang', text: 'Gas metana dari timbunan organik.', sourceId: 'S2' },
  ],
  core: 'Satu gerbang menerima ±400 ton/hari tanpa pengaturan aliran dan tanpa pengukuran mutu.',
  roots: [
    { id: 'A1', title: 'Kedatangan bergelombang', text: 'Truk berangkat serentak dalam kloter pagi tanpa melihat kapasitas bongkar. Dalam satu–dua jam, gerbang menerima lebih banyak truk daripada yang bisa dibongkar.' },
    { id: 'A2', title: 'Kapasitas bongkar fluktuatif', text: 'Alat berat rusak atau zona longsor menurunkan kapasitas mendadak, tetapi tidak terukur dan tidak terkomunikasikan ke sopir yang sudah di jalan.' },
    { id: 'A3', title: 'Data operasional manual', text: 'Pencatatan masih memakai Excel, tidak real-time, dan lokasi TPS/TPA belum terintegrasi dalam GIS.' },
    { id: 'A4', title: 'Mutu muatan tidak diukur', text: 'Komposisi, nilai kalor, dan kadar air muatan tidak pernah diukur di gerbang. Tidak ada yang tahu muatan mana yang layak bakar.' },
    { id: 'A5', title: 'Aliran tidak dipisah', text: 'Tidak ada mekanisme memisahkan muatan "layak bakar", "organik", dan "residu". Semuanya berakhir di timbunan yang sama.' },
  ],
  impacts: [
    { title: 'Operasional', text: 'Jam kerja hilang, ritase berkurang, sampah tertinggal di kelurahan.', tone: 'slate' },
    { title: 'Energi', text: 'BBM terbuang saat mesin idle; PLTSa kekurangan bahan bakar bermutu.', tone: 'amber' },
    { title: 'Lingkungan', text: 'Organik tertimbun menghasilkan metana dan risiko kebakaran.', tone: 'olive' },
    { title: 'Sosial', text: 'Konflik berulang dengan warga sekitar TPA.', tone: 'coral' },
  ],
  statement:
    'TPA Putri Cempo menerima ±400 ton sampah per hari melalui satu gerbang, tetapi kedatangan truk tidak dijadwalkan sesuai kapasitas bongkar yang tersedia (alat berat dan akses zona). Akibatnya, setiap gangguan kapasitas langsung berubah menjadi antrean kilometer, jam kerja hilang, BBM terbuang, dan konflik dengan warga. Di saat yang sama, tidak ada pengukuran mutu muatan di gerbang, sehingga muatan yang layak menjadi bahan bakar PLTSa tidak teridentifikasi. Padahal PLTSa terhenti karena bahan bakunya tidak sesuai kebutuhan mesin.',
}

export const insights = [
  {
    n: '01',
    title: 'Bottleneck-nya di area bongkar, bukan di jumlah truk',
    text: 'Antrean Februari terjadi karena alat berat rusak dan akses zona tertutup. Membagi rata jam saja tidak cukup. Jadwal harus dihitung dari kapasitas bongkar real-time: alat berat aktif × produktivitas × zona yang bisa diakses.',
    sourceId: 'S7',
  },
  {
    n: '02',
    title: 'Masalah PLTSa adalah masalah mutu bahan baku',
    text: 'Kalau gerbang memberi "rapor" tiap muatan, terlihat kelurahan atau sumber mana yang menghasilkan muatan kaya kalori (pasar, perumahan, perkantoran), lalu muatan itu bisa diarahkan ke PLTSa.',
    sourceId: 'S6',
  },
  {
    n: '03',
    title: 'Gerbang adalah choke point semua data',
    text: 'Satu titik instrumentasi (kamera, timbangan, check-in) memberi data seluruh kota. Jauh lebih murah daripada memasang sensor di ratusan TPS.',
  },
  {
    n: '04',
    title: 'DLH sendiri sudah menyebut penjadwalan',
    text: 'Kepala DLH menyatakan akan menerapkan penjadwalan berdasarkan volume tiap kelurahan, dengan prioritas truk multi-ritase. ARUS tidak memaksakan ide dari luar, tetapi mewujudkan rencana itu secara cerdas.',
    sourceId: 'S9',
  },
]

export const valueProps = [
  { who: 'DLH / UPTD', before: 'Reaktif, tahu masalah dari berita', after: 'Proaktif: peringatan H-1, jadwal otomatis, data GIS' },
  { who: 'Sopir', before: 'Antre tanpa kepastian', after: 'Slot jam pasti lewat WhatsApp' },
  { who: 'Operator timbangan', before: 'Catat manual', after: 'Check-in QR, berat & foto tercatat otomatis' },
  { who: 'PLTSa', before: 'Mutu bahan bakar tidak diketahui', after: 'Rapor mutu & prediksi ton grade A' },
  { who: 'Warga', before: 'Jalan tertutup antrean', after: 'Antrean di jalan permukiman berkurang' },
  { who: 'Pemkot', before: 'Sulit justifikasi anggaran', after: 'Bukti kuantitatif kebutuhan alat berat & dampak kebijakan' },
]

export const personas = [
  {
    name: 'Pak Herman',
    age: 48,
    role: 'Kepala UPTD TPA',
    goal: 'TPA berjalan lancar, tidak ada berita antrean atau protes.',
    pain: 'Tidak tahu hari mana akan padat. Saat alat berat rusak, tidak ada cara cepat memberi tahu puluhan sopir.',
    need: 'Dashboard satu layar, peringatan "besok padat", tombol "alat berat rusak" yang langsung mengatur ulang jadwal.',
    tone: 'teal',
  },
  {
    name: 'Mas Agung',
    age: 35,
    role: 'Sopir truk Kel. Mangkubumen',
    goal: 'Ritase selesai, pulang tepat waktu.',
    pain: 'Berangkat pagi serentak dengan truk lain, lalu antre berjam-jam tanpa kepastian.',
    need: 'Pesan WhatsApp sederhana: "Slot kamu jam 07.40. Berangkat 07.10." Tanpa install aplikasi.',
    tone: 'coral',
  },
  {
    name: 'Mbak Rina',
    age: 29,
    role: 'Operator timbangan',
    goal: 'Mencatat cepat dan benar.',
    pain: 'Mencatat manual atau di Excel, antrean menekan dia untuk cepat.',
    need: 'Check-in otomatis (scan QR), berat dan foto terekam otomatis. Tidak menambah klik.',
    tone: 'slate',
  },
  {
    name: 'Ir. Dimas',
    age: 41,
    role: 'Engineer pasokan PLTSa',
    goal: 'Bahan bakar sesuai spesifikasi mesin.',
    pain: 'Tidak tahu mutu sampah sebelum masuk proses. Organik basah menurunkan kinerja.',
    need: 'Prediksi ton muatan grade A per hari dan rapor mutu per sumber.',
    tone: 'amber',
  },
] as const

export type DayScene = 'forecast' | 'check' | 'schedule' | 'send' | 'remind' | 'depart' | 'gate' | 'grade' | 'broken' | 'reschedule' | 'report' | 'retrain'

export const dayFlow: { time: string; text: string; modules: string; scene: DayScene }[] = [
  { time: 'H-1 18.00', text: 'Forecast tonase & ritase besok untuk tiap kelurahan.', modules: 'M1', scene: 'forecast' },
  { time: 'H-1 18.30', text: 'Kepala UPTD mengecek status alat berat & zona untuk besok.', modules: 'M7 · M8', scene: 'check' },
  { time: 'H-1 19.00', text: 'Penjadwal menyusun slot kedatangan sesuai kapasitas bongkar.', modules: 'M2', scene: 'schedule' },
  { time: 'H-1 19.30', text: 'Bot mengirim jadwal ke semua sopir lewat WhatsApp.', modules: 'M3', scene: 'send' },
  { time: '05.30', text: 'Pengingat otomatis ke sopir ritase pertama.', modules: 'M3', scene: 'remind' },
  { time: '06.15', text: 'Sopir menekan tombol "Berangkat".', modules: 'M3', scene: 'depart' },
  { time: '06.40', text: 'Truk tiba, scan QR, ditimbang, foto bak diambil.', modules: 'Gerbang', scene: 'gate' },
  { time: '06.40 +3 dtk', text: 'Komposisi, kalor, kadar air, dan grade dihitung. Layar operator: "Grade A → Bunker PLTSa".', modules: 'M4–M6', scene: 'grade' },
  { time: '10.15', text: 'Ekskavator 2 rusak. Operator mengubah statusnya di dashboard.', modules: 'M7', scene: 'broken' },
  { time: '10.15 +30 dtk', text: 'Jadwal disusun ulang; notifikasi terkirim ke sopir yang terdampak.', modules: 'M2 · M3', scene: 'reschedule' },
  { time: '14.00', text: 'Rapor pasokan PLTSa diperbarui: sekian ton grade A hari ini.', modules: 'M7', scene: 'report' },
  { time: '20.00', text: 'Laporan harian otomatis; data masuk antrean retraining.', modules: 'M7 · M1', scene: 'retrain' },
]

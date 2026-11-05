export type Source = { id: string; title: string; url: string }

export const sources: Source[] = [
  { id: 'S1', title: 'BRIDA Surakarta: Executive Summary PLTSa 2023', url: 'https://brida.surakarta.go.id/e-riset/uploads/riset//Executive_Summary_PLTSa_2023.pdf' },
  { id: 'S2', title: 'Katadata: Kebakaran TPA Putri Cempo, 2 dekade kelebihan kapasitas (3 Sep 2026)', url: 'https://katadata.co.id/ekonomi-hijau/ekonomi-sirkular/6a990ac951f24/kebakaran-tpa-putri-cempo-2-dekade-kelebihan-kapasitas-bolak-balik-dilalap-api' },
  { id: 'S3', title: 'Kumparan: Mengenal Putri Cempo (data DLH 2024)', url: 'https://kumparan.com/faadhil-althaf/mengenal-putri-cempo-sisi-timur-solo-yang-terlupakan-26Un4RhKlQp' },
  { id: 'S4', title: 'JPPMR Undip: Manajemen pengelolaan sampah TPA Putri Cempo (komposisi 2023)', url: 'https://ejournal3.undip.ac.id/index.php/jppmr/article/download/44784/31320' },
  { id: 'S5', title: 'Bisnis.com: Proyek PLTSa Putri Cempo terhambat (2021)', url: 'https://ekonomi.bisnis.com/read/20210306/44/1364640/proyek-pembangkit-listrik-tenaga-sampah-putri-cempo-terhambat' },
  { id: 'S6', title: 'Listrik Indonesia: PLTSa Putri Cempo mandek (Nov 2025)', url: 'https://listrikindonesia.com/detail/18451/pltsa-putri-cempo-mandek-apa-yang-sebenarnya-terjadi' },
  { id: 'S7', title: 'RRI: Antrean truk sampah ke TPA Solo sampai 2 km (9 Feb 2026)', url: 'https://rri.co.id/surakarta/regional/2172165/dampak-overload-antrean-truk-sampah-ke-tpa-solo-sampai-2km' },
  { id: 'S8', title: 'Metro TV: Truk mengular 2 km, kendala alat berat (9 Feb 2026)', url: 'https://www.metrotvnews.com/read/Ky6C5673-truk-sampah-mengular-2-km-di-tpa-putri-cempo-warga-keluhkan-bau-menyengat' },
  { id: 'S9', title: 'detikJateng: Walkot minta maaf, rencana penjadwalan (10 Feb 2026)', url: 'https://www.detik.com/jateng/berita/d-8349742/walkot-solo-minta-maaf-mobil-sampah-ngular-2-km-di-tpa-putri-cempo' },
  { id: 'S10', title: 'RRI: Kondisi Putri Cempo, longsor akses timbangan (9 Feb 2026)', url: 'https://rri.co.id/surakarta/regional/2170454/buntut-blokade-tpa-ketua-fraksi-pdi-p-ungkap-kondisi-putri-cempo' },
  { id: 'S11', title: 'RRI: Warga blokade akses TPA (9 Feb 2026)', url: 'https://rri.co.id/surakarta/daerah/2169797/protes-loading-sampah-warga-blokade-akses-ke-tpa-putri-cempo' },
  { id: 'S12', title: 'The Jakarta Post: Surakarta landfill crisis (Feb 2026)', url: 'https://www.thejakartapost.com/indonesia/2026/02/11/surakarta-landfill-crisis-highlights-indonesias-growing-waste-problem' },
  { id: 'S13', title: 'SENATIB 2026: Sistem informasi persampahan DLH Surakarta', url: 'https://ojs.udb.ac.id/Senatib/article/download/6797/4534/16577' },
  { id: 'S14', title: 'Journal Arta: PLTSa kembali beroperasi pasca kebakaran (18 Sep 2026)', url: 'https://journalarta.com/news/2026/09/18/pltsa-putri-cempo-bisa-kembali-beroperasi-pasca-kebakaran-tpa/' },
  { id: 'S15', title: 'RRI: Wamen LH tinjau PLTSa (15 Jan 2026)', url: 'https://rri.co.id/surakarta/regional/2108881/tinjau-tpa-solo-wamen-lh-dapati-kendala-operasional-pltsa' },
  { id: 'S16', title: 'RRI: DPRD targetkan darurat sampah tuntas akhir 2026', url: 'https://rri.co.id/surakarta/regional/2618986/dprd-solo-targetkan-penanganan-darurat-sampah-tuntas-akhir-2026' },
  { id: 'S17', title: 'detikJateng: Warga Mojosongo protes limbah PLTSa (Okt 2024)', url: 'https://www.detik.com/jateng/bisnis/d-7589220/terganggu-limbah-pltsa-warga-mojosongo-geruduk-balai-kota-solo' },
  { id: 'S18', title: 'VOI: Surakarta 1 dari 12 kota percontohan PLTSa', url: 'https://voi.id/en/berita/312055' },
  { id: 'S19', title: 'Nilai kalor default per fraksi (Tchobanoglous et al., 1993), dipakai di CSCE 2024', url: 'https://csce.cust.edu.pk/archive/CSCE_24_conference_proceedings/2024-711.pdf' },
]

export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s])) as Record<string, Source>

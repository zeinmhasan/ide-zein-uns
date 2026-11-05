# GERBANG

**Gerbang Cerdas TPA Putri Cempo**: penjadwalan adaptif dan penilaian mutu muatan sampah berbasis AI.

> *Antre lebih singkat, bahan bakar PLTSa lebih bermutu.*

---

## Masalah

Semua sampah Kota Solo, sekitar **400 ton per hari**, masuk lewat satu gerbang yang sama: TPA Putri Cempo. Di titik ini ada tiga masalah yang saling berkaitan.

### 1. Antrean truk yang tidak terkendali
- Pada 9 Februari 2026, seratusan truk sampah antre sampai **±2 km** di depan TPA. Sebagian sopir menunggu dari pagi sampai malam.
- Penyebab utamanya **bukan jumlah truk**. Alat berat di area bongkar rusak dan sebagian akses zona tertutup longsor, sehingga kapasitas bongkar turun drastis.
- Truk tetap datang serentak per kloter karena tidak ada jadwal yang menyesuaikan kapasitas bongkar hari itu.
- Dampaknya: jam kerja hilang, BBM terbuang saat truk diam, jalan permukiman tertutup, bau, dan konflik dengan warga sekitar (sampai terjadi blokade).

### 2. PLTSa kekurangan bahan bakar yang cocok
- PLTSa Putri Cempo (5 MW) butuh pasokan sampah sekitar 500 ton per hari dengan mutu tertentu.
- Sekitar **71% sampah Solo adalah organik basah** yang nilai kalornya rendah. PLTSa sempat berhenti karena bahan bakunya tidak sesuai kebutuhan mesin.
- Saat ini **tidak ada yang mengukur mutu muatan** di gerbang. Muatan yang sebenarnya layak dibakar tercampur dengan muatan yang tidak layak.

### 3. Data masih manual
- Pencatatan masih memakai Excel dan belum terintegrasi dengan peta (GIS).
- DLH tidak bisa memprediksi hari padat, tidak bisa cepat memberi tahu sopir saat terjadi gangguan, dan tidak punya data kuat untuk mengajukan anggaran (misalnya penambahan alat berat).

### Ringkasnya
| Gejala | Akar masalah |
|---|---|
| Antrean kilometer | Kedatangan truk tidak disesuaikan dengan kapasitas bongkar |
| Gangguan berantai saat alat rusak | Perubahan kapasitas tidak terukur dan tidak tersampaikan ke sopir |
| PLTSa tidak stabil | Mutu muatan tidak pernah dinilai dan tidak dipisahkan |
| Keputusan reaktif | Data operasional manual dan tidak real-time |

---

## Solusi

GERBANG memasang "otak" di satu titik yang dilewati seluruh sampah kota, yaitu **gerbang dan jembatan timbang TPA**. Ada dua otak yang bekerja bersama.

### Otak aliran: mengatur *kapan* truk datang
1. Memprediksi volume sampah tiap kelurahan untuk besok.
2. Menghitung **kapasitas bongkar nyata** dari jumlah alat berat yang aktif dan zona yang bisa diakses.
3. Menyusun **slot jam kedatangan** untuk setiap truk sehingga jumlah truk tidak melebihi kapasitas.
4. Mengirim jadwal ke sopir lewat **WhatsApp**.
5. Saat alat berat rusak, jadwal **disusun ulang otomatis** dan sopir yang terdampak langsung diberi tahu.

### Otak mutu: menilai *apa* yang dibawa truk
1. Saat truk ditimbang, kamera memotret bak truk.
2. AI memperkirakan **komposisi sampah** (organik, plastik, kertas, dan seterusnya).
3. Komposisi digabung dengan berat timbangan untuk memperkirakan **nilai kalor** dan **kelas kadar air**.
4. Setiap muatan mendapat **grade** dan arahan tujuan:
   - **Grade A** (kaya kalori) → ke PLTSa
   - **Grade B** → perlu pra-olah (misalnya dikeringkan) dulu
   - **Grade C-organik** → olah organik (kompos/maggot)
   - **Grade C-residu** → zona timbun

Hasil kedua otak masuk ke **dashboard DLH** dan **rapor mutu pasokan PLTSa**. Data harian dipakai untuk membuat prediksi berikutnya makin akurat.

```
Kelurahan → [Forecast] → [Penjadwal slot] → [Bot WhatsApp sopir]
                                                   ↓
                         Truk tiba di gerbang: scan QR → timbang → foto bak
                                                   ↓
                     [AI komposisi] → [Estimasi kalor & kadar air] → [Grade]
                                                   ↓
                     PLTSa  |  Olah organik  |  Zona timbun
                                                   ↓
                              [Dashboard DLH & rapor PLTSa]
```

### Siapa yang terbantu
| Pengguna | Sebelum | Dengan GERBANG |
|---|---|---|
| Kepala UPTD TPA / DLH | Tahu masalah setelah terjadi | Peringatan hari padat, jadwal otomatis, data real-time |
| Sopir truk | Antre tanpa kepastian | Jam slot pasti lewat WhatsApp |
| Operator timbangan | Mencatat manual | Scan QR; berat dan foto tercatat otomatis |
| Operator PLTSa | Mutu bahan bakar tidak diketahui | Rapor mutu dan prediksi pasokan grade A |
| Warga sekitar TPA | Jalan tertutup antrean | Antrean di jalan permukiman berkurang |

---

## Fitur

### 1. Forecast Volume Sampah
Memprediksi berapa ton sampah dan berapa ritase dari tiap kelurahan.
- Prediksi harian per kelurahan untuk besok dan 7 hari ke depan, lengkap dengan rentang (perkiraan rendah–tinggi)
- Perkiraan jumlah ritase per kelurahan berdasarkan kapasitas armada
- Peringatan **"hari padat"** bila prediksi melebihi kapasitas bongkar
- Penjelasan penyebab lonjakan, misalnya libur panjang, hujan, atau hari setelah Lebaran
- Prediksi makin akurat seiring bertambahnya data timbang

### 2. Penjadwal Slot Sadar Kapasitas
Fitur inti GERBANG. Jadwal disusun dari kemampuan area bongkar, bukan dibagi rata.
- Menghitung kapasitas bongkar per slot waktu dari alat berat aktif, produktivitas, zona terbuka, dan cuaca
- Menyusun slot kedatangan untuk setiap ritase dengan waktu tunggu sekecil mungkin
- Memprioritaskan truk yang harus bolak-balik beberapa kali
- **Penjadwalan ulang otomatis** dalam hitungan detik saat status alat berat atau zona berubah
- Pergeseran jadwal dibuat seminimal mungkin supaya sopir tidak dioper-oper
- **Simulator what-if**: uji skenario seperti "1 ekskavator rusak" atau "zona utara tertutup" sebelum terjadi
- Rekomendasi kebutuhan alat berat, misalnya "tambah 1 unit akan memangkas antrean sekian persen"

### 3. Bot WhatsApp Sopir
Sopir tidak perlu memasang aplikasi baru.
- Kirim jadwal H-1: jam slot dan saran jam berangkat
- Pengingat pagi sebelum berangkat
- Tombol balas cepat: **Berangkat**, **Tunda**, **Kendala**
- Notifikasi otomatis saat jadwal berubah, beserta alasannya
- QR check-in truk dikirim langsung di chat
- Ringkasan harian untuk koordinator kebersihan kelurahan

Contoh pesan:
```
GERBANG – Jadwal Besok
Truk AD 8123 XX – Kel. Mangkubumen
Ritase 1: slot 06.40–06.55 → berangkat ±06.15
Ritase 2: slot 09.20–09.35
[Berangkat] [Tunda] [Kendala]
```
```
⚠️ Perubahan jadwal
1 alat berat sedang diperbaiki.
Ritase 2 kamu digeser ke 10.05–10.20.
Mohon tidak berangkat sebelum 09.40.
```

### 4. Kamera Gerbang & Analisis Komposisi
Foto bak truk diubah menjadi data komposisi.
- Foto otomatis saat truk berada di jembatan timbang, dengan cadangan foto dari HP operator
- AI mengenali 9 jenis fraksi: organik basah, organik kering, plastik lunak, plastik keras, kertas & kardus, tekstil, karet & kulit, kaca/logam/inert, dan residu
- Hasil berupa persentase berat tiap fraksi
- Perkiraan tingkat isi bak untuk menghitung volume muatan
- Pengecekan kualitas foto (buram, gelap, terhalang) disertai permintaan foto ulang
- Kamera diarahkan ke bak, bukan ke kabin, sehingga wajah tidak terekam

### 5. Estimasi Nilai Kalor & Kadar Air
Menerjemahkan komposisi menjadi "seberapa bagus muatan ini sebagai bahan bakar".
- Estimasi nilai kalor muatan (MJ/kg dan kkal/kg) dari komposisi
- Kalibrasi dengan uji laboratorium supaya sesuai karakter sampah lokal
- Perhitungan kepadatan muatan dari berat timbangan dibagi volume
- Klasifikasi kadar air: **Basah / Sedang / Kering**
- Setiap hasil disertai alasan yang mudah dibaca, misalnya "Organik basah 70% → nilai kalor rendah"

### 6. Grade & Arahan Tujuan Muatan
Memutuskan muatan dibawa ke mana.
- Grade otomatis A / B / C-organik / C-residu
- Batas grade bisa diatur sesuai spesifikasi mesin PLTSa
- Layar operator menampilkan arahan yang jelas, misalnya **"Arahkan ke: Bunker PLTSa"**
- Operator bisa mengoreksi grade dengan menyertakan alasan, dan koreksi ini dipakai untuk memperbaiki AI
- **Rapor mutu per kelurahan**: kelurahan atau sumber mana yang paling sering menghasilkan muatan kaya kalori

### 7. Dashboard DLH & Rapor Pasokan PLTSa
Satu layar untuk memantau semuanya.
- Ringkasan real-time: jumlah truk antre, rata-rata waktu tunggu, ton masuk hari ini
- Tombol status alat berat dan zona (aktif/rusak/tertutup) yang langsung memicu penjadwalan ulang
- Peta kelurahan: prediksi dibanding aktual, dan mutu rata-rata muatan
- Timeline slot hari ini dalam bentuk Gantt
- Rapor pasokan PLTSa: ton grade A/B/C per hari beserta trennya
- Estimasi BBM terbuang dan jam kerja hilang akibat antrean
- Laporan harian dan mingguan otomatis

### 8. Pengelolaan Data Master
- Data kelurahan, truk (plat, kapasitas bak), sopir (nomor WhatsApp), alat berat, dan zona
- Pengaturan jam operasional, durasi slot, dan batas grade
- Hak akses per peran: admin, kepala UPTD, operator timbang, dan operator PLTSa (lihat saja)

---

## Satu hari bersama GERBANG

| Waktu | Yang terjadi |
|---|---|
| H-1, 18.00 | Prediksi volume besok untuk tiap kelurahan |
| H-1, 19.00 | Jadwal slot disusun sesuai kapasitas alat berat |
| H-1, 19.30 | Jadwal terkirim ke WhatsApp semua sopir |
| 06.15 | Sopir menekan "Berangkat" |
| 06.40 | Truk tiba → scan QR → timbang → foto → **Grade A, arahkan ke PLTSa** |
| 10.15 | Satu ekskavator rusak → operator ubah status di dashboard |
| 10.15 + detik | Jadwal disusun ulang, sopir terdampak dapat notifikasi |
| 14.00 | Rapor pasokan PLTSa diperbarui |
| 20.00 | Laporan harian terbit; data dipakai untuk prediksi berikutnya |

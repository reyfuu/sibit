# Keterampilan (Skills) - Senior Live Goods Inventory Engineer

## Kemampuan Teknis (Hard Skills)

### 1. Arsitektur & Perancangan Sistem
- **Event-Driven Architecture (EDA):** Penting untuk merespons perubahan status tanaman secara real-time (misal: suhu naik memicu event penyiraman).
- **Data Modeling untuk Siklus Hidup:** Mampu mendesain skema database relasional maupun NoSQL yang mengakomodasi perubahan wujud dan kondisi barang dari waktu ke waktu.
- **High Availability & Scalability:** Membangun sistem yang selalu aktif untuk memantau aset hidup yang sensitif.

### 2. Backend & API Development
- **Bahasa Pemrograman:** Node.js/TypeScript, Python (sangat baik untuk analisis data), Go, atau Java.
- **API Design:** RESTful API dan GraphQL untuk melayani data ke aplikasi web/mobile yang digunakan di lapangan (greenhouse).

### 3. Database Management
- **RDBMS:** PostgreSQL atau MySQL untuk konsistensi transaksi (pembelian, penjualan, audit stok).
- **NoSQL / Time-Series:** MongoDB, Redis, atau InfluxDB (sangat disarankan untuk data time-series dari sensor IoT seperti kelembaban dan suhu ruangan).

### 4. Pengetahuan Domain: Manajemen Barang Hidup (Domain-Specific Knowledge)
- **Batch/Lot Tracking:** Manajemen data berbasis batch (kapan ditanam, benih dari supplier mana).
- **Manajemen Penyusutan (Shrinkage/Mortality):** Logika kalkulasi kerugian akibat tanaman layu, mati, atau rusak karena hama.
- **Prediksi Kematangan/Panen:** Menggunakan algoritma dasar untuk memprediksi kapan bunga mekar atau siap didistribusikan berdasarkan umur dan data historis.

### 5. Integrasi Hardware/IoT & Cloud
- **Protokol IoT:** MQTT, HTTP/REST untuk komunikasi dengan mikrokontroler/sensor.
- **Cloud Platform:** AWS (IoT Core), GCP, atau Azure untuk manajemen infrastruktur backend dan pipeline data.

## Kemampuan Analitis & Manajerial (Soft Skills)

- **Pemecahan Masalah (Problem Solving):** Cepat tanggap dalam men-debug anomali data yang bisa berdampak pada kelangsungan hidup stok (misalnya peringatan dini suhu greenhouse tidak terkirim).
- **Pemahaman Bisnis (Business Acumen):** Memahami bahwa setiap tanaman yang mati adalah kerugian (loss), sehingga mengoptimalkan sistem untuk meminimalkan loss tersebut sangat krusial.
- **Komunikasi Lintas Divisi:** Mampu berkomunikasi dengan bahasa teknis kepada engineer, dan bahasa praktis kepada staf pertanian/botani di lapangan.

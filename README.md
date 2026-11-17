# PULSE — Spend With Intention (Halaman Transaksi)

**PULSE (Spend With Intention)** adalah aplikasi web pengelolaan keuangan pribadi untuk mahasiswa yang dirancang guna membantu pengguna memantau pemasukan, mengontrol pengeluaran, dan mengurangi kebiasaan belanja impulsif.

Repositori ini merupakan implementasi **Tugas 2 — Implementasi Komponen Dasar dengan HTML, CSS, dan JavaScript Murni** yang memfokuskan pengerjaan pada **Halaman Transaksi** secara fungsional penuh.

---

## Struktur Proyek

Seluruh berkas utama berada langsung di folder akar (*root*) repositori:

```text
.
├── index.html   # Struktur HTML5 semantik (5 komponen utama antarmuka)
├── styles.css   # Styling terpisah dengan CSS Custom Properties (warna & 8px spacing)
├── script.js    # Logika interaktif JavaScript murni (validasi form, kalkulator saldo, filter)
└── README.md    # Dokumentasi proyek dan panduan penggunaan
```

---

## 5 Komponen Utama yang Diimplementasikan

1. **Sidebar Navigasi Hierarkis (`aside#sidebar` & `toggleSidebar()`)**
   Menampilkan identitas brand PULSE, menu navigasi utama, pesan pengingat *Spend With Intention*, serta mendukung *toggle* buka/tutup menu pada layar mobile.
2. **Header Halaman & Pencarian Real-Time (`header#topbar` & `#input-cari`)**
   Menampilkan konteks halaman aktif dan menyediakan kolom pencarian langsung (*live search*) berdasarkan nama transaksi atau kategori.
3. **Kartu Ringkasan Keuangan (`section#ringkasan-keuangan` & `hitungRingkasan()`)**
   Menghitung dan memperbarui **Total Pemasukan**, **Total Pengeluaran**, **Sisa Uang**, serta persentase ketersediaan anggaran secara otomatis setiap kali ada penambahan atau penghapusan transaksi.
4. **Tabel & Filter Riwayat Transaksi (`section#daftar-transaksi` & `filterTransaksi()`)**
   Menampilkan daftar transaksi dengan *segmented tab filter* (**Semua**, **Pemasukan**, **Pengeluaran**), *dropdown* kategori, fitur hapus baris transaksi, dan penyimpanan lokal (`localStorage`).
5. **Form Tambah Transaksi & Pintasan Kategori (`form#form-transaksi` & `validasiTransaksi()`)**
   Memvalidasi input pengguna (nama transaksi minimal 3 karakter, jumlah nominal > Rp 0, kategori, dan tanggal) serta menyediakan kartu pintasan kategori cepat.

---

## Cara Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan HTML, CSS, dan JavaScript murni tanpa ketergantungan *framework* atau proses *build*:

1. Unduh atau *clone* repositori ini:
   ```bash
   git clone https://github.com/username-kamu/nama-repo.git
   ```
2. Buka berkas `index.html` secara langsung menggunakan *browser* modern (Chrome, Firefox, Edge, atau Safari), atau jalankan melalui ekstensi **Live Server** di VS Code.

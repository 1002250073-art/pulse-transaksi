/**
 * PULSE — Spend With Intention (script.js)
 * Logika Interaktif Halaman Transaksi dengan JavaScript Murni (Vanilla JS)
 */

const STORAGE_KEY = "pulse_transaksi_data_v1";

/**
 * Data Transaksi Awal (Oktober 2026)
 * Total Pemasukan: Rp 2.000.000 | Total Pengeluaran: Rp 750.000 | Sisa Uang: Rp 1.250.000
 */
const transaksiAwal = [
  {
    id: 101,
    tanggal: "2026-10-30",
    labelTanggal: "30 Okt",
    deskripsi: "Makan siang kantin",
    detail: "Kantin Kampus",
    kategori: "Makanan",
    nominal: -25000,
  },
  {
    id: 102,
    tanggal: "2026-10-29",
    labelTanggal: "29 Okt",
    deskripsi: "Belanja bahan makan",
    detail: "Kebutuhan Mingguan",
    kategori: "Makanan",
    nominal: -160000,
  },
  {
    id: 103,
    tanggal: "2026-10-28",
    labelTanggal: "28 Okt",
    deskripsi: "Top Up E-Wallet",
    detail: "Saldo Transportasi",
    kategori: "Transportasi",
    nominal: -50000,
  },
  {
    id: 104,
    tanggal: "2026-10-28",
    labelTanggal: "28 Okt",
    deskripsi: "Gaji Part-Time",
    detail: "Jasa Desain Poster",
    kategori: "Pemasukan",
    nominal: 500000,
  },
  {
    id: 105,
    tanggal: "2026-10-27",
    labelTanggal: "27 Okt",
    deskripsi: "Langganan Canva",
    detail: "Paket Pro",
    kategori: "Lainnya",
    nominal: -75000,
  },
  {
    id: 106,
    tanggal: "2026-10-26",
    labelTanggal: "26 Okt",
    deskripsi: "Buku & cetak tugas",
    detail: "Keperluan Praktikum",
    kategori: "Kuliah",
    nominal: -200000,
  },
  {
    id: 107,
    tanggal: "2026-10-26",
    labelTanggal: "26 Okt",
    deskripsi: "Jajan Kopi",
    detail: "Kopi setelah kelas",
    kategori: "Makanan",
    nominal: -20000,
  },
  {
    id: 108,
    tanggal: "2026-10-25",
    labelTanggal: "25 Okt",
    deskripsi: "Top Up Game",
    detail: "Hiburan Akhir Pekan",
    kategori: "Hiburan",
    nominal: -100000,
  },
  {
    id: 109,
    tanggal: "2026-10-24",
    labelTanggal: "24 Okt",
    deskripsi: "Skincare",
    detail: "Facial Wash",
    kategori: "Shopping",
    nominal: -120000,
  },
  {
    id: 110,
    tanggal: "2026-10-01",
    labelTanggal: "01 Okt",
    deskripsi: "Uang Bulanan",
    detail: "Kiriman Orang Tua",
    kategori: "Pemasukan",
    nominal: 1500000,
  },
];

// State Aplikasi
let daftarTransaksi = muatDataTransaksi();
let filterJenisAktif = "Semua";
let filterKategoriAktif = "Semua";
let kataKunciCari = "";

/**
 * Memuat data dari localStorage atau menggunakan data awal jika belum tersedia
 */
function muatDataTransaksi() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    if (tersimpan) {
      return JSON.parse(tersimpan);
    }
  } catch (err) {
    console.warn("Gagal membaca localStorage:", err);
  }
  return [...transaksiAwal];
}

/**
 * Menyimpan perubahan daftar transaksi ke localStorage
 */
function simpanKeStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarTransaksi));
  } catch (err) {
    console.warn("Gagal menyimpan ke localStorage:", err);
  }
}

/**
 * Memformat angka menjadi format mata uang Rupiah (contoh: Rp 50.000)
 */
function formatRupiah(angka, tampilkanTanda = false) {
  const nilaiAbsolut = Math.abs(angka).toLocaleString("id-ID");
  if (!tampilkanTanda) {
    return `Rp ${nilaiAbsolut}`;
  }
  return `${angka < 0 ? "- " : "+ "}Rp ${nilaiAbsolut}`;
}

/**
 * Mengubah string tanggal YYYY-MM-DD menjadi format singkat (contoh: 30 Okt)
 */
function formatTanggalSingkat(tanggalIso) {
  const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const bagian = tanggalIso.split("-");
  if (bagian.length !== 3) return "30 Okt";
  const hari = bagian[2];
  const indeksBulan = parseInt(bagian[1], 10) - 1;
  return `${hari} ${namaBulan[indeksBulan] || "Okt"}`;
}

/**
 * Menentukan warna badge kategori
 */
function warnaTagKategori(kategori, nominal) {
  if (nominal > 0 || kategori === "Pemasukan") return "tag-green";
  if (kategori === "Makanan") return "tag-orange";
  if (kategori === "Transportasi") return "tag-blue";
  if (kategori === "Kuliah") return "tag-purple";
  return "tag-teal";
}

/**
 * KOMPONEN 3: Menghitung ulang Total Pemasukan, Total Pengeluaran, dan Sisa Uang
 */
function hitungRingkasan() {
  const itemPemasukan = daftarTransaksi.filter((t) => t.nominal > 0);
  const itemPengeluaran = daftarTransaksi.filter((t) => t.nominal < 0);

  const totalMasuk = itemPemasukan.reduce((acc, item) => acc + item.nominal, 0);
  const totalKeluar = itemPengeluaran.reduce((acc, item) => acc + Math.abs(item.nominal), 0);
  const sisaSaldo = totalMasuk - totalKeluar;
  const persentaseSisa = totalMasuk > 0 ? Math.max(0, ((sisaSaldo / totalMasuk) * 100)).toFixed(1).replace(".", ",") : "0";

  document.getElementById("total-pemasukan").textContent = formatRupiah(totalMasuk);
  document.getElementById("sub-pemasukan").textContent = `${itemPemasukan.length} transaksi pemasukan`;

  document.getElementById("total-pengeluaran").textContent = formatRupiah(totalKeluar);
  document.getElementById("sub-pengeluaran").textContent = `${itemPengeluaran.length} transaksi pengeluaran`;

  document.getElementById("sisa-uang").textContent = formatRupiah(sisaSaldo);
  document.getElementById("sub-sisa").textContent =
    sisaSaldo >= 0
      ? `${persentaseSisa}% dari pemasukan masih tersedia`
      : "Pengeluaran melebihi pemasukan bulan ini";

  const elSelisih = document.getElementById("selisih-bersih");
  elSelisih.textContent = `Selisih bersih ${formatRupiah(sisaSaldo, true)}`;
}

/**
 * KOMPONEN 2 & 4: Menyaring dan me-render baris transaksi ke dalam tabel DOM
 */
function filterTransaksi() {
  const kontainer = document.getElementById("list-transaksi");
  const infoJumlah = document.getElementById("info-jumlah-transaksi");

  const hasilFilter = daftarTransaksi.filter((item) => {
    const cocokJenis =
      filterJenisAktif === "Semua" ||
      (filterJenisAktif === "Pemasukan" ? item.nominal > 0 : item.nominal < 0);

    const cocokKategori =
      filterKategoriAktif === "Semua" || item.kategori === filterKategoriAktif;

    const teksCari = `${item.deskripsi} ${item.detail} ${item.kategori}`.toLowerCase();
    const cocokCari = teksCari.includes(kataKunciCari.toLowerCase());

    return cocokJenis && cocokKategori && cocokCari;
  });

  kontainer.innerHTML = "";

  if (hasilFilter.length === 0) {
    const kosong = document.createElement("div");
    kosong.className = "empty-state";
    kosong.textContent = "Tidak ada transaksi yang sesuai dengan filter atau pencarianmu.";
    kontainer.appendChild(kosong);
  } else {
    hasilFilter.forEach((item) => {
      const baris = document.createElement("div");
      baris.className = "transaction-row";

      const kelasNominal = item.nominal > 0 ? "income" : "expense";
      const kelasTag = warnaTagKategori(item.kategori, item.nominal);

      baris.innerHTML = `
        <time datetime="${item.tanggal}">${item.labelTanggal}</time>
        <div class="transaction-name">
          <b>${item.deskripsi}</b>
          <small>${item.detail}</small>
        </div>
        <span class="tag ${kelasTag}">${item.kategori}</span>
        <strong class="${kelasNominal}">${formatRupiah(item.nominal, true)}</strong>
        <button type="button" class="btn-delete" data-id="${item.id}" aria-label="Hapus ${item.deskripsi}" title="Hapus transaksi">
          &times;
        </button>
      `;
      kontainer.appendChild(baris);
    });
  }

  infoJumlah.textContent = `Menampilkan ${hasilFilter.length} dari ${daftarTransaksi.length} transaksi • Oktober 2026`;
}

/**
 * KOMPONEN 5: Memvalidasi input Form Tambah Transaksi sebelum disimpan
 */
function validasiTransaksi(deskripsi, nominal, kategori, tanggal) {
  if (!deskripsi || deskripsi.trim().length < 3) {
    return { valid: false, pesan: "Nama transaksi wajib diisi (minimal 3 karakter)." };
  }
  if (Number.isNaN(nominal) || nominal <= 0) {
    return { valid: false, pesan: "Jumlah nominal harus berupa angka lebih dari Rp 0." };
  }
  if (!kategori) {
    return { valid: false, pesan: "Silakan pilih kategori transaksi terlebih dahulu." };
  }
  if (!tanggal) {
    return { valid: false, pesan: "Tanggal transaksi wajib diisi." };
  }
  return { valid: true, pesan: "Transaksi berhasil dicatat!" };
}

/**
 * KOMPONEN 5: Menambahkan transaksi baru ke state, memperbarui UI, dan mereset form
 */
function tambahTransaksi(event) {
  event.preventDefault();

  const jenis = document.getElementById("input-jenis").value;
  const inputDeskripsi = document.getElementById("input-deskripsi");
  const inputNominal = document.getElementById("input-nominal");
  const inputKategori = document.getElementById("input-kategori");
  const inputTanggal = document.getElementById("input-tanggal");
  const pesanEl = document.getElementById("pesan-validasi");
  const statusDraf = document.getElementById("status-draf");

  const deskripsi = inputDeskripsi.value.trim();
  const nominalAngka = parseFloat(inputNominal.value);
  const kategori = inputKategori.value;
  const tanggal = inputTanggal.value;

  const hasilValidasi = validasiTransaksi(deskripsi, nominalAngka, kategori, tanggal);

  if (!hasilValidasi.valid) {
    pesanEl.hidden = false;
    pesanEl.className = "form-feedback error";
    pesanEl.textContent = hasilValidasi.pesan;
    return;
  }

  const nilaiAkhir = jenis === "Pemasukan" ? Math.abs(nominalAngka) : -Math.abs(nominalAngka);

  const transaksiBaru = {
    id: Date.now(),
    tanggal: tanggal,
    labelTanggal: formatTanggalSingkat(tanggal),
    deskripsi: deskripsi,
    detail: jenis === "Pemasukan" ? "Pemasukan tambahan" : `Catatan ${kategori.toLowerCase()}`,
    kategori: kategori,
    nominal: nilaiAkhir,
  };

  daftarTransaksi.unshift(transaksiBaru);
  simpanKeStorage();
  hitungRingkasan();
  filterTransaksi();

  // Tampilkan umpan balik berhasil
  pesanEl.hidden = false;
  pesanEl.className = "form-feedback success";
  pesanEl.textContent = `Berhasil mencatat "${deskripsi}" (${formatRupiah(nilaiAkhir, true)})`;
  statusDraf.textContent = "Tersimpan";
  statusDraf.className = "tag tag-green";

  tampilkanToast(`Transaksi "${deskripsi}" berhasil disimpan.`);

  // Reset field input
  inputDeskripsi.value = "";
  inputNominal.value = "";
  if (jenis !== "Pemasukan") {
    inputKategori.value = "";
  }

  setTimeout(() => {
    pesanEl.hidden = true;
    statusDraf.textContent = "Draf";
    statusDraf.className = "tag tag-dark";
  }, 3000);
}

/**
 * Menghapus transaksi berdasarkan ID
 */
function hapusTransaksi(idTransaksi) {
  const target = daftarTransaksi.find((t) => t.id === idTransaksi);
  daftarTransaksi = daftarTransaksi.filter((t) => t.id !== idTransaksi);
  simpanKeStorage();
  hitungRingkasan();
  filterTransaksi();
  if (target) {
    tampilkanToast(`Transaksi "${target.deskripsi}" dihapus.`);
  }
}

/**
 * KOMPONEN 1: Membuka atau menutup sidebar pada layar mobile
 */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const btnMenu = document.getElementById("btn-mobile-menu");
  const terbuka = sidebar.classList.toggle("open");
  btnMenu.setAttribute("aria-expanded", String(terbuka));
}

/**
 * Memilih kategori cepat dari panel Pintasan Kategori
 */
function pilihPintasanKategori(kategori) {
  const selectKategori = document.getElementById("input-kategori");
  const inputJenis = document.getElementById("input-jenis");
  const btnMasuk = document.getElementById("btn-jenis-pemasukan");
  const btnKeluar = document.getElementById("btn-jenis-pengeluaran");

  selectKategori.value = kategori;

  if (kategori === "Pemasukan") {
    inputJenis.value = "Pemasukan";
    btnMasuk.classList.add("selected");
    btnKeluar.classList.remove("selected");
  } else {
    inputJenis.value = "Pengeluaran";
    btnKeluar.classList.add("selected");
    btnMasuk.classList.remove("selected");
  }

  document.querySelectorAll(".shortcut-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.category === kategori);
  });

  document.getElementById("input-deskripsi").focus();
  tampilkanToast(`Kategori "${kategori}" dipilih pada form.`);
}

/**
 * Menampilkan toast notifikasi singkat di pojok kanan bawah
 */
let toastTimer = null;
function tampilkanToast(pesan) {
  const toast = document.getElementById("toast-notifikasi");
  const teks = document.getElementById("toast-teks");
  teks.textContent = pesan;
  toast.hidden = false;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

/**
 * Inisialisasi seluruh Event Listener saat DOM selesai dimuat
 */
document.addEventListener("DOMContentLoaded", () => {
  hitungRingkasan();
  filterTransaksi();

  // Event Listener Form Submit
  document.getElementById("form-transaksi").addEventListener("submit", tambahTransaksi);

  // Event Listener Pemilih Jenis Transaksi (Pemasukan / Pengeluaran)
  document.querySelectorAll(".type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const jenisBaru = btn.dataset.type;
      document.getElementById("input-jenis").value = jenisBaru;

      const selectKategori = document.getElementById("input-kategori");
      if (jenisBaru === "Pemasukan") {
        selectKategori.value = "Pemasukan";
      } else if (selectKategori.value === "Pemasukan") {
        selectKategori.value = "";
      }
    });
  });

  // Event Listener Tab Filter (Semua / Pemasukan / Pengeluaran)
  document.querySelectorAll("#tab-filter-jenis .tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#tab-filter-jenis .tab-btn").forEach((b) => {
        b.classList.remove("selected");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("selected");
      btn.setAttribute("aria-selected", "true");
      filterJenisAktif = btn.dataset.filter;
      filterTransaksi();
    });
  });

  // Event Listener Dropdown Filter Kategori
  document.getElementById("filter-kategori").addEventListener("change", (e) => {
    filterKategoriAktif = e.target.value;
    filterTransaksi();
  });

  // Event Listener Input Pencarian Real-Time
  document.getElementById("input-cari").addEventListener("input", (e) => {
    kataKunciCari = e.target.value;
    filterTransaksi();
  });

  // Event Listener Hapus Transaksi (Event Delegation)
  document.getElementById("list-transaksi").addEventListener("click", (e) => {
    const tombolHapus = e.target.closest(".btn-delete");
    if (tombolHapus) {
      const id = Number(tombolHapus.dataset.id);
      hapusTransaksi(id);
    }
  });

  // Event Listener Reset Data ke Awal
  document.getElementById("btn-reset-data").addEventListener("click", () => {
    daftarTransaksi = [...transaksiAwal];
    simpanKeStorage();
    hitungRingkasan();
    filterTransaksi();
    tampilkanToast("Data transaksi dikembalikan ke pengaturan awal.");
  });

  // Event Listener Pintasan Kategori
  document.querySelectorAll(".shortcut-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      pilihPintasanKategori(btn.dataset.category);
    });
  });

  // Event Listener Toggle Sidebar Mobile
  document.getElementById("btn-mobile-menu").addEventListener("click", toggleSidebar);

  // Event Listener Menu Sidebar Navigasi
  document.querySelectorAll("#nav-utama .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const halaman = btn.dataset.page;
      if (halaman !== "Transaksi") {
        tampilkanToast(`Halaman ${halaman} merupakan bagian dari rancangan penuh. Demo Tugas 2 berfokus pada Halaman Transaksi.`);
      }
      const sidebar = document.getElementById("sidebar");
      if (sidebar.classList.contains("open")) {
        toggleSidebar();
      }
    });
  });
});

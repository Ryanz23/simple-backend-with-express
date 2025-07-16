# Backend TypeScript MySQL API

Simple REST API menggunakan Express, TypeScript, dan MySQL.

---

## Fitur

### User Namagement (`/users`)

- Tambah user
- Lihat daftar user
- Update user
- Hapus user
- Validasi input (email, name)
- Error handling lengkap (404, 500, invalid format)

### Sistem Pendukung Keputusan (SPK) - Metode SMART (`/smart`)

- Tambah **kriteria** dengan bobot (`/smart/criteria`)
- Tambah **alternatif** pilihan (`/smart/alternatives`)
- Input **skor** tiap alternatif terhadap semua kriteria (`/smart/scores`)
- Hitung **peringkat alternatif** berdasarkan metode **SMART**
- Response berupa urutan alternatif dari nilai tertinggi ke terendah

### Konfigurasi

- `CORS` aktif untuk integrasi frontend terpisah
- Gunakan `.env` untuk konfigurasi database & port
- Struktur modular:
  - `routes/`, `controllers/`, `config/`, `types/`, `utils/`
- Gunakan `UUID v4` untuk ID unik pada:
  - User
  - Criteria
  - Alternatives
  - Scores

### Endpoint Cek Kesehatan Server

- `GET /health` untuk memastikan server berjalan normal

---

## Prasyarat

- Node.js v16+
- MySQL server sudah berjalan
- npm

---

## Setup

1. **Clone repo**

```bash
git clone https://github.com/ryanz23/simple-backend-with-express.git
```

2. **Buka folder**

```bash
cd simple-backend-with-express
```

3. **Install dependencies**

```bash
npm install
```

4. **Buat database MySQL**

```bash
CREATE DATABASE simple_db;
```

5. **Import schema table**

```bash
mysql -u your_username -p simple_db < database/schema.sql
```

6. **Konfigurasi `.env` (tidak disertakan dalam repositori, silahkan buat manual)**

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=simple_db

# Server Configuration
PORT=3000
NODE_ENV=development
```

7. **Jalankan server**

```bash
npm run dev
```

---

## Struktur Folder

```bash
simple-backend-with-express/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   ├── └── smart.controller.ts
│   ├── routes/
│   │   ├── smart.ts
│   │   └── users.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── smart.ts
│   └── server.ts
├── .eslintrc.json
├── .gitignore
├── eslint.config.mjs
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## Kolaborasi

Proyek ini terbuka untuk kontribusi dan kolaborasi! Kalau kamu punya ide fitur baru, perbaikan, atau ingin diskusi soal pengembangan, jangan ragu buat buka issue atau pull request di GitHub.

&copy; 2025 Ryanz23

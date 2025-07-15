# Backend TypeScript MySQL API

Simple REST API menggunakan Express, TypeScript, dan MySQL.

---

## Fitur

- CRUD data user (`/users`)
- Validasi input dan error handling
- CORS enabled
- Environment variables dengan `.env`
- Struktur project modular

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

## Kolaborasi
Proyek ini terbuka untuk kontribusi dan kolaborasi! Kalau kamu punya ide fitur baru, perbaikan, atau ingin diskusi soal pengembangan, jangan ragu buat buka issue atau pull request di GitHub.

&copy; 2025 Ryanz23
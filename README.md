# Cuci Mobil Panggilan

Aplikasi pemesanan jasa cuci kendaraan langsung ke rumah atau kantor.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (Cloud SQL) + MongoDB (GCE)
- **Web Admin:** React (Vite) + Tailwind CSS
- **Mobile App:** Flutter
- **Deployment:** Google Cloud Run, Cloud Storage

## Arsitektur

```
┌──────────┐   ┌──────────────┐   ┌─────────────┐
│ Frontend │   │ Auth Service │   │ API Service  │
│ (React)  │   │  (Express)   │   │  (Express)   │
│ :3000    │   │  :5000       │   │  :5001       │
└──────────┘   └──────┬───────┘   └──────┬───────┘
                      │                   │
                ┌─────┴─────┐    ┌────────┴───────┐
                │  MySQL    │    │   MongoDB      │
                │  :3306    │    │   :27017       │
                └───────────┘    └────────────────┘
```

---

## Prasyarat

Pastikan sudah terinstall di PC:

1. **Docker Desktop** — [Download](https://www.docker.com/products/docker-desktop/)
2. **Node.js v18+** — [Download](https://nodejs.org/)
3. **Flutter SDK** (untuk mobile app) — [Download](https://docs.flutter.dev/get-started/install)
4. **Git** — [Download](https://git-scm.com/)

---

## Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone <URL_REPOSITORY>
```

### 2. Nyalakan Docker Desktop

Buka aplikasi Docker Desktop, tunggu sampai statusnya **Running**.

### 3. Jalankan Backend (Docker Compose)

```bash
docker compose up --build -d
```

Ini akan menjalankan 4 container sekaligus:
| Container | Port | Keterangan |
|-----------|------|------------|
| MySQL | 3306 | Database SQL (auto create tabel + seed data) |
| MongoDB | 27017 | Database NoSQL |
| Auth Service | 5000 | API autentikasi |
| API Service | 5001 | API utama (CRUD) |

Tunggu ~1 menit, lalu cek semua container running:

```bash
docker compose ps
```

Pastikan semua STATUS = **Up**.

Test backend sudah jalan:

```bash
curl http://localhost:5000/health
curl http://localhost:5001/health
```

Kedua endpoint harus mengembalikan `{"status":"OK"}`.

### 4. Jalankan Web Admin (React)

```bash
cd frontend/web-admin
npm install
npm run dev
```

Buka browser ke **http://localhost:3000**

Login admin:
- **Email:** `admin@cucimobil.com`
- **Password:** `password`

### 5. Jalankan Mobile App (Flutter)

```bash
cd frontend/mobile-app
flutter pub get
flutter create . --platforms web       # (pertama kali saja)
flutter run -d chrome --web-port 8080
```

Atau jika ingin jalankan di HP Android:
```bash
flutter run
```

Login / Register sebagai customer untuk test.

---

## Akun Default (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cucimobil.com | password |

Data seed lainnya:
- 3 Staff (Budi, Andi, Rudi)
- 8 Paket Layanan (Motor, Mobil Kecil, Mobil Besar, SUV)

---

## API Endpoints (26 total)

### Auth Service (:5000)

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | /api/auth/register | Register user baru |
| POST | /api/auth/login | Login |
| GET | /api/auth/profile | Get profil (perlu token) |
| PUT | /api/auth/profile | Update profil (perlu token) |

### API Service (:5001)

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | /api/staff | List semua staff |
| GET | /api/staff/:id | Detail staff |
| POST | /api/staff | Tambah staff (admin) |
| PUT | /api/staff/:id | Edit staff (admin) |
| DELETE | /api/staff/:id | Hapus staff (admin) |
| GET | /api/packages | List paket layanan |
| POST | /api/packages | Tambah paket (admin) |
| PUT | /api/packages/:id | Edit paket (admin) |
| DELETE | /api/packages/:id | Hapus paket (admin) |
| GET | /api/orders | List pesanan |
| GET | /api/orders/:id | Detail pesanan |
| POST | /api/orders | Buat pesanan |
| PUT | /api/orders/:id | Update pesanan |
| DELETE | /api/orders/:id | Batalkan pesanan |
| POST | /api/ratings | Beri rating |
| GET | /api/ratings/staff/:id | Rating staff |
| GET | /api/schedules | List jadwal |
| POST | /api/schedules | Buat jadwal (admin) |
| PUT | /api/tracking/:staffId | Update lokasi staff |
| GET | /api/tracking/:staffId | Get lokasi staff |
| POST | /api/chat/:orderId | Kirim chat |
| GET | /api/chat/:orderId | Get chat messages |

---

## Struktur Folder

```
├── backend/
│   ├── auth-service/          # Service autentikasi (JWT)
│   └── api-service/           # Service utama (CRUD + NoSQL)
├── frontend/
│   ├── web-admin/             # React admin dashboard
│   └── mobile-app/            # Flutter mobile app
├── database/
│   └── init.sql               # Schema MySQL + seed data
└── docker-compose.yml         # Local development
```

---

## Troubleshooting

**Docker compose gagal:**
- Pastikan Docker Desktop sudah running (icon hijau di system tray)
- Pastikan port 3306, 5000, 5001, 27017 tidak dipakai aplikasi lain

**npm install error:**
- Pastikan Node.js versi 18+ (`node -v`)
- Hapus `node_modules` lalu `npm install` ulang

**Flutter error:**
- Jalankan `flutter doctor` untuk cek masalah
- Pastikan `flutter pub get` sudah berhasil

**Login admin gagal:**
- Pastikan container MySQL sudah running: `docker logs cuci-mobil-mysql`
- Cek auth service: `docker logs cuci-mobil-auth`

**Mau reset database:**
```bash
docker compose down -v
docker compose up --build -d
```

---

## Tim Pengembang

Kelompok Project Akhir - Praktikum Teknologi Cloud Computing

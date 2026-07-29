# Aplikasi Yang Menurut Kamu Lagi Hype Enterprise

Manajemen Proyek.

## Fitur

*   Manajemen Tugas
*   Bagan Gantt
*   Papan Kanban
*   Kolaborasi Tim
*   Pelaporan & Analitik
*   Alokasi Sumber Daya
*   Pelacakan Waktu

## Teknologi

*   Backend: Node.js, Express.js, Turso SQLite
*   Frontend: React, Vite, Tailwind CSS
*   Database: Turso SQLite

## Instalasi

1.  **Kloning repositori:**
    ```bash
    git clone [URL REPOSITORI ANDA]
    cd aplikasi-hype-enterprise
    ```

2.  **Setup Backend:**
    *   Instal dependensi:
        ```bash
        cd backend
        npm install
        ```
    *   Buat file `.env` di direktori `backend` dan isi dengan kredensial Turso Anda:
        ```env
        TURSO_URL=https://[URL TURSO ANDA]
        TURSO_TOKEN=[TOKEN TURSO ANDA]
        JWT_SECRET=[RAHASIA JWT ANDA]
        ```
    *   Jalankan migrasi database (jika ada):
        ```bash
        npm run migrate
        ```
    *   Mulai server:
        ```bash
        npm start
        ```

3.  **Setup Frontend:**
    *   Instal dependensi:
        ```bash
        cd frontend
        npm install
        ```
    *   Buat file `.env` di direktori `frontend` dan atur URL backend Anda:
        ```env
        VITE_API_URL=http://localhost:[PORT BACKEND ANDA]
        ```
    *   Mulai server pengembangan:
        ```bash
        npm run dev
        ```

## Penggunaan

Akses aplikasi melalui browser Anda di `http://localhost:5173` (atau port yang dikonfigurasi).

## Struktur Proyek

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── README.md
└── package.json
```

## Multi-Tenancy

Aplikasi ini mendukung multi-tenancy menggunakan skema database terpisah untuk setiap tenant. ID tenant dikelola melalui otentikasi JWT.

## Keamanan

*   Gunakan `JWT_SECRET` yang kuat dan jaga kerahasiaannya.
*   Validasi semua input pengguna.
*   Implementasikan rate limiting pada API.

## Lisensi

[Lisensi Anda]
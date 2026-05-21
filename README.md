# AuditGuard - Enterprise Compliance Platform

![AuditGuard](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

Platform kepatuhan perusahaan dengan visibilitas terpusat untuk audit sistem kritis dan deteksi anomali waktu nyata.

## 🚀 Fitur Utama

- **Dashboard Real-time** - Pemantauan audit dan status kepatuhan secara langsung
- **Manajemen Insiden** - CRUD lengkap untuk log insiden keamanan
- **Log Audit Pengguna** - Pelacakan aktivitas pengguna secara mendetail
- **Deteksi Anomali** - Alert dan peringatan untuk aktivitas mencurigakan
- **Analitik Sistem** - Visualisasi data dan metrik kepatuhan
- **Pengaturan Fleksibel** - Konfigurasi sistem dan manajemen pengguna

## 📋 Prasyarat

- Node.js 18.x atau lebih tinggi
- npm atau yarn

## 🛠️ Instalasi

1. Clone repository:

```bash
git clone https://github.com/yourusername/AuditGuard.git
cd AuditGuard
```

2. Install dependencies:

```bash
npm install
# atau
yarn install
```

3. Jalankan development server:

```bash
npm run dev
# atau
yarn dev
```

4. Buka browser dan akses [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
AuditGuard/
├── app/
│   ├── dashboard/          # Halaman dashboard utama
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Halaman login
├── components/
│   ├── Sidebar.tsx         # Komponen navigasi sidebar
│   ├── TopNav.tsx          # Komponen navigasi atas
│   └── Toast.tsx           # Komponen notifikasi
├── public/                 # Static assets
├── tailwind.config.ts      # Konfigurasi Tailwind CSS
├── tsconfig.json           # Konfigurasi TypeScript
└── package.json            # Dependencies
```

## 🎨 Design System

AuditGuard menggunakan Material Design 3 dengan custom color palette:

- **Primary**: Navy Custom (#0f172a)
- **Secondary**: Blue (#505f76)
- **Error**: Red (#ba1a1a)
- **Success**: Neon Green (#39FF14)

## 🔐 Keamanan

- Autentikasi pengguna
- Role-based access control
- Audit trail lengkap
- Enkripsi data sensitif
- Compliance dengan SOC2 Type II

## 📱 Halaman

- `/` - Login
- `/dashboard` - Dashboard utama
- `/incidents` - Manajemen insiden (Coming soon)
- `/audit-logs` - Log audit (Coming soon)
- `/alerts` - Alert & anomali (Coming soon)
- `/analytics` - Analitik (Coming soon)
- `/settings` - Pengaturan (Coming soon)

## 🚧 Roadmap

- [ ] Implementasi halaman Incidents lengkap
- [ ] Implementasi halaman Audit Logs
- [ ] Implementasi halaman Alerts & Anomaly
- [ ] Implementasi halaman Analytics
- [ ] Implementasi halaman Settings
- [ ] Integrasi API backend
- [ ] Autentikasi real dengan JWT
- [ ] Export laporan PDF/Excel
- [ ] Dark mode support
- [ ] Multi-language support

## 🤝 Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## 📄 Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Tim

- **Developer**: Your Name
- **Designer**: Your Name
- **Project Manager**: Your Name

## 📞 Kontak

Untuk pertanyaan atau dukungan, hubungi:

- Email: support@auditguard.com
- Website: https://auditguard.com

---

Dibuat dengan ❤️ menggunakan Next.js dan Tailwind CSS

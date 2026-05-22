-- =============================================
-- BUAT TABEL
-- =============================================

create table if not exists public.incidents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  severity text check (severity in ('rendah','sedang','tinggi','kritis')) default 'sedang',
  status text check (status in ('terbuka','dalam-proses','selesai')) default 'terbuka',
  target text,
  assigned_to text,
  created_at timestamptz default now()
);

create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id text,
  action text,
  ip_address text,
  status text check (status in ('berhasil','peringatan')) default 'berhasil',
  created_at timestamptz default now()
);

create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  severity text check (severity in ('kritis','peringatan','minor')) default 'minor',
  title text,
  description text,
  status text default 'aktif',
  created_at timestamptz default now()
);

-- =============================================
-- DATA DUMMY
-- =============================================

insert into public.incidents (title, description, severity, status, target, assigned_to) values
('Percobaan SQL Injection', 'Terdeteksi query berbahaya pada endpoint login', 'kritis', 'terbuka', 'DB Cluster-04', 'Tim Keamanan'),
('Akses S3 Tidak Sah', 'Upaya akses bucket tanpa otorisasi', 'kritis', 'terbuka', 'bucket-finance-prod', 'Tim Infrastruktur'),
('Reset Password Massal', 'Lebih dari 50 reset password dalam 1 jam', 'tinggi', 'dalam-proses', 'IAM-Controller', 'Tim Audit'),
('Brute Force Login', 'Percobaan login berulang dari IP asing', 'tinggi', 'dalam-proses', 'Auth Gateway', 'Tim Keamanan'),
('Anomali Traffic API', 'Lonjakan trafik tidak wajar pada /api/v2', 'sedang', 'terbuka', 'API Gateway', 'Tim DevOps'),
('Perubahan Konfigurasi Firewall', 'Aturan firewall diubah tanpa approval', 'sedang', 'selesai', 'Firewall-01', 'Tim Jaringan'),
('Akses Data Sensitif', 'Pengguna mengakses data di luar wewenang', 'rendah', 'selesai', 'DB-HR-Prod', 'Tim Compliance');

insert into public.audit_logs (user_id, action, ip_address, status) values
('admin_user', 'Perbarui Aturan Firewall', '192.168.1.1', 'berhasil'),
('operator_2', 'Lihat Insiden #9021', '192.168.1.5', 'berhasil'),
('guest_acc', 'Gagal Login', '45.12.33.1', 'peringatan'),
('manager_01', 'Logout Sistem', '192.168.1.12', 'berhasil'),
('admin_user', 'Tambah Pengguna Baru', '192.168.1.1', 'berhasil'),
('operator_2', 'Export Laporan PDF', '192.168.1.5', 'berhasil'),
('guest_acc', 'Akses Ditolak - /admin', '45.12.33.1', 'peringatan'),
('manager_01', 'Update Kebijakan Akses', '192.168.1.12', 'berhasil'),
('admin_user', 'Hapus Log Lama', '192.168.1.1', 'berhasil'),
('operator_3', 'Login Berhasil', '10.0.0.5', 'berhasil');

insert into public.alerts (severity, title, description, status) values
('kritis', 'Upaya Brute Force', '50+ login gagal dari IP 45.12.33.1', 'aktif'),
('kritis', 'Akses Database Tidak Sah', 'Query DROP TABLE terdeteksi pada DB Cluster-04', 'aktif'),
('peringatan', 'Volume API Tidak Biasa', 'Lonjakan trafik pada /api/v2/financial-records', 'aktif'),
('peringatan', 'Sertifikat SSL Hampir Kadaluarsa', 'Sertifikat domain utama kadaluarsa dalam 7 hari', 'aktif'),
('minor', 'Login dari Lokasi Baru', 'Pengguna manager_01 login dari Singapore', 'aktif'),
('minor', 'Backup Terlambat', 'Jadwal backup harian terlewat 2 jam', 'aktif');

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table public.incidents enable row level security;
alter table public.audit_logs enable row level security;
alter table public.alerts enable row level security;

create policy "read_incidents" on public.incidents for select using (auth.role() = 'authenticated');
create policy "write_incidents" on public.incidents for all using (auth.role() = 'authenticated');
create policy "read_audit_logs" on public.audit_logs for select using (auth.role() = 'authenticated');
create policy "write_audit_logs" on public.audit_logs for all using (auth.role() = 'authenticated');
create policy "read_alerts" on public.alerts for select using (auth.role() = 'authenticated');
create policy "write_alerts" on public.alerts for all using (auth.role() = 'authenticated');

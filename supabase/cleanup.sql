-- =============================================
-- CLEANUP: Sesuaikan tabel dengan yang dipakai web
-- Jalankan di Supabase SQL Editor
-- =============================================

-- =============================================
-- TABEL: profiles
-- Yang dipakai web: id, full_name, email, department
-- Yang tidak dipakai: role, employee_id
-- =============================================
alter table public.profiles drop column if exists role;
alter table public.profiles drop column if exists employee_id;

-- =============================================
-- TABEL: incidents
-- Yang dipakai web: id, title, description, severity, status, target, assigned_to, created_at
-- Semua kolom dipakai, tidak ada yang dihapus
-- =============================================

-- =============================================
-- TABEL: audit_logs
-- Yang dipakai web: id, user_id, action, ip_address, status, created_at
-- Semua kolom dipakai, tidak ada yang dihapus
-- =============================================

-- =============================================
-- TABEL: alerts
-- Yang dipakai web: id, severity, title, description, status, created_at
-- Semua kolom dipakai, tidak ada yang dihapus
-- =============================================

-- =============================================
-- Verifikasi struktur tabel setelah cleanup
-- =============================================
select column_name, data_type 
from information_schema.columns 
where table_schema = 'public' 
  and table_name = 'profiles'
order by ordinal_position;

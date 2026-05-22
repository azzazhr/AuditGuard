'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { useState } from 'react';

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@auditguard.com',
    department: 'Kepatuhan & Audit Internal',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEditModal(false);
    setTimeout(() => showToast('Informasi diperbarui'), 400);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setTimeout(() => showToast('Data dihapus', 'error'), 400);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <TopNav />
        <main className="pt-24 px-8 pb-12 min-h-screen">
          <div className="max-w-[1440px] mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <nav className="flex text-[12px] text-on-surface-variant mb-1 gap-2 uppercase tracking-wider font-medium">
                  <span>Utama</span>
                  <span className="opacity-30">/</span>
                  <span className="text-primary">Profil Pengguna</span>
                </nav>
                <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">
                  Profil Pengguna
                </h2>
                <p className="text-on-surface-variant font-body-sm">
                  Kelola informasi pribadi dan keamanan akun Anda.
                </p>
              </div>
            </div>

            {/* Profile Header */}
            <section className="bg-white/80 backdrop-blur-xl border border-outline-variant rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl -z-10"></div>

              <div className="relative group">
                <img
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg0f86HzuYEwmjM-QPHFY51BIXNVyVnf99ckwXEqlvFW_XUKylG2GgzqUTN0_QsN8aM_rB1olE5DylfyChIMKy9oeBMDxAkUi6LY2el_YDRSgc58PXUkGvLum_Y8I59EAlZPXgLskrgbsXMJgcRFmnGloC4PMmBQ09-_VuK71L9Sy7frxNisuzhJ_49Z9oS_sKHL3n5JL2upaQ4qKuVfkRlSHBXUDrdNtfpGmGqB4EuvOrtPFbokXFOyeCLkhmhRYh1KjOPEL3bR9z"
                  alt="Alex Rivera"
                />
                <button className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-lg shadow-md hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </button>
              </div>

              <div className="text-center md:text-left flex-1">
                <h2 className="text-[36px] font-bold text-primary leading-tight">{formData.name}</h2>
                <p className="text-on-surface-variant font-medium text-[20px] mt-1">Ketua Kepatuhan</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-[12px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Akun Terverifikasi
                  </span>
                  <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full text-[12px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">apartment</span>
                    Kantor Pusat
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowEditModal(true)}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Ubah Profil
              </button>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Informasi Pribadi */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white/80 backdrop-blur-xl border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                    <h3 className="font-bold text-[20px] text-primary">Informasi Pribadi</h3>
                  </div>
                  <div className="p-6 divide-y divide-outline-variant/30">
                    {[
                      { label: 'Nama Lengkap', value: formData.name },
                      { label: 'Email Kantor', value: formData.email },
                      { label: 'Departemen', value: formData.department },
                      { label: 'ID Karyawan', value: 'AG-982110-XR' },
                    ].map((row) => (
                      <div key={row.label} className="py-4 flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-on-surface-variant text-[11px] uppercase tracking-wider font-bold font-mono">
                            {row.label}
                          </p>
                          <p className="text-primary font-medium text-[16px]">{row.value}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setShowEditModal(true)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Cards */}
              <div className="space-y-6">
                {/* Keamanan */}
                <section className="bg-white/80 backdrop-blur-xl border border-outline-variant rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                    <h3 className="font-bold text-[20px] text-primary">Keamanan</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">passkey</span>
                      <div className="flex-1">
                        <p className="text-body-sm font-bold text-primary leading-tight">2FA Aktif</p>
                        <p className="text-[12px] text-on-surface-variant">Terakhir diatur 2 hari lalu</p>
                      </div>
                    </div>
                    <button className="w-full py-2 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors text-body-sm">
                      Ganti Kata Sandi
                    </button>
                  </div>
                </section>

                {/* Statistik */}
                <section className="bg-navy-custom rounded-xl p-6 shadow-sm text-on-primary">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">monitoring</span>
                    Statistik Aktivitas
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-on-primary/70 text-body-sm">Log Diperiksa</span>
                      <span className="font-bold">1,248</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-primary/70 text-body-sm">Laporan Dibuat</span>
                      <span className="font-bold">42</span>
                    </div>
                    <div className="w-full bg-on-primary/10 h-1.5 rounded-full mt-4">
                      <div className="bg-tertiary-fixed w-[75%] h-full rounded-full"></div>
                    </div>
                    <p className="text-[11px] text-on-primary/50 text-center uppercase tracking-tighter font-bold">
                      Target Bulanan: 75% Tercapai
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-[18px] text-primary">Ubah Informasi Profil</h3>
              <button onClick={() => setShowEditModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Nama Lengkap</label>
                <input
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Email</label>
                <input
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">Departemen</label>
                <select
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  <option>Kepatuhan &amp; Audit Internal</option>
                  <option>Manajemen Risiko</option>
                  <option>Teknologi Informasi</option>
                  <option>Sumber Daya Manusia</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="font-bold text-[18px] text-primary mb-2">Hapus Informasi?</h3>
            <p className="text-on-surface-variant text-body-sm mb-8">
              Apakah Anda yakin ingin menghapus detail informasi ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-error text-on-error font-bold rounded-lg hover:opacity-90 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-on-primary/10 min-w-[280px] transition-all ${
          toast.type === 'success' ? 'bg-navy-custom text-on-primary' : 'bg-error text-on-error'
        }`}>
          <span className="material-symbols-outlined text-tertiary-fixed">
            {toast.type === 'success' ? 'check_circle' : 'delete'}
          </span>
          <span className="font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

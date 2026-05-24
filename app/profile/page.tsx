'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRole } from '@/lib/useRole';

type FieldKey = 'name' | 'email' | 'department';

interface Field {
  key: FieldKey;
  label: string;
  type?: string;
  options?: string[];
}

const fields: Field[] = [
  { key: 'name', label: 'Nama Lengkap', type: 'text' },
  { key: 'email', label: 'Email', type: 'email' },
  {
    key: 'department',
    label: 'Departemen',
    options: ['Kepatuhan & Audit Internal', 'Manajemen Risiko', 'Teknologi Informasi', 'Sumber Daya Manusia'],
  },
];

export default function ProfilePage() {
  const { isAdmin, role } = useRole();
  const [data, setData] = useState<Record<FieldKey, string>>({
    name: '',
    email: '',
    department: 'Kepatuhan & Audit Internal',
  });
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState<Field | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteField, setDeleteField] = useState<Field | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pengguna';
        const email = user.email || '';
        setData(prev => ({ ...prev, name, email }));
        const parts = name.trim().split(' ');
        const ini = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase();
        setInitials(ini);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const openEdit = (field: Field) => {
    setEditField(field);
    setEditValue(data[field.key]);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editField) return;
    setData({ ...data, [editField.key]: editValue });
    setEditField(null);
    setTimeout(() => showToast(`${editField.label} berhasil diperbarui`), 300);
  };

  const handleDelete = () => {
    if (!deleteField) return;
    setData({ ...data, [deleteField.key]: '-' });
    setDeleteField(null);
    setTimeout(() => showToast(`${deleteField.label} dihapus`, 'error'), 300);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('Password tidak cocok', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('Password minimal 6 karakter', 'error');
      return;
    }
    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword });
    setPasswordLoading(false);
    if (error) {
      showToast('Gagal mengganti password: ' + error.message, 'error');
    } else {
      setShowPasswordModal(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => showToast('Password berhasil diperbarui'), 300);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px]">
        <TopNav />
        <main className="pt-20 px-4 lg:pt-24 lg:px-8 pb-12 min-h-screen">
          <div className="max-w-[1440px] mx-auto space-y-8">

            {/* Page Header */}
            <div className="mb-8">
              <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">
                Profil Pengguna
              </h2>
              <p className="text-on-surface-variant font-body-sm">
                Kelola informasi pribadi dan keamanan akun Anda.
              </p>
            </div>

            {/* Profile Header Card */}
            <section className="bg-white border border-outline-variant rounded-xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed/30 rounded-full blur-3xl -z-10"></div>
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-primary-fixed flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-primary font-bold text-[32px]">
                    {loading ? '...' : initials}
                  </span>
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-[36px] font-bold text-primary leading-tight">
                  {loading ? 'Memuat...' : data.name}
                </h2>
                <p className="text-on-surface-variant font-medium text-[16px] mt-1">{data.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-[12px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Akun Terverifikasi
                  </span>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[12px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield_person</span>
                    {role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </div>
              </div>
            </section>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Informasi Pribadi */}
              <div className="lg:col-span-2">
                <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant">
                    <h3 className="font-bold text-[20px] text-primary">Informasi Pribadi</h3>
                  </div>
                  <div className="p-6 divide-y divide-outline-variant/30">
                    {fields.map((field) => (
                      <div key={field.key} className="py-4 flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-on-surface-variant text-[11px] uppercase tracking-wider font-bold font-mono">
                            {field.label}
                          </p>
                          <p className="text-primary font-medium text-[16px]">{data[field.key] || '-'}</p>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isAdmin && (
                          <button
                            onClick={() => openEdit(field)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          )}
                          {isAdmin && (
                          <button
                            onClick={() => setDeleteField(field)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar Cards */}
              <div className="space-y-6">
                <section className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
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
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full py-2 border border-outline-variant text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors text-body-sm">
                      Ganti Kata Sandi
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditField(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-[18px] text-primary">Edit {editField.label}</h3>
              <button onClick={() => setEditField(null)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">
                  {editField.label}
                </label>
                {editField.options ? (
                  <select
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  >
                    {editField.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    type={editField.type || 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    required
                  />
                )}
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditField(null)}
                  className="flex-1 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteField && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteField(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[32px]">warning</span>
            </div>
            <h3 className="font-bold text-[18px] text-primary mb-2">Hapus {deleteField.label}?</h3>
            <p className="text-on-surface-variant text-body-sm mb-8">
              Data <span className="font-bold text-primary">{deleteField.label}</span> akan dihapus.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteField(null)}
                className="flex-1 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all">
                Batal
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2 bg-error text-on-error font-bold rounded-lg hover:opacity-90 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-[18px] text-primary">Ganti Kata Sandi</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">
                  Password Baru
                </label>
                <input
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-bold text-on-surface-variant tracking-wider">
                  Konfirmasi Password Baru
                </label>
                <input
                  className="w-full px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                  type="password"
                  placeholder="Ulangi password baru"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 text-on-surface-variant font-bold border border-outline-variant rounded-lg hover:bg-surface-container-low transition-all">
                  Batal
                </button>
                <button type="submit" disabled={passwordLoading}
                  className="flex-1 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50">
                  {passwordLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 z-[200] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[280px] ${
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



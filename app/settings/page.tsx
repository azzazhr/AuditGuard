'use client';

import Sidebar from '@/components/Sidebar';
import Toast from '@/components/Toast';
import TopNav from '@/components/TopNav';
import { FormEvent, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'aktif' | 'nonaktif';
  initials: string;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Alex Rivera',
      email: 'alex@auditguard.com',
      role: 'ADMIN UTAMA',
      status: 'aktif',
      initials: 'AR'
    },
    {
      id: '2',
      name: 'Sarah Bakri',
      email: 'sarah.b@auditguard.com',
      role: 'AUDITOR',
      status: 'aktif',
      initials: 'SB'
    }
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string>('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Auditor'
  });

  const [emailNotif, setEmailNotif] = useState(true);
  const [slackNotif, setSlackNotif] = useState(false);
  const [desktopNotif, setDesktopNotif] = useState(true);

  const openUserModal = (mode: 'create' | 'edit', user?: User) => {
    setModalMode(mode);
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Auditor'
      });
    }
    setShowUserModal(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (modalMode === 'create') {
      const newUser: User = {
        id: `${users.length + 1}`,
        name: formData.name,
        email: formData.email,
        role: formData.role.toUpperCase(),
        status: 'aktif',
        initials: formData.name.split(' ').map(n => n[0]).join('').toUpperCase()
      };
      setUsers([...users, newUser]);
      displayToast('Data pengguna berhasil disimpan', 'success');
    } else if (modalMode === 'edit' && currentUser) {
      setUsers(users.map(u => 
        u.id === currentUser.id 
          ? { ...u, name: formData.name, email: formData.email, role: formData.role.toUpperCase() }
          : u
      ));
      displayToast('Data pengguna berhasil diperbarui', 'success');
    }
    
    setShowUserModal(false);
  };

  const confirmDelete = (userId: string) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    setUsers(users.filter(u => u.id !== deleteUserId));
    setShowDeleteModal(false);
    displayToast('Pengguna telah dihapus', 'success');
  };

  const displayToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('PROD_KEY_89XC');
    displayToast('Kunci API disalin ke clipboard', 'success');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <TopNav />
        <main className="pt-24 px-8 pb-12 min-h-screen">
          <div className="max-w-[1440px] mx-auto">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  Pengaturan Sistem
                </h2>
                <p className="text-on-surface-variant font-body-sm">
                  Pengaturan Manajemen Pengguna
                </p>
              </div>
            </header>

            <div className="grid grid-cols-12 gap-6">
              {/* Section: Profil Pengguna & Notifikasi */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <section className="bg-white/70 backdrop-blur-xl border border-outline-variant p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline-sm text-headline-sm text-primary">Profil Saya</h3>
                    <span className="material-symbols-outlined text-primary/40">id_card</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative group cursor-pointer mb-4">
                      <img
                        alt="Alex Rivera"
                        className="w-24 h-24 rounded-full border-2 border-surface shadow-md"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxPXYVLEQ_bzIwancVk_5_qQtWF0Xz9KobSJ95oTbqiQpUHKGg3oQ5jEkg9yehhifA_IUlmwtEHI1nmhsLv5-8W5nf-Nen31l_b7jrQhUSED36Bi8mddO8zdxewhKgI6YVEavKPD0u2853iOPbQ6pcINd6P7DEBIQDtP-rvftpKdP_H0FkAnEE6NUCqW0Qj4Ko03rEUH3iO8Wl7jDuPXNMvchmzAruVafZkID7PKPvpzj0_AgEQ-sDU25F9F_XIgctzw0ClhflIWLQ"
                      />
                    </div>
                    <h4 className="font-bold text-primary">Alex Rivera</h4>
                    <p className="text-xs text-on-surface-variant mb-4">
                      Ketua Kepatuhan • AuditGuard HQ
                    </p>
                  </div>
                </section>
              </div>

              {/* Section: User Management & Identity */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Manajemen Pengguna (CRUD) */}
                <section className="bg-white/70 backdrop-blur-xl border border-outline-variant rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Manajemen Pengguna
                      </h3>
                      <p className="text-[11px] text-on-surface-variant">
                        Kelola akses personil dan hak istimewa sistem.
                      </p>
                    </div>
                    <button
                      onClick={() => openUserModal('create')}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-bold hover:opacity-90 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_add</span>
                      Tambah Pengguna
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low border-b border-outline-variant/30">
                        <tr>
                          <th className="px-6 py-3 font-mono text-[10px] uppercase">Pengguna</th>
                          <th className="px-6 py-3 font-mono text-[10px] uppercase">Peran</th>
                          <th className="px-6 py-3 font-mono text-[10px] uppercase">Status</th>
                          <th className="px-6 py-3 text-right font-mono text-[10px] uppercase">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-surface-container/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">
                                  {user.initials}
                                </div>
                                <div>
                                  <p className="text-body-sm font-bold">{user.name}</p>
                                  <p className="text-[11px] text-on-surface-variant">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] rounded font-bold">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-[11px] font-medium">Aktif</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                                  title="Detail"
                                  onClick={() => { setDetailUser(user); setShowDetailModal(true); }}
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    visibility
                                  </span>
                                </button>
                                <button
                                  onClick={() => openUserModal('edit', user)}
                                  className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                                  title="Edit"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button
                                  onClick={() => confirmDelete(user.id)}
                                  className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                                  title="Hapus"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Modal Detail Pengguna */}
      {showDetailModal && detailUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-[16px] text-primary">Detail Pengguna</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-lg">
                  {detailUser.initials}
                </div>
                <div>
                  <p className="font-bold text-primary text-base">{detailUser.name}</p>
                  <p className="text-[12px] text-on-surface-variant">{detailUser.email}</p>
                </div>
              </div>
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Peran</p>
                  <span className="px-2 py-0.5 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] rounded font-bold">
                    {detailUser.role}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-[12px] font-medium capitalize">{detailUser.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">ID Pengguna</p>
                  <p className="text-[12px] font-mono text-on-surface">#{detailUser.id}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Inisial</p>
                  <p className="text-[12px] font-mono text-on-surface">{detailUser.initials}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end gap-2">
              <button
                onClick={() => { setShowDetailModal(false); openUserModal('edit', detailUser); }}
                className="px-4 py-2 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Edit
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Pengguna */}
      {showUserModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowUserModal(false)}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6">
            <div className="bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-[18px] text-primary">
                  {modalMode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Informasi Pengguna'}
                </h3>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => setShowUserModal(false)}
                >
                  close
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-on-surface-variant uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low text-body-sm focus:ring-primary"
                    placeholder="Contoh: John Doe"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-on-surface-variant uppercase">
                    Email Instansi
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low text-body-sm focus:ring-primary"
                    placeholder="email@auditguard.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-on-surface-variant uppercase">
                    Peran Sistem
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low text-body-sm focus:ring-primary"
                  >
                    <option>Admin Utama</option>
                    <option>Auditor</option>
                    <option>Operator Log</option>
                    <option>Pengamat</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="flex-1 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-body-sm font-bold hover:opacity-90 transition-all"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6">
            <div className="bg-surface rounded-2xl shadow-2xl p-6 border border-outline-variant text-center">
              <div className="w-12 h-12 bg-error-container/20 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[24px]">delete_forever</span>
              </div>
              <h3 className="font-headline-sm text-[18px] text-primary mb-2">Hapus Pengguna?</h3>
              <p className="text-body-sm text-on-surface-variant mb-6">
                Tindakan ini tidak dapat dibatalkan. Pengguna akan kehilangan semua akses ke sistem
                segera.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border border-outline-variant rounded-lg text-body-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-error text-on-error rounded-lg text-body-sm font-bold hover:opacity-90 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

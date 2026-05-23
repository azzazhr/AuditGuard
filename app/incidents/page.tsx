'use client';

import Sidebar from '@/components/Sidebar';
import Toast from '@/components/Toast';
import TopNav from '@/components/TopNav';
import { FormEvent, useEffect, useState } from 'react';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'rendah' | 'sedang' | 'tinggi' | 'kritis';
  status: 'terbuka' | 'dalam-proses' | 'selesai';
  target: string;
  assignedTo: string;
  detectedAt: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/incidents')
      .then(r => r.json())
      .then(data => {
        if (data.incidents) {
          setIncidents(data.incidents.map((inc: any) => ({
            id: inc.id,
            title: inc.title,
            description: inc.description || '',
            severity: inc.severity,
            status: inc.status,
            target: inc.target || '',
            assignedTo: inc.assigned_to || '',
            detectedAt: new Date(inc.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
          })));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create');
  const [currentIncident, setCurrentIncident] = useState<Incident | null>(null);
  const [deleteId, setDeleteId] = useState<string>('');
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Filter states
  const [filterSeverity, setFilterSeverity] = useState<string>('semua');
  const [filterStatus, setFilterStatus] = useState<string>('semua');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'sedang' as 'rendah' | 'sedang' | 'tinggi' | 'kritis',
    target: '',
    assignedTo: ''
  });

  const openModal = (mode: 'create' | 'edit' | 'detail', incident?: Incident) => {
    setModalMode(mode);
    if (incident) {
      setCurrentIncident(incident);
      setFormData({
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        target: incident.target,
        assignedTo: incident.assignedTo
      });
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'sedang',
        target: '',
        assignedTo: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentIncident(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          status: 'terbuka',
          target: formData.target,
          assigned_to: formData.assignedTo,
        }),
      });
      const data = await res.json();
      if (data.incident) {
        setIncidents([{
          id: data.incident.id,
          title: data.incident.title,
          description: data.incident.description || '',
          severity: data.incident.severity,
          status: data.incident.status,
          target: data.incident.target || '',
          assignedTo: data.incident.assigned_to || '',
          detectedAt: 'Baru saja',
        }, ...incidents]);
        displayToast('Insiden baru berhasil dibuat!', 'success');
      }
    } else if (modalMode === 'edit' && currentIncident) {
      const res = await fetch('/api/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentIncident.id,
          title: formData.title,
          description: formData.description,
          severity: formData.severity,
          target: formData.target,
          assigned_to: formData.assignedTo,
        }),
      });
      const data = await res.json();
      if (data.incident) {
        setIncidents(incidents.map(inc =>
          inc.id === currentIncident.id
            ? {
                ...inc,
                title: data.incident.title,
                description: data.incident.description || '',
                severity: data.incident.severity,
                target: data.incident.target || '',
                assignedTo: data.incident.assigned_to || '',
              }
            : inc
        ));
        displayToast('Insiden berhasil diperbarui di database!', 'success');
      } else {
        displayToast('Gagal memperbarui insiden.', 'error');
      }
    }
    closeModal();
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    await fetch('/api/incidents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deleteId }),
    });
    setIncidents(incidents.filter(inc => inc.id !== deleteId));
    setShowDeleteModal(false);
    displayToast('Insiden berhasil dihapus.', 'success');
  };

  const displayToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Filter function
  const filteredIncidents = incidents.filter((incident) => {
    const matchSeverity = filterSeverity === 'semua' || incident.severity === filterSeverity;
    const matchStatus = filterStatus === 'semua' || incident.status === filterStatus;
    return matchSeverity && matchStatus;
  });

  // Reset filter function
  const resetFilters = () => {
    setFilterSeverity('semua');
    setFilterStatus('semua');
    console.log('Filter direset ke default');
  };

  // Handle filter change
  const handleSeverityChange = (value: string) => {
    setFilterSeverity(value);
    console.log('Filter Keparahan:', value);
    console.log('Data yang ditampilkan:', incidents.filter(inc => 
      value === 'semua' || inc.severity === value
    ));
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    console.log('Filter Status:', value);
    console.log('Data yang ditampilkan:', incidents.filter(inc => 
      value === 'semua' || inc.status === value
    ));
  };

  const getSeverityBadge = (severity: string) => {
    const styles = {
      kritis: 'bg-error/10 text-error',
      tinggi: 'bg-tertiary-fixed text-on-tertiary-fixed',
      sedang: 'bg-secondary-container text-on-secondary-container',
      rendah: 'bg-surface-container text-on-surface-variant'
    };
    return styles[severity as keyof typeof styles] || styles.sedang;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'terbuka': { color: 'text-error', dot: 'bg-error animate-pulse' },
      'dalam-proses': { color: 'text-secondary', dot: 'bg-secondary' },
      'selesai': { color: 'text-green-600', dot: 'bg-green-600' }
    };
    return styles[status as keyof typeof styles] || styles['terbuka'];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'terbuka': 'Terbuka',
      'dalam-proses': 'Dalam Proses',
      'selesai': 'Selesai'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px]">
        <TopNav />
        <main className="pt-20 px-4 lg:pt-24 lg:px-8 pb-12 max-w-[1440px] w-full mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">Log Insiden</h2>
              <p className="text-on-surface-variant font-body-sm">
                Mencatat dan memantau seluruh insiden keamanan sistem.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => openModal('create')}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Buat Insiden Baru
              </button>
              <button className="bg-surface border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-sm">download</span>
                Ekspor
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6 py-2">
            <select 
              value={filterSeverity}
              onChange={(e) => handleSeverityChange(e.target.value)}
              className="bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="semua">Semua Keparahan</option>
              <option value="kritis">Kritis</option>
              <option value="tinggi">Tinggi</option>
              <option value="sedang">Sedang</option>
              <option value="rendah">Rendah</option>
            </select>
            <select 
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="semua">Semua Status</option>
              <option value="terbuka">Terbuka</option>
              <option value="dalam-proses">Dalam Proses</option>
              <option value="selesai">Selesai</option>
            </select>
            <div className="flex items-center gap-2 bg-white border border-outline-variant rounded-lg px-3 py-1.5 text-sm cursor-pointer hover:border-primary transition-all">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
              <span>24 Jam Terakhir</span>
            </div>
            <button 
              onClick={resetFilters}
              className="text-on-surface-variant hover:text-primary text-xs font-medium ml-2"
            >
              Reset Filter
            </button>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low">
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      ID Insiden
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Keparahan
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Terdeteksi
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Ditugaskan Ke
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">
                            search_off
                          </span>
                          <p className="text-sm text-on-surface-variant">
                            Tidak ada insiden yang sesuai dengan filter
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredIncidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-surface-container-low transition-colors duration-150">
                      <td className="px-6 py-4 font-mono text-sm text-primary font-medium">
                        {incident.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-on-surface">{incident.title}</div>
                        <div className="text-[11px] text-on-surface-variant">{incident.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityBadge(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1.5 text-xs font-medium ${getStatusBadge(incident.status).color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(incident.status).dot}`}></span>
                          {getStatusLabel(incident.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-on-surface-variant">
                        {incident.detectedAt}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {incident.assignedTo}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openModal('detail', incident)}
                            className="p-1.5 hover:bg-primary/5 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            title="Lihat Detail"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button
                            onClick={() => openModal('edit', incident)}
                            className="p-1.5 hover:bg-primary/5 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => confirmDelete(incident.id)}
                            className="p-1.5 hover:bg-error/5 rounded-lg text-on-surface-variant hover:text-error transition-colors"
                            title="Hapus"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest">
              <div className="text-xs text-on-surface-variant">
                Menampilkan {filteredIncidents.length} dari {incidents.length} insiden
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded hover:bg-surface-container disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg text-[12px] font-bold bg-primary text-on-primary">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg text-[12px] font-medium hover:bg-surface-container transition-all">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg text-[12px] font-medium hover:bg-surface-container transition-all">
                  3
                </button>
                <button className="p-1 rounded hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Form Insiden */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="text-lg font-bold text-primary">
                {modalMode === 'create' ? 'Buat Insiden Baru' : modalMode === 'edit' ? `Edit Insiden ${currentIncident?.id}` : `Detail Insiden ${currentIncident?.id}`}
              </h3>
              <button
                onClick={closeModal}
                className="text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Judul Insiden
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Contoh: Ancaman Malware Terdeteksi"
                  required
                  disabled={modalMode === 'detail'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                    Keparahan
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                    className="w-full border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
                    disabled={modalMode === 'detail'}
                  >
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="tinggi">Tinggi</option>
                    <option value="kritis">Kritis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                    Target/Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Contoh: Server-PROD-01"
                    disabled={modalMode === 'detail'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Ditugaskan Ke
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Contoh: Tim Keamanan"
                  disabled={modalMode === 'detail'}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">
                  Deskripsi Lengkap
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-outline-variant rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                  placeholder="Jelaskan detail insiden yang terjadi..."
                  rows={4}
                  required
                  disabled={modalMode === 'detail'}
                />
              </div>

              {modalMode !== 'detail' && (
                <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Simpan Perubahan
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-[32px]">delete_forever</span>
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Hapus Insiden?</h3>
            <p className="text-sm text-on-surface-variant mb-6">
              Tindakan ini tidak dapat dibatalkan. Insiden{' '}
              <span className="font-mono font-bold text-primary">{deleteId}</span> akan dihapus selamanya.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-error text-on-primary px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all"
              >
                Hapus
              </button>
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



"use client";

import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import TopNav from "@/components/TopNav";
import { useState } from "react";

interface Incident {
  id: string;
  title: string;
  target: string;
  severity: "kritis" | "tinggi" | "sedang" | "rendah";
  status: string;
}

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const incidents: Incident[] = [
    {
      id: "#INC-9482",
      title: "Akses S3 Tidak Sah",
      target: "bucket-finance-prod",
      severity: "kritis",
      status: "Terbuka",
    },
    {
      id: "#INC-9481",
      title: "Reset Password Massal",
      target: "IAM-Controller",
      severity: "tinggi",
      status: "Investigasi",
    },
  ];

  const handleDelete = () => {
    setShowDeleteModal(false);
    setToast({ show: true, message: `Insiden ${deleteId} berhasil dihapus`, type: "success" });
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const openDetailModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailModal(true);
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "kritis":
        return "px-2 py-0.5 rounded text-[10px] font-bold bg-error/10 text-error uppercase";
      case "tinggi":
        return "px-2 py-0.5 rounded text-[10px] font-bold bg-navy-custom text-on-primary uppercase";
      case "sedang":
        return "px-2 py-0.5 rounded text-[10px] font-bold bg-secondary-container text-on-secondary-container uppercase";
      default:
        return "px-2 py-0.5 rounded text-[10px] font-bold bg-surface-variant text-on-surface-variant uppercase";
    }
  };

  return (
    <div className="bg-surface text-on-background font-body-md overflow-x-hidden min-h-screen">
      <Sidebar />
      <TopNav />

      <div className="ml-[260px] pt-24 px-8 pb-12">
        <main className="max-w-[1440px] mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">
                Dashboard
              </h2>
              <p className="text-on-surface-variant font-body-sm">
                Pemantauan audit real-time dan status kepatuhan.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2 bg-white border border-outline-variant text-on-surface-variant rounded-lg text-body-sm font-bold hover:bg-surface-container-low transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Ekspor Laporan
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="px-5 py-2 bg-navy-custom text-on-primary rounded-lg text-body-sm font-bold hover:opacity-90 shadow-sm transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Audit Baru
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-secondary-container/30 text-navy-custom rounded-lg">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <span className="text-success-neon bg-navy-custom px-2 py-0.5 rounded text-[10px] font-bold">
                  +12%
                </span>
              </div>
              <p className="text-on-surface-variant/60 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Insiden Total
              </p>
              <h3 className="font-display-lg text-[32px] text-navy-custom">1,284</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-error/10 text-error rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  5 Kritis
                </span>
              </div>
              <p className="text-on-surface-variant/60 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Alert Aktif
              </p>
              <h3 className="font-display-lg text-[32px] text-navy-custom">42</h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-navy-custom/5 text-navy-custom rounded-lg">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <span className="text-on-surface-variant/40 font-label-mono text-[10px] uppercase">
                  Aman
                </span>
              </div>
              <p className="text-on-surface-variant/60 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Skor Anomali
              </p>
              <h3 className="font-display-lg text-[32px] text-navy-custom">
                98<span className="text-[16px] text-on-surface-variant/30">/100</span>
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-surface-container-high text-on-surface rounded-lg">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <p className="text-on-surface-variant/60 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Pengguna Aktif
              </p>
              <h3 className="font-display-lg text-[32px] text-navy-custom">12</h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-headline-sm text-navy-custom">Tren Insiden</h4>
                <select className="bg-surface-container-low border border-outline-variant/20 rounded-lg text-[12px] font-semibold px-3 py-1.5 focus:ring-0">
                  <option>30 Hari Terakhir</option>
                  <option>7 Hari Terakhir</option>
                </select>
              </div>
              <div className="h-[240px] w-full relative">
                <svg
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="none"
                  viewBox="0 0 1000 300"
                >
                  <path
                    d="M0,250 Q100,220 200,240 T400,180 T600,200 T800,120 T1000,150"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M0,250 Q100,220 200,240 T400,180 T600,200 T800,120 T1000,150 L1000,300 L0,300 Z"
                    fill="url(#gradient-chart)"
                    opacity="0.05"
                  />
                  <defs>
                    <linearGradient id="gradient-chart" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "rgb(15, 23, 42)", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "rgb(15, 23, 42)", stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-label-mono text-on-surface-variant/40 uppercase tracking-widest">
                <span>01 MEI</span>
                <span>08 MEI</span>
                <span>15 MEI</span>
                <span>22 MEI</span>
                <span>30 MEI</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm">
              <h4 className="font-headline-sm text-navy-custom mb-8">Distribusi Keparahan</h4>
              <div className="relative w-44 h-44 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="50%" cy="50%" fill="transparent" r="40%" stroke="#f1f5f9" strokeWidth="16" />
                  <circle
                    cx="50%"
                    cy="50%"
                    fill="transparent"
                    r="40%"
                    stroke="#ba1a1a"
                    strokeDasharray="25 100"
                    strokeWidth="16"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    fill="transparent"
                    r="40%"
                    stroke="#0f172a"
                    strokeDasharray="40 100"
                    strokeDashoffset="-25"
                    strokeWidth="16"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    fill="transparent"
                    r="40%"
                    stroke="#94a3b8"
                    strokeDasharray="35 100"
                    strokeDashoffset="-65"
                    strokeWidth="16"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[28px] font-bold text-navy-custom">100%</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span className="font-medium text-on-surface">Kritis</span>
                  </div>
                  <span className="font-label-mono text-on-surface-variant">25%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-navy-custom"></span>
                    <span className="font-medium text-on-surface">Tinggi</span>
                  </div>
                  <span className="font-label-mono text-on-surface-variant">40%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                    <span className="font-medium text-on-surface">Sedang</span>
                  </div>
                  <span className="font-label-mono text-on-surface-variant">35%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lists Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Incident List */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h4 className="font-headline-sm text-navy-custom">Daftar Insiden Terkini</h4>
                <a className="text-navy-custom text-[12px] font-bold hover:underline" href="#">
                  Lihat Semua
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                      <th className="px-6 py-3 font-label-mono text-on-surface-variant/60 text-[10px] uppercase tracking-widest">
                        ID
                      </th>
                      <th className="px-6 py-3 font-label-mono text-on-surface-variant/60 text-[10px] uppercase tracking-widest">
                        Judul & Target
                      </th>
                      <th className="px-6 py-3 font-label-mono text-on-surface-variant/60 text-[10px] uppercase tracking-widest">
                        Keparahan
                      </th>
                      <th className="px-6 py-3 font-label-mono text-on-surface-variant/60 text-[10px] uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-6 py-3 font-label-mono text-on-surface-variant/60 text-[10px] uppercase tracking-widest text-right">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {incidents.map((incident) => (
                      <tr key={incident.id} className="hover:bg-surface-container-low/20 transition-colors">
                        <td className="px-6 py-4 font-label-mono text-sm text-on-surface">
                          {incident.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm text-on-surface">{incident.title}</div>
                          <div className="text-[10px] text-on-surface-variant/60">
                            Target: {incident.target}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={getSeverityClass(incident.severity)}>
                            {incident.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-on-surface">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                incident.severity === "kritis" ? "bg-error animate-pulse" : "bg-slate-400"
                              }`}
                            ></span>
                            <span>{incident.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openDetailModal(incident)}
                              className="p-1.5 text-on-surface-variant hover:text-navy-custom transition-colors"
                              title="Detail"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                            <button
                              onClick={() => setShowModal(true)}
                              className="p-1.5 text-on-surface-variant hover:text-navy-custom transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                            <button
                              onClick={() => confirmDelete(incident.id)}
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
            </div>

            {/* Audit Activity Feed */}
            <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm flex flex-col">
              <div className="p-6 border-b border-outline-variant/10">
                <h4 className="font-headline-sm text-navy-custom">Log Audit Pengguna</h4>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[380px]">
                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-low flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-navy-custom">person</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      <span className="font-bold">m_chen</span> mengubah{" "}
                      <span className="font-label-mono text-[11px] bg-surface-container-low px-1.5 py-0.5 rounded">
                        IAM_Policy_Admin
                      </span>
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1.5 uppercase font-medium">
                      HARI INI 10:42 • 192.168.1.44
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-success-neon/10 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-navy-custom">login</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      <span className="font-bold">j_doe</span> login berhasil dari perangkat baru
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1.5 uppercase font-medium">
                      HARI INI 09:15 • SAN FRANCISCO, US
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-9 h-9 rounded-lg bg-error/10 flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-error">lock</span>
                  </div>
                  <div>
                    <p className="text-sm text-on-surface">
                      <span className="font-bold">Sistem</span> memblokir 4 upaya koneksi
                    </p>
                    <p className="text-[10px] text-on-surface-variant/50 mt-1.5 uppercase font-medium">
                      KEMARIN 23:58 • EU-WEST-1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100]">
          <div className="modal-overlay absolute inset-0" onClick={() => setShowModal(false)}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6">
            <div className="bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant modal-content">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-[18px] text-navy-custom">Informasi Audit Baru</h3>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-navy-custom transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  close
                </button>
              </div>
              <form
                className="p-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowModal(false);
                  setToast({ show: true, message: "Insiden berhasil ditambahkan", type: "success" });
                }}
              >
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Judul Insiden
                  </label>
                  <input
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-navy-custom outline-none px-4 py-2 text-on-surface"
                    placeholder="Contoh: Ancaman Malware Terdeteksi"
                    required
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Keparahan
                    </label>
                    <select className="w-full rounded-lg border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-navy-custom outline-none px-4 py-2 text-on-surface">
                      <option value="rendah">Rendah</option>
                      <option value="sedang">Sedang</option>
                      <option value="tinggi">Tinggi</option>
                      <option value="kritis">Kritis</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Target Aset
                    </label>
                    <input
                      className="w-full rounded-lg border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-navy-custom outline-none px-4 py-2 text-on-surface"
                      placeholder="Contoh: Server-PROD-01"
                      type="text"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    className="w-full rounded-lg border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-navy-custom outline-none px-4 py-2 resize-none text-on-surface"
                    placeholder="Jelaskan detail temuan audit..."
                    required
                    rows={4}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    className="flex-1 py-2 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    onClick={() => setShowModal(false)}
                    type="button"
                  >
                    Batal
                  </button>
                  <button
                    className="flex-1 py-2 bg-navy-custom text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100]">
          <div className="modal-overlay absolute inset-0" onClick={() => setShowDeleteModal(false)}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6">
            <div className="bg-surface rounded-2xl shadow-2xl p-8 border border-outline-variant text-center modal-content">
              <div className="w-14 h-14 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[28px]">delete_forever</span>
              </div>
              <h3 className="font-headline-sm text-[18px] text-navy-custom mb-2">Hapus Insiden?</h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Tindakan ini tidak dapat dibatalkan. Log insiden{" "}
                <span className="font-bold text-navy-custom">{deleteId}</span> akan dihapus selamanya.
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-2.5 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>
                <button
                  className="flex-1 py-2.5 bg-error text-on-error rounded-lg text-sm font-bold hover:opacity-90 transition-all"
                  onClick={handleDelete}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 z-[100]">
          <div className="modal-overlay absolute inset-0" onClick={() => setShowDetailModal(false)}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl p-6">
            <div className="bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant modal-content">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="font-headline-sm text-[18px] text-navy-custom">Detail Insiden {selectedIncident.id}</h3>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-navy-custom transition-colors"
                  onClick={() => setShowDetailModal(false)}
                >
                  close
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* ID & Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                      ID Insiden
                    </label>
                    <p className="text-lg font-mono font-bold text-navy-custom">{selectedIncident.id}</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                      Status
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          selectedIncident.severity === "kritis" ? "bg-error animate-pulse" : "bg-slate-400"
                        }`}
                      ></span>
                      <span className="text-sm font-medium text-on-surface">{selectedIncident.status}</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                    Judul Insiden
                  </label>
                  <p className="text-base font-semibold text-on-surface">{selectedIncident.title}</p>
                </div>

                {/* Target & Severity */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                      Target/Lokasi
                    </label>
                    <p className="text-sm font-mono bg-surface-container-low px-3 py-2 rounded-lg text-on-surface">
                      {selectedIncident.target}
                    </p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                      Tingkat Keparahan
                    </label>
                    <span className={getSeverityClass(selectedIncident.severity)}>
                      {selectedIncident.severity}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-surface-container-low rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Waktu Terdeteksi</span>
                    <span className="font-medium text-on-surface">Hari ini, 14:32 WIB</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Ditugaskan Ke</span>
                    <span className="font-medium text-on-surface">Tim Keamanan</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-on-surface-variant">Prioritas</span>
                    <span className="font-bold text-error">URGENT</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2">
                    Deskripsi Lengkap
                  </label>
                  <div className="bg-surface-container-low rounded-lg p-4 text-sm text-on-surface leading-relaxed">
                    <p>
                      Terdeteksi upaya akses tidak sah ke bucket S3 <span className="font-mono font-semibold">{selectedIncident.target}</span>.
                      Sistem keamanan telah memblokir akses dan mencatat IP address pelaku.
                    </p>
                    <p className="mt-3">
                      <strong>Tindakan yang diambil:</strong> Akses diblokir, notifikasi dikirim ke tim keamanan,
                      dan log forensik telah disimpan untuk investigasi lebih lanjut.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3 border-t border-outline-variant">
                  <button
                    className="flex-1 py-2.5 border border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Tutup
                  </button>
                  <button
                    className="flex-1 py-2.5 bg-navy-custom text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowModal(true);
                    }}
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit Insiden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

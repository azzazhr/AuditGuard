"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";
import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

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
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [totalIncidents, setTotalIncidents] = useState(0);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [criticalAlerts, setCriticalAlerts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentLogs, setRecentLogs] = useState<{userId: string; action: string; time: string; ipAddress: string; status: string}[]>([]);
  const [chartData, setChartData] = useState<{bulan: string; insiden: number}[]>([]);
  const [severityData, setSeverityData] = useState<{name: string; value: number}[]>([]);
  const [formData, setFormData] = useState({ title: '', severity: 'rendah', target: '', description: '' });
  const [editIncident, setEditIncident] = useState<Incident | null>(null);
  const [saving, setSaving] = useState(false);

  const openEditModal = (incident: Incident) => {
    setEditIncident(incident);
    setFormData({
      title: incident.title,
      severity: incident.severity,
      target: incident.target,
      description: '',
    });
    setShowModal(true);
  };

  useEffect(() => {
    // Fetch incidents
    fetch('/api/incidents')
      .then(r => r.json())
      .then(data => {
        if (data.incidents) {
          setTotalIncidents(data.incidents.length);
          setIncidents(data.incidents.slice(0, 2).map((inc: any) => ({
            id: `#INC-${inc.id.slice(0, 4).toUpperCase()}`,
            title: inc.title,
            target: inc.target || '-',
            severity: inc.severity,
            status: inc.status === 'terbuka' ? 'Terbuka' : inc.status === 'dalam-proses' ? 'Investigasi' : 'Selesai',
          })));

          // Hitung tren per bulan dari data nyata
          const bulanNames = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
          const counts: Record<string, number> = {};
          data.incidents.forEach((inc: any) => {
            const d = new Date(inc.created_at);
            const key = bulanNames[d.getMonth()];
            counts[key] = (counts[key] || 0) + 1;
          });
          // Ambil 6 bulan terakhir yang ada datanya, atau semua bulan yang ada
          const result = Object.entries(counts).map(([bulan, insiden]) => ({ bulan, insiden }));
          setChartData(result.length > 0 ? result : bulanNames.slice(0, 6).map(b => ({ bulan: b, insiden: 0 })));

          // Hitung distribusi keparahan
          const total = data.incidents.length;
          if (total > 0) {
            const kritis = data.incidents.filter((i: any) => i.severity === 'kritis').length;
            const tinggi = data.incidents.filter((i: any) => i.severity === 'tinggi').length;
            const sedang = data.incidents.filter((i: any) => i.severity === 'sedang').length;
            const rendah = data.incidents.filter((i: any) => i.severity === 'rendah').length;
            const sv = [];
            if (kritis > 0) sv.push({ name: 'Kritis', value: Math.round((kritis / total) * 100) });
            if (tinggi > 0) sv.push({ name: 'Tinggi', value: Math.round((tinggi / total) * 100) });
            if (sedang > 0) sv.push({ name: 'Sedang', value: Math.round((sedang / total) * 100) });
            if (rendah > 0) sv.push({ name: 'Rendah', value: Math.round((rendah / total) * 100) });
            setSeverityData(sv);
          }
        }
      });

    // Fetch alerts
    fetch('/api/alerts')
      .then(r => r.json())
      .then(data => {
        if (data.alerts) {
          setTotalAlerts(data.alerts.length);
          setCriticalAlerts(data.alerts.filter((a: any) => a.severity === 'kritis').length);
        }
      });

    // Fetch audit logs
    fetch('/api/audit-logs')
      .then(r => r.json())
      .then(data => {
        if (data.logs) {
          setRecentLogs(data.logs.slice(0, 3).map((log: any) => ({
            userId: log.user_id,
            action: log.action,
            time: new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            ipAddress: log.ip_address,
            status: log.status,
          })));
        }
      });

    // Fetch users count
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        if (data.users) setTotalUsers(data.users.length);
      });
  }, []);

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
    <div className="flex min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px]">
        <TopNav />
        <main className="pt-20 px-4 lg:pt-24 lg:px-8 pb-12">
        <div className="max-w-[1440px] mx-auto">
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
            {/* Card 1 - Insiden Total - Biru */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <span className="material-symbols-outlined">database</span>
                </div>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] font-bold">
                  +12%
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Insiden Total
              </p>
              <h3 className="font-display-lg text-[32px] text-blue-600">{totalIncidents.toLocaleString('id-ID')}</h3>
            </div>

            {/* Card 2 - Alert Aktif - Merah */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  {criticalAlerts} Kritis
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Alert Aktif
              </p>
              <h3 className="font-display-lg text-[32px] text-red-500">{totalAlerts}</h3>
            </div>

            {/* Card 3 - Skor Anomali - Hijau */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-emerald-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <span className="text-emerald-600 bg-emerald-50 font-label-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                  Aman
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Skor Anomali
              </p>
              <h3 className="font-display-lg text-[32px] text-emerald-600">
                98<span className="text-[16px] text-gray-300">/100</span>
              </h3>
            </div>

            {/* Card 4 - Pengguna Aktif - Ungu */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
                  <span className="material-symbols-outlined">group</span>
                </div>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Pengguna Aktif
              </p>
              <h3 className="font-display-lg text-[32px] text-purple-600">{totalUsers}</h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bar Chart - Tren Insiden */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline-sm text-navy-custom">Tren Insiden per Bulan</h4>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData.length > 0 ? chartData : [
                  { bulan: 'Jan', insiden: 0 },
                ]} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value: number | string | undefined) => [`${value} insiden`, 'Jumlah']}
                  />
                  <Bar dataKey="insiden" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Distribusi Keparahan */}
            <div className="bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm">
              <h4 className="font-headline-sm text-navy-custom mb-4">Distribusi Keparahan</h4>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={severityData.length > 0 ? severityData : [
                      { name: 'Kritis', value: 25 },
                      { name: 'Tinggi', value: 40 },
                      { name: 'Sedang', value: 35 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(severityData.length > 0 ? severityData : [
                      { name: 'Kritis' }, { name: 'Tinggi' }, { name: 'Sedang' }
                    ]).map((entry, index) => {
                      const colors: Record<string, string> = {
                        'Kritis': '#ef4444',
                        'Tinggi': '#f97316',
                        'Sedang': '#94a3b8',
                        'Rendah': '#86efac',
                      };
                      return <Cell key={index} fill={colors[entry.name] || '#94a3b8'} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(value: number | string | undefined) => [`${value}%`, '']}
                  />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Lists Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Incident List */}
            <div className="xl:col-span-2 bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                <h4 className="font-headline-sm text-navy-custom">Daftar Insiden Terkini</h4>
                <Link href="/incidents" className="text-navy-custom text-[12px] font-bold hover:underline">
                  Lihat Semua
                </Link>
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
                              onClick={() => openEditModal(incident)}
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
                {recentLogs.length === 0 ? (
                  <p className="text-sm text-on-surface-variant">Memuat log...</p>
                ) : (
                  recentLogs.map((log, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${
                        log.status === 'peringatan' ? 'bg-error/10' : 'bg-surface-container-low'
                      }`}>
                        <span className={`material-symbols-outlined text-[18px] ${
                          log.status === 'peringatan' ? 'text-error' : 'text-navy-custom'
                        }`}>
                          {log.status === 'peringatan' ? 'lock' : 'person'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-on-surface">
                          <span className="font-bold">{log.userId}</span>{' '}
                          {log.action.toLowerCase()}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/50 mt-1.5 uppercase font-medium">
                          HARI INI {log.time} • {log.ipAddress}
                        </p>
                      </div>
                    </div>
                  ))
                )}
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
                <h3 className="font-headline-sm text-[18px] text-navy-custom">
                  {editIncident ? 'Edit Insiden' : 'Informasi Audit Baru'}
                </h3>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-navy-custom transition-colors"
                  onClick={() => { setShowModal(false); setEditIncident(null); }}
                >
                  close
                </button>
              </div>
              <form
                className="p-6 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSaving(true);
                  try {
                    const res = await fetch('/api/incidents', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        title: formData.title,
                        description: formData.description,
                        severity: formData.severity,
                        status: 'terbuka',
                        target: formData.target,
                      }),
                    });
                    const data = await res.json();
                    if (data.incident) {
                      setTotalIncidents(prev => prev + 1);
                      const newInc: Incident = {
                        id: `#INC-${data.incident.id.slice(0, 4).toUpperCase()}`,
                        title: data.incident.title,
                        target: data.incident.target || '-',
                        severity: data.incident.severity,
                        status: 'Terbuka',
                      };
                      setIncidents(prev => [newInc, ...prev].slice(0, 2));
                      setToast({ show: true, message: editIncident ? "Insiden berhasil diperbarui!" : "Insiden berhasil ditambahkan!", type: "success" });
                    }
                  } catch {
                    setToast({ show: true, message: "Gagal menyimpan insiden.", type: "error" });
                  } finally {
                    setSaving(false);
                    setShowModal(false);
                    setEditIncident(null);
                    setFormData({ title: '', severity: 'rendah', target: '', description: '' });
                  }
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Keparahan
                    </label>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container-low text-sm focus:ring-1 focus:ring-navy-custom outline-none px-4 py-2 text-on-surface"
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    >
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
                      value={formData.target}
                      onChange={(e) => setFormData({ ...formData, target: e.target.value })}
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
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <div className="bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant modal-content max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low flex-shrink-0">
                <h3 className="font-headline-sm text-[18px] text-navy-custom">Detail Insiden {selectedIncident.id}</h3>
                <button
                  className="material-symbols-outlined text-on-surface-variant hover:text-navy-custom transition-colors"
                  onClick={() => setShowDetailModal(false)}
                >
                  close
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
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



'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  time: string;
  ipAddress: string;
  status: 'berhasil' | 'peringatan';
}

const mapLog = (log: any): AuditLog => ({
  id: log.id,
  userId: log.user_id,
  action: log.action,
  time: new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  ipAddress: log.ip_address,
  status: log.status,
});

export default function AuditLogsPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = () => {
    fetch('/api/audit-logs')
      .then(r => r.json())
      .then(data => {
        if (data.logs) setAuditLogs(data.logs.map(mapLog));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();

    const supabase = createClient();
    const channel = supabase
      .channel('audit-logs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'audit_logs' }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px]">
        <TopNav />
        <main className="pt-16 min-h-screen">
          <div className="max-w-[1440px] mx-auto p-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">
                  Log Audit
                </h2>
                <p className="text-on-surface-variant font-body-sm">
                  Riwayat aktivitas pengguna dan perubahan data secara detail.
                </p>
              </div>
              <div className="flex gap-2">
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Activity Timeline */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white border border-outline-variant rounded-lg p-6">
                  <h3 className="text-body-md font-bold text-primary mb-8 uppercase tracking-widest text-[12px]">
                    Aktivitas Terbaru
                  </h3>
                  <div className="space-y-8 relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-outline-variant"></div>
                    {auditLogs.slice(0, 5).map((log, index) => (
                      <div key={log.id} className="relative pl-10">
                        <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${
                          log.status === 'peringatan' ? 'bg-error' : index === 0 ? 'bg-primary' : 'bg-outline'
                        }`}></div>
                        <div className={`text-body-sm font-semibold ${log.status === 'peringatan' ? 'text-error' : ''}`}>
                          {log.action}
                        </div>
                        <div className="text-[12px] text-on-surface-variant">{log.time} • {log.userId}</div>
                      </div>
                    ))}
                    {auditLogs.length === 0 && (
                      <div className="text-[12px] text-on-surface-variant pl-10">Memuat aktivitas...</div>
                    )}
                  </div>

                  <div className="mt-10 pt-8 border-t border-outline-variant grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] text-on-surface-variant uppercase font-medium mb-1">
                        Tingkat Berhasil
                      </div>
                      <div className="text-headline-sm font-bold text-primary">
                        {auditLogs.length > 0
                          ? `${Math.round((auditLogs.filter(l => l.status === 'berhasil').length / auditLogs.length) * 100)}%`
                          : '-'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-error uppercase font-medium mb-1">
                        Peringatan Hari Ini
                      </div>
                      <div className="text-headline-sm font-bold text-error">
                        {auditLogs.filter(l => l.status === 'peringatan').length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="col-span-12 lg:col-span-8">
                <div className="bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                    <h3 className="text-body-md font-bold text-primary uppercase tracking-widest text-[12px]">
                      Alur Log Audit
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-tighter">
                        Sistem Aktif
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant">
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                            ID Pengguna
                          </th>
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                            Deskripsi Aksi
                          </th>
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                            Waktu
                          </th>
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider">
                            Alamat IP
                          </th>
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-right">
                            Status
                          </th>
                          <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-right">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {auditLogs.map((log) => (
                          <tr
                            key={log.id}
                            className={`transition-colors ${
                              log.status === 'peringatan'
                                ? 'bg-error/5'
                                : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <span
                                className={`text-body-sm font-medium ${
                                  log.status === 'peringatan' ? 'text-error' : ''
                                }`}
                              >
                                {log.userId}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-body-sm ${
                                  log.status === 'peringatan' ? 'font-medium text-error' : ''
                                }`}
                              >
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-body-sm ${
                                  log.status === 'peringatan'
                                    ? 'text-error'
                                    : 'text-on-surface-variant'
                                }`}
                              >
                                {log.time}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`font-mono text-[12px] ${
                                  log.status === 'peringatan'
                                    ? 'text-error'
                                    : 'text-on-surface-variant'
                                }`}
                              >
                                {log.ipAddress}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`text-[11px] font-bold uppercase ${
                                  log.status === 'peringatan'
                                    ? 'text-error'
                                    : 'text-green-600'
                                }`}
                              >
                                {log.status === 'peringatan' ? 'Peringatan' : 'Berhasil'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleRowClick(log)}
                                className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-all"
                                title="Lihat Detail"
                              >
                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 border-t border-outline-variant mt-auto flex justify-between items-center bg-surface-container-lowest">
                    <span className="text-[12px] text-on-surface-variant">
                      Menampilkan 1-{auditLogs.length} dari {auditLogs.length} entri
                    </span>
                    <div className="flex gap-1">
                      <button
                        className="p-1 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-20"
                        disabled
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedLog(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-[16px] text-primary uppercase tracking-widest text-[12px]">
                Detail Log Audit
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    ID Pengguna
                  </p>
                  <p className={`text-sm font-semibold ${selectedLog.status === 'peringatan' ? 'text-error' : 'text-primary'}`}>
                    {selectedLog.userId}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <span
                    className={`text-[11px] font-bold uppercase px-2 py-1 rounded ${
                      selectedLog.status === 'peringatan'
                        ? 'bg-error/10 text-error'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {selectedLog.status === 'peringatan' ? 'Peringatan' : 'Berhasil'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                  Deskripsi Aksi
                </p>
                <p className={`text-sm ${selectedLog.status === 'peringatan' ? 'text-error font-medium' : 'text-on-surface'}`}>
                  {selectedLog.action}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Waktu
                  </p>
                  <p className={`text-sm font-mono ${selectedLog.status === 'peringatan' ? 'text-error' : 'text-on-surface'}`}>
                    {selectedLog.time}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                    Alamat IP
                  </p>
                  <p className={`text-sm font-mono ${selectedLog.status === 'peringatan' ? 'text-error' : 'text-on-surface-variant'}`}>
                    {selectedLog.ipAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-outline-variant bg-surface-container-lowest flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:opacity-90 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


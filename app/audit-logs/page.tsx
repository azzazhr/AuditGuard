'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { useState } from 'react';

interface AuditLog {
  id: string;
  userId: string;
  action: string;
  time: string;
  ipAddress: string;
  status: 'berhasil' | 'peringatan';
}

export default function AuditLogsPage() {
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      userId: 'admin_user',
      action: 'Perbarui Aturan Firewall',
      time: '10:15',
      ipAddress: '192.168.1.1',
      status: 'berhasil'
    },
    {
      id: '2',
      userId: 'operator_2',
      action: 'Lihat Insiden #9021',
      time: '10:10',
      ipAddress: '192.168.1.5',
      status: 'berhasil'
    },
    {
      id: '3',
      userId: 'guest_acc',
      action: 'Gagal Login',
      time: '09:45',
      ipAddress: '45.12.33.1',
      status: 'peringatan'
    },
    {
      id: '4',
      userId: 'manager_01',
      action: 'Logout Sistem',
      time: '09:30',
      ipAddress: '192.168.1.12',
      status: 'berhasil'
    }
  ]);

  const handleRowClick = (log: AuditLog) => {
    console.log('Membuka detail log:', log);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <TopNav />
        <main className="pt-16 min-h-screen">
          <div className="max-w-[1440px] mx-auto p-8">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-10">
              <div>
                <nav className="flex text-[12px] text-on-surface-variant mb-1 gap-2 uppercase tracking-wider font-medium">
                  <span>Utama</span>
                  <span className="opacity-30">/</span>
                  <span className="text-primary">Log Audit</span>
                </nav>
                <h2 className="font-headline-md text-headline-md text-primary">
                  Log Audit Pengguna
                </h2>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded hover:bg-surface-container transition-all text-body-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:opacity-90 transition-all text-body-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Ekspor Laporan
                </button>
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
                    
                    <div className="relative pl-10">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-white"></div>
                      <div className="text-body-sm font-semibold">Perbarui Aturan Firewall</div>
                      <div className="text-[12px] text-on-surface-variant">10:15 • admin_user</div>
                    </div>

                    <div className="relative pl-10">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-outline ring-4 ring-white"></div>
                      <div className="text-body-sm font-semibold">Lihat Insiden #9021</div>
                      <div className="text-[12px] text-on-surface-variant">10:10 • operator_2</div>
                    </div>

                    <div className="relative pl-10">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-error ring-4 ring-white"></div>
                      <div className="text-body-sm font-semibold text-error">Gagal Login</div>
                      <div className="text-[12px] text-on-surface-variant">09:45 • guest_acc</div>
                    </div>

                    <div className="relative pl-10">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-outline ring-4 ring-white"></div>
                      <div className="text-body-sm font-semibold">Logout Sistem</div>
                      <div className="text-[12px] text-on-surface-variant">09:30 • manager_01</div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-outline-variant grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] text-on-surface-variant uppercase font-medium mb-1">
                        Tingkat Berhasil
                      </div>
                      <div className="text-headline-sm font-bold text-primary">98.2%</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-error uppercase font-medium mb-1">
                        Peringatan Hari Ini
                      </div>
                      <div className="text-headline-sm font-bold text-error">12</div>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {auditLogs.map((log) => (
                          <tr
                            key={log.id}
                            onClick={() => handleRowClick(log)}
                            className={`transition-colors cursor-pointer ${
                              log.status === 'peringatan'
                                ? 'bg-error/5 hover:bg-error/10'
                                : 'hover:bg-surface-container-low'
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
                            <td className="px-6 py-4 text-right">
                              <span
                                className={`text-[11px] font-bold uppercase ${
                                  log.status === 'peringatan'
                                    ? 'text-error'
                                    : log.status === 'berhasil'
                                    ? 'text-green-600'
                                    : 'text-on-surface-variant'
                                }`}
                              >
                                {log.status === 'peringatan' ? 'Peringatan' : 'Berhasil'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="px-6 py-4 border-t border-outline-variant mt-auto flex justify-between items-center bg-surface-container-lowest">
                    <span className="text-[12px] text-on-surface-variant">
                      Menampilkan 1-{auditLogs.length} dari 1.240 entri
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
    </div>
  );
}

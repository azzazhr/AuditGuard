'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  severity: 'kritis' | 'peringatan' | 'minor';
  title: string;
  description: string;
  time: string;
}

interface Anomaly {
  id: string;
  time: string;
  type: string;
  entity: string;
  confidence: number;
  status: 'aktif' | 'tertunda';
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [anomalies] = useState<Anomaly[]>([
    { id: '1', time: '15:02:11', type: 'Login Burst', entity: 'Auth Gateway v2', confidence: 98, status: 'aktif' },
    { id: '2', time: '14:58:02', type: 'Geo-Impossible', entity: 'User: k_thompson', confidence: 72, status: 'aktif' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then(r => r.json())
      .then(data => {
        if (data.alerts) {
          setAlerts(data.alerts.map((a: any) => ({
            id: a.id,
            severity: a.severity,
            title: a.title,
            description: a.description,
            time: new Date(a.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
          })));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const [timeFilter, setTimeFilter] = useState<'1H' | '24H'>('1H');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'kritis':
        return 'text-error';
      case 'peringatan':
        return 'text-[#98805d]';
      case 'minor':
        return 'text-secondary';
      default:
        return 'text-on-surface-variant';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'kritis':
        return 'KRITIS';
      case 'peringatan':
        return 'PERINGATAN';
      case 'minor':
        return 'MINOR';
      default:
        return severity.toUpperCase();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 ml-[260px]">
        <TopNav />
        <main className="pt-24 px-8 pb-12 max-w-[1440px]">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-navy-custom tracking-tight">
                Peringatan & Anomali
              </h2>
              <p className="text-on-surface-variant font-body-sm">
                Deteksi otomatis terhadap aktivitas mencurigakan dan pelanggaran.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">download</span>
                Ekspor Laporan
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Key Metrics */}
            <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant font-medium text-sm mb-1">
                    Aktivitas Mencurigakan
                  </p>
                  <h3 className="font-headline-md text-headline-md text-error">3 Terdeteksi</h3>
                </div>
                <div className="bg-error-container p-2 rounded-lg text-error">
                  <span className="material-symbols-outlined">warning</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-error animate-pulse"></span>
                <p className="text-body-sm text-on-surface-variant">
                  Terakhir terdeteksi 12 menit lalu
                </p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant font-medium text-sm mb-1">
                    Frekuensi Login Gagal
                  </p>
                  <h3 className="font-headline-md text-headline-md text-primary">Alert Tinggi</h3>
                </div>
                <div className="bg-secondary-container p-2 rounded-lg text-secondary">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
              </div>
              <p className="mt-4 text-body-sm text-on-surface-variant">
                IP Target: <span className="font-mono text-primary font-bold">45.12.33.1</span>
              </p>
            </div>

            <div className="col-span-12 md:col-span-4 bg-white/70 backdrop-blur-xl border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant font-medium text-sm mb-1">
                    Skor Anomali Live
                  </p>
                  <h3 className="font-headline-md text-headline-md text-[#98805d]">84 / 100</h3>
                </div>
                <div className="bg-tertiary-fixed p-2 rounded-lg text-on-tertiary-fixed">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
              </div>
              <div className="mt-4 w-full bg-surface-container rounded-full h-2 overflow-hidden">
                <div className="bg-[#98805d] h-full rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            {/* Simplified Graph */}
            <div className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-xl border border-outline-variant p-6 rounded-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Anomali Trafik & Login
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeFilter('1H')}
                    className={`text-[10px] px-3 py-1 rounded font-bold ${
                      timeFilter === '1H'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    1H
                  </button>
                  <button
                    onClick={() => setTimeFilter('24H')}
                    className={`text-[10px] px-3 py-1 rounded font-bold ${
                      timeFilter === '24H'
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    24H
                  </button>
                </div>
              </div>
              <div className="h-[260px] w-full flex items-end gap-3 px-2">
                {[30, 45, 35, 90, 55, 40, 48, 70, 42, 30].map((height, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 rounded-t-sm relative ${
                      idx === 3
                        ? 'bg-error/30'
                        : idx === 7
                        ? 'bg-[#98805d]/30'
                        : 'bg-surface-container-high'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {(idx === 3 || idx === 7) && (
                      <div
                        className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                          idx === 3 ? 'bg-error' : 'bg-[#98805d]'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6 text-[10px] font-mono text-on-surface-variant opacity-60">
                <span>14:00</span>
                <span>14:30</span>
                <span>15:00 (LIVE)</span>
              </div>
            </div>

            {/* Simplified Priority Alert Feed */}
            <div className="col-span-12 lg:col-span-4 bg-white/70 backdrop-blur-xl border border-outline-variant flex flex-col rounded-xl overflow-hidden">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="font-headline-sm text-headline-sm text-primary">
                  Feed Alert Prioritas
                </h3>
              </div>
              <div className="flex-1">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="px-6 py-5 border-b border-outline-variant hover:bg-surface-container transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest ${getSeverityColor(
                          alert.severity
                        )}`}
                      >
                        {getSeverityLabel(alert.severity)}
                      </span>
                      <span className="text-[10px] font-mono text-on-surface-variant">
                        {alert.time}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-primary">{alert.title}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-1">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
              <button className="p-4 bg-surface-container-low text-[11px] font-bold text-primary hover:bg-surface-container transition-all">
                LIHAT SEMUA ALERT
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

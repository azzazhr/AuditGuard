'use client';

import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface Alert {
  id: string;
  severity: 'kritis' | 'peringatan' | 'minor';
  title: string;
  description: string;
  time: string;
}

const mapAlert = (a: any): Alert => ({
  id: a.id,
  severity: a.severity,
  title: a.title,
  description: a.description,
  time: new Date(a.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
});

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'1H' | '24H'>('1H');

  const fetchAlerts = () => {
    fetch('/api/alerts')
      .then(r => r.json())
      .then(data => {
        if (data.alerts) setAlerts(data.alerts.map(mapAlert));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();

    const supabase = createClient();
    const channel = supabase
      .channel('alerts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

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
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-[260px]">
        <TopNav />
        <main className="pt-20 px-4 lg:pt-24 lg:px-8 pb-12 max-w-[1440px]">
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
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Key Metrics — desain sama dengan dashboard */}
            {/* Card 1 - Kritis - Merah */}
            <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-red-500">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-lg">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Kritis
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Aktivitas Mencurigakan
              </p>
              <h3 className="font-display-lg text-[32px] text-red-500">
                {loading ? '...' : alerts.filter(a => a.severity === 'kritis').length}
              </h3>
              <p className="text-body-sm text-on-surface-variant mt-2">
                {alerts.length > 0 ? `${alerts.length} total alert aktif` : 'Memuat data...'}
              </p>
            </div>

            {/* Card 2 - Peringatan - Oranye */}
            <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-orange-400">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-orange-50 text-orange-500 rounded-lg">
                  <span className="material-symbols-outlined">lock_reset</span>
                </div>
                <span className="bg-orange-400 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Peringatan
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Peringatan
              </p>
              <h3 className="font-display-lg text-[32px] text-orange-400">
                {loading ? '...' : alerts.filter(a => a.severity === 'peringatan').length}
              </h3>
              <p className="text-body-sm text-on-surface-variant mt-2 truncate">
                {alerts.filter(a => a.severity === 'peringatan')[0]?.title || 'Tidak ada peringatan'}
              </p>
            </div>

            {/* Card 3 - Minor - Biru */}
            <div className="col-span-12 md:col-span-4 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-md border-l-4 border-l-blue-400">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-500 rounded-lg">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <span className="bg-blue-400 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                  Minor
                </span>
              </div>
              <p className="text-gray-500 font-medium text-[11px] mb-1 uppercase tracking-wider">
                Minor
              </p>
              <h3 className="font-display-lg text-[32px] text-blue-400">
                {loading ? '...' : alerts.filter(a => a.severity === 'minor').length}
              </h3>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full transition-all"
                  style={{ width: alerts.length > 0 ? `${Math.round((alerts.filter(a => a.severity === 'minor').length / alerts.length) * 100)}%` : '0%' }}
                ></div>
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



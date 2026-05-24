"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRole } from "@/lib/useRole";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", fill: true },
  { icon: "list_alt", label: "Log Insiden", href: "/incidents" },
  { icon: "history_edu", label: "Log Audit", href: "/audit-logs" },
  { icon: "notification_important", label: "Peringatan & Anomali", href: "/alerts" },
  { icon: "manage_accounts", label: "Manajemen Pengguna", href: "/user-management", adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { isAdmin } = useRole();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <>
      {/* Tombol hamburger — hanya muncul di layar kecil */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-navy-custom text-on-primary rounded-lg shadow-md"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Overlay gelap saat sidebar terbuka di mobile */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[55]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-[260px] bg-navy-custom text-on-primary
        border-r border-outline-variant shadow-sm flex flex-col py-6 z-[56]
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Tombol tutup di mobile */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-on-primary/60 hover:text-on-primary"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="px-6 mb-10">
          <h1 className="font-display-lg text-display-lg font-bold text-on-primary">
            AuditGuard
          </h1>
          <p className="text-on-primary/60 text-body-sm">Enterprise Compliance</p>
        </div>

        <nav className="flex-grow space-y-1">
          {menuItems.map((item) => {
            if ((item as any).adminOnly && !isAdmin) return null;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 font-body-md font-medium transition-colors cursor-pointer active:opacity-80 ${
                  isActive
                    ? "border-l-4 border-[#a3b18a] bg-on-primary/10 text-on-primary"
                    : "text-on-primary/70 hover:bg-on-primary/5"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={
                    isActive && item.fill
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 border-t border-on-primary/10 pt-4">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:bg-on-primary/5 transition-colors cursor-pointer active:opacity-80 font-body-md font-medium"
          >
            <span className="material-symbols-outlined">account_circle</span>
            Profil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-error/80 hover:bg-error/10 transition-colors cursor-pointer active:opacity-80 font-body-md font-medium"
          >
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", fill: true },
  { icon: "list_alt", label: "Log Insiden", href: "/incidents" },
  { icon: "history_edu", label: "Log Audit", href: "/audit-logs" },
  { icon: "notification_important", label: "Peringatan & Anomali", href: "/alerts" },
  { icon: "manage_accounts", label: "Manajemen Pengguna", href: "/user-management" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-navy-custom dark:bg-primary-container text-on-primary border-r border-outline-variant dark:border-outline shadow-sm flex flex-col py-6 z-50">
      <div className="px-6 mb-10">
        <h1 className="font-display-lg text-display-lg font-bold text-on-primary">
          AuditGuard
        </h1>
        <p className="text-on-primary/60 text-body-sm">Enterprise Compliance</p>
      </div>

      <nav className="flex-grow space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 font-body-md font-medium transition-colors cursor-pointer active:opacity-80 ${
                isActive
                  ? "border-l-4 border-tertiary-fixed bg-on-primary/10 text-on-primary"
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
          className="flex items-center gap-3 px-4 py-3 text-on-primary/70 hover:bg-on-primary/5 transition-colors cursor-pointer active:opacity-80 font-body-md font-medium"
        >
          <span className="material-symbols-outlined">account_circle</span>
          Profil
        </Link>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TopNav() {
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);
        const parts = name.trim().split(' ');
        const initials = parts.length >= 2
          ? (parts[0][0] + parts[1][0]).toUpperCase()
          : name.slice(0, 2).toUpperCase();
        setUserInitials(initials);
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-260px)] h-16 bg-surface/80 dark:bg-surface-container/80 backdrop-blur-md border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center px-8 z-40">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border-none rounded-lg py-2 pl-10 pr-4 text-body-sm focus:ring-1 focus:ring-navy-custom/20 transition-all"
            placeholder="Cari insiden, log, atau pengguna..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>

        <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="text-right hidden lg:block">
            <p className="text-body-sm font-bold text-navy-custom">{userName || 'Loading...'}</p>
            <p className="text-[10px] text-on-surface-variant font-medium uppercase">
              Pengguna
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center border border-outline-variant">
            <span className="text-primary font-bold text-[13px]">{userInitials || '...'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}

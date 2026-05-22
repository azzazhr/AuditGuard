"use client";

import Link from "next/link";
import Image from "next/image";

export default function TopNav() {
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

        <div className="flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="text-right hidden lg:block">
            <p className="text-body-sm font-bold text-navy-custom">Alex Rivera</p>
            <p className="text-[10px] text-on-surface-variant font-medium">
              LEAD KEPATUHAN
            </p>
          </div>
          <Image
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXl00wM7eRPRcE4kXni-FYdc1V7K3-LIbsNYAVcIImlSxrIqKeDPf1YauuTnsQJ4YsXVCYOU9lotR6Pe-BDJ2umdrKs1HFNCf_AcjSzHoibx8OUSYIklwk5t7zCNt9_nUsQ7IKrifzZ6rkr5L21WgHW9QxuiMmer23eKEARB0jwod9cHO_ONlpVjvzGyGtBSN9Kc9pjJvbf2W4QbJDkJjAYQPlFuxcOAMGmjWaX1JHk4hGrvGqaXDcDyTY3pfncrVOQavoJGMku7as"
            width={40}
            height={40}
          />
        </Link>
        </div>
      </div>
    </header>
  );
}

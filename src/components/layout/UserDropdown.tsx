'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const MENU_ITEMS = [
  { href: '/profile',     label: 'Profil'    },
  { href: '/my-listings', label: 'Elanlarım' },
  { href: '/escrow',      label: 'Escrow'    },
];

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);
  const ref              = useRef<HTMLDivElement>(null);
  const router           = useRouter();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const initial = user?.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <div ref={ref} className="relative">

      {/* Avatar düyməsi */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 p-1.5 rounded-xl transition-all ${
          open ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
        }`}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black font-display bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
          {initial}
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50 bg-[#161616] border border-white/[0.08] shadow-2xl shadow-black/50">

          {/* User info */}
          <div className="px-4 py-3.5 border-b border-white/[0.06]">
            <p className="text-[13px] font-bold text-white">{user?.username}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{user?.email}</p>
          </div>

          {/* Menu items */}
          <div className="py-1.5">
            {MENU_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-2.5 text-[13px] text-slate-400 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-white/[0.06] py-1.5">
            <button
              onClick={() => { logout(); setOpen(false); router.push('/'); }}
              className="w-full text-left px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-all"
            >
              Cixis
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
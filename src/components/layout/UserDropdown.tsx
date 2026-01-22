'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function UserDropdown() {
  const { user, logout } = useAuth(); // ✅ hamısı context-dən
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null; // safety

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {getInitials(user.username ?? "User")}
        </div>

        <span className="hidden md:block text-sm font-semibold text-gray-700">
          Kabinetim
        </span>

        <ChevronDown
          size={14}
          className={`transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border py-2 z-50">
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 font-bold uppercase">
              İstifadəçi
            </p>
            <p className="text-sm font-semibold truncate">
              {user.username}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user.email}
            </p>
          </div>

          <div className="h-px bg-gray-100 my-1" />

          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-600"
            onClick={() => setOpen(false)}
          >
            <User size={18} /> Profilim
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} /> Çıxış et
          </button>
        </div>
      )}
    </div>
  );
}


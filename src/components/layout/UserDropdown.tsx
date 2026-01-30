'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, ChevronDown, ShieldUser } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UserDropdown() {
  const { user, logout } = useAuth();
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg
                  hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <ShieldUser size={16} />
        </div>

        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-[#1f2d3d]
                        text-gray-100 rounded-md shadow-lg z-50">

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 hover:bg-[#2c3e50]"
          >
            <ShieldUser size={16} />
            Profile
          </Link>

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#2c3e50]"
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

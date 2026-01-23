'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 font-bold text-gray-700 hover:text-blue-600"
      >
        {user?.username || 'Hesab'}
      </button>


      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
          
          <Link
            href="/cabinet"
            className="block px-4 py-3 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Kabinetim
          </Link>

          <Link
            href="/settings"
            className="block px-4 py-3 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Ayarlar
          </Link>

          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
          >
            Çıxış
          </button>
        </div>
      )}
    </div>
  );
}

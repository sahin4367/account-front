'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
        style={{ background: open ? 'var(--black3)' : 'transparent' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display"
          style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)', border: '1px solid var(--yellow-border)' }}
        >
          {initial}
        </div>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
          style={{ background: 'var(--black3)', border: '1px solid var(--border2)' }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{user?.username}</p>
            <p className="text-[11px]" style={{ color: 'var(--text3)' }}>{user?.email}</p>
          </div>

          {[
            { href: '/profile', label: 'Profil' },
            { href: '/my-listings', label: 'Elanlarım' },
            { href: '/escrow', label: 'Escrow' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] transition-colors"
              style={{ color: 'var(--text2)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--black4)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={() => { logout(); setOpen(false); router.push('/'); }}
            className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
            style={{ color: 'var(--red)', borderTop: '1px solid var(--border)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--black4)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Çıxış
          </button>
        </div>
      )}
    </div>
  );
}
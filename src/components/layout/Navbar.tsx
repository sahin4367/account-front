'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserDropdown from './UserDropdown';
import api from '../../lib/api';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get('/balance')
      .then(res => setBalance(res.data.balance))
      .catch(() => setBalance(null));
  }, [isAuthenticated]);

  return (
    <header style={{
      background: 'var(--black)',
      borderBottom: '1px solid var(--border2)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="container mx-auto px-6 h-[58px] flex items-center justify-between">

        <Link href="/" className="font-display text-[17px] font-extrabold tracking-tight">
          <span style={{ color: 'var(--yellow)' }}>ACCOUNT</span>
          <span style={{ color: 'var(--text)' }}>market</span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { href: '/listings',    label: 'Almaq'     },
              { href: '/escrow',      label: 'Escrow'    },
              { href: '/my-listings', label: 'Elanlarım' },
              { href: '/messages',    label: 'Mesajlar'  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="nav-item px-4 py-2 rounded-lg text-[13px] font-medium"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <button className="btn-ghost text-[13px] py-[7px] px-4">Daxil ol</button>
              </Link>
              <Link href="/register">
                <button className="btn-primary text-[13px] py-[7px] px-4">Qeydiyyat</button>
              </Link>
            </>
          ) : (
            <>
              {balance !== null && (
                <div
                  className="hidden sm:flex flex-col items-end px-3 py-1 rounded-lg"
                  style={{
                    background: 'var(--yellow-dim)',
                    border: '1px solid var(--yellow-border)',
                  }}
                >
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--text3)' }}
                  >
                    Balans
                  </span>
                  <span
                    className="text-[13px] font-extrabold font-display"
                    style={{ color: 'var(--yellow)' }}
                  >
                    {Number(balance).toFixed(2)} AZN
                  </span>
                </div>
              )}

              <Link href="/sell">
                <button className="btn-primary text-[13px] py-[7px] px-4">
                  + Elan Yerləşdir
                </button>
              </Link>

              <UserDropdown />
            </>
          )}
        </div>

      </div>
    </header>
  );
}
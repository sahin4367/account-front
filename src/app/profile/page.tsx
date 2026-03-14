'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const NAV_ITEMS = [
  { href: '/profile',                  label: 'Hesab Məlumatları', key: 'account'  },
  { href: '/profile/phone',            label: 'Telefon Doğrulama', key: 'phone'    },
  { href: '/profile/escrowpayments',   label: 'Ödəniş Profili',    key: 'payment'  },
  { href: '/my-listings',              label: 'Elanlarım',         key: 'listings' },
  { href: '/escrow',                   label: 'Escrow Deallar',    key: 'escrow'   },
];

export default function ProfilePage() {
  const { isAuthenticated, loading, user, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email:    '',
    phone:    '',
    address:  '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || '',
        email:    user.email    || '',
        phone:    user.phone    || '',
        address:  user.address  || '',
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text3)' }}>Yüklənir...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (form.phone !== user.phone) {
      router.push('/profile/phone');
      return;
    }
    setUpdating(true);
    try {
      await api.put(`/users/update/${user.id}`, {
        username: form.username,
        address:  form.address,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hesabı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.')) return;
    setDeleting(true);
    try {
      await api.delete(`/users/delete/${user.id}`);
      logout();
      router.push('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi');
      setDeleting(false);
    }
  };

  const initial = user.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[900px]">

        <div className="flex gap-6">

          {/* ── SIDEBAR ── */}
          <aside className="w-[220px] flex-shrink-0">

            {/* Avatar */}
            <div
              className="rounded-2xl p-5 mb-4 flex flex-col items-center"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-display font-extrabold text-[24px] mb-3"
                style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)', border: '2px solid var(--yellow-border)' }}
              >
                {initial}
              </div>
              <p className="font-display font-bold text-[14px] text-center" style={{ color: 'var(--text)' }}>
                {user.username}
              </p>
              <p className="text-[11px] mt-0.5 text-center" style={{ color: 'var(--text3)' }}>
                {user.email}
              </p>
              {user.isVerifiedPhone && (
                <span
                  className="mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}
                >
                  ✓ Telefon doğrulandı
                </span>
              )}
            </div>

            {/* Nav */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="block px-4 py-3 text-[13px] font-medium transition-all"
                  style={{
                    color: item.key === 'account' ? 'var(--yellow)' : 'var(--text2)',
                    background: item.key === 'account' ? 'var(--yellow-dim)' : 'transparent',
                    borderBottom: i < NAV_ITEMS.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={() => { logout(); router.push('/'); }}
                className="w-full text-left px-4 py-3 text-[13px] font-medium transition-all"
                style={{ color: '#ef4444', borderTop: '1px solid var(--border)' }}
              >
                Çıxış
              </button>
            </div>

          </aside>

          {/* ── MAIN ── */}
          <div className="flex-1 flex flex-col gap-4">

            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-5"
                style={{ color: 'var(--text3)' }}
              >
                Hesab Məlumatları
              </p>

              <div className="flex flex-col gap-4">

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    İstifadəçi adı
                  </label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="input"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    disabled
                    className="input"
                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  />
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text3)' }}>
                    Email dəyişdirilə bilməz
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Telefon
                  </label>
                  <div className="relative">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="input pr-24"
                      placeholder="+994501234567"
                    />
                    {!user.isVerifiedPhone && (
                      <Link
                        href="/profile/phone"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded-md"
                        style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
                      >
                        Doğrula
                      </Link>
                    )}
                  </div>
                  {!user.isVerifiedPhone && (
                    <p className="text-[10px] mt-1" style={{ color: '#f59e0b' }}>
                      Telefon nömrəsi doğrulanmayıb
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                    Ünvan
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    className="input resize-none"
                    placeholder="Ünvanınızı daxil edin..."
                  />
                </div>

              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="btn-primary flex-1 py-2.5 text-[13px]"
                >
                  {updating ? 'Saxlanılır...' : 'Yadda Saxla'}
                </button>
              </div>

              {saved && (
                <div
                  className="mt-3 rounded-xl p-3 text-center text-[12px] font-medium"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}
                >
                  ✓ Məlumatlar uğurla yeniləndi
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-3"
                style={{ color: '#ef4444' }}
              >
                Təhlükəli zona
              </p>
              <p className="text-[12px] mb-4" style={{ color: 'var(--text3)' }}>
                Hesabı silsəniz bütün məlumatlarınız, elanlarınız və deal tarixçəniz birdəfəlik silinəcək.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[12px] font-bold px-5 py-2.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                }}
              >
                {deleting ? 'Silinir...' : 'Hesabı Sil'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
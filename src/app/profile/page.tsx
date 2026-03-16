'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const NAV_ITEMS = [
  { href: '/profile',                label: 'Hesab Məlumatları', key: 'account'  },
  { href: '/profile/phone',          label: 'Telefon Doğrulama', key: 'phone'    },
  { href: '/profile/escrowpayments', label: 'Ödəniş Profili',    key: 'payment'  },
  { href: '/my-listings',            label: 'Elanlarım',         key: 'listings' },
  { href: '/escrow',                 label: 'Escrow Deallar',    key: 'escrow'   },
];

export default function ProfilePage() {
  const { isAuthenticated, loading, user, logout, refreshUser } = useAuth();
  const router = useRouter();

  const [saved,    setSaved]    = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', phone: '', address: '' });

  useEffect(() => {
    if (user) setForm({
      username: user.username || '',
      email:    user.email    || '',
      phone:    user.phone    || '',
      address:  user.address  || '',
    });
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-slate-500 text-[13px]">Yüklənir...</p>
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
    if (form.phone !== user.phone) { router.push('/profile/phone'); return; }
    setUpdating(true);
    try {
      await api.put(`/users/update/${user.id}`, { username: form.username, address: form.address });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi');
    } finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Hesabı silmək istədiyinizə əminsiniz?')) return;
    setDeleting(true);
    try {
      await api.delete(`/users/delete/${user.id}`);
      logout(); router.push('/');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi');
      setDeleting(false);
    }
  };

  const initial = user.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR ── */}
          <aside className="w-[220px] flex-shrink-0">

            {/* Avatar card */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 mb-3 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-[24px] mb-3 bg-yellow-500/10 text-yellow-500 border-2 border-yellow-500/20">
                {initial}
              </div>
              <p className="font-display font-bold text-[14px] text-white text-center">
                {user.username}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 text-center truncate w-full text-center">
                {user.email}
              </p>
              {user.isVerifiedPhone && (
                <span className="mt-2.5 text-[9px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                  ✓ Telefon doğrulandı
                </span>
              )}
            </div>

            {/* Nav */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`block px-4 py-3 text-[13px] font-medium transition-all ${
                    item.key === 'account'
                      ? 'text-yellow-500 bg-yellow-500/[0.08]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  } ${i < NAV_ITEMS.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="w-full text-left px-4 py-3 text-[13px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.05] transition-all border-t border-white/[0.05]"
              >
                Çıxış
              </button>
            </div>

          </aside>

          {/* ── MAIN ── */}
          <div className="flex-1 flex flex-col gap-4">

            {/* Hesab məlumatları */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">

              <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-6">
                Hesab Məlumatları
              </p>

              <div className="flex flex-col gap-5">

                <div>
                  <label className="block text-[11px] text-slate-500 mb-2">
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
                  <label className="block text-[11px] text-slate-500 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={form.email}
                    disabled
                    className="input opacity-40 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-600 mt-1.5">
                    Email dəyişdirilə bilməz
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-2">
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      >
                        Doğrula
                      </Link>
                    )}
                  </div>
                  {!user.isVerifiedPhone && (
                    <p className="text-[10px] text-amber-500/80 mt-1.5">
                      Telefon nömrəsi doğrulanmayıb
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-2">
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

              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-primary w-full py-3 text-[13px] mt-6"
              >
                {updating ? 'Saxlanılır...' : 'Yadda Saxla'}
              </button>

              {saved && (
                <div className="mt-3 rounded-xl p-3 text-center text-[12px] font-medium bg-green-500/[0.08] border border-green-500/20 text-green-400">
                  ✓ Məlumatlar uğurla yeniləndi
                </div>
              )}

            </div>

            {/* Danger zone */}
            <div className="rounded-2xl p-6 bg-red-500/[0.03] border border-red-500/[0.12]">
              <p className="text-[10px] font-black uppercase tracking-[1.5px] text-red-400 mb-3">
                Təhlükəli zona
              </p>
              <p className="text-[12px] text-slate-500 mb-5">
                Hesabı silsəniz bütün məlumatlarınız, elanlarınız və deal tarixçəniz birdəfəlik silinəcək.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[12px] font-bold px-5 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/20 text-red-400 hover:bg-red-500/[0.14] transition-all"
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
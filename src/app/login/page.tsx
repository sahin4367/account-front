'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/users/login', form);
      await login(res.data.access_token);

      const userRes = await api.get('/users/me');
      const user = userRes.data;

      if (!user.isVerifiedEmail) {
  try {
    await api.post('/users/verify-email');
  } catch {}  // already verified olsa belə davam et
  router.replace('/verify-email-code');
  return;
}

    if (!user.isVerifiedPhone) {
      router.replace('/profile/phone');
        return;
}

    router.replace('/');
    router.refresh();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ve ya sifre yanlisdir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-display font-black text-[24px]">
            <span className="text-yellow-500">ACCOUNT</span>
            <span className="text-white">market</span>
          </p>
          <p className="text-slate-500 text-[13px] mt-1">Hesabiniza daxil olun</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <div>
              <label className="block text-[11px] text-slate-500 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="email@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-2">Sifre</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl px-4 py-3 text-[12px] font-medium bg-red-500/[0.08] border border-red-500/20 text-red-400">
                ✕ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-[14px] mt-1"
            >
              {loading ? 'Gozleyin...' : 'Daxil ol'}
            </button>

          </form>

          <p className="text-[12px] text-center text-slate-500 mt-5">
            Hesabin yoxdur?{' '}
            <Link href="/register" className="font-bold text-yellow-500 hover:text-yellow-400 transition-colors">
              Qeydiyyat
            </Link>
          </p>

        </div>

        {/* Back to home */}
        <p className="text-center mt-5">
          <Link href="/" className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors">
            ← Ana sehifeye qayit
          </Link>
        </p>

      </div>
    </main>
  );
}
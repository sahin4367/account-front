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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/login', form);
      await login(res.data.access_token);

      // Token save olduqdan sonra user məlumatını al
      const userRes = await api.get('/users/me');
      const user = userRes.data;

      // Email verify olmayıbsa → verify-email səhifəsinə
      if (!user.isVerifiedEmail) {
        // Yeni kod göndər və code səhifəsinə yönləndir
        await api.post('/users/verify-email');
        router.push('/verify-email-code');
        return;
      }

      // Telefon verify olmayıbsa → phone səhifəsinə
      if (!user.isVerifiedPhone) {
        router.push('/profile/phone');
        return;
      }

      router.push('/');

    } catch (err: any) {
      alert(err.response?.data?.message || 'Email və ya şifrə yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">

        <div className="text-center mb-8">
          <p className="font-display font-extrabold text-[22px]">
            <span style={{ color: 'var(--yellow)' }}>ACCOUNT</span>
            <span style={{ color: 'var(--text)' }}>market</span>
          </p>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Hesabınıza daxil olun</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                Şifrə
              </label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full py-3 text-[14px] mt-2"
            >
              {loading ? 'Gözləyin...' : 'Daxil ol'}
            </button>

          </form>

          <p className="text-[12px] text-center mt-5" style={{ color: 'var(--text3)' }}>
            Hesabın yoxdur?{' '}
            <Link href="/register" className="font-bold" style={{ color: 'var(--yellow)' }}>
              Qeydiyyat
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

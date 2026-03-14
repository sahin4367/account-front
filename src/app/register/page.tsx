'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend register zamanı token qaytarır — onu dərhal save edirik
      const res = await api.post('/users/register', form);
      const token = res.data.access_token;

      if (token) {
        await login(token);
      }

      // Register zamanı email kodu göndərilir — birbaşa code səhifəsinə get
      router.push('/verify-email-code');

    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[400px]">

        <div className="text-center mb-8">
          <p className="font-display font-extrabold text-[22px]">
            <span style={{ color: 'var(--yellow)' }}>ACCOUNT</span>
            <span style={{ color: 'var(--text)' }}>market</span>
          </p>
          <p className="text-[13px] mt-1" style={{ color: 'var(--text3)' }}>Yeni hesab yaradın</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                İstifadəçi adı *
              </label>
              <input
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="input"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                Email *
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
                Şifrə *
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

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                Telefon *
              </label>
              <input
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="input"
                placeholder="+994501234567"
              />
            </div>

            <div>
              <label className="block text-[11px] mb-1.5" style={{ color: 'var(--text3)' }}>
                Ünvan *
              </label>
              <textarea
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                rows={2}
                className="input resize-none"
                placeholder="Şəhər, ölkə..."
              />
            </div>

            <button
              disabled={loading}
              className="btn-primary w-full py-3 text-[14px] mt-1"
            >
              {loading ? 'Gözləyin...' : 'Qeydiyyat'}
            </button>

          </form>

          <p className="text-[12px] text-center mt-5" style={{ color: 'var(--text3)' }}>
            Hesabın var?{' '}
            <Link href="/login" className="font-bold" style={{ color: 'var(--yellow)' }}>
              Daxil ol
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
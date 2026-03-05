'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await api.post('/users/login', form);

      const token = res.data.access_token;

      await login(token);

      const userRes = await api.get('/users/me');

      const user = userRes.data;

      if (!user.isVerifiedEmail) {
        router.push('/verify-email');
        return;
      }

      if (!user.isVerifiedPhone) {
        router.push('/verify-phone');
        return;
      }

      router.push('/profile');

    } catch (err: any) {
      alert(err.response?.data?.message || 'Email və ya şifrə yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Daxil ol
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
            onChange={handleChange}
            value={form.email}
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Şifrə"
            className="input"
            onChange={handleChange}
            value={form.password}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Gözləyin...' : 'Daxil ol'}
          </button>

        </form>

      </div>
    </div>
  );
}
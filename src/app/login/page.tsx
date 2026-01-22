'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';



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

      /**
       * Backend response gözlənilən:
       * {
       *   accessToken: string,
       *   user: { id, username, email }
       * }
       */
      login(res.data.accessToken, res.data.user);

      router.push('/');
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
          />

          <input
            name="password"
            type="password"
            required
            placeholder="Şifrə"
            className="input"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Gözləyin...' : 'Daxil ol'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Hesabın yoxdur?{' '}
          <a href="/register" className="text-blue-600 font-semibold">
            Qeydiyyat
          </a>
        </p>
      </div>
    </div>
  );
}

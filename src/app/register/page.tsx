'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/users/register', form);
      alert('Qeydiyyat uğurla tamamlandı');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Hesab Yarat
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="username"
            required
            placeholder="İstifadəçi adı"
            className="input"
            onChange={handleChange}
          />

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

          <input
            name="phone"
            placeholder="Telefon"
            className="input"
            onChange={handleChange}
          />

          <textarea
            name="address"
            placeholder="Ünvan"
            rows={3}
            className="input resize-none"
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Gözləyin...' : 'Qeydiyyat'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Hesabın var?{' '}
          <a href="/login" className="text-blue-600 font-semibold">
            Daxil ol
          </a>
        </p>
      </div>
    </div>
  );
}

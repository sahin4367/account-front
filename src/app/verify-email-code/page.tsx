'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function VerifyCodePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // console.log('TOKEN:', localStorage.getItem('token'))

    try {
      const res = await api.post('/users/verify-email-code', {
        code: Number(code),
      });

      alert(res.data.message);
      router.push('/');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kod yanlışdır');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Kodu daxil et
        </h1>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Təsdiq Kodu"
            className="input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-60"
          >
            {loading ? 'Yoxlanılır...' : 'Təsdiqlə'}
          </button>
        </form>
      </div>
    </div>
  );
}

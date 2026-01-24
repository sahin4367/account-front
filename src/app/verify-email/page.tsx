'use client';

import { useState } from 'react';
import api from '../../lib/api';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    setLoading(true);
    try {
      const res = await api.post('/users/verify-email');
      alert(res.data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Email təsdiqi</h1>
        <p className="text-gray-500">
          Email-ə təsdiq kodu göndərmək üçün aşağıdakı düyməni bas.
        </p>

        <button
          onClick={sendCode}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Göndərilir...' : 'Kodu göndər'}
        </button>

        <a href="/verify-email-code" className="block text-blue-600 font-semibold">
          Artıq kodun var? Təsdiqlə →
        </a>
      </div>
    </div>
  );
}

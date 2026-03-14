'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

// Bu səhifə yalnız LOGIN olmuş amma email verify etməmiş
// istifadəçilər üçündür (login flow-dan gəlirlər)

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const sendCode = async () => {
    setLoading(true);
    try {
      // Backend: POST /users/verify-email — yeni kod göndərir
      await api.post('/users/verify-email');
      setSent(true);
      setTimeout(() => router.push('/verify-email-code'), 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div
          className="rounded-2xl p-8 text-center"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] mx-auto mb-5"
            style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
          >
            📧
          </div>

          <h1
            className="font-display font-extrabold text-[22px] tracking-tight mb-2"
            style={{ color: 'var(--text)' }}
          >
            Email Doğrulama
          </h1>
          <p className="text-[12px] mb-6" style={{ color: 'var(--text3)' }}>
            Email ünvanınıza 6 rəqəmli təsdiq kodu göndəriləcək
          </p>

          {sent ? (
            <div
              className="rounded-xl p-3 text-[12px] font-medium"
              style={{
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.2)',
                color: '#22c55e',
              }}
            >
              ✓ Kod göndərildi, yönləndirilirsiniz...
            </div>
          ) : (
            <button
              onClick={sendCode}
              disabled={loading}
              className="btn-primary w-full py-3 text-[13px]"
            >
              {loading ? 'Göndərilir...' : 'Kodu Göndər'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      setError('Kod 6 rəqəm olmalıdır');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Backend: POST /users/verify-email-code  body: { code: number }
      await api.post('/users/verify-email-code', {
        code: Number(code),
      });

      // Uğurlu — telefon doğrulamasına yönləndir
      router.push('/profile/phone');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Kod yanlışdır və ya müddəti bitib');
    } finally {
      setLoading(false);
    }
  };

  // OTP hər rəqəm daxil olduqda avtomatik göndər
  const handleCodeChange = (val: string) => {
    if (!/^\d*$/.test(val)) return;
    setCode(val);
    setError('');

    // 6 rəqəm doldurulduqda avtomatik submit
    if (val.length === 6) {
      setTimeout(() => {
        document.getElementById('verify-btn')?.click();
      }, 300);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] mx-auto mb-5"
            style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
          >
            🔐
          </div>

          <h1
            className="font-display font-extrabold text-[22px] tracking-tight mb-2 text-center"
            style={{ color: 'var(--text)' }}
          >
            Kodu Daxil Et
          </h1>
          <p className="text-[12px] mb-6 text-center" style={{ color: 'var(--text3)' }}>
            Emailinizə göndərilən 6 rəqəmli kodu daxil edin
          </p>

          <form onSubmit={handleVerify} className="flex flex-col gap-4">

            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={e => handleCodeChange(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="input text-center text-[28px] font-display font-bold tracking-[12px]"
              autoFocus
            />

            {error && (
              <div
                className="rounded-xl p-3 text-[11px] text-center font-medium"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444',
                }}
              >
                {error}
              </div>
            )}

            <button
              id="verify-btn"
              disabled={loading || code.length < 6}
              className="btn-primary w-full py-3 text-[13px]"
              style={{ opacity: code.length < 6 ? 0.5 : 1 }}
            >
              {loading ? 'Yoxlanılır...' : 'Təsdiqlə'}
            </button>

          </form>

          <p className="text-[11px] text-center mt-5" style={{ color: 'var(--text3)' }}>
            Kod gəlmədi?{' '}
            <button
              onClick={() => window.location.href = '/verify-email'}
              className="font-bold"
              style={{ color: 'var(--yellow)' }}
            >
              Yenidən göndər
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
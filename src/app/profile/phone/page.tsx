'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function PhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [phone, setPhone]   = useState('');
  const [otp, setOtp]       = useState('');
  const [step, setStep]     = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const phoneRegex = /^\+994(50|51|55|70|77|10)\d{7}$/;

  const handleSendOTP = async () => {
    if (!phoneRegex.test(phone)) {
      setMessage({ text: 'Düzgün format: +994501234567', ok: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/users/sent-otp', { newPhone: phone });
      setStep('otp');
      setMessage({ text: 'Kod göndərildi', ok: true });
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.message || 'Xəta baş verdi', ok: false });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessage({ text: 'Kod 6 rəqəm olmalıdır', ok: false });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/users/verify-phone', { code: otp });
      await refreshUser();
      setMessage({ text: 'Telefon uğurla doğrulandı!', ok: true });
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.message || 'Kod yanlışdır', ok: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[420px]">

        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-[12px] mb-6"
          style={{ color: 'var(--text3)' }}
        >
          ← Profilə qayıt
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-5"
            style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
          >
            📱
          </div>

          <h1
            className="font-display font-extrabold text-[22px] tracking-tight mb-1"
            style={{ color: 'var(--text)' }}
          >
            {step === 'phone' ? 'Telefon Doğrulama' : 'Kodu Daxil Et'}
          </h1>
          <p className="text-[12px] mb-6" style={{ color: 'var(--text3)' }}>
            {step === 'phone'
              ? 'Azərbaycan nömrənizi daxil edin'
              : `${phone} nömrəsinə göndərilən 6 rəqəmli kodu daxil edin`}
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-6">
            {['Nömrə', 'Kod'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: (step === 'otp' && i === 0) || (step === 'phone' && i === 0)
                      ? i === 0 && step === 'otp' ? 'var(--yellow)' : 'var(--yellow-dim)'
                      : i === 1 && step === 'otp' ? 'var(--yellow-dim)' : 'var(--black3)',
                    border: `1px solid ${i === 0 || step === 'otp' ? 'var(--yellow)' : 'var(--border)'}`,
                    color: i === 0 && step === 'otp' ? 'var(--black)' : 'var(--yellow)',
                  }}
                >
                  {i === 0 && step === 'otp' ? '✓' : i + 1}
                </div>
                <span className="text-[11px]" style={{ color: 'var(--text3)' }}>{s}</span>
                {i === 0 && (
                  <div className="flex-1 h-px" style={{ background: step === 'otp' ? 'var(--yellow-border)' : 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>

          {step === 'phone' && (
            <div className="flex flex-col gap-3">
              <input
                value={phone}
                onChange={e => /^[0-9+]*$/.test(e.target.value) && setPhone(e.target.value)}
                placeholder="+994501234567"
                maxLength={13}
                className="input"
              />
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="btn-primary w-full py-3 text-[13px]"
              >
                {loading ? 'Göndərilir...' : 'Kod Göndər'}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="flex flex-col gap-3">
              <input
                value={otp}
                onChange={e => /^\d*$/.test(e.target.value) && setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="input text-center text-[20px] font-display font-bold tracking-[8px]"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="btn-primary w-full py-3 text-[13px]"
              >
                {loading ? 'Yoxlanılır...' : 'Doğrula'}
              </button>
              <button
                onClick={() => { setStep('phone'); setOtp(''); setMessage(null); }}
                className="text-[12px] text-center"
                style={{ color: 'var(--text3)' }}
              >
                Nömrəni dəyiş
              </button>
            </div>
          )}

          {message && (
            <div
              className="mt-4 rounded-xl p-3 text-center text-[12px] font-medium"
              style={{
                background: message.ok ? 'rgba(34,197,94,0.1)'  : 'rgba(239,68,68,0.08)',
                border:     `1px solid ${message.ok ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                color:      message.ok ? '#22c55e' : '#ef4444',
              }}
            >
              {message.ok ? '✓ ' : '✕ '}{message.text}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

export default function PhonePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [phone, setPhone]     = useState('');
  const [otp, setOtp]         = useState('');
  const [step, setStep]       = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  const phoneRegex = /^\+994(50|51|55|70|77|10)\d{7}$/;

  const handleSendOTP = async () => {
    if (!phoneRegex.test(phone)) {
      setMessage({ text: 'Duzgun format: +994501234567', ok: false });
      return;
    }
    setLoading(true); setMessage(null);
    try {
      await api.post('/users/sent-otp', { newPhone: phone });
      setStep('otp');
      setMessage({ text: 'Kod gonderildi', ok: true });
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.message || 'Xeta bas verdi', ok: false });
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setMessage({ text: 'Kod 6 reqem olmalidir', ok: false });
      return;
    }
    setLoading(true); setMessage(null);
    try {
      await api.post('/users/verify-phone', { code: otp });
      await refreshUser();
      setMessage({ text: 'Telefon ugurla dogrulandı!', ok: true });
      setTimeout(() => router.push('/profile'), 1500);
    } catch (err: any) {
      setMessage({ text: err?.response?.data?.message || 'Kod yanlisdir', ok: false });
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-[420px]">

        <Link href="/profile" className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-white transition-colors mb-6">
          &#8592; Profile qayit
        </Link>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">

          {/* Icon */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[22px] mb-5 bg-yellow-500/10 border border-yellow-500/20">
            📱
          </div>

          <h1 className="font-display font-black text-[22px] tracking-tight text-white mb-1">
            {step === 'phone' ? 'Telefon Dogrulama' : 'Kodu Daxil Et'}
          </h1>
          <p className="text-[12px] text-slate-500 mb-6">
            {step === 'phone'
              ? 'Azerbaycan nomrenizi daxil edin'
              : `${phone} nomresine gonderilen 6 reqemli kodu daxil edin`}
          </p>

          {/* Stepper */}
          <div className="flex items-center gap-2 mb-6">
            {['Nomre', 'Kod'].map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: i === 0 && step === 'otp'
                      ? '#f5c518'
                      : (i === 0 && step === 'phone') || (i === 1 && step === 'otp')
                      ? 'rgba(245,197,24,0.1)'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${i === 0 || step === 'otp' ? '#f5c518' : 'rgba(255,255,255,0.1)'}`,
                    color: i === 0 && step === 'otp' ? '#000' : '#f5c518',
                  }}
                >
                  {i === 0 && step === 'otp' ? '✓' : i + 1}
                </div>
                <span className="text-[11px] text-slate-500">{s}</span>
                {i === 0 && (
                  <div
                    className="flex-1 h-px"
                    style={{ background: step === 'otp' ? 'rgba(245,197,24,0.3)' : 'rgba(255,255,255,0.07)' }}
                  />
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
              <button onClick={handleSendOTP} disabled={loading} className="btn-primary w-full py-3 text-[13px]">
                {loading ? 'Gonderilir...' : 'Kod Gonder'}
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
                className="input text-center text-[20px] font-display font-black tracking-[8px]"
                autoFocus
              />
              <button onClick={handleVerifyOTP} disabled={loading} className="btn-primary w-full py-3 text-[13px]">
                {loading ? 'Yoxlanilir...' : 'Dogrula'}
              </button>
              <button
                onClick={() => { setStep('phone'); setOtp(''); setMessage(null); }}
                className="text-[12px] text-center text-slate-500 hover:text-white transition-colors"
              >
                Nomreni deyis
              </button>
            </div>
          )}

          {message && (
            <div className={`mt-4 rounded-xl p-3 text-center text-[12px] font-medium ${
              message.ok
                ? 'bg-green-500/[0.08] border border-green-500/20 text-green-400'
                : 'bg-red-500/[0.08] border border-red-500/20 text-red-400'
            }`}>
              {message.ok ? '✓ ' : '✕ '}{message.text}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
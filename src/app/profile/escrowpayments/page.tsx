'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

type Method = 'BALANCE' | 'PAYPAL' | 'BANK'

const METHODS: { key: Method; label: string; desc: string }[] = [
  { key: 'BALANCE', label: 'ACCOUNTmarket Balans',    desc: 'Qazancınız birbaşa platforma balansınıza köçürülür'  },
  { key: 'PAYPAL',  label: 'PayPal',                  desc: 'PayPal hesabınıza avtomatik ödəniş'                  },
  { key: 'BANK',    label: 'Bank Kocurmesi (Wise)',   desc: 'Wise vasitesile bank hesabiniza beynelxalq kocurme'  },
]

export default function PaymentsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [method, setMethod]             = useState<Method>('PAYPAL')
  const [paypalEmail, setPaypalEmail]   = useState('')
  const [bankDetails, setBankDetails]   = useState('')
  const [loading, setLoading]           = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [saved, setSaved]               = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await api.get('/pay-profile/payment-profile')
        if (res.data) {
          setMethod(res.data.method ?? 'PAYPAL')
          setPaypalEmail(res.data.paypalEmail ?? '')
          setBankDetails(res.data.bankDetails ?? '')
        }
      } catch {}
      finally { setFetchLoading(false) }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  const handleUpdate = async () => {
    setLoading(true); setSaved(false)
    try {
      await api.put('/pay-profile/payment-profile', {
        method,
        paypalEmail: method === 'PAYPAL' ? paypalEmail : '',
        bankDetails: method === 'BANK'   ? bankDetails : '',
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xeta bas verdi')
    } finally { setLoading(false) }
  }

  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-slate-500 text-[13px]">Yuklenir...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-[640px] mx-auto">

        {/* Geri */}
        <Link href="/profile" className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-white transition-colors mb-8">
          &#8592; Profile qayit
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-black text-[28px] tracking-tight text-white">
            Odenis Profili
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            Escrow deallari tamamlandigda odenisi nece almaq istediginizi secin
          </p>
        </div>

        {/* Method seçimi */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-5">
            Odenis Usulu
          </p>
          <div className="flex flex-col gap-3">
            {METHODS.map(m => (
              <div
                key={m.key}
                onClick={() => setMethod(m.key)}
                className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background:  method === m.key ? 'rgba(245,197,24,0.08)' : 'rgba(255,255,255,0.03)',
                  border:      `1px solid ${method === m.key ? 'rgba(245,197,24,0.25)' : 'rgba(255,255,255,0.07)'}`,
                }}
              >
                {/* Radio */}
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                  style={{ border: `2px solid ${method === m.key ? '#f5c518' : '#475569'}` }}
                >
                  {method === m.key && (
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  )}
                </div>
                <div>
                  <p className={`font-display font-bold text-[13px] mb-0.5 ${method === m.key ? 'text-yellow-500' : 'text-white'}`}>
                    {m.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PayPal */}
        {method === 'PAYPAL' && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-4">
              PayPal Email
            </p>
            <input
              type="email"
              value={paypalEmail}
              onChange={e => setPaypalEmail(e.target.value)}
              placeholder="paypal@email.com"
              className="input"
            />
          </div>
        )}

        {/* Bank */}
        {method === 'BANK' && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-4">
              Bank Melumatlari
            </p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-4 text-[11px] leading-relaxed text-slate-500">
              <p className="text-slate-400 mb-2">Wise.com hesab emaili ve ya:</p>
              <p>🇺🇸 ABŞ: Routing, Hesab nomresi, Ad, Soyad, Unvan</p>
              <p className="mt-1">🌍 Diger: IBAN, BIC/SWIFT, Hesab nomresi, Ad, Soyad, Unvan</p>
            </div>
            <textarea
              value={bankDetails}
              onChange={e => setBankDetails(e.target.value)}
              placeholder="Wise email ve ya bank melumatlarinizi daxil edin..."
              rows={5}
              className="input resize-none"
            />
          </div>
        )}

        {/* Balance info */}
        {method === 'BALANCE' && (
          <div className="bg-yellow-500/[0.06] border border-yellow-500/20 rounded-2xl p-5 mb-4 flex items-start gap-3">
            <span className="text-[20px]">💡</span>
            <div>
              <p className="font-display font-bold text-[13px] text-yellow-500 mb-1">
                Balans haqqinda
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Qazandiginiz meblej ACCOUNTmarket balansına elave olunur.
                Balansi yeni hesab almaq ucun istifade ede bilersiniz.
              </p>
            </div>
          </div>
        )}

        {/* Save */}
        <button onClick={handleUpdate} disabled={loading} className="btn-primary w-full py-3 text-[14px]">
          {loading ? 'Saxlanilir...' : 'Yadda Saxla'}
        </button>

        {saved && (
          <div className="mt-3 rounded-xl p-3 text-center text-[12px] font-medium bg-green-500/[0.08] border border-green-500/20 text-green-400">
            ✓ Odenis profili ugurla yenilendi
          </div>
        )}

      </div>
    </main>
  )
}
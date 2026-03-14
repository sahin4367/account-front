'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

type Method = 'BALANCE' | 'PAYPAL' | 'BANK'

export default function PaymentsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [method, setMethod]           = useState<Method>('PAYPAL')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [bankDetails, setBankDetails] = useState('')
  const [loading, setLoading]         = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [saved, setSaved]             = useState(false)

  // Mövcud payment profile-u yüklə
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
      } catch {
        // yeni istifadəçi — boş form
      } finally {
        setFetchLoading(false)
      }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  const handleUpdate = async () => {
    setLoading(true)
    setSaved(false)
    try {
      await api.put('/pay-profile/payment-profile', {
        method,
        paypalEmail: method === 'PAYPAL' ? paypalEmail : '',
        bankDetails: method === 'BANK'   ? bankDetails : '',
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text3)' }}>Yüklənir...</p>
      </div>
    )
  }

  const METHODS: { key: Method; label: string; desc: string }[] = [
    { key: 'BALANCE', label: 'ACCOUNTmarket Balans',    desc: 'Qazancınız birbaşa platforma balansınıza köçürülür'         },
    { key: 'PAYPAL',  label: 'PayPal',                  desc: 'PayPal hesabınıza avtomatik ödəniş'                          },
    { key: 'BANK',    label: 'Bank Köçürməsi (Wise.com)',desc: 'Wise vasitəsilə bank hesabınıza beynəlxalq köçürmə'         },
  ]

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[640px]">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-[28px] tracking-tight mb-1"
            style={{ color: 'var(--text)' }}
          >
            Ödəniş Profili
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
            Escrow dealları tamamlandıqda ödənişi necə almaq istədiyinizi seçin
          </p>
        </div>

        {/* Method seçimi */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
        >
          <p
            className="font-display font-bold text-[11px] uppercase tracking-widest mb-4"
            style={{ color: 'var(--text3)' }}
          >
            Ödəniş Üsulu
          </p>

          <div className="flex flex-col gap-3">
            {METHODS.map(m => (
              <label
                key={m.key}
                onClick={() => setMethod(m.key)}
                className="flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: method === m.key ? 'var(--yellow-dim)' : 'var(--black3)',
                  border: `1px solid ${method === m.key ? 'var(--yellow-border)' : 'var(--border)'}`,
                }}
              >
                {/* Custom radio */}
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                  style={{
                    border: `2px solid ${method === m.key ? 'var(--yellow)' : 'var(--text3)'}`,
                  }}
                >
                  {method === m.key && (
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: 'var(--yellow)' }}
                    />
                  )}
                </div>

                <div>
                  <p
                    className="font-display font-bold text-[13px] mb-0.5"
                    style={{ color: method === m.key ? 'var(--yellow)' : 'var(--text)' }}
                  >
                    {m.label}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                    {m.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* PayPal email */}
        {method === 'PAYPAL' && (
          <div
            className="rounded-2xl p-6 mb-4"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
          >
            <p
              className="font-display font-bold text-[11px] uppercase tracking-widest mb-3"
              style={{ color: 'var(--text3)' }}
            >
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

        {/* Bank details */}
        {method === 'BANK' && (
          <div
            className="rounded-2xl p-6 mb-4"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest"
                style={{ color: 'var(--text3)' }}
              >
                Bank Məlumatları
              </p>
            </div>

            <div
              className="rounded-xl p-4 mb-4 text-[11px] leading-relaxed"
              style={{ background: 'var(--black3)', border: '1px solid var(--border)', color: 'var(--text3)' }}
            >
              <p className="mb-1" style={{ color: 'var(--text2)' }}>Wise.com hesab emaili <span style={{ color: 'var(--text3)' }}>və ya:</span></p>
              <p>🇺🇸 ABŞ: Routing nömrəsi, Hesab nömrəsi, Ad, Soyad, Ünvan</p>
              <p className="mt-1">🌍 Digər: IBAN, BIC/SWIFT, Hesab nömrəsi, Ad, Soyad, Ünvan</p>
            </div>

            <textarea
              value={bankDetails}
              onChange={e => setBankDetails(e.target.value)}
              placeholder="Wise email və ya bank məlumatlarınızı daxil edin..."
              rows={5}
              className="input resize-none"
            />
          </div>
        )}

        {/* BALANCE info */}
        {method === 'BALANCE' && (
          <div
            className="rounded-2xl p-5 mb-4 flex items-start gap-3"
            style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
          >
            <span className="text-[20px]">💡</span>
            <div>
              <p className="font-display font-bold text-[13px] mb-1" style={{ color: 'var(--yellow)' }}>
                Balans haqqında
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                Qazandığınız məbləğ ACCOUNTmarket balansınıza əlavə olunur.
                Balansı yeni hesab almaq üçün istifadə edə bilərsiniz.
              </p>
            </div>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="btn-primary w-full py-3 text-[14px]"
        >
          {loading ? 'Saxlanılır...' : 'Yadda Saxla'}
        </button>

        {saved && (
          <div
            className="mt-3 rounded-xl p-3 text-center text-[12px] font-medium"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}
          >
            ✓ Ödəniş profili uğurla yeniləndi
          </div>
        )}

      </div>
    </main>
  )
}
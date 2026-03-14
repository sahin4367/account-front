'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

type EscrowStatus = 'PENDING' | 'FUNDED' | 'DELIVERED' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED'
type EscrowRole   = 'BUYER' | 'SELLER'

interface EscrowDeal {
  id: number
  listingTitle: string
  platform: string
  price: number
  role: EscrowRole
  status: EscrowStatus
  buyerUsername: string
  sellerUsername: string
  createdAt: string
}

const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; bg: string; step: number }> = {
  PENDING:   { label: 'Gözləyir',       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  step: 0 },
  FUNDED:    { label: 'Ödəniş Alındı',  color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  step: 1 },
  DELIVERED: { label: 'Hesab Verildi',  color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  step: 2 },
  COMPLETED: { label: 'Tamamlandı',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   step: 3 },
  DISPUTED:  { label: 'Mübahisə',       color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   step: -1},
  REFUNDED:  { label: 'Geri Qaytarıldı',color: '#a0a0a0', bg: 'rgba(160,160,160,0.12)',step: -1},
}

const ESCROW_STEPS = ['Gözləyir', 'Ödəniş Alındı', 'Hesab Verildi', 'Tamamlandı']

const MOCK_DEALS: EscrowDeal[] = [
  { id: 1, listingTitle: 'Musiqi Səhifəsi – 45.2K', platform: 'INSTAGRAM', price: 350,  role: 'SELLER', status: 'FUNDED',    buyerUsername: 'murad123',   sellerUsername: 'azer_sell', createdAt: '2025-01-10' },
  { id: 2, listingTitle: 'Tech Kanal – 22K',         platform: 'YOUTUBE',   price: 1200, role: 'BUYER',  status: 'COMPLETED', buyerUsername: 'azer_sell',  sellerUsername: 'yt_master', createdAt: '2024-12-05' },
  { id: 3, listingTitle: 'Kripto Kanalı – 14K',      platform: 'TELEGRAM',  price: 320,  role: 'BUYER',  status: 'PENDING',   buyerUsername: 'azer_sell',  sellerUsername: 'crypto_az', createdAt: '2025-02-01' },
  { id: 4, listingTitle: 'Komedi Kanal – 120K',      platform: 'TIKTOK',    price: 800,  role: 'SELLER', status: 'DISPUTED',  buyerUsername: 'elvin99',    sellerUsername: 'azer_sell', createdAt: '2025-01-28' },
]

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
}

export default function EscrowPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth()
  const router = useRouter()

  const [deals, setDeals]           = useState<EscrowDeal[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [selected, setSelected]     = useState<EscrowDeal | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [roleFilter, setRoleFilter] = useState<'ALL' | EscrowRole>('ALL')

  useEffect(() => {
  if (authLoading) return;
  if (!isAuthenticated) { router.push('/login'); return; }

  const load = async () => {
    try {
      const res = await api.get('/escrow');
      setDeals(res.data);
    } catch {
      setDeals([]);
    } finally {
      setPageLoading(false);
    }
  };
  load();
}, [isAuthenticated, authLoading, router]);

  const handleAction = async (dealId: number, action: 'confirm' | 'dispute') => {
  setActionLoading(true);
  try {
    if (action === 'confirm') {
      await api.post(`/escrow/${dealId}/confirm`);
    } else {
      const reason = prompt('Mübahisə səbəbini yazın:');
      if (!reason) { setActionLoading(false); return; }
      await api.post(`/escrow/${dealId}/dispute`, { disputeReason: reason });
    }
    const res = await api.get('/escrow');
    setDeals(res.data);
    setSelected(null);
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Xəta baş verdi');
  } finally {
    setActionLoading(false);
  }
};

  const filtered = roleFilter === 'ALL'
    ? deals
    : deals.filter(d => d.role === roleFilter)

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text3)' }}>Yüklənir...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[960px]">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-[28px] tracking-tight mb-1"
            style={{ color: 'var(--text)' }}
          >
            Escrow Deallar
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
            Bütün alqı-satqı əməliyyatların burada izlə
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Aktiv',       value: deals.filter(d => ['FUNDED','DELIVERED'].includes(d.status)).length, color: '#3b82f6' },
            { label: 'Tamamlandı',  value: deals.filter(d => d.status === 'COMPLETED').length,  color: '#22c55e' },
            { label: 'Mübahisə',    value: deals.filter(d => d.status === 'DISPUTED').length,   color: '#ef4444' },
            { label: 'Ümumi',       value: deals.length,                                         color: 'var(--yellow)' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p className="font-display font-extrabold text-[24px]" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Role filter */}
        <div className="flex gap-2 mb-5">
          {([
            { key: 'ALL',    label: 'Hamısı'  },
            { key: 'BUYER',  label: 'Aldıqlarım' },
            { key: 'SELLER', label: 'Satdıqlarım' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setRoleFilter(f.key)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: roleFilter === f.key ? 'var(--yellow-dim)' : 'var(--black2)',
                border: `1px solid ${roleFilter === f.key ? 'var(--yellow-border)' : 'var(--border)'}`,
                color: roleFilter === f.key ? 'var(--yellow)' : 'var(--text2)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Deal list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div
                className="rounded-2xl p-10 flex flex-col items-center justify-center"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
              >
                <span className="text-[36px] mb-3">🤝</span>
                <p className="text-[13px] font-bold font-display" style={{ color: 'var(--text)' }}>
                  Deal yoxdur
                </p>
              </div>
            ) : (
              filtered.map(deal => {
                const st = STATUS_CONFIG[deal.status]
                const isSelected = selected?.id === deal.id
                return (
                  <div
                    key={deal.id}
                    onClick={() => setSelected(deal)}
                    className="rounded-xl p-4 cursor-pointer transition-all"
                    style={{
                      background: isSelected ? 'var(--yellow-dim)' : 'var(--black2)',
                      border: `1px solid ${isSelected ? 'var(--yellow-border)' : 'var(--border)'}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex-shrink-0"
                        style={{ background: PLATFORM_BG[deal.platform] ?? '#222' }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-display font-bold text-[12px] truncate"
                          style={{ color: isSelected ? 'var(--yellow)' : 'var(--text)' }}
                        >
                          {deal.listingTitle}
                        </p>
                        <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                          {deal.role === 'BUYER' ? '🛒 Alıcı' : '💰 Satıcı'} · {deal.price} AZN
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Deal detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div
                className="rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
              >
                <span className="text-[36px] mb-3">👆</span>
                <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
                  Deal seçin
                </p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
              >
                {/* Deal header */}
                <div className="flex items-start gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ background: PLATFORM_BG[selected.platform] ?? '#222' }}
                  />
                  <div>
                    <p
                      className="font-display font-bold text-[16px] mb-0.5"
                      style={{ color: 'var(--text)' }}
                    >
                      {selected.listingTitle}
                    </p>
                    <p className="text-[12px]" style={{ color: 'var(--text3)' }}>
                      {selected.platform} · Deal #{selected.id}
                    </p>
                  </div>
                </div>

                {/* Progress stepper */}
                {selected.status !== 'DISPUTED' && selected.status !== 'REFUNDED' && (
                  <div className="mb-6">
                    <div className="flex items-center">
                      {ESCROW_STEPS.map((s, i) => {
                        const currentStep = STATUS_CONFIG[selected.status].step
                        const done = i < currentStep
                        const active = i === currentStep
                        return (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                  background: done ? 'var(--yellow)' : active ? 'var(--yellow-dim)' : 'var(--black3)',
                                  border: `1px solid ${done || active ? 'var(--yellow)' : 'var(--border)'}`,
                                  color: done ? 'var(--black)' : active ? 'var(--yellow)' : 'var(--text3)',
                                }}
                              >
                                {done ? '✓' : i + 1}
                              </div>
                              <p
                                className="text-[9px] mt-1 text-center whitespace-nowrap"
                                style={{ color: active ? 'var(--yellow)' : 'var(--text3)' }}
                              >
                                {s}
                              </p>
                            </div>
                            {i < ESCROW_STEPS.length - 1 && (
                              <div
                                className="flex-1 h-px mx-1 mb-4"
                                style={{ background: done ? 'var(--yellow-border)' : 'var(--border)' }}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Deal info */}
                <div className="flex flex-col gap-2 mb-6">
                  {[
                    { label: 'Qiymət',   value: `${selected.price} AZN` },
                    { label: 'Rolu',     value: selected.role === 'BUYER' ? '🛒 Alıcı' : '💰 Satıcı' },
                    { label: 'Alıcı',    value: selected.buyerUsername  },
                    { label: 'Satıcı',   value: selected.sellerUsername },
                    { label: 'Tarix',    value: new Date(selected.createdAt).toLocaleDateString('az-AZ') },
                    { label: 'Status',   value: STATUS_CONFIG[selected.status].label },
                  ].map(row => (
                    <div
                      key={row.label}
                      className="flex justify-between py-2"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <span className="text-[12px]" style={{ color: 'var(--text3)' }}>{row.label}</span>
                      <span className="text-[12px] font-medium" style={{ color: 'var(--text)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {selected.status === 'DELIVERED' && selected.role === 'BUYER' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(selected.id, 'confirm')}
                      disabled={actionLoading}
                      className="btn-primary flex-1 py-2.5 text-[13px]"
                    >
                      {actionLoading ? 'Gözləyin...' : '✓ Hesabı Qəbul Et'}
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, 'dispute')}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 text-[13px] rounded-xl font-medium transition-all"
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#ef4444',
                      }}
                    >
                      Mübahisə Aç
                    </button>
                  </div>
                )}

                {selected.status === 'DISPUTED' && (
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    <p className="text-[12px] font-bold mb-1" style={{ color: '#ef4444' }}>
                      Mübahisə açıqdır
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                      Moderator 24 saat ərzində əlaqə saxlayacaq
                    </p>
                  </div>
                )}

                {selected.status === 'COMPLETED' && (
                  <div
                    className="rounded-xl p-4 text-center"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    <p className="text-[13px] font-bold" style={{ color: '#22c55e' }}>
                      ✓ Deal uğurla tamamlandı
                    </p>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
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
  PENDING:   { label: 'Gozleyir',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  step: 0  },
  FUNDED:    { label: 'Odenis Alindi',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  step: 1  },
  DELIVERED: { label: 'Hesab Verildi',   color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  step: 2  },
  COMPLETED: { label: 'Tamamlandi',      color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   step: 3  },
  DISPUTED:  { label: 'Mubahise',        color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   step: -1 },
  REFUNDED:  { label: 'Geri Qaytarildi', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', step: -1 },
}

const ESCROW_STEPS = ['Gozleyir', 'Odenis Alindi', 'Hesab Verildi', 'Tamamlandi']

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
}

export default function EscrowPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [deals, setDeals]                 = useState<EscrowDeal[]>([])
  const [pageLoading, setPageLoading]     = useState(true)
  const [selected, setSelected]           = useState<EscrowDeal | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [roleFilter, setRoleFilter]       = useState<'ALL' | EscrowRole>('ALL')

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await api.get('/escrow')
        setDeals(res.data)
      } catch { setDeals([]) }
      finally { setPageLoading(false) }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  const handleAction = async (dealId: number, action: 'confirm' | 'dispute') => {
    setActionLoading(true)
    try {
      if (action === 'confirm') {
        await api.post(`/escrow/${dealId}/confirm`)
      } else {
        const reason = prompt('Mubahise sebebini yazin:')
        if (!reason) { setActionLoading(false); return }
        await api.post(`/escrow/${dealId}/dispute`, { disputeReason: reason })
      }
      const res = await api.get('/escrow')
      setDeals(res.data)
      setSelected(null)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xeta bas verdi')
    } finally { setActionLoading(false) }
  }

  const filtered = roleFilter === 'ALL' ? deals : deals.filter(d => d.role === roleFilter)

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-slate-500 text-[13px]">Yuklenir...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-black text-[32px] tracking-tight text-white leading-none">
            Escrow Deallar
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            Butun alqi-satqi emeliyyatlari burada izle
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Aktiv',      value: deals.filter(d => ['FUNDED','DELIVERED'].includes(d.status)).length, color: '#3b82f6' },
            { label: 'Tamamlandi', value: deals.filter(d => d.status === 'COMPLETED').length,  color: '#22c55e' },
            { label: 'Mubahise',   value: deals.filter(d => d.status === 'DISPUTED').length,   color: '#ef4444' },
            { label: 'Umumi',      value: deals.length,                                         color: '#f5c518' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
              <p className="font-display font-black text-[26px] leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-2">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Role filter */}
        <div className="flex gap-2 mb-6">
          {([
            { key: 'ALL',    label: 'Hamisi'      },
            { key: 'BUYER',  label: 'Aldiqlarim'  },
            { key: 'SELLER', label: 'Satdiqlarim' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setRoleFilter(f.key)}
              className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: roleFilter === f.key ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.03)',
                border:     `1px solid ${roleFilter === f.key ? 'rgba(245,197,24,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color:      roleFilter === f.key ? '#f5c518' : '#64748b',
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
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-12 flex flex-col items-center justify-center">
                <span className="text-[36px] mb-3">🤝</span>
                <p className="font-display font-bold text-[13px] text-white">Deal yoxdur</p>
              </div>
            ) : filtered.map(deal => {
              const st    = STATUS_CONFIG[deal.status]
              const isSel = selected?.id === deal.id
              return (
                <div
                  key={deal.id}
                  onClick={() => setSelected(deal)}
                  className="rounded-xl p-4 cursor-pointer transition-all"
                  style={{
                    background: isSel ? 'rgba(245,197,24,0.08)' : 'rgba(255,255,255,0.03)',
                    border:     `1px solid ${isSel ? 'rgba(245,197,24,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: PLATFORM_BG[deal.platform] ?? '#222' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-[12px] truncate" style={{ color: isSel ? '#f5c518' : '#f1f5f9' }}>
                        {deal.listingTitle}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {deal.role === 'BUYER' ? 'Alici' : 'Satici'} · {deal.price} AZN
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Deal detail */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl min-h-[300px] flex flex-col items-center justify-center">
                <span className="text-[36px] mb-3">👆</span>
                <p className="text-[13px] text-slate-500">Deal secin</p>
              </div>
            ) : (
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">

                {/* Deal header */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: PLATFORM_BG[selected.platform] ?? '#222' }} />
                  <div>
                    <p className="font-display font-bold text-[16px] text-white">{selected.listingTitle}</p>
                    <p className="text-[12px] text-slate-500 mt-0.5">{selected.platform} · Deal #{selected.id}</p>
                  </div>
                </div>

                {/* Stepper */}
                {!['DISPUTED','REFUNDED'].includes(selected.status) && (
                  <div className="flex items-center mb-6">
                    {ESCROW_STEPS.map((s, i) => {
                      const cur  = STATUS_CONFIG[selected.status].step
                      const done = i < cur
                      const act  = i === cur
                      return (
                        <div key={s} className="flex items-center" style={{ flex: i < ESCROW_STEPS.length - 1 ? 1 : 'none' }}>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{
                                background: done ? '#f5c518' : act ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.05)',
                                border:     `1px solid ${done || act ? '#f5c518' : 'rgba(255,255,255,0.1)'}`,
                                color:      done ? '#000' : act ? '#f5c518' : '#475569',
                              }}
                            >
                              {done ? '✓' : i + 1}
                            </div>
                            <p className="text-[9px] mt-1 whitespace-nowrap" style={{ color: act ? '#f5c518' : '#475569' }}>{s}</p>
                          </div>
                          {i < ESCROW_STEPS.length - 1 && (
                            <div className="flex-1 h-px mx-1 mb-4" style={{ background: done ? 'rgba(245,197,24,0.3)' : 'rgba(255,255,255,0.07)' }} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Deal info */}
                <div className="flex flex-col mb-6">
                  {[
                    { label: 'Qiymet', value: `${selected.price} AZN`                            },
                    { label: 'Rol',    value: selected.role === 'BUYER' ? 'Alici' : 'Satici'      },
                    { label: 'Alici',  value: selected.buyerUsername                              },
                    { label: 'Satici', value: selected.sellerUsername                             },
                    { label: 'Tarix',  value: new Date(selected.createdAt).toLocaleDateString()   },
                    { label: 'Status', value: STATUS_CONFIG[selected.status].label                },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between py-2.5 border-b border-white/[0.06]">
                      <span className="text-[12px] text-slate-500">{row.label}</span>
                      <span className="text-[12px] font-medium text-white">{row.value}</span>
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
                      {actionLoading ? 'Gozleyin...' : '✓ Hesabi Qebul Et'}
                    </button>
                    <button
                      onClick={() => handleAction(selected.id, 'dispute')}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 text-[13px] rounded-xl font-semibold bg-red-500/[0.08] border border-red-500/20 text-red-400 hover:bg-red-500/[0.12] transition-all"
                    >
                      Mubahise Ac
                    </button>
                  </div>
                )}

                {selected.status === 'DISPUTED' && (
                  <div className="rounded-xl p-4 text-center bg-red-500/[0.08] border border-red-500/20">
                    <p className="text-[12px] font-bold text-red-400 mb-1">Mubahise aciqdir</p>
                    <p className="text-[11px] text-slate-500">Moderator 24 saat erzinde elaqe saxlayacaq</p>
                  </div>
                )}

                {selected.status === 'COMPLETED' && (
                  <div className="rounded-xl p-4 text-center bg-green-500/[0.08] border border-green-500/20">
                    <p className="text-[13px] font-bold text-green-400">✓ Deal ugurla tamamlandi</p>
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
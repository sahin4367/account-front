'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../lib/api'

type ListingStatus = 'PENDING' | 'ACTIVE' | 'SOLD' | 'REJECTED'

interface Listing {
  id: number
  platform: string
  title: string
  price: number
  priceType: 'fixed' | 'negotiable'
  status: ListingStatus
  followers: number
  createdAt: string
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; color: string; bg: string }> = {
  PENDING:  { label: 'Gozleyir',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  ACTIVE:   { label: 'Aktiv',       color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  SOLD:     { label: 'Satildi',     color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  REJECTED: { label: 'Redd edildi', color: '#ef4444', bg: 'rgba(239,68,68,0.12)'   },
}

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
}

export default function MyListingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router       = useRouter()
  const searchParams = useSearchParams()
  const isCreated    = searchParams.get('created') === '1'

  const [listings, setListings]       = useState<Listing[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [filter, setFilter]           = useState<'ALL' | ListingStatus>(
    isCreated ? 'PENDING' : 'ALL'
  )

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { router.push('/login'); return }
    const load = async () => {
      try {
        const res = await api.get('/listings/user/my-listings')
        setListings(res.data)
      } catch { setListings([]) }
      finally { setPageLoading(false) }
    }
    load()
  }, [isAuthenticated, authLoading, router])

  const handleDelete = async (id: number) => {
    if (!confirm('Bu elani silmek istediginize eminsiniz?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(prev => prev.filter(l => l.id !== id))
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xeta bas verdi')
    }
  }

  const filtered = filter === 'ALL' ? listings : listings.filter(l => l.status === filter)

  const counts = {
    ALL:      listings.length,
    ACTIVE:   listings.filter(l => l.status === 'ACTIVE').length,
    PENDING:  listings.filter(l => l.status === 'PENDING').length,
    SOLD:     listings.filter(l => l.status === 'SOLD').length,
    REJECTED: listings.filter(l => l.status === 'REJECTED').length,
  }

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-slate-500 text-[13px]">Yuklenir...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display font-black text-[32px] tracking-tight text-white leading-none">
              Elanlarim
            </h1>
            <p className="text-slate-500 text-[13px] mt-2">{listings.length} elan tapildi</p>
          </div>
          <Link href="/sell">
            <button className="btn-primary text-[13px] py-2.5 px-5">+ Yeni Elan</button>
          </Link>
        </div>

        {/* Created success banner */}
        {isCreated && (
          <div className="mb-8 bg-green-500/[0.06] border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0 text-[20px]">
              🎉
            </div>
            <div>
              <p className="font-display font-bold text-[15px] text-green-400 mb-1">
                Elan ugurla gonderildi!
              </p>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Elaniniz hal-hazirda moderasiya gozleyir. Tesdiqden sonra platformda gorunecek.
                Orta gozleme muddeti <strong className="text-white">24 saat</strong>-dir.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { key: 'ACTIVE',   label: 'Aktiv',       color: '#22c55e' },
            { key: 'PENDING',  label: 'Gozleyir',    color: '#f59e0b' },
            { key: 'SOLD',     label: 'Satildi',     color: '#94a3b8' },
            { key: 'REJECTED', label: 'Redd edildi', color: '#ef4444' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key as ListingStatus)}
              className="bg-white/[0.03] border rounded-xl p-4 text-left transition-all hover:border-white/[0.12]"
              style={{
                borderColor: filter === s.key
                  ? s.color + '40'
                  : 'rgba(255,255,255,0.07)',
              }}
            >
              <p
                className="font-display font-black text-[26px] leading-none"
                style={{ color: s.color }}
              >
                {counts[s.key as ListingStatus]}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {([
            { key: 'ALL',      label: 'Hamisi'      },
            { key: 'ACTIVE',   label: 'Aktiv'        },
            { key: 'PENDING',  label: 'Gozleyir'     },
            { key: 'SOLD',     label: 'Satildi'      },
            { key: 'REJECTED', label: 'Redd edildi'  },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: filter === f.key ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.03)',
                border:     `1px solid ${filter === f.key ? 'rgba(245,197,24,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color:      filter === f.key ? '#f5c518' : '#64748b',
              }}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-60">
                {counts[f.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl py-20 flex flex-col items-center justify-center">
            <span className="text-[40px] mb-4">📭</span>
            <p className="font-display font-bold text-[15px] text-white mb-2">Elan yoxdur</p>
            <p className="text-[13px] text-slate-500 mb-6">
              {filter === 'PENDING'
                ? 'Gozleyen elaniniz yoxdur'
                : 'Hele bu kateqoriyada elan yoxdur'}
            </p>
            <Link href="/sell">
              <button className="btn-primary text-[12px] py-2 px-5">
                Ilk elanini yerlesdiri
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(l => {
              const st = STATUS_CONFIG[l.status]
              return (
                <div
                  key={l.id}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.12] transition-all"
                  style={{
                    borderColor: l.status === 'PENDING' && isCreated
                      ? 'rgba(245,158,11,0.3)'
                      : undefined,
                  }}
                >
                  {/* Platform */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ background: PLATFORM_BG[l.platform] ?? '#222' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-display font-bold text-[14px] text-white truncate">
                        {l.title}
                      </p>
                      <span
                        className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {l.platform} · {l.followers.toLocaleString()} izleyici · {new Date(l.createdAt).toLocaleDateString()}
                    </p>
                    {l.status === 'PENDING' && (
                      <p className="text-[10px] text-amber-500/70 mt-1">
                        ⏳ Moderasiya gozleyir — max 24 saat
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-black text-[16px] text-white">
                      {l.price} AZN
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {l.priceType === 'fixed' ? 'sabit' : 'muzakireli'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Link href={`/listing/${l.id}`}>
                      <button className="text-[11px] px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.07] text-slate-400 hover:text-white transition-all">
                        Bax
                      </button>
                    </Link>
                    {l.status !== 'SOLD' && (
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="text-[11px] px-3 py-2 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-red-400 hover:bg-red-500/[0.14] transition-all"
                      >
                        Sil
                      </button>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        )}

      </div>
    </main>
  )
}
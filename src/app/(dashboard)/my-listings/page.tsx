'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  PENDING:  { label: 'Gözləyir',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  ACTIVE:   { label: 'Aktiv',     color: '#22c55e', bg: 'rgba(34,197,94,0.12)'   },
  SOLD:     { label: 'Satıldı',   color: '#a0a0a0', bg: 'rgba(160,160,160,0.12)' },
  REJECTED: { label: 'Rədd edildi',color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
}

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
}

// Mock data — backend hazır olanda api çağırışı ilə əvəz et
const MOCK: Listing[] = [
  { id: 1, platform: 'INSTAGRAM', title: 'Musiqi Səhifəsi – 45.2K', price: 350,  priceType: 'fixed',      status: 'ACTIVE',   followers: 45200, createdAt: '2024-12-01' },
  { id: 2, platform: 'TIKTOK',    title: 'Komedi Kanal – 120K',      price: 800,  priceType: 'negotiable', status: 'PENDING',  followers: 120000,createdAt: '2025-01-15' },
  { id: 3, platform: 'YOUTUBE',   title: 'Tech Kanal – 22K',         price: 1200, priceType: 'fixed',      status: 'SOLD',     followers: 22100, createdAt: '2024-10-20' },
  { id: 4, platform: 'TELEGRAM',  title: 'Xəbər Kanalı – 8.5K',      price: 180,  priceType: 'fixed',      status: 'REJECTED', followers: 8500,  createdAt: '2025-02-01' },
]

export default function MyListingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()

  const [listings, setListings]   = useState<Listing[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [filter, setFilter]       = useState<'ALL' | ListingStatus>('ALL')
  const [deleteId, setDeleteId]   = useState<number | null>(null)

  useEffect(() => {
  if (authLoading) return;
  if (!isAuthenticated) { router.push('/login'); return; }

  const load = async () => {
    try {
      const res = await api.get('/listings/user/my-listings');
      setListings(res.data);
    } catch {
      setListings([]);
    } finally {
      setPageLoading(false);
    }
  };
  load();
}, [isAuthenticated, authLoading, router]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu elanı silmək istədiyinizə əminsiniz?')) return
    try {
      await api.delete(`/listings/${id}`)
      setListings(prev => prev.filter(l => l.id !== id))  
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi')
    }
  }

  const filtered = filter === 'ALL'
    ? listings
    : listings.filter(l => l.status === filter)

  const counts = {
    ALL:      listings.length,
    ACTIVE:   listings.filter(l => l.status === 'ACTIVE').length,
    PENDING:  listings.filter(l => l.status === 'PENDING').length,
    SOLD:     listings.filter(l => l.status === 'SOLD').length,
    REJECTED: listings.filter(l => l.status === 'REJECTED').length,
  }

  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--text3)' }}>Yüklənir...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[860px]">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-display font-extrabold text-[28px] tracking-tight mb-1"
              style={{ color: 'var(--text)' }}
            >
              Elanlarım
            </h1>
            <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
              {listings.length} elan tapıldı
            </p>
          </div>
          <Link href="/sell">
            <button className="btn-primary text-[13px] py-2.5 px-5">
              + Yeni Elan
            </button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { key: 'ACTIVE',   label: 'Aktiv',      color: '#22c55e' },
            { key: 'PENDING',  label: 'Gözləyir',   color: '#f59e0b' },
            { key: 'SOLD',     label: 'Satıldı',    color: '#a0a0a0' },
            { key: 'REJECTED', label: 'Rədd edildi',color: '#ef4444' },
          ].map(s => (
            <div
              key={s.key}
              className="rounded-xl p-4"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p
                className="font-display font-extrabold text-[24px]"
                style={{ color: s.color }}
              >
                {counts[s.key as ListingStatus]}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar">
          {([
            { key: 'ALL',      label: 'Hamısı'      },
            { key: 'ACTIVE',   label: 'Aktiv'        },
            { key: 'PENDING',  label: 'Gözləyir'     },
            { key: 'SOLD',     label: 'Satıldı'      },
            { key: 'REJECTED', label: 'Rədd edildi'  },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{
                background: filter === f.key ? 'var(--yellow-dim)' : 'var(--black2)',
                border: `1px solid ${filter === f.key ? 'var(--yellow-border)' : 'var(--border)'}`,
                color: filter === f.key ? 'var(--yellow)' : 'var(--text2)',
              }}
            >
              {f.label}
              <span
                className="ml-1.5 text-[10px]"
                style={{ color: filter === f.key ? 'var(--yellow)' : 'var(--text3)' }}
              >
                {counts[f.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
          >
            <span className="text-[40px] mb-4">📭</span>
            <p className="font-display font-bold text-[15px] mb-1" style={{ color: 'var(--text)' }}>
              Elan yoxdur
            </p>
            <p className="text-[12px] mb-5" style={{ color: 'var(--text3)' }}>
              Hələ bu kateqoriyada elan yoxdur
            </p>
            <Link href="/sell">
              <button className="btn-primary text-[12px] py-2 px-5">İlk elanını yerlşdir</button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(l => {
              const st = STATUS_CONFIG[l.status]
              return (
                <div
                  key={l.id}
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
                >
                  {/* Platform color bar */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ background: PLATFORM_BG[l.platform] ?? '#222' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p
                        className="font-display font-bold text-[14px] truncate"
                        style={{ color: 'var(--text)' }}
                      >
                        {l.title}
                      </p>
                      <span
                        className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>
                      {l.platform} · {l.followers.toLocaleString()} izləyici · {new Date(l.createdAt).toLocaleDateString('az-AZ')}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-display font-extrabold text-[16px]"
                      style={{ color: 'var(--text)' }}
                    >
                      {l.price} AZN
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {l.priceType === 'fixed' ? 'sabit' : 'müzakirəli'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/listing/${l.id}`}>
                      <button
                        className="text-[11px] px-3 py-2 rounded-lg transition-all"
                        style={{
                          background: 'var(--black3)',
                          border: '1px solid var(--border)',
                          color: 'var(--text2)',
                        }}
                      >
                        Bax
                      </button>
                    </Link>
                    {l.status !== 'SOLD' && (
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="text-[11px] px-3 py-2 rounded-lg transition-all"
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: '#ef4444',
                        }}
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
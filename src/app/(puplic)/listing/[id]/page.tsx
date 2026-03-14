'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../lib/api';

interface ListingDetail {
  id: number;
  platform: string;
  title: string;
  description: string;
  price: number;
  priceType: 'fixed' | 'negotiable';
  followers: number;
  engagementRate?: string;
  niche?: string;
  country?: string;
  age?: string;
  monthlyIncome?: number;
  views: number;
  status: string;
  seller: {
    id: number;
    username: string;
    avatar?: string;
  };
}

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
};

export default function ListingDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [listing, setListing]         = useState<ListingDetail | null>(null);
  const [loading, setLoading]         = useState(true);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [msgLoading, setMsgLoading]   = useState(false);
  const [notFound, setNotFound]       = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err: any) {
        if (err?.response?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBuy = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setEscrowLoading(true);
    try {
      const res = await api.post('/escrow/create', { listingId: Number(id) });
      router.push(`/escrow?dealId=${res.data.dealId}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setEscrowLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setMsgLoading(true);
    try {
      const res = await api.post('/messages/start', {
        listingId: Number(id),
        text:      'Salam! Bu elan haqda məlumat almaq istəyirəm.',
      });
      router.push(`/messages?convId=${res.data.conversationId}`);
    } catch (err: any) {
      // Söhbət artıq mövcuddursa bilavasitə yönləndir
      router.push('/messages');
    } finally {
      setMsgLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="container mx-auto max-w-[1000px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="h-[180px] rounded-2xl animate-pulse" style={{ background: 'var(--black2)' }} />
              <div className="h-[120px] rounded-2xl animate-pulse" style={{ background: 'var(--black2)' }} />
              <div className="h-[200px] rounded-2xl animate-pulse" style={{ background: 'var(--black2)' }} />
            </div>
            <div className="h-[300px] rounded-2xl animate-pulse" style={{ background: 'var(--black2)' }} />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-[40px]">😕</span>
        <p className="font-display font-bold text-[18px]" style={{ color: 'var(--text)' }}>Elan tapılmadı</p>
        <Link href="/listings">
          <button className="btn-primary px-6 py-2 text-[13px]">Elanlara qayıt</button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.seller?.id;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto max-w-[1000px]">

        <Link
          href="/listings"
          className="inline-flex items-center gap-1 text-[12px] mb-6"
          style={{ color: 'var(--text3)' }}
        >
          ← Elanlara qayıt
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Banner */}
            <div
              className="h-[180px] rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{ background: PLATFORM_BG[listing.platform] ?? '#222' }}
            >
              <span
                className="font-display font-extrabold text-[15px] px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.35)', color: '#fff' }}
              >
                {listing.platform}
              </span>
              <span
                className="absolute top-3 right-3 text-[10px] px-2 py-1 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}
              >
                👁 {listing.views} baxış
              </span>
            </div>

            {/* Title */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>
                {listing.platform}
              </p>
              <h1 className="font-display font-extrabold text-[24px] tracking-tight mb-2" style={{ color: 'var(--text)' }}>
                {listing.title}
              </h1>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                {listing.description}
              </p>
            </div>

            {/* Stats */}
            <div
              className="rounded-2xl p-6"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p className="font-display font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                Hesab Məlumatları
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'İzləyici',    value: listing.followers?.toLocaleString() },
                  { label: 'Engagement',  value: listing.engagementRate ?? '—'       },
                  { label: 'Ölkə',        value: listing.country ?? '—'              },
                  { label: 'Hesab yaşı',  value: listing.age ?? '—'                  },
                  { label: 'Niş',         value: listing.niche ?? '—'                },
                  { label: 'Aylıq gəlir', value: listing.monthlyIncome ? `${listing.monthlyIncome} AZN` : '—' },
                ].map(s => (
                  <div
                    key={s.label}
                    className="rounded-xl p-3"
                    style={{ background: 'var(--black3)', border: '1px solid var(--border)' }}
                  >
                    <p className="text-[10px] mb-1" style={{ color: 'var(--text3)' }}>{s.label}</p>
                    <p className="font-display font-bold text-[14px]" style={{ color: 'var(--text)' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow info */}
            <div
              className="rounded-2xl p-5 flex items-start gap-4"
              style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
            >
              <span className="text-[22px]">🛡️</span>
              <div>
                <p className="font-display font-bold text-[13px] mb-1" style={{ color: 'var(--yellow)' }}>
                  Escrow ilə qorunmuş alqı-satqı
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                  Ödənişin <strong style={{ color: 'var(--text)' }}>100%</strong>-i əvvəlcə sistemdə saxlanılır.
                  Hesabı aldıqdan sonra satıcıya köçürülür. Problem olarsa tam geri qaytarılır.
                </p>
              </div>
            </div>

          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-6 sticky top-[72px]"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <p className="text-[11px] mb-1" style={{ color: 'var(--text3)' }}>Qiymət</p>
              <p className="font-display font-extrabold text-[32px] tracking-tight mb-1" style={{ color: 'var(--text)' }}>
                {listing.price} <span className="text-[16px]">AZN</span>
              </p>
              <p className="text-[11px] mb-5" style={{ color: 'var(--text3)' }}>
                {listing.priceType === 'fixed' ? 'Sabit qiymət' : 'Müzakirə mümkündür'}
              </p>

              {isOwner ? (
                <div
                  className="rounded-xl p-3 text-center text-[12px]"
                  style={{ background: 'var(--black3)', color: 'var(--text3)' }}
                >
                  Bu sizin elanınızdır
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBuy}
                    disabled={escrowLoading || listing.status === 'SOLD'}
                    className="btn-primary w-full py-3 text-[14px] mb-3"
                  >
                    {listing.status === 'SOLD'
                      ? '✕ Satılıb'
                      : escrowLoading
                      ? 'Yönləndirilir...'
                      : '🛡️ Escrow ilə Al'}
                  </button>

                  <button
                    onClick={handleMessage}
                    disabled={msgLoading}
                    className="btn-ghost w-full py-3 text-[13px]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {msgLoading ? '...' : '💬 Satıcıya Yaz'}
                  </button>
                </>
              )}

              <p className="text-[10px] text-center mt-4" style={{ color: 'var(--text3)' }}>
                Escrow sistemi sizi tam qoruyur
              </p>
            </div>

            {/* Seller */}
            {listing.seller && (
              <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
              >
                <p className="font-display font-bold text-[11px] uppercase tracking-widest mb-4" style={{ color: 'var(--text3)' }}>
                  Satıcı
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[14px]"
                    style={{ background: 'var(--yellow-dim)', color: 'var(--yellow)', border: '1px solid var(--yellow-border)' }}
                  >
                    {listing.seller.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[13px]" style={{ color: 'var(--text)' }}>
                      {listing.seller.username}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--text3)' }}>Satıcı</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
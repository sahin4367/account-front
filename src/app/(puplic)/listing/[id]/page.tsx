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
  seller: { id: number; username: string; avatar?: string; };
}

const PLATFORM_BG: Record<string, string> = {
  INSTAGRAM: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)',
  TIKTOK:    'linear-gradient(135deg,#111,#69c9d0)',
  YOUTUBE:   'linear-gradient(135deg,#c00,#ff4444)',
  TELEGRAM:  'linear-gradient(135deg,#2ca5e0,#1a6fa8)',
  FACEBOOK:  'linear-gradient(135deg,#1877f2,#0d5bba)',
  TWITTER:   'linear-gradient(135deg,#111,#1d9bf0)',
};

const syne = 'var(--font-syne), Syne, sans-serif';

export default function ListingDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [listing, setListing]             = useState<ListingDetail | null>(null);
  const [loading, setLoading]             = useState(true);
  const [escrowLoading, setEscrowLoading] = useState(false);
  const [msgLoading, setMsgLoading]       = useState(false);
  const [notFound, setNotFound]           = useState(false);

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
      alert(err?.response?.data?.message || 'Xeta bas verdi');
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
        text: 'Salam! Bu elan haqda melumat almaq isteyirem.',
      });
      router.push(`/messages?convId=${res.data.conversationId}`);
    } catch {
      router.push('/messages');
    } finally {
      setMsgLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', padding: '40px 24px', background: 'var(--black)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[180, 120, 200].map(h => (
                <div key={h} style={{ height: h, borderRadius: 16, background: 'var(--black2)' }} />
              ))}
            </div>
            <div style={{ height: 300, borderRadius: 16, background: 'var(--black2)' }} />
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--black)',
      }}>
        <span style={{ fontSize: 48 }}>&#128533;</span>
        <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
          Elan tapilmadi
        </p>
        <Link href="/listings">
          <button className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
            Elanlara qayit
          </button>
        </Link>
      </main>
    );
  }

  const isOwner = user?.id === listing.seller?.id;

  return (
    <main style={{ minHeight: '100vh', padding: '40px 24px', background: 'var(--black)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>

        {/* Back */}
        <Link
          href="/listings"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text3)', marginBottom: 24, textDecoration: 'none' }}
        >
          &#8592; Elanlara qayit
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="detail-grid">
          <style>{`
            @media (min-width: 1024px) {
              .detail-grid { grid-template-columns: 2fr 1fr !important; }
            }
          `}</style>

          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Banner */}
            <div style={{
              height: 180,
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: PLATFORM_BG[listing.platform] ?? '#222',
            }}>
              <span style={{
                fontFamily: syne,
                fontWeight: 800,
                fontSize: 15,
                padding: '6px 16px',
                borderRadius: 100,
                background: 'rgba(0,0,0,0.35)',
                color: '#fff',
              }}>
                {listing.platform}
              </span>
              <span style={{
                position: 'absolute',
                top: 12,
                right: 12,
                fontSize: 10,
                padding: '4px 8px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
              }}>
                &#128065; {listing.views} baxis
              </span>
            </div>

            {/* Title block */}
            <div style={{
              borderRadius: 16,
              padding: 24,
              background: 'var(--black2)',
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: 8 }}>
                {listing.platform}
              </p>
              <h1 style={{
                fontFamily: syne,
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: '-0.5px',
                color: 'var(--text)',
                marginBottom: 8,
              }}>
                {listing.title}
              </h1>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text2)' }}>
                {listing.description}
              </p>
            </div>

            {/* Stats grid */}
            <div style={{
              borderRadius: 16,
              padding: 24,
              background: 'var(--black2)',
              border: '1px solid var(--border)',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: 16,
              }}>
                Hesab Melumatlari
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { label: 'Izleyici',    value: listing.followers?.toLocaleString() },
                  { label: 'Engagement',  value: listing.engagementRate ?? '-'        },
                  { label: 'Olke',        value: listing.country ?? '-'               },
                  { label: 'Hesab yasi',  value: listing.age ?? '-'                   },
                  { label: 'Nis',         value: listing.niche ?? '-'                 },
                  { label: 'Aylig gelir', value: listing.monthlyIncome ? `${listing.monthlyIncome} AZN` : '-' },
                ].map(s => (
                  <div key={s.label} style={{
                    borderRadius: 10,
                    padding: 12,
                    background: 'var(--black3)',
                    border: '1px solid var(--border)',
                  }}>
                    <p style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Escrow info */}
            <div style={{
              borderRadius: 16,
              padding: 20,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              background: 'var(--yellow-dim)',
              border: '1px solid var(--yellow-border)',
            }}>
              <span style={{ fontSize: 22 }}>&#128737;</span>
              <div>
                <p style={{ fontFamily: syne, fontWeight: 700, fontSize: 13, color: 'var(--yellow)', marginBottom: 4 }}>
                  Escrow ile qorunmus alis-veris
                </p>
                <p style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--text2)' }}>
                  Odenisin <strong style={{ color: 'var(--text)' }}>100%</strong>-i evvelce sistemde saxlanilir.
                  Hesabi alandan sonra saticiya kocurulur. Problem olarsa tam geri qaytarilir.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Price card */}
            <div style={{
              borderRadius: 16,
              padding: 24,
              background: 'var(--black2)',
              border: '1px solid var(--border)',
              position: 'sticky',
              top: 72,
            }}>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Qiymet</p>
              <p style={{ fontFamily: syne, fontWeight: 800, fontSize: 32, letterSpacing: '-1px', color: 'var(--text)', marginBottom: 4 }}>
                {listing.price} <span style={{ fontSize: 16, fontWeight: 400 }}>AZN</span>
              </p>
              <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 20 }}>
                {listing.priceType === 'fixed' ? 'Sabit qiymet' : 'Muzakire mumkundur'}
              </p>

              {isOwner ? (
                <div style={{
                  borderRadius: 10,
                  padding: 12,
                  textAlign: 'center',
                  fontSize: 12,
                  background: 'var(--black3)',
                  color: 'var(--text3)',
                }}>
                  Bu sizin elaninizdir
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBuy}
                    disabled={escrowLoading || listing.status === 'SOLD'}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', fontSize: 14, marginBottom: 10 }}
                  >
                    {listing.status === 'SOLD'
                      ? 'Satildi'
                      : escrowLoading
                      ? 'Yonlendirilir...'
                      : '&#128737; Escrow ile Al'}
                  </button>

                  <button
                    onClick={handleMessage}
                    disabled={msgLoading}
                    className="btn-ghost"
                    style={{ width: '100%', padding: '12px', fontSize: 13 }}
                  >
                    {msgLoading ? '...' : 'Saticiya Yaz'}
                  </button>
                </>
              )}

              <p style={{ fontSize: 10, textAlign: 'center', marginTop: 12, color: 'var(--text3)' }}>
                Escrow sistemi sizi tam qoruyur
              </p>
            </div>

            {/* Seller card */}
            {listing.seller && (
              <div style={{
                borderRadius: 16,
                padding: 20,
                background: 'var(--black2)',
                border: '1px solid var(--border)',
              }}>
                <p style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.8px', color: 'var(--text3)', marginBottom: 16,
                }}>
                  Satici
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: syne, fontWeight: 700, fontSize: 16,
                    background: 'var(--yellow-dim)',
                    color: 'var(--yellow)',
                    border: '1px solid var(--yellow-border)',
                    flexShrink: 0,
                  }}>
                    {listing.seller.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
                      {listing.seller.username}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text3)' }}>Satici</p>
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
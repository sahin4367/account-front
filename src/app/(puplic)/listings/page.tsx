'use client';

import { useState, useEffect, useMemo } from 'react';

import api from '../../../lib/api';
import ListingCard from '../../../components/listing/ListingCard';

interface Listing {
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
  badge?: 'featured' | 'hot' | 'new';
}

const PLATFORMS = [
  { key: 'ALL',       label: 'Hamısı'    },
  { key: 'INSTAGRAM', label: 'Instagram' },
  { key: 'TIKTOK',    label: 'TikTok'    },
  { key: 'YOUTUBE',   label: 'YouTube'   },
  { key: 'TELEGRAM',  label: 'Telegram'  },
  { key: 'FACEBOOK',  label: 'Facebook'  },
  { key: 'TWITTER',   label: 'Twitter/X' },
];

const SORT_OPTIONS = [
  { key: 'newest',     label: 'Ən yeni'        },
  { key: 'price_asc',  label: 'Qiymət: Aşağı'  },
  { key: 'price_desc', label: 'Qiymət: Yüksək' },
];

const PRICE_RANGES = [
  { key: 'all',  label: 'Hamısı',        min: 0,   max: Infinity },
  { key: 'low',  label: '0 – 300 AZN',   min: 0,   max: 300      },
  { key: 'mid',  label: '300 – 700 AZN', min: 300, max: 700      },
  { key: 'high', label: '700+ AZN',      min: 700, max: Infinity  },
];

export default function ListingsPage() {
  const [listings, setListings]     = useState<Listing[]>([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);

  const [platform, setPlatform]     = useState('ALL');
  const [sort, setSort]             = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const range = PRICE_RANGES.find(r => r.key === priceRange)!;

      const params: Record<string, string> = { sort };
      if (platform !== 'ALL')        params.platform = platform;
      if (search)                    params.search   = search;
      if (range.min > 0)             params.minPrice = String(range.min);
      if (range.max !== Infinity)    params.maxPrice = String(range.max);

      const res = await api.get('/listings', { params });
      setListings(res.data.data ?? res.data);
      setTotal(res.data.total ?? res.data.length);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [platform, sort, priceRange, search]);

  const handleSearch = () => setSearch(searchInput);
  const handleReset  = () => {
    setPlatform('ALL');
    setPriceRange('all');
    setSearch('');
    setSearchInput('');
    setSort('newest');
  };

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="container mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1
            className="font-display font-extrabold text-[32px] tracking-tight mb-1"
            style={{ color: 'var(--text)' }}
          >
            Elanlar
          </h1>
          <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
            {total} elan mövcuddur
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div
            className="flex flex-1 items-center gap-2 px-4 rounded-xl"
            style={{ background: 'var(--black2)', border: '1px solid var(--border2)' }}
          >
            <span style={{ color: 'var(--text3)' }}>⌕</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Elan axtar..."
              className="flex-1 bg-transparent outline-none py-3 text-[13px]"
              style={{ color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                style={{ color: 'var(--text3)' }}
              >✕</button>
            )}
            <button onClick={handleSearch} className="btn-primary text-[11px] py-1.5 px-3 rounded-lg">
              Axtar
            </button>
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-3 rounded-xl text-[13px] outline-none"
            style={{
              background: 'var(--black2)',
              border: '1px solid var(--border2)',
              color: 'var(--text2)',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block w-[200px] flex-shrink-0">

            <div className="mb-6">
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-3"
                style={{ color: 'var(--text3)' }}
              >
                Platform
              </p>
              <div className="flex flex-col gap-1">
                {PLATFORMS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className="text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      background: platform === p.key ? 'var(--yellow-dim)' : 'transparent',
                      color:      platform === p.key ? 'var(--yellow)' : 'var(--text2)',
                      border:     `1px solid ${platform === p.key ? 'var(--yellow-border)' : 'transparent'}`,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p
                className="font-display font-bold text-[11px] uppercase tracking-widest mb-3"
                style={{ color: 'var(--text3)' }}
              >
                Qiymət
              </p>
              <div className="flex flex-col gap-1">
                {PRICE_RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setPriceRange(r.key)}
                    className="text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      background: priceRange === r.key ? 'var(--yellow-dim)' : 'transparent',
                      color:      priceRange === r.key ? 'var(--yellow)' : 'var(--text2)',
                      border:     `1px solid ${priceRange === r.key ? 'var(--yellow-border)' : 'transparent'}`,
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Grid */}
          <div className="flex-1">

            {/* Mobile platform pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar lg:hidden">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium"
                  style={{
                    background: platform === p.key ? 'var(--yellow-dim)' : 'var(--black2)',
                    border:     `1px solid ${platform === p.key ? 'var(--yellow-border)' : 'var(--border)'}`,
                    color:      platform === p.key ? 'var(--yellow)' : 'var(--text2)',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <p className="text-[12px] mb-4" style={{ color: 'var(--text3)' }}>
              {loading ? 'Yüklənir...' : `${listings.length} nəticə`}
            </p>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden"
                    style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
                  >
                    <div className="h-[84px] animate-pulse" style={{ background: 'var(--black3)' }} />
                    <div className="p-3 flex flex-col gap-2">
                      <div className="h-3 rounded animate-pulse" style={{ background: 'var(--black3)', width: '60%' }} />
                      <div className="h-4 rounded animate-pulse" style={{ background: 'var(--black3)' }} />
                      <div className="h-3 rounded animate-pulse" style={{ background: 'var(--black3)', width: '80%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {listings.map(l => (
                  <ListingCard key={l.id} {...l} />
                ))}
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-20 rounded-xl"
                style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
              >
                <span className="text-[40px] mb-4">🔍</span>
                <p className="font-display font-bold text-[15px] mb-1" style={{ color: 'var(--text)' }}>
                  Nəticə tapılmadı
                </p>
                <p className="text-[12px] mb-4" style={{ color: 'var(--text3)' }}>
                  Filtrləri dəyişdirməyi sınayın
                </p>
                <button onClick={handleReset} className="btn-primary text-[12px] py-2 px-5">
                  Filtrləri sıfırla
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/api';
import ListingCard from '../../../components/ui/ListingCard';

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
  { key: 'ALL',       label: 'Hamisi'    },
  { key: 'INSTAGRAM', label: 'Instagram' },
  { key: 'TIKTOK',    label: 'TikTok'    },
  { key: 'YOUTUBE',   label: 'YouTube'   },
  { key: 'TELEGRAM',  label: 'Telegram'  },
  { key: 'FACEBOOK',  label: 'Facebook'  },
  { key: 'TWITTER',   label: 'Twitter/X' },
];

const SORT_OPTIONS = [
  { key: 'newest',     label: 'En yeni'        },
  { key: 'price_asc',  label: 'Qiymet: Asagi'  },
  { key: 'price_desc', label: 'Qiymet: Yuksek' },
];

const PRICE_RANGES = [
  { key: 'all',  label: 'Hamisi',        min: 0,   max: Infinity },
  { key: 'low',  label: '0 - 300 AZN',   min: 0,   max: 300      },
  { key: 'mid',  label: '300 - 700 AZN', min: 300, max: 700      },
  { key: 'high', label: '700+ AZN',      min: 700, max: Infinity  },
];

export default function ListingsPage() {
  const [listings, setListings]       = useState<Listing[]>([]);
  const [loading, setLoading]         = useState(true);
  const [total, setTotal]             = useState(0);
  const [platform, setPlatform]       = useState('ALL');
  const [sort, setSort]               = useState('newest');
  const [priceRange, setPriceRange]   = useState('all');
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const range = PRICE_RANGES.find(r => r.key === priceRange)!;
      const params: Record<string, string> = { sort };
      if (platform !== 'ALL')      params.platform = platform;
      if (search)                  params.search   = search;
      if (range.min > 0)           params.minPrice = String(range.min);
      if (range.max !== Infinity)  params.maxPrice = String(range.max);
      const res = await api.get('/listings', { params });
      setListings(res.data.data ?? res.data);
      setTotal(res.data.total ?? res.data.length);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [platform, sort, priceRange, search]);

  const handleSearch = () => setSearch(searchInput);
  const handleReset  = () => {
    setPlatform('ALL'); setPriceRange('all');
    setSearch(''); setSearchInput(''); setSort('newest');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-display font-black text-[36px] tracking-tight text-white leading-none">
            Elanlar
          </h1>
          <p className="text-slate-500 text-[13px] mt-2">
            {total} elan movcuddur
          </p>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          <div className="flex flex-1 items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4">
            <span className="text-slate-500 text-[16px]">&#128269;</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Elan axtar..."
              className="flex-1 bg-transparent outline-none py-3 text-[13px] text-white placeholder-slate-500"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                className="text-slate-500 hover:text-white transition-colors text-[14px]"
              >
                &#10005;
              </button>
            )}
            <button
              onClick={handleSearch}
              className="btn-primary text-[11px] py-1.5 px-3 rounded-lg"
            >
              Axtar
            </button>
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.07] text-slate-300 rounded-xl px-4 py-3 text-[13px] outline-none cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.key} value={o.key} className="bg-[#111]">{o.label}</option>
            ))}
          </select>

        </div>

        <div className="flex gap-8">

          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-[200px] flex-shrink-0">

            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-3">
                Platform
              </p>
              <div className="flex flex-col gap-1">
                {PLATFORMS.map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className="text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      background: platform === p.key ? 'rgba(245,197,24,0.1)' : 'transparent',
                      color:      platform === p.key ? '#f5c518' : '#64748b',
                      border:     `1px solid ${platform === p.key ? 'rgba(245,197,24,0.25)' : 'transparent'}`,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[1.5px] text-slate-500 mb-3">
                Qiymet
              </p>
              <div className="flex flex-col gap-1">
                {PRICE_RANGES.map(r => (
                  <button
                    key={r.key}
                    onClick={() => setPriceRange(r.key)}
                    className="text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all"
                    style={{
                      background: priceRange === r.key ? 'rgba(245,197,24,0.1)' : 'transparent',
                      color:      priceRange === r.key ? '#f5c518' : '#64748b',
                      border:     `1px solid ${priceRange === r.key ? 'rgba(245,197,24,0.25)' : 'transparent'}`,
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">

            {/* Mobile platform pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar lg:hidden">
              {PLATFORMS.map(p => (
                <button
                  key={p.key}
                  onClick={() => setPlatform(p.key)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                  style={{
                    background: platform === p.key ? 'rgba(245,197,24,0.1)' : 'rgba(255,255,255,0.04)',
                    border:     `1px solid ${platform === p.key ? 'rgba(245,197,24,0.25)' : 'rgba(255,255,255,0.07)'}`,
                    color:      platform === p.key ? '#f5c518' : '#64748b',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <p className="text-[12px] text-slate-600 mb-5">
              {loading ? 'Yuklenir...' : `${listings.length} netice`}
            </p>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                    <div className="h-[90px] bg-white/[0.04]" />
                    <div className="p-4 flex flex-col gap-2.5">
                      <div className="h-2.5 rounded bg-white/[0.05] w-3/5" />
                      <div className="h-4 rounded bg-white/[0.05]" />
                      <div className="h-2.5 rounded bg-white/[0.05] w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Listings */}
            {!loading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map(l => (
                  <ListingCard key={l.id} {...l} />
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && listings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <p className="text-[40px] mb-4">&#128269;</p>
                <p className="font-display font-bold text-[16px] text-white mb-2">
                  Netice tapilmadi
                </p>
                <p className="text-[13px] text-slate-500 mb-6">
                  Filtrleri deyisdirmeyi sinayin
                </p>
                <button onClick={handleReset} className="btn-primary text-[13px] py-2.5 px-6">
                  Filtrleri sifirla
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
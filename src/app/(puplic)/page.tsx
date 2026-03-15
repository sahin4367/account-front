import Link from 'next/link';
import api from '../../lib/api';
import ListingCard from '../../components/listing/ListingCard';

const STATS = [
  { num: '1,247', label: 'Aktiv elan'  },
  { num: '99.2%', label: 'Uğurlu deal' },
  { num: '3,800+',label: 'İstifadəçi'  },
];

const CATEGORIES = [
  { key: 'all',       label: 'Hamısı'    },
  { key: 'INSTAGRAM', label: 'Instagram' },
  { key: 'TIKTOK',    label: 'TikTok'    },
  { key: 'YOUTUBE',   label: 'YouTube'   },
  { key: 'TELEGRAM',  label: 'Telegram'  },
  { key: 'FACEBOOK',  label: 'Facebook'  },
  { key: 'TWITTER',   label: 'Twitter/X' },
];

async function getLatestListings() {
  try {
    const res = await api.get('/listings', {
      params: { sort: 'newest', limit: '8' },
    });
    return res.data.data ?? res.data ?? [];
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const res = await api.get('/listings', { params: { limit: '1' } });
    return res.data.total ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [listings, totalListings] = await Promise.all([
    getLatestListings(),
    getStats(),
  ]);

  return (
    <main>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10">
        <div className="container mx-auto">

          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold font-display mb-5"
            style={{ border: '1px solid var(--yellow-border)', color: 'var(--yellow)' }}
          >
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: 'var(--yellow)' }} />
            {totalListings ? `${totalListings} Aktiv Elan` : '1,247 Aktiv Elan'} · Escrow Qorunması
          </div>

          <h1
            className="font-display font-extrabold text-[46px] md:text-[56px] leading-[1.05] tracking-[-2px] mb-4"
            style={{ color: 'var(--text)' }}
          >
            Hesabını <span style={{ color: 'var(--yellow)' }}>Sat.</span>
            <br />
            Hesab <span style={{ color: 'var(--yellow)' }}>Al.</span>
          </h1>

          <p
            className="text-[14px] leading-relaxed mb-8 max-w-[460px]"
            style={{ color: 'var(--text2)' }}
          >
            Instagram, TikTok, YouTube — real izləyicili hesabları
            Escrow sistemi ilə tam təhlükəsiz al və sat.
          </p>

          {/* Search */}
          <div
            className="flex items-center gap-2 max-w-[600px] rounded-xl p-[5px]"
            style={{ background: 'var(--black3)', border: '1px solid var(--border2)' }}
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <span style={{ color: 'var(--text3)' }}>⌕</span>
              <input
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
                placeholder="50k Instagram, musiqi nişi..."
              />
            </div>
            <div className="w-px h-6" style={{ background: 'var(--border2)' }} />
            <select
              className="bg-transparent outline-none text-[12px] px-3"
              style={{ color: 'var(--text2)', fontFamily: 'Inter, sans-serif' }}
            >
              <option value="">Bütün platformlar</option>
              {CATEGORIES.slice(1).map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <Link href="/listings">
              <button className="btn-primary text-[13px] py-2 px-5 rounded-[9px]">
                Axtar
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-8">
            {STATS.map(s => (
              <div key={s.label}>
                <p
                  className="font-display font-extrabold text-[22px]"
                  style={{ color: 'var(--yellow)' }}
                >
                  {s.num}
                </p>
                <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="px-6 mt-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((c, i) => (
              <Link key={c.key} href={i === 0 ? '/listings' : `/listings?platform=${c.key}`}>
                <button
                  className="flex-shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{
                    background: i === 0 ? 'var(--yellow-dim)' : 'var(--black2)',
                    border:     `1px solid ${i === 0 ? 'var(--yellow-border)' : 'var(--border)'}`,
                    color:      i === 0 ? 'var(--yellow)' : 'var(--text2)',
                  }}
                >
                  {c.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SON ELANLAR ── */}
      <section className="px-6 mt-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="font-display font-bold text-[15px]"
              style={{ color: 'var(--text)' }}
            >
              Son Elanlar
            </h2>
            <Link
              href="/listings"
              className="text-[12px] font-medium"
              style={{ color: 'var(--yellow)' }}
            >
              Hamısına bax →
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {listings.map((l: any) => (
                <ListingCard key={l.id} {...l} />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-2xl"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <span className="text-[36px] mb-3">📭</span>
              <p className="font-display font-bold text-[14px] mb-1" style={{ color: 'var(--text)' }}>
                Hələ elan yoxdur
              </p>
              <p className="text-[12px] mb-4" style={{ color: 'var(--text3)' }}>
                İlk elanı sən yerləşdir!
              </p>
              <Link href="/sell">
                <button className="btn-primary text-[12px] py-2 px-5">
                  Elan Yerləşdir
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 mt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🛡️', title: 'Escrow Sistemi',  desc: 'Pul yalnız hesab təhvil verildikdən sonra satıcıya keçir.' },
            { icon: '💬', title: 'Birbaşa Çat',     desc: 'Alıcı-satıcı arasında şifrəli sürətli mesajlaşma.'        },
            { icon: '📊', title: 'Real Statistika', desc: 'İzləyici keyfiyyəti bot analizi ilə yoxlanılır.'           },
          ].map(f => (
            <div
              key={f.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <span className="text-[22px]">{f.icon}</span>
              <p
                className="font-display font-bold text-[13px] mt-3 mb-1"
                style={{ color: 'var(--yellow)' }}
              >
                {f.title}
              </p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text2)' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 mt-8 mb-16">
        <div
          className="container mx-auto rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)' }}
        >
          <div>
            <h2
              className="font-display font-extrabold text-[22px] tracking-tight mb-1"
              style={{ color: 'var(--text)' }}
            >
              Hesabını satmağa hazırsan?
            </h2>
            <p className="text-[13px]" style={{ color: 'var(--text2)' }}>
              Minlərlə alıcı sənin təklifini gözləyir.
            </p>
          </div>
          <Link href="/sell">
            <button className="btn-primary px-8 py-3 text-[14px] whitespace-nowrap">
              Satışa Başla →
            </button>
          </Link>
        </div>
      </section>

    </main>
  );
}
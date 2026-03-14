import Link from 'next/link';
import ListingCard from '../../components/listing/ListingCard';

const MOCK_LISTINGS = [
  { id: 1, platform: 'INSTAGRAM', title: 'Musiqi Səhifəsi – 45.2K', description: 'Aktiv AZ auditoriya · Musiqi nişi', price: 350, priceType: 'fixed'      as const, engagementRate: '4.8%', country: 'AZ 🇦🇿', age: '2 il',   badge: 'featured' as const },
  { id: 2, platform: 'TIKTOK',    title: 'Komedi Kanal – 120K',      description: 'Gündəlik aktiv · TR/AZ',          price: 800, priceType: 'negotiable' as const, engagementRate: '7.2%', country: 'TR 🇹🇷', age: '1.5 il', badge: 'hot'      as const },
  { id: 3, platform: 'YOUTUBE',   title: 'Tech Kanal – 22K',         description: 'Monetizasiya aktiv · EN',          price: 1200,priceType: 'fixed'      as const, engagementRate: '3.1%', country: 'EN 🌍', age: '3 il',   badge: 'new'      as const },
  { id: 4, platform: 'TELEGRAM',  title: 'Xəbər Kanalı – 8.5K',      description: 'AZ xəbər · Gündəlik post',         price: 180, priceType: 'fixed'      as const, country: 'AZ 🇦🇿', age: '8 ay',  badge: 'new'      as const },
  { id: 5, platform: 'INSTAGRAM', title: 'Gözəllik – 31K',           description: 'Qadın auditoriya · Beauty nişi',   price: 420, priceType: 'negotiable' as const, engagementRate: '6.1%', country: 'AZ 🇦🇿', age: '1 il',   badge: 'featured' as const },
  { id: 6, platform: 'FACEBOOK',  title: 'Biznes Qrupu – 55K',       description: 'AZ üzv · Aktiv community',         price: 650, priceType: 'fixed'      as const, country: 'AZ 🇦🇿', age: '4 il',  badge: 'hot'      as const },
  { id: 7, platform: 'TIKTOK',    title: 'Lifestyle Kanal – 78K',    description: 'Yüksək görünüş · AZ/TR',           price: 550, priceType: 'negotiable' as const, engagementRate: '5.4%', country: 'AZ 🇦🇿', age: '2 il',   badge: 'new'      as const },
  { id: 8, platform: 'YOUTUBE',   title: 'Gaming Kanal – 41K',       description: 'Aktiv gənclik auditoriyası',        price: 900, priceType: 'fixed'      as const, engagementRate: '4.0%', country: 'TR 🇹🇷', age: '2.5 il', badge: 'hot'      as const },
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

const STATS = [
  { num: '1,247', label: 'Aktiv elan'  },
  { num: '99.2%', label: 'Uğurlu deal' },
  { num: '3,800+',label: 'İstifadəçi'  },
];

export default function HomePage() {
  return (
    <main>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10">
        <div className="container mx-auto">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold font-display mb-5"
            style={{ border: '1px solid var(--yellow-border)', color: 'var(--yellow)' }}
          >
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: 'var(--yellow)' }} />
            1,247 Aktiv Elan · Escrow Qorunması
          </div>

          {/* Heading */}
          <h1
            className="font-display font-extrabold text-[46px] md:text-[56px] leading-[1.05] tracking-[-2px] mb-4"
            style={{ color: 'var(--text)' }}
          >
            Hesabını <span style={{ color: 'var(--yellow)' }}>Sat.</span>
            <br />
            Hesab <span style={{ color: 'var(--yellow)' }}>Al.</span>
          </h1>

          <p className="text-[14px] leading-relaxed mb-8 max-w-[460px]" style={{ color: 'var(--text2)' }}>
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
                <p className="font-display font-extrabold text-[22px]" style={{ color: 'var(--yellow)' }}>
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
              <button
                key={c.key}
                className="flex-shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{
                  background: i === 0 ? 'var(--yellow-dim)' : 'var(--black2)',
                  border: `1px solid ${i === 0 ? 'var(--yellow-border)' : 'var(--border)'}`,
                  color: i === 0 ? 'var(--yellow)' : 'var(--text2)',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── LISTINGS ── */}
      <section className="px-6 mt-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-bold text-[15px]" style={{ color: 'var(--text)' }}>
              Son Elanlar
            </h2>
            <Link href="/listings" className="text-[12px] font-medium" style={{ color: 'var(--yellow)' }}>
              Hamısına bax →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MOCK_LISTINGS.map(l => (
              <ListingCard key={l.id} {...l} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 mt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '🛡️', title: 'Escrow Sistemi',  desc: 'Pul yalnız hesab təhvil verildikdən sonra satıcıya keçir. Tam qorunma.' },
            { icon: '💬', title: 'Birbaşa Çat',     desc: 'Alıcı-satıcı arasında şifrəli, sürətli mesajlaşma sistemi.' },
            { icon: '📊', title: 'Real Statistika', desc: 'İzləyici keyfiyyəti bot analizi ilə avtomatik yoxlanılır.' },
          ].map(f => (
            <div
              key={f.title}
              className="rounded-xl p-5"
              style={{ background: 'var(--black2)', border: '1px solid var(--border)' }}
            >
              <span className="text-[22px]">{f.icon}</span>
              <p className="font-display font-bold text-[13px] mt-3 mb-1" style={{ color: 'var(--yellow)' }}>
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
            <h2 className="font-display font-extrabold text-[22px] tracking-tight mb-1" style={{ color: 'var(--text)' }}>
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
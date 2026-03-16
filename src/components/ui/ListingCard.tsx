import Link from 'next/link';

const PLATFORM_STYLES: Record<string, { bg: string; label: string }> = {
  INSTAGRAM: { bg: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', label: 'Instagram' },
  TIKTOK:    { bg: 'linear-gradient(135deg,#111,#69c9d0)',             label: 'TikTok'    },
  YOUTUBE:   { bg: 'linear-gradient(135deg,#c00,#ff4444)',             label: 'YouTube'   },
  TELEGRAM:  { bg: 'linear-gradient(135deg,#2ca5e0,#1a6fa8)',          label: 'Telegram'  },
  FACEBOOK:  { bg: 'linear-gradient(135deg,#1877f2,#0d5bba)',          label: 'Facebook'  },
  TWITTER:   { bg: 'linear-gradient(135deg,#111,#1d9bf0)',             label: 'Twitter/X' },
};

const BADGE: Record<string, { label: string; color: string; bg: string }> = {
  featured: { label: '★ Featured', color: 'var(--yellow)', bg: 'rgba(245,197,24,.15)'  },
  hot:      { label: '🔥 Hot',     color: '#ef4444',       bg: 'rgba(239,68,68,.15)'   },
  new:      { label: '✦ Yeni',     color: '#22c55e',       bg: 'rgba(34,197,94,.15)'   },
};

interface ListingCardProps {
  id: number;
  platform: string;
  title: string;
  description: string;
  price: number;
  priceType?: 'fixed' | 'negotiable';
  engagementRate?: string;
  country?: string;
  age?: string;
  badge?: 'featured' | 'hot' | 'new';
}

export default function ListingCard({
  id, platform, title, description,
  price, priceType = 'fixed',
  engagementRate, country, age, badge,
}: ListingCardProps) {
  const p = PLATFORM_STYLES[platform.toUpperCase()] ?? PLATFORM_STYLES.INSTAGRAM;
  const b = badge ? BADGE[badge] : null;

  return (
    <Link href={`/listing/${id}`} className="listing-card block rounded-xl overflow-hidden">
      <style>{`
        .listing-card {
          background: var(--black2);
          border: 1px solid var(--border);
          transition: border-color .2s, transform .2s;
          text-decoration: none;
        }
        .listing-card:hover {
          border-color: var(--yellow-border);
          transform: translateY(-2px);
        }
      `}</style>

      {/* Banner */}
      <div
        className="h-[84px] flex items-center justify-center relative"
        style={{ background: p.bg }}
      >
        {b && (
          <span
            className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-md font-display"
            style={{ background: b.bg, color: b.color }}
          >
            {b.label}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--text3)' }}>
          {p.label}
        </p>
        <p className="text-[13px] font-bold font-display truncate mb-1" style={{ color: 'var(--text)' }}>
          {title}
        </p>
        <p className="text-[10px] mb-2" style={{ color: 'var(--text2)' }}>
          {description}
        </p>

        {/* Chips */}
        <div className="flex gap-1.5 flex-wrap mb-2">
          {engagementRate && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--black3)', border: '1px solid var(--border)', color: 'var(--text3)' }}
            >
              ER {engagementRate}
            </span>
          )}
          {country && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--black3)', border: '1px solid var(--border)', color: 'var(--text3)' }}
            >
              {country}
            </span>
          )}
          {age && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded"
              style={{ background: 'var(--black3)', border: '1px solid var(--border)', color: 'var(--text3)' }}
            >
              {age}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div>
            <span className="text-[14px] font-extrabold font-display" style={{ color: 'var(--text)' }}>
              {price} AZN
            </span>
            <span className="text-[9px] ml-1" style={{ color: 'var(--text3)' }}>
              {priceType === 'fixed' ? 'sabit' : 'müzakirə'}
            </span>
          </div>
          <span className="btn-primary text-[10px] py-[5px] px-3 rounded-[7px]">
            Bax
          </span>
        </div>
      </div>
    </Link>
  );
}
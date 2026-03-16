import Link from 'next/link';

const PLATFORMS = [
  {
    key:   'INSTAGRAM',
    title: 'Instagram',
    desc:  'Real izləyicili hesablar. Yüksək ER.',
    bg:    'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
    count: 142,
    price: '80 AZN',
  },
  {
    key:   'YOUTUBE',
    title: 'YouTube',
    desc:  'Monetizasiya açıq kanallar. RPM ilə.',
    bg:    'linear-gradient(135deg, #c00 0%, #ff4e4e 100%)',
    count: 89,
    price: '200 AZN',
  },
  {
    key:      'TIKTOK',
    title:    'TikTok',
    desc:     'Viral potensialı olan hesablar.',
    bg:       'linear-gradient(135deg, #010101 0%, #1a1a1a 100%)',
    count:    213,
    price:    '150 AZN',
    accent:   '#69c9d0',
    border:   'rgba(105,201,208,0.25)',
  },
  {
    key:   'TELEGRAM',
    title: 'Telegram',
    desc:  'Aktiv üzvlü kanallar və qruplar.',
    bg:    'linear-gradient(135deg, #2ca5e0 0%, #1a6fa8 100%)',
    count: 67,
    price: '50 AZN',
  },
  {
    key:   'FACEBOOK',
    title: 'Facebook',
    desc:  'Yüksək reach-li səhifə və qruplar.',
    bg:    'linear-gradient(135deg, #1877f2 0%, #0d5bba 100%)',
    count: 44,
    price: '100 AZN',
  },
  {
    key:    'TWITTER',
    title:  'Twitter / X',
    desc:   'Aktiv auditoriyalı X hesabları.',
    bg:     'linear-gradient(135deg, #14171a 0%, #1d9bf0 100%)',
    count:  31,
    price:  '80 AZN',
    accent: '#1d9bf0',
    border: 'rgba(29,155,240,0.25)',
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen">

      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">

        {/* Sarı glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-yellow-500/[0.07] blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-6 py-28 flex flex-col items-center text-center">

          {/* Live badge */}
          <div className="mb-10 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-yellow-500/25 bg-yellow-500/[0.06] text-[11px] font-bold uppercase tracking-widest text-yellow-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500" />
            </span>
            Escrow ile 100% Tehlukesiz &nbsp;·&nbsp; 500+ Aktiv Elan
          </div>

          {/* Başlıq */}
          <h1 className="font-display font-black text-[clamp(36px,5vw,56px)] leading-[1] tracking-[-2px] text-white mb-6">
            Sosial hesabı{' '}
            <em className="not-italic text-yellow-500">Al</em>
            <br />
            Sosial hesabı{' '}
            <em className="not-italic text-yellow-500">Sat</em>
          </h1>

          <p className="max-w-md text-slate-400 text-[15px] leading-relaxed mb-12">
            Instagram, TikTok, YouTube — güvənli alış-veriş
            üçün tək ünvan. Escrow sistemi ilə ödənişin qorunur.
          </p>

          {/* CTA düymələri */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/listings">
              <button className="btn-primary text-[15px] py-4 px-10">
                Hesab Al
              </button>
            </Link>
            <Link href="/sell">
              <button className="btn-ghost text-[15px] py-4 px-10">
                Hesab Sat
              </button>
            </Link>
          </div>

          {/* Statistika */}
          <div className="mt-20 grid grid-cols-3 gap-6 sm:gap-16 w-full max-w-sm sm:max-w-none">
            {[
              { num: '500+',  label: 'Aktiv Elan'  },
              { num: '99.2%', label: 'Ugurlu Deal' },
              { num: '3.8K+', label: 'Istifadeci'  },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display font-black text-[28px] sm:text-[32px] text-yellow-500 leading-none">
                  {s.num}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────── PLATFORMS ─────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="text-center mb-12">
          <p className="text-[11px] font-black uppercase tracking-[2px] text-yellow-500 mb-3">
            Platformalar
          </p>
          <h2 className="font-display font-black text-[clamp(24px,4vw,36px)] text-white tracking-tight">
            Hansı platformada hesab almaq istəyirsən?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLATFORMS.map(p => (
            <Link key={p.key} href={`/listings?platform=${p.key}`} className="group block">
              <div
                className="relative h-[220px] rounded-2xl overflow-hidden flex flex-col justify-end p-7 border transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-2xl"
                style={{
                  background:   p.bg,
                  borderColor:  p.border ?? 'rgba(0,0,0,0.2)',
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                {/* İçerik */}
                <div className="relative z-10">
                  <h3
                    className="font-display font-black text-[28px] tracking-tight leading-none mb-1"
                    style={{ color: p.accent ?? '#ffffff' }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-white/60 text-[12px] mb-4">{p.desc}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div>
                        <p className="font-bold text-white text-[15px] leading-none">{p.count}</p>
                        <p className="text-[9px] uppercase text-white/40 font-bold mt-0.5">Elan</p>
                      </div>
                      <div className="w-px bg-white/10" />
                      <div>
                        <p className="font-bold text-white text-[15px] leading-none">{p.price}</p>
                        <p className="text-[9px] uppercase text-white/40 font-bold mt-0.5">Min</p>
                      </div>
                    </div>

                    <span
                      className="text-[12px] font-bold px-4 py-2 rounded-xl backdrop-blur-sm border transition-all group-hover:scale-105"
                      style={{
                        background:  p.accent ? `rgba(${p.accent === '#69c9d0' ? '105,201,208' : '29,155,240'},.12)` : 'rgba(255,255,255,.12)',
                        color:       p.accent ?? '#ffffff',
                        borderColor: p.border ?? 'rgba(255,255,255,.2)',
                      }}
                    >
                      Bax →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─────────── ESCROW / FEATURES ─────────── */}
      <section className="border-t border-white/[0.06] bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 py-24">

          <div className="text-center mb-14">
            <p className="text-[11px] font-black uppercase tracking-[2px] text-yellow-500 mb-3">
              Niye biz?
            </p>
            <h2 className="font-display font-black text-[clamp(24px,4vw,36px)] text-white tracking-tight mb-3">
              100% Tehlukesiz Alis-Veris
            </h2>
            <p className="text-slate-500 text-[14px] max-w-sm mx-auto">
              Escrow sistemi ile odenisiniz tam qorunur
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🛡️', title: 'Escrow',        desc: 'Pul yalnız hesab təhvil verildikdə satıcıya keçir.'  },
              { icon: '💬', title: 'Canli Cat',      desc: 'Alıcı və satıcı üçün birbaşa şifrəli yazışma.'       },
              { icon: '📊', title: 'Analitika',      desc: 'İzləyici keyfiyyəti sistem tərəfindən yoxlanılır.'   },
              { icon: '⚡', title: 'Suretli Transfer',desc: 'Bütün proseslər avtomatlaşdırılıb, ani transfer.'   },
            ].map(f => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-yellow-500/25 hover:bg-yellow-500/[0.03] transition-all duration-300"
              >
                <span className="text-3xl block mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </span>
                <h3 className="font-display font-bold text-yellow-500 text-[14px] mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-[12px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-6 py-28 text-center">

          <h2 className="font-display font-black text-[clamp(28px,5vw,48px)] text-white tracking-tight leading-[1] mb-4">
            Hesabını satmağa{' '}
            <span className="text-yellow-500">hazırsan?</span>
          </h2>
          <p className="text-slate-400 text-[15px] mb-10">
            Minlərlə alıcı sənin təklifini gözləyir.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sell">
              <button className="btn-primary text-[15px] py-4 px-12">
                Satışa Başla →
              </button>
            </Link>
            <Link href="/listings">
              <button className="btn-ghost text-[15px] py-4 px-12">
                Elanlara Bax
              </button>
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
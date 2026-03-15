import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">

      <div className="text-center max-w-[400px]">

        <p
          className="font-display font-extrabold text-[80px] leading-none tracking-tight mb-4"
          style={{ color: 'var(--yellow)' }}
        >
          404
        </p>

        <h1
          className="font-display font-extrabold text-[22px] tracking-tight mb-2"
          style={{ color: 'var(--text)' }}
        >
          Səhifə tapılmadı
        </h1>

        <p className="text-[13px] mb-8 leading-relaxed" style={{ color: 'var(--text3)' }}>
          Axtardığınız səhifə mövcud deyil və ya silinib.
        </p>

        <div className="flex gap-3 justify-center">
          <Link href="/">
            <button className="btn-primary px-6 py-2.5 text-[13px]">
              Ana Səhifə
            </button>
          </Link>
          <Link href="/listings">
            <button className="btn-ghost px-6 py-2.5 text-[13px]">
              Elanlara Bax
            </button>
          </Link>
        </div>

      </div>

    </main>
  );
}
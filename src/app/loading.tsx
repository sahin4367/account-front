export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--yellow-border)', borderTopColor: 'var(--yellow)' }}
        />
        <p className="text-[12px] font-display font-bold" style={{ color: 'var(--text3)' }}>
          Yüklənir...
        </p>
      </div>
    </main>
  );
}
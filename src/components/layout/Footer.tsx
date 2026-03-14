export default function Footer() {
  return (
    <footer
      className="mt-20 py-10"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--black)' }}
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="font-display font-extrabold text-[15px]">
            <span style={{ color: 'var(--yellow)' }}>ACCOUNT</span>
            <span style={{ color: 'var(--text)' }}>market</span>
          </p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--text3)' }}>
            © {new Date().getFullYear()} Bütün hüquqlar qorunur
          </p>
        </div>
        <div className="flex gap-6 text-[12px]" style={{ color: 'var(--text3)' }}>
          <span className="cursor-pointer hover:text-yellow-400 transition-colors">Haqqımızda</span>
          <span className="cursor-pointer hover:text-yellow-400 transition-colors">Qaydalar</span>
          <span className="cursor-pointer hover:text-yellow-400 transition-colors">Dəstək</span>
        </div>
      </div>
    </footer>
  );
}
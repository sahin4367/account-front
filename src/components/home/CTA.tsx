import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-12 container mx-auto px-4">
      <div className="relative overflow-hidden bg-blue-600 rounded-[2.5rem] px-8 py-12 md:py-20 text-center text-white shadow-2xl shadow-blue-200">
        {/* Dekorativ dairələr (Arxa plan üçün) */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            Hesabını satmağa hazırsan?
          </h2>
          <p className="mb-10 text-blue-100 text-lg opacity-90 leading-relaxed">
            Minlərlə alıcı sənin təklifini gözləyir. İndi elan yerləşdir, 
            təhlükəsiz şəkildə hesabını sat və qazancını dərhal balansına al.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/listings/new">
              <button className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl hover:scale-105 flex items-center gap-2">
                <PlusCircle size={22} />
                Satışa Başla
              </button>
            </Link>
            
            <Link href="/how-it-works" className="text-white font-bold hover:underline flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              Sistem necə işləyir? <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
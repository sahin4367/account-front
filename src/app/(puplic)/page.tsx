import {
  Search,
  ShieldCheck,
  MessageSquare,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import Link from "next/link";

export default function HomePage() {
  const categories = [
    "Instagram",
    "TikTok",
    "YouTube",
    "Telegram",
    "Facebook",
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Təhlükəsiz{" "}
            <span className="text-blue-600">Hesab Alqı-Satqısı</span>
          </h1>

          <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
            Instagram, TikTok və digər platformalar üçün real izləyicili
            hesabları Escrow sistemi ilə tam təhlükəsiz al və sat.
          </p>

          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-2 p-2 bg-gray-100 rounded-2xl border">
            <div className="flex-1 flex items-center px-4 gap-2 bg-white rounded-xl">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Məs: 50k Instagram hesabı..."
                className="w-full py-3 outline-none bg-transparent"
              />
            </div>

            <select className="bg-white px-4 py-3 rounded-xl outline-none">
              <option>Bütün Kateqoriyalar</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">
              Axtar
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<ShieldCheck />}
            title="Escrow Sistemi"
            desc="Ödəniş yalnız hesabı təhvil aldıqdan sonra satıcıya köçürülür."
          />
          <Feature
            icon={<MessageSquare />}
            title="Birbaşa Çat"
            desc="Alıcı və satıcı arasında təhlükəsiz mesajlaşma."
          />
          <Feature
            icon={<TrendingUp />}
            title="Real Statistika"
            desc="Hesabların aktivliyi və izləyici kütləsi yoxlanılır."
          />
        </div>
      </section>

      {/* LATEST LISTINGS */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-bold">Son Elanlar</h3>
            <p className="text-gray-500">
              Sizin üçün seçdiyimiz ən yeni təkliflər
            </p>
          </div>

          <button className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            Hamısına bax <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition"
            >
              <div className="h-40 bg-gray-200" />
              <div className="p-4">
                <h4 className="font-bold truncate">
                  Musiqi Səhifəsi – 45K
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Aktiv AZ auditoriya
                </p>

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-bold text-blue-600">
                    350 AZN
                  </span>
                  <Link
                    href="/sell"
                    className="text-xs font-bold bg-gray-100 px-3 py-2 rounded-lg
                  hover:bg-blue-600 hover:text-white">
                  Ətraflı
                </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 mx-4 container rounded-3xl mb-20 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Hesabını satmağa hazırsan?
        </h2>
        <p className="mb-8 opacity-90 max-w-md mx-auto">
          Minlərlə alıcı sənin təklifini gözləyir.
        </p>
        <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100">
          Satışa Başla  
        </button>
      </section>
    </>
  );
}

/* Small helper component */
function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

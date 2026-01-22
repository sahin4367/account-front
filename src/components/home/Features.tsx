import { ShieldCheck, MessageSquare, TrendingUp, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: "Escrow Sistemi",
      desc: "Ödəniş yalnız hesabı təhvil aldıqdan sonra satıcıya köçürülür.",
      icon: <ShieldCheck className="text-green-600" size={24} />,
      bgColor: "bg-green-100"
    },
    {
      title: "Birbaşa Çat",
      desc: "Alıcı və satıcı arasında şifrələnmiş və təhlükəsiz mesajlaşma.",
      icon: <MessageSquare className="text-blue-600" size={24} />,
      bgColor: "bg-blue-100"
    },
    {
      title: "Real Statistika",
      desc: "Hesabların aktivliyi və izləyici kütləsi botlara qarşı yoxlanılır.",
      icon: <TrendingUp className="text-purple-600" size={24} />,
      bgColor: "bg-purple-100"
    },
    {
      title: "Sürətli Təhvil",
      desc: "Avtomatlaşdırılmış sistemlərlə hesabın məlumatlarını dərhal al.",
      icon: <Zap className="text-orange-600" size={24} />,
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-100 transition-all hover:shadow-md">
              <div className={`p-3 shrink-0 rounded-xl ${f.bgColor}`}>
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{f.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
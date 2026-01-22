import { Search } from 'lucide-react';

export default function Hero() {
  const categories = ["Instagram", "TikTok", "YouTube", "Telegram", "Facebook"];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
          Təhlükəsiz <span className="text-blue-600">Hesab Alqı-Satqısı</span>
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
          Instagram, TikTok və digər platformalar üçün real izləyicili hesabları 
          Escrow sistemi ilə tam təhlükəsiz şəkildə al və sat.
        </p>
        
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-2 p-2 bg-gray-100 rounded-2xl border">
          <div className="flex-1 flex items-center px-4 gap-2 bg-white rounded-xl">
            <Search className="text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Məs: 50k Instagram hesabı..." 
              className="w-full py-3 outline-none bg-transparent"
            />
          </div>
          <select className="bg-white px-4 py-3 rounded-xl outline-none border-l md:border-l-0 text-sm font-medium">
            <option>Bütün Kateqoriyalar</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Axtar
          </button>
        </div>
      </div>
    </section>
  );
}
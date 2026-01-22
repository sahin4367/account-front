// import Link from 'next/link';
// import { ArrowRight, Sparkles } from 'lucide-react';
// import ListingCard from '../listing/ListingCard';

// // Real layihədə bu data API-dan (lib/api.ts) gələcək
// const DUMMY_LISTINGS = [
//   {
//     id: "1",
//     category: "Instagram",
//     title: "Geyim Mağazası - 25K Aktiv",
//     price: 450,
//     followers: "25.4K",
//     isVerified: true
//   },
//   {
//     id: "2",
//     category: "YouTube",
//     title: "Gaming Kanalı (Monetizasiya Açıq)",
//     price: 1200,
//     followers: "12.1K",
//     isVerified: false
//   },
//   {
//     id: "3",
//     category: "TikTok",
//     title: "Musiqi/Edit Səhifəsi",
//     price: 180,
//     followers: "45K",
//     isVerified: true
//   },
//   {
//     id: "4",
//     category: "Telegram",
//     title: "Kripto Xəbər Kanalı",
//     price: 320,
//     followers: "8.5K",
//     isVerified: false
//   }
// ];

// export default function LatestListings() {
//   return (
//     <section className="py-16 container mx-auto px-4">
//       {/* Başlıq Hissəsi */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
//         <div>
//           <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
//             <Sparkles size={18} />
//             <span>Yeni Təkliflər</span>
//           </div>
//           <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">
//             Son Əlavə Edilən <span className="text-blue-600">Elanlar</span>
//           </h3>
//           <p className="text-gray-500 mt-2 max-w-md">
//             Sistemimizə yenicə əlavə olunmuş, yoxlanılmış və təhlükəsiz hesablar.
//           </p>
//         </div>

//         <Link 
//           href="/listings" 
//           className="group flex items-center gap-2 bg-white border-2 border-gray-100 px-6 py-3 rounded-2xl font-bold text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
//         >
//           Hamısına bax 
//           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//         </Link>
//       </div>

//       {/* Grid Sistemi */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {DUMMY_LISTINGS.map((listing) => (
//           <ListingCard 
//             key={listing.id}
//             id={listing.id}
//             category={listing.category}
//             title={listing.title}
//             price={listing.price}
//             description=""
//             // followers={listing.followers}
//             // isVerified={listing.isVerified}
//           />
//         ))}
//       </div>

//       {/* Mobil üçün "Hamısına bax" (Opsional) */}
//       <div className="mt-10 md:hidden">
//         <Link href="/listings">
//           <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold">
//             Bütün Elanları Gör
//           </button>
//         </Link>
//       </div>
//     </section>
//   );
// }
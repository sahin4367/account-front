import Link from 'next/link';
import { LayoutGrid, MessageSquare, ShieldCheck, User, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const menuItems = [
    { icon: <LayoutGrid size={20} />, label: 'Elanlarım', href: '/my-listings' },
    { icon: <MessageSquare size={20} />, label: 'Mesajlar', href: '/messages' },
    { icon: <ShieldCheck size={20} />, label: 'Escrow (Sövdələşmələr)', href: '/escrow' },
    { icon: <User size={20} />, label: 'Profil', href: '/profile' },
    { icon: <Settings size={20} />, label: 'Ayarlar', href: '/settings' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-2">
        <div className="bg-white p-6 rounded-2xl border mb-6 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-4">
            AA
          </div>
          <h3 className="font-bold text-gray-900">Ali Aliyev</h3>
          <p className="text-sm text-gray-500">ID: 45892</p>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition font-medium"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white border rounded-2xl p-6 shadow-sm min-h-[600px]">
        {children}
      </main>
    </div>
  );
}

// import Link from "next/link";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       {/* NAVBAR (SƏNİN NAVBAR) */}
//       <header className="border-b bg-white">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <Link href="/" className="font-extrabold text-xl">
//             ACCOUNT<span className="text-blue-600">market</span>
//           </Link>

//           <nav className="flex items-center gap-6 text-sm font-semibold">
//             <Link href="/browse">Browse</Link>
//             <Link href="/messages">Messages</Link>
//             <Link href="/dashboard/my-listings">Listings</Link>
//             <Link href="/offers">Offers</Link>
//             <Link href="/escrow">Escrow</Link>

//             <span className="text-gray-400">0.00 AZN</span>

//             <Link
//               href="/sell"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Sell
//             </Link>
//           </nav>
//         </div>
//       </header>

//       {/* CONTENT */}
//       <main className="min-h-screen bg-gray-50">
//         {children}
//       </main>

//       {/* FOOTER (istəsən ayrıca component edərik) */}
//       <footer className="bg-white border-t py-12 mt-20">
//         <div className="container mx-auto px-4 text-sm text-gray-500">
//           © {new Date().getFullYear()} ACCOUNTmarket. All rights reserved.
//         </div>
//       </footer>
//     </>
//   );
// }

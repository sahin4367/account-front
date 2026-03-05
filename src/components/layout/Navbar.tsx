'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  MessageSquare,
  LayoutGrid,
  Search,
} from 'lucide-react';

import UserDropdown from './UserDropdown';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        <Link href="/" className="text-2xl font-bold text-blue-600">
          <span className="underline">ACCOUNT</span>
          <span className="overline">market</span>
        </Link>

        {isAuthenticated && (
          <nav className="hidden lg:flex items-center space-x-6 font-medium text-gray-600">
            <Link href="/listings">Almaq</Link>

            <Link href="/escrow" className="flex items-center gap-1">
              <ShieldCheck size={18} /> Escrow
            </Link>

            <Link href="/my-listings" className="flex items-center gap-1">
              <LayoutGrid size={18} /> Elanlarım
            </Link>

            <Link
              href="/messages"
              className="flex items-center gap-1 relative"
            >
              <MessageSquare size={18} /> Mesajlar
              <span className="absolute -top-1 -right-2 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">

          {!isAuthenticated ? (
            <>
              <Link
                href="/listings"
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600"
                    >
                <Search size={18} />
                <span>Support</span>
              </Link>

              <Link
                href="/login"
                className="text-sm font-bold text-gray-600 hover:text-blue-600"
              >
                Log In
              </Link>

              <Link href="/register">
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">
                  Register
                </button>
              </Link>

              <Link href="/login">
                <button className="border border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50">
                  Sell
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] text-gray-400 font-bold">
                  Balans
                </span>
                {/* <span className="text-sm font-bold text-green-600">
                  125.50 AZN
                // </span> BURA DAHA DA FIX OLUNMALIDIR ESLINDE BELE SAXLANILA BILMEZ*/} 
              </div>

              <UserDropdown />

              <Link href="/sell">
                <button className="hidden sm:block bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700">
                  Elan Yerləşdir
                </button>
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

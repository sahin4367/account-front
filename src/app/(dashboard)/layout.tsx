import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8 flex gap-8">
      {/* SIDEBAR */}
      <aside className="w-64">
        <div className="bg-white border rounded-2xl p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full
                          flex items-center justify-center
                          text-blue-600 text-xl font-bold mx-auto mb-2">
            U
          </div>
          <p className="font-bold">My Dashboard</p>
        </div>

        <Link
          href="/dashboard/my-listings"
          className="flex items-center gap-3 px-4 py-3
                     rounded-xl font-medium
                     text-blue-600 bg-blue-50"
        >
          <LayoutGrid size={20} />
          Elanlarım
        </Link>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-white border rounded-2xl p-6 min-h-[600px]">
        {children}
      </main>
    </div>
  );
}

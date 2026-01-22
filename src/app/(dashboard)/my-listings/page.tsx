import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function ListingsPage() {
  return (
    <section className="container mx-auto px-4 py-12">
      {/* BREADCRUMB */}
      <p className="text-sm text-gray-400 mb-2">
        Home / Listings
      </p>

      <h1 className="text-3xl font-extrabold mb-6">
        Manage Listings
      </h1>

      <p className="text-gray-500 mb-10">
        You can create a new listing using buttons below
      </p>

      {/* ACTIONS */}
      <div className="flex gap-4 mb-12">
        <Link
          href="/my-listings/create"
          className="inline-flex items-center gap-2
                    bg-blue-600 text-white px-6 py-3
                    rounded-xl font-bold hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Add New Listing
        </Link>
      </div>

      {/* EMPTY STATE */}
      <div className="bg-white border rounded-2xl p-16 text-center">
        <h3 className="text-xl font-bold mb-2">
          No Listings Found
        </h3>
        <p className="text-gray-500 mb-6">
          You haven’t created any listings yet.
        </p>

        <Link
          href="/my-listings/create"
          className="text-blue-600 font-semibold hover:underline"
        >
          Create your first listing →
        </Link>
      </div>
    </section>
  );
}

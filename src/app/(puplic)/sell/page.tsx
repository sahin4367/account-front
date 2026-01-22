import Link from "next/link";
import { PlusCircle, ShieldCheck, MessageSquare } from "lucide-react";

export default function SellPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-4">
          Sell Social Media Accounts on{" "}
          <span className="text-blue-600">ACCOUNTmarket</span>
        </h1>

        <p className="text-gray-500 text-lg">
          ACCOUNTmarket təhlükəsiz escrow sistemi ilə sosial media
          hesablarını alıb-satmaq üçün etibarlı marketplace-dir.
        </p>

        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 mt-8
                     bg-blue-600 text-white px-8 py-4 rounded-2xl
                     font-bold text-lg hover:bg-blue-700"
        >
          <PlusCircle size={20} />
          Add New Listing (FREE)
        </Link>
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Feature
          icon={<ShieldCheck />}
          title="ACCOUNTmarket Escrow"
          desc="Ödəniş yalnız hesab alıcıya təhvil verildikdən sonra
                satıcıya köçürülür."
        />
        <Feature
          icon={<MessageSquare />}
          title="Offers & Messages"
          desc="Bütün təklifləri və mesajları tək paneldən idarə et."
        />
        <Feature
          icon={<ShieldCheck />}
          title="Chargeback Protection"
          desc="Ödəniş geri qaytarılması riskinə qarşı tam qoruma."
        />
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Category
          title="Sell TikTok Accounts"
          desc="Brendlər və agentliklər real auditoriyalı TikTok
                səhifələri axtarır."
        />
        <Category
          title="Sell YouTube Channels"
          desc="Media şirkətləri və creatorlar aktiv YouTube
                kanallarını ACCOUNTmarket üzərindən alır."
        />
      </div>
    </section>
  );
}

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
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center
                    g-blue-100 text-blue-600 rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}

function Category({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-gray-50 border rounded-2xl p-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-500 mb-6">{desc}</p>
      <Link
        href="/my-listings"
        className="font-semibold text-blue-600 hover:underline"
      >
        Start Selling →
      </Link>
    </div>
  );
}

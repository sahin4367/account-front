import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ListingCardProps {
  id: number;
  category: string;
  title: string;
  price: number;
  description: string;
}

export default function ListingCard({ id, category, title, price, description }: ListingCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition group">
      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 relative">
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
          {category}
        </span>
      </div>
      <div className="p-4">
        <h5 className="font-bold text-lg mb-1 truncate">{title}</h5>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-xl font-black text-blue-600">{price} AZN</span>
          <Link href={`/listing/${id}`}>
            <button className="text-xs font-bold bg-gray-100 px-3 py-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
              Ətraflı
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
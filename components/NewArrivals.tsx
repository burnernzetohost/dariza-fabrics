'use client';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface Product {
  name: string;
  price: number;
  sale: number | null;
  img: string;
}

const products: Product[] = [
  { name: 'Midnight Indigo Noir', price: 6999.99, sale: 5999.99, img: '/coats/coat3.jpeg' },
  { name: 'Pashmina Black Shawl', price: 7999.99, sale: null, img: '/shawl/shawl1.jpeg' },
  { name: 'Imperial Merlot', price: 7999.99, sale: null, img: '/coats/coat1.jpeg' },
  { name: 'Pashmina Red Shawl', price: 8999.99, sale: null, img: '/shawl/shawl2.jpeg' },
];

export default function NewArrivals() {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    setAddingId(product.name);
    addToCart({
      name: product.name,
      price: product.price,
      salePrice: product.sale || undefined,
      image: product.img,
    });

    // Reset loading state after a brief delay
    setTimeout(() => setAddingId(null), 500);
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4">
      <h2 className="text-center font-serif text-4xl mb-12 text-[#012d20]">Newest Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.name} className="group relative">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 uppercase tracking-wider z-10">
                {product.sale ? 'Sale' : 'New'}
              </span>
              <Link href="/coats/midnight-indigo-noir">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover hover:opacity-90 transition duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Quick Add Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#012d20] hover:text-white"
                title="Add to Cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center cursor-pointer">
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-800 hover:text-black">{product.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {product.sale && <span className="text-red-500 mr-2">₹{product.sale}</span>}
                <span className={product.sale ? 'line-through text-gray-300' : ''}>₹{product.price}</span>
              </p>
            </div>

            {addingId === product.name && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#012d20]/90 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                Added!
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
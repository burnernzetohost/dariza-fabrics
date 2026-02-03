'use client';
import { useCart } from '../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category: string;
}

export default function NewArrivals() {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const response = await fetch('/api/products/new-arrivals');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewArrivals();
  }, []);

  const handleAddToCart = (product: Product) => {
    setAddingId(product.id);
    addToCart({
      name: product.name,
      price: product.price,
      salePrice: product.sale_price || undefined,
      image: product.images[0],
    });

    // Reset loading state after a brief delay
    setTimeout(() => setAddingId(null), 500);
  };

  if (loading) {
    return (
      <section ref={ref} className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-center font-serif text-4xl mb-12 text-[#012d20]">Newest Arrivals</h2>
        <div className="text-center text-gray-500">Loading...</div>
      </section>
    );
  }

  return (
    <section ref={ref} className={`py-20 max-w-7xl mx-auto px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      <h2 className="text-center font-serif text-4xl mb-12 text-[#012d20]">Newest Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div key={product.id} className={`group relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`} style={{transitionDelay: isVisible ? `${index * 75}ms` : '0ms'}}>
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
              <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2 py-1 uppercase tracking-wider z-10">
                {product.sale_price ? 'Sale' : 'New'}
              </span>
              <Link href={`/${product.category}/${product.id}`}>
                <img
                  src={product.images[0]}
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
                {product.sale_price && <span className="text-red-500 mr-2">₹{product.sale_price}</span>}
                <span className={product.sale_price ? 'line-through text-gray-300' : ''}>₹{product.price}</span>
              </p>
            </div>

            {addingId === product.id && (
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

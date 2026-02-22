'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Category {
  name: string;
  img: string;
  link: string;
  dbCategory: string; // The category name in the database
}

const categories: Category[] = [
  { name: 'Coats', img: '/coats/coat1.jpeg', link: '/coats', dbCategory: 'coats' },
  { name: 'Shawl', img: '/shawl/shawl2.jpeg', link: '/shawls', dbCategory: 'shawls' },
  { name: 'Saree', img: '/saree/saree1.jpeg', link: '/saree', dbCategory: 'saree' },
];

export default function Collections() {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        const response = await fetch('/api/products/category-counts');
        const data = await response.json();
        setCategoryCounts(data);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryCounts();
  }, []);

  const getItemCount = (dbCategory: string) => {
    const count = categoryCounts[dbCategory] || 0;
    return count === 1 ? '1 Item' : `${count} Items`;
  };

  return (
    <section ref={ref} className="py-20 max-w-7xl mx-auto px-4">
      <h2 className={`text-center font-serif text-4xl mb-12 text-[#01321F] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>Shop by Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, index) => (
          <Link key={cat.name} href={cat.link} className="group cursor-pointer block">
            <div className={`relative h-[500px] overflow-hidden bg-gray-100 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`} style={{transitionDelay: isVisible ? `${index * 150}ms` : '0ms'}}>
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="font-bold text-sm uppercase tracking-wide text-[#01321F]">{cat.name}</h3>
              <p className="text-gray-500 text-xs mt-1">
                {loading ? 'Loading...' : getItemCount(cat.dbCategory)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  images: any[];
  category: string;
}

export default function SearchModal() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);
    const delayTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(delayTimer);
  }, [query]);

  // Focus input when hovered
  useEffect(() => {
    if (isHovered) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isHovered]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsHovered(false);
        if (!query) {
          setShowResults(false);
        }
      }
    };

    if (isHovered) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isHovered, query]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center h-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!query) {
          setIsHovered(false);
          setShowResults(false);
        }
      }}
    >
      {/* Search Input - Slides in from right on hover */}
      <div
        className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${isHovered ? 'w-64 mr-4' : 'w-0'
          }`}
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-0 py-1 text-sm border-0 border-b border-gray-300 focus:outline-none focus:border-[#012d20] bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Icon Button */}
      <button
        className="text-gray-500 hover:text-black transition-colors cursor-pointer flex-shrink-0"
        title="Search products"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Results Dropdown - Below the header */}
      {isHovered && showResults && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-w-sm">
          {loading && (
            <div className="text-center py-4">
              <div className="inline-block h-4 w-4 border-2 border-gray-300 border-t-[#012d20] rounded-full animate-spin" />
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="text-center py-4 px-4">
              <p className="text-xs text-gray-500">No products found</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto p-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.category}/${product.id}`}
                  onClick={() => {
                    setQuery('');
                    setShowResults(false);
                  }}
                  className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="relative w-12 h-16 flex-shrink-0 overflow-hidden bg-gray-100 rounded">
                    <img
                      src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                      alt={typeof product.images[0] === 'string' ? product.name : (product.images[0]?.alt || product.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.sale_price && (
                      <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] px-1 py-0.5 rounded">
                        Sale
                      </span>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-[#012d20]">
                      {product.name}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      {product.sale_price ? (
                        <>
                          <span className="text-red-600 font-medium">₹{product.sale_price}</span>
                          {' '}
                          <span className="line-through text-gray-400">₹{product.price}</span>
                        </>
                      ) : (
                        `₹${product.price}`
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

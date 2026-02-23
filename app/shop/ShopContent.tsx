'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    price: number;
    slug?: string;
    images: any[];
    category: string;
}

export default function ShopContent({ products }: { products: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = new Set<string>();
        products.forEach(p => {
            if (p.category) {
                cats.add(p.category.trim());
            }
        });
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!selectedCategory) return products;
        return products.filter(p => p.category?.trim().toLowerCase() === selectedCategory.toLowerCase());
    }, [products, selectedCategory]);

    return (
        <section className="max-w-7xl mx-auto px-4 pt-4 pb-16">
            {/* Category Filter - Horizontally Scrollable */}
            {categories.length > 0 && (
                <div className="mb-4">
                    <div className="flex overflow-x-auto pb-2 gap-1 hide-scrollbar snap-x items-center justify-start">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`snap-start whitespace-nowrap px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors duration-300 rounded ${selectedCategory === null
                                ? 'bg-black text-white border-black'
                                : 'bg-transparent text-gray-700 border-gray-300 hover:border-black'
                                }`}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`snap-start whitespace-nowrap px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors duration-300 rounded ${selectedCategory === category
                                    ? 'bg-black text-white border-black'
                                    : 'bg-transparent text-gray-700 border-gray-300 hover:border-black'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No products found for this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/${product.category.toLowerCase().trim()}/${product.slug || product.id}`}
                            className="group cursor-pointer block"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                <Image
                                    src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url}
                                    alt={typeof product.images[0] === 'string' ? product.name : (product.images[0]?.alt || product.name)}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-xs uppercase tracking-widest px-6 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90%] text-center">
                                    Add to Cart
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-sm font-bold uppercase tracking-wide text-[#01321F]">
                                    {product.name}
                                </h3>
                                <p className="text-gray-500 text-sm mt-1">₹{Number(product.price).toLocaleString('en-IN')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                }
            `}</style>
        </section>
    );
}

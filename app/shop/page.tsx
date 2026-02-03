'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Page Header */}
                <div className="bg-[#012d20] py-16 text-center px-4">
                    <h1 className="font-lush text-5xl md:text-7xl mb-4 text-[#DCf9f1] capitalize">
                        The Collection
                    </h1>
                    <p className="font-script text-2xl text-[#DCf9f1]/80 mb-8">
                        Explore our exclusive range.
                    </p>

                    {/* Breadcrumb / Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs uppercase tracking-widest text-[#DCf9f1]/60 hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>

                {/* Product Grid */}
                <section className="max-w-7xl mx-auto px-4 py-20">
                    {loading ? (
                        <div className="text-center text-gray-500">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/${product.category}/${product.id}`}
                                    className="group cursor-pointer block"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#012d20] text-white text-xs uppercase tracking-widest px-6 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90%] text-center">
                                            Add to Cart
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">₹{product.price.toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </main>
    );
}

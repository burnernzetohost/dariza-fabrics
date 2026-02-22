import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import pool from '@/lib/db'; // Connect to DB

export const revalidate = 3600; // 1 hour static cache for global shop

export const metadata = {
    title: 'Shop All | Darzia Fabrics',
    description: 'Explore our exclusive range of timeless Kashmiri Elegance, premium sarees, and warm coats.',
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com'}/shop`
    },
    openGraph: {
        title: 'Shop All | Darzia Fabrics',
        description: 'Explore our exclusive range of timeless Kashmiri Elegance, premium sarees, and warm coats.',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com'}/shop`
    }
};

interface Product {
    id: string;
    name: string;
    price: number;
    images: any[];
    category: string;
}

export default async function ShopPage() {
    // Fetch products securely server-side
    const { rows: products } = await pool.query(`SELECT * FROM products ORDER BY created_at DESC`);

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Page Header */}
                <div className="bg-[#000000] py-16 text-center px-4">
                    <h1 className="font-lush text-5xl md:text-7xl mb-4 text-[#ffffff] capitalize">
                        The Collection
                    </h1>
                    <p className="font-script text-2xl text-[#ffffff]/80 mb-8">
                        Explore our exclusive range.
                    </p>

                    {/* Breadcrumb / Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-xs uppercase tracking-widest text-[#ffffff]/60 hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>

                {/* Product Grid */}
                <section className="max-w-7xl mx-auto px-4 py-20">
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">No products found in this collection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
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
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#000000] text-white text-xs uppercase tracking-widest px-6 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-[90%] text-center">
                                            Add to Cart
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">₹{Number(product.price).toLocaleString('en-IN')}</p>
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

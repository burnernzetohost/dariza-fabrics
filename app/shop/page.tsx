import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import pool from '@/lib/db'; // Connect to DB
import ShopContent from './ShopContent';

export const dynamic = 'force-dynamic';

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

    // Serialize products for the Client Component to avoid Date object warnings
    const serializedProducts = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: p.images,
        category: p.category,
        slug: p.slug
    }));

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Page Header */}
                <div className="bg-[#000000] pt-16 pb-8 text-center px-4">
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

                {/* Product Grid & Categories */}
                <ShopContent products={serializedProducts} />
            </div>

            <Footer />
        </main>
    );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import pool from '@/lib/db'; // Connect to DB

export const dynamic = 'force-dynamic';

// --- Your Helper Functions (Kept Exactly the Same) ---
const getCategoryTitle = (cat: string) => {
    if (!cat) return 'Collection';
    const c = cat.toLowerCase();
    if (c === 'coats') return 'The Coat Collection';
    if (c === 'shawls') return 'Pashmina Shawl Collection';
    if (c === 'saree') return 'Pashmina Saree Collection';
    return `${cat.charAt(0).toUpperCase() + cat.slice(1)} Collection`;
};

const getCategorySubtitle = (cat: string) => {
    const c = cat.toLowerCase();
    if (c === 'coats') return 'Warmth, wrapped in elegance.';
    if (c === 'shawls') return 'Timeless Kashmiri Elegance';
    if (c === 'saree') return 'Silk Elegance';
    return 'Explore our exclusive range.';
};

// --- The New Server Component ---
export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
    // 1. Get the Category from URL
    const params = await props.params;
    const category = params.category;

    // List of valid categories
    const validCategories = ['coats', 'shawls', 'saree'];

    // Check if category is valid
    if (!validCategories.includes(category.toLowerCase())) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page not found</p>
                        <Link
                            href="/"
                            className="inline-block bg-[#012d20] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#001a12] transition duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    // 2. Fetch Real Data from Database
    const { rows: categoryProducts } = await pool.query(
        `SELECT * FROM products WHERE category = $1`,
        [category]
    );

    // 3. Render Your Exact Design
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Page Header (Your Custom Design) */}
                <div className="bg-[#012d20] py-16 text-center px-4">
                    <h1 className="font-lush text-5xl md:text-7xl mb-4 text-[#DCf9f1] capitalize">
                        {getCategoryTitle(category)}
                    </h1>
                    <p className="font-script text-2xl text-[#DCf9f1]/80 mb-8">
                        {getCategorySubtitle(category)}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center text-xs uppercase tracking-widest text-[#DCf9f1]/60 hover:text-white transition"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                </div>

                {/* Product Grid */}
                <section className="max-w-7xl mx-auto px-4 py-20">
                    {categoryProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-xl text-gray-500">No products found in this collection.</p>
                            <Link href="/" className="mt-4 inline-block border-b border-black text-black">Return Home</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {categoryProducts.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/${category}/${product.id}`}
                                    className="group cursor-pointer block"
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                        {/* Handle array of images from DB */}
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
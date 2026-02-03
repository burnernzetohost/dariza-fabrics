import pool from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProductClient from '@/components/ProductClient';

export const dynamic = 'force-dynamic';

// Helper to sanitize data (prevents "Date Object" crashes)
const sanitizeProduct = (row: any) => {
    if (!row) return null;
    return {
        ...row,
        price: Number(row.price),
        // Ensure dates are strings or null
        createdAt: row.createdAt ? row.createdAt.toString() : null,
        updatedAt: row.updatedAt ? row.updatedAt.toString() : null,
    };
};

export default async function ProductPage(props: { params: Promise<{ category: string; id: string }> }) {
    const params = await props.params;
    const { category, id } = params;

    // 1. FETCH FROM DATABASE
    const { rows } = await pool.query(
        `SELECT * FROM products 
     WHERE LOWER(id) = LOWER($1) 
     AND LOWER(category) = LOWER($2)`,
        [id, category]
    );

    // 2. SANITIZE DATA
    const product = sanitizeProduct(rows[0]);

    // 3. HANDLE NOT FOUND
    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Navbar />
                <h1 className="text-2xl font-serif mt-20">Product not found</h1>
                <p className="text-gray-500">We couldn't find ID: {id}</p>
                <a href={`/${category}`} className="mt-6 underline">Return to {category}</a>
            </div>
        );
    }

    // 4. RENDER THE DESIGN COMPONENT
    return <ProductClient product={product} />;
}
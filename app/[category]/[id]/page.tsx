import pool from '@/lib/db';
import Navbar from '@/components/Navbar';
import ProductClient from '@/components/ProductClient';

import { Metadata } from 'next';

export const revalidate = 60; // Regenerate pages selectively for caching
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

export async function generateMetadata(props: { params: Promise<{ category: string; id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const { id } = params;
    const category = decodeURIComponent(params.category).toLowerCase().trim();

    const { rows } = await pool.query(
        `SELECT * FROM products WHERE (LOWER(id) = LOWER($1) OR LOWER(slug) = LOWER($1)) AND LOWER(category) = LOWER($2)`,
        [id, category]
    );
    const product = sanitizeProduct(rows[0]);

    if (!product) return {};

    // Fallbacks if no explicit metadata provided
    const title = product.meta_title || `${product.name} | Darzia Fabrics`;
    const description = product.meta_description || product.description?.substring(0, 160).replace(/<[^>]+>/g, '') || `Shop the ${product.name} at Darzia Fabrics`;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com'}/${category}/${product.slug || product.id}`;

    const imageUrl = product.images && product.images.length > 0
        ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)
        : '';

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'Darzia Fabrics',
            images: imageUrl ? [{ url: imageUrl, width: 800, height: 600 }] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}

export default async function ProductPage(props: { params: Promise<{ category: string; id: string }> }) {
    const params = await props.params;
    const { id } = params;

    // Decode the category from URL (handles spaces and special characters)
    const category = decodeURIComponent(params.category).toLowerCase().trim();

    // 1. FETCH FROM DATABASE
    const { rows } = await pool.query(
        `SELECT * FROM products 
         WHERE (LOWER(id) = LOWER($1) OR LOWER(slug) = LOWER($1))
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

    // 4. GENERATE STRUCTURED DATA (JSON-LD)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
        description: product.description?.replace(/<[^>]+>/g, '') || '',
        sku: product.id,
        offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com'}/${category}/${product.slug || product.id}`,
            priceCurrency: 'INR',
            price: product.sale_price ? product.sale_price : product.price,
            availability: 'https://schema.org/InStock',
        }
    };

    // 5. RENDER THE DESIGN COMPONENT
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductClient product={product} />
        </>
    );
}
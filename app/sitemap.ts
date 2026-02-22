import { MetadataRoute } from 'next';
import pool from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com';

    // Base static routes
    const routes = [
        '',
        '/about',
        '/shop',
        '/contact',
        '/shipping-policy',
        '/cancellation-exchange'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    try {
        const { rows: products } = await pool.query('SELECT id, slug, category, created_at FROM products');

        const productRoutes = products.map((product) => ({
            url: `${baseUrl}/${encodeURIComponent(product.category)}/${encodeURIComponent(product.slug || product.id)}`,
            lastModified: product.created_at ? new Date(product.created_at) : new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }));

        const { rows: categories } = await pool.query('SELECT DISTINCT category FROM products');
        const categoryRoutes = categories.map((cat) => ({
            url: `${baseUrl}/${encodeURIComponent(cat.category)}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));

        return [...routes, ...categoryRoutes, ...productRoutes];
    } catch (e) {
        console.error('Sitemap DB error:', e);
        return routes;
    }
}

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
    try {
        // Get distinct categories from products table - only categories with products
        const result = await pool.query(
            `SELECT DISTINCT LOWER(category) as category 
             FROM products 
             WHERE category IS NOT NULL AND category != ''
             ORDER BY category ASC`
        );

        const categories = result.rows.map(row => row.category);

        // Return only categories that actually have products
        return NextResponse.json({ categories: categories.length > 0 ? categories : [] });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { categories: [] },
            { status: 200 }
        );
    }
}

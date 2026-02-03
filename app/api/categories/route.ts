import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
    try {
        // Get distinct categories from products table
        const result = await pool.query(
            `SELECT DISTINCT LOWER(category) as category 
             FROM products 
             WHERE category IS NOT NULL AND category != ''
             ORDER BY category ASC`
        );

        const categories = result.rows.map(row => row.category);
        
        // Always include default categories
        const defaultCategories = ['coats', 'shawls', 'sarees'];
        const allCategories = Array.from(new Set([...defaultCategories, ...categories]));

        return NextResponse.json({ categories: allCategories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { categories: ['coats', 'shawls', 'sarees'] },
            { status: 200 }
        );
    }
}

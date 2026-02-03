import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
    try {
        const result = await pool.query(`
            SELECT 
                category,
                COUNT(*) as count
            FROM products
            GROUP BY category
            ORDER BY category
        `);

        // Convert to object for easier lookup
        const counts: Record<string, number> = {};
        result.rows.forEach(row => {
            counts[row.category] = parseInt(row.count);
        });

        return NextResponse.json(counts);
    } catch (error) {
        console.error('Error fetching category counts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category counts' },
            { status: 500 }
        );
    }
}

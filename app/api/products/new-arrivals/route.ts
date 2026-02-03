import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE new_arrival = TRUE ORDER BY created_at DESC LIMIT 4'
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch new arrivals' },
            { status: 500 }
        );
    }
}

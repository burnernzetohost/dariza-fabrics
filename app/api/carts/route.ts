import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

// Ensure the user_carts table exists
async function ensureTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS user_carts (
            id SERIAL PRIMARY KEY,
            user_email TEXT NOT NULL UNIQUE,
            user_name TEXT,
            items JSONB NOT NULL DEFAULT '[]',
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `);
}

// POST: Upsert cart for a logged-in user
export async function POST(request: NextRequest) {
    try {
        const { user_email, user_name, items } = await request.json();

        if (!user_email) {
            return NextResponse.json({ error: 'user_email is required' }, { status: 400 });
        }

        await ensureTable();

        await pool.query(
            `INSERT INTO user_carts (user_email, user_name, items, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (user_email)
             DO UPDATE SET items = $3, user_name = $2, updated_at = NOW()`,
            [user_email, user_name || null, JSON.stringify(items)]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving cart:', error);
        return NextResponse.json({ error: 'Failed to save cart' }, { status: 500 });
    }
}

// GET: Return all carts with their status (for admin)
export async function GET() {
    try {
        await ensureTable();

        // Get all carts and join with orders to determine if cart was converted
        const result = await pool.query(`
            SELECT 
                uc.id,
                uc.user_email,
                uc.user_name,
                uc.items,
                uc.updated_at,
                uc.created_at,
                CASE 
                    WHEN o.customer_email IS NOT NULL THEN 'bought'
                    WHEN jsonb_array_length(uc.items) = 0 THEN 'empty'
                    ELSE 'abandoned'
                END AS cart_status,
                o.id AS order_id,
                o.total_amount AS order_total,
                o.created_at AS order_date
            FROM user_carts uc
            LEFT JOIN LATERAL (
                SELECT customer_email, id, total_amount, created_at
                FROM orders
                WHERE customer_email = uc.user_email
                ORDER BY created_at DESC
                LIMIT 1
            ) o ON true
            ORDER BY uc.updated_at DESC
        `);

        const rows = result.rows.map(row => ({
            ...row,
            items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
        }));

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching carts:', error);
        return NextResponse.json({ error: 'Failed to fetch carts' }, { status: 500 });
    }
}

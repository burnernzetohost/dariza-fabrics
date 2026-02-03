import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
    try {
        // Get all orders (newest first)
        const result = await pool.query(
            `SELECT * FROM orders ORDER BY created_at DESC`
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            user_id,
            customer_name,
            customer_email,
            customer_phone,
            customer_address,
            shipping_address,
            items,
            total_amount,
            special_notes
        } = body;

        // Validate required fields
        if (!customer_name || !customer_email || !customer_phone || !customer_address || !shipping_address || !items || !total_amount) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Insert order into database
        const result = await pool.query(
            `INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, customer_address, shipping_address, items, total_amount, payment_status, order_status, special_notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING id, user_id, customer_name, customer_email, customer_phone, customer_address, shipping_address, items, total_amount, payment_status, order_status, special_notes, created_at, updated_at`,
            [
                user_id || null,
                customer_name,
                customer_email,
                customer_phone,
                customer_address,
                shipping_address,
                JSON.stringify(items),
                total_amount,
                'Paid',
                'Confirmed',
                special_notes || null
            ]
        );

        if (!result.rows || result.rows.length === 0) {
            console.error('No rows returned from INSERT query');
            return NextResponse.json(
                { message: 'Failed to create order - no data returned' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: 'Order created successfully',
                order: result.rows[0]
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { message: 'Failed to create order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

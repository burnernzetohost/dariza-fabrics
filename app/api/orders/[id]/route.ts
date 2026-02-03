import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Parse items JSON
        const order = result.rows[0];
        if (typeof order.items === 'string') {
            order.items = JSON.parse(order.items);
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch order' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session?.user || !session.user.admin) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { order_status, special_notes } = body;

        // Validate order status
        const validStatuses = ['Confirmed', 'Shipped', 'Delivered'];
        if (order_status && !validStatuses.includes(order_status)) {
            return NextResponse.json(
                { message: 'Invalid order status' },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `UPDATE orders 
             SET order_status = COALESCE($1, order_status),
                 special_notes = COALESCE($2, special_notes),
                 updated_at = NOW()
             WHERE id = $3
             RETURNING *`,
            [order_status || null, special_notes || null, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: 'Order not found' },
                { status: 404 }
            );
        }

        // Parse items JSON
        const order = result.rows[0];
        if (typeof order.items === 'string') {
            order.items = JSON.parse(order.items);
        }

        return NextResponse.json(
            {
                message: 'Order updated successfully',
                order
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { message: 'Failed to update order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

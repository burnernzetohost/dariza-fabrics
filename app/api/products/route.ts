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
        const result = await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        if (!session?.user || !session.user.admin) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        // Validate required fields
        const { id, name, category, description, price, sale_price, images, sizes, new_arrival, created_at } = body;

        if (!name || !category || !description || !price) {
            return NextResponse.json(
                { message: 'Missing required fields: name, category, description, price' },
                { status: 400 }
            );
        }

        // Insert product into database
        const result = await pool.query(
            `INSERT INTO products (id, name, category, description, price, sale_price, images, sizes, new_arrival, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                id,
                name,
                category,
                description,
                price,
                sale_price || null,
                images || [],
                sizes || [],
                new_arrival || false,
                created_at || new Date().toISOString()
            ]
        );

        return NextResponse.json(
            { 
                message: 'Product added successfully',
                product: result.rows[0]
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json(
            { message: 'Failed to add product', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

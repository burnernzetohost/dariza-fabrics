import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        console.log('Session:', session);
        
        if (!session?.user || !session.user.admin) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;
        console.log('Product ID to update:', id);
        
        const body = await request.json();
        console.log('Update body:', body);

        const {
            name,
            category,
            description,
            price,
            sale_price,
            images,
            sizes,
            new_arrival
        } = body;

        // Validate required fields
        if (!name || !category || !description || price === undefined) {
            console.log('Missing required fields:', { name, category, description, price });
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Update product in database
        const query = `UPDATE products 
             SET name = $1, 
                 category = $2, 
                 description = $3, 
                 price = $4, 
                 sale_price = $5, 
                 images = $6, 
                 sizes = $7, 
                 new_arrival = $8
             WHERE id = $9
             RETURNING *`;

        console.log('Executing query with values:', [
            name, category, description, price, sale_price, images, sizes, new_arrival, id
        ]);

        const result = await pool.query(query, [
            name,
            category,
            description,
            price,
            sale_price || null,
            images || [],
            sizes || [],
            new_arrival || false,
            id
        ]);

        console.log('Query result rows:', result.rowCount);

        if (result.rowCount === 0) {
            console.log('Product not found with ID:', id);
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        console.log('Product updated successfully');

        return NextResponse.json(
            {
                message: 'Product updated successfully',
                product: result.rows[0]
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating product:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Full error:', errorMessage);
        
        return NextResponse.json(
            {
                message: 'Failed to update product',
                error: errorMessage,
                details: error instanceof Error ? error.stack : 'No stack trace'
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Check admin authentication
        const session = await getServerSession(authOptions);
        console.log('DELETE Session:', session);
        
        if (!session?.user || !session.user.admin) {
            return NextResponse.json(
                { message: 'Unauthorized. Admin access required.' },
                { status: 401 }
            );
        }

        const { id } = await params;
        console.log('Product ID to delete:', id);

        // Delete product from database
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            console.log('Product not found with ID:', id);
            return NextResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            );
        }

        console.log('Product deleted successfully');

        return NextResponse.json(
            {
                message: 'Product deleted successfully',
                product: result.rows[0]
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting product:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Full error:', errorMessage);
        
        return NextResponse.json(
            {
                message: 'Failed to delete product',
                error: errorMessage
            },
            { status: 500 }
        );
    }
}

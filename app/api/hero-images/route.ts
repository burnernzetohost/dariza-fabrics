import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all hero images
export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM hero_images ORDER BY display_order ASC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching hero images:', error);
        return NextResponse.json(
            { message: 'Failed to fetch hero images' },
            { status: 500 }
        );
    }
}

// POST new hero image
export async function POST(request: NextRequest) {
    try {
        const { image_url } = await request.json();

        if (!image_url) {
            return NextResponse.json(
                { message: 'Image URL is required' },
                { status: 400 }
            );
        }

        // Get the highest display_order and add 1
        const maxOrderResult = await pool.query(
            'SELECT COALESCE(MAX(display_order), 0) as max_order FROM hero_images'
        );
        const nextOrder = maxOrderResult.rows[0].max_order + 1;

        const result = await pool.query(
            'INSERT INTO hero_images (image_url, display_order) VALUES ($1, $2) RETURNING *',
            [image_url, nextOrder]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error adding hero image:', error);
        return NextResponse.json(
            { message: 'Failed to add hero image' },
            { status: 500 }
        );
    }
}

// DELETE hero image
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Image ID is required' },
                { status: 400 }
            );
        }

        await pool.query('DELETE FROM hero_images WHERE id = $1', [id]);

        return NextResponse.json({ message: 'Hero image deleted successfully' });
    } catch (error) {
        console.error('Error deleting hero image:', error);
        return NextResponse.json(
            { message: 'Failed to delete hero image' },
            { status: 500 }
        );
    }
}

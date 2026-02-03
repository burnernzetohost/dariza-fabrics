import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    const { rows: products } = await pool.query(
      `SELECT id, name, price, sale_price, images, category 
       FROM products 
       WHERE LOWER(name) LIKE $1 OR LOWER(description) LIKE $1
       LIMIT 20`,
      [searchTerm]
    );

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

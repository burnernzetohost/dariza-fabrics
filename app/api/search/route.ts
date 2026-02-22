import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const rawQuery = query.toLowerCase().trim();

    // Split search query by space to find multiple keywords
    const keywords = rawQuery.split(/\s+/).slice(0, 5); // Max 5 keywords to prevent overload

    // For very short queries (1-2 letters), we want to try to match the exact start of the name first for better relevance
    const isShortQuery = rawQuery.length <= 2;

    let queryStr = '';
    let values = [];

    if (isShortQuery) {
      // If it's 1 or 2 letters, prioritize items where ANY word in the name STARTS with these letters
      // We check for the explicit start of the string OR the start of a word following a space
      queryStr = `
       SELECT id, name, price, sale_price, images, category 
       FROM products 
       WHERE LOWER(name) LIKE $1 OR LOWER(name) LIKE $2
       ORDER BY name ASC
       LIMIT 20
      `;
      values = [`${rawQuery}%`, `% ${rawQuery}%`];
    } else {
      // Normal multi-word search
      // We only search the 'name' field because descriptions aren't visible in the UI dropdown
      // which causes confusion when words like 'versatile' trigger invisible matches.
      const conditions = keywords.map((_, i) => `(
        LOWER(name) LIKE $${i + 1} OR LOWER(name) LIKE $${i + 2}
      )`);

      // We create two parameters: one for string start ("ver%"), one for word boundary space ("% ver%")
      values = keywords.flatMap(word => [`${word}%`, `% ${word}%`]);

      // Adjust parameter bindings because each word now generates 2 parameters
      const mappedConditions = keywords.map((_, i) => `(
        LOWER(name) LIKE $${(i * 2) + 1} OR LOWER(name) LIKE $${(i * 2) + 2}
      )`);

      queryStr = `
       SELECT id, name, price, sale_price, images, category 
       FROM products 
       WHERE ${mappedConditions.join(' AND ')}
       LIMIT 20
      `;
    }

    const { rows: products } = await pool.query(queryStr, values);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

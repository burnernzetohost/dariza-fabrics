const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

// 1. Connect directly
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('🌱 Starting Seed...');

    try {
        // 2. Drop and Create the Table
        // Note: We use TEXT[] for arrays in Postgres
        await pool.query('DROP TABLE IF EXISTS products CASCADE');
        console.log('Dropped existing products table');

        await pool.query(`
      CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        sale_price INTEGER,
        images TEXT[],
        sizes TEXT[],
        details TEXT[],
        new_arrival BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Created products table');

        // 3. Clear old data (not needed since we dropped the table)
        // await pool.query('DELETE FROM products');

        // 4. Define Data - CORRECT PRICES FROM USER
        const products = [
            // COATS - ALL HEIRLOOM COATS ARE 3800
            ['midnight-indigo-noir', 'Midnight Indigo Noir', 'coats', 'A timeless classic, the Midnight Indigo Noir coat is crafted from premium wool blend, offering both warmth and sophistication. Perfect for evening wear.', 3800, null, ['/coats/coat3.jpeg'], ['S', 'M', 'L', 'XL'], ['Wool Blend', 'Satin Lining', 'Dry Clean Only'], true],
            ['imperial-merlot', 'Imperial Merlot', 'coats', 'Rich and elegant, the Imperial Merlot coat adds a pop of color to your winter wardrobe. Tailored fit for a sharp silhouette.', 3800, null, ['/coats/coat1.jpeg'], ['S', 'M', 'L'], ['Premium Cotton Blend', 'Button Closure', 'Machine Washable'], true],
            ['imperial-garnet-rouge', 'Imperial Garnet Rouge', 'coats', 'Experience luxury with the Imperial Garnet Rouge. Designed for the modern individual who values style and comfort.', 3800, null, ['/coats/coat2.jpeg'], ['M', 'L', 'XL'], ['100% Wool', 'Hand Stitched', 'Dry Clean Only'], false],
            ['verdant-imperial-moss', 'Verdant Imperial Moss', 'coats', 'Connect with nature in the Verdant Imperial Moss coat. Its unique hue and texture make it a standout piece.', 3800, null, ['/coats/coat4.jpeg'], ['S', 'M', 'L'], ['Textured Fabric', 'Wide Lapels', 'Dry Clean Recommended'], false],

            // SHAWLS
            ['pashmina-black-shawl', 'Pashmina Black Shawl', 'shawls', 'An exquisite black pashmina shawl, hand-woven to perfection. A versatile accessory for any occasion.', 15000, null, ['/shawl/shawl1.jpeg'], ['One Size'], ['100% Pashmina', 'Hand Woven', 'Dry Clean Only'], true],
            ['pashmina-red-shawl', 'Pashmina Red Shawl', 'shawls', 'Vibrant and warm, this red pashmina shawl is a testament to Kashmiri craftsmanship.', 16000, null, ['/shawl/shawl2.jpeg'], ['One Size'], ['Pashmina Blend', 'Intricate Embroidery', 'Dry Clean Only'], true],

            // SAREES
            ['pashmina-silk-saree', 'Pashmina Silk Saree', 'saree', 'A stunning blend of pashmina and silk, this saree drapes elegantly and offers unmatched comfort.', 25000, null, ['/saree/saree1.jpeg'], ['Free Size'], ['Silk Pashmina Blend', 'Zari Border', 'Dry Clean Only'], false]
        ];

        // 5. Insert Loop
        for (const product of products) {
            await pool.query(
                'INSERT INTO products (id, name, category, description, price, sale_price, images, sizes, details, new_arrival) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                product
            );
            console.log(`Inserted: ${product[1]}`);
        }

        console.log('✅ Seeding finished successfully.');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await pool.end();
    }
}

main();

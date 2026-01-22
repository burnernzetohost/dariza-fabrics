const { Pool } = require('pg');
require('dotenv').config();

// 1. Connect directly
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function main() {
    console.log('🌱 Starting Seed...');

    try {
        // 2. Create the Table
        // Note: We use TEXT[] for arrays in Postgres
        await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        images TEXT[],
        sizes TEXT[]
      );
    `);

        // 3. Clear old data
        await pool.query('DELETE FROM products');

        // 4. Define Data
        const products = [
            // COATS (Heirloom Collection: 3800)
            ['midnight-indigo-noir', 'coats', 'Midnight Indigo Noir', 3800, 'A timeless classic crafted from premium wool blend.', ['/coats/coat3.jpeg'], ['S', 'M', 'L', 'XL']],
            ['imperial-merlot', 'coats', 'Imperial Merlot', 3800, 'Rich and elegant, adding a pop of color to your winter wardrobe.', ['/coats/coat1.jpeg'], ['S', 'M', 'L']],
            ['imperial-garnet-rouge', 'coats', 'Imperial Garnet Rouge', 3800, 'Experience luxury with the Imperial Garnet Rouge.', ['/coats/coat2.jpeg'], ['M', 'L', 'XL']],
            ['verdant-imperial-moss', 'coats', 'Verdant Imperial Moss', 3800, 'Connect with nature in the Verdant Imperial Moss coat.', ['/coats/coat4.jpeg'], ['S', 'M', 'L']],

            // SHAWLS
            ['pashmina-black-shawl', 'shawls', 'Pashmina Black Shawl', 15000, 'An exquisite black pashmina shawl, hand-woven to perfection.', ['/shawl/shawl1.jpeg'], ['One Size']],
            ['pashmina-red-shawl', 'shawls', 'Pashmina Red Shawl', 16000, 'Vibrant and warm, a testament to Kashmiri craftsmanship.', ['/shawl/shawl2.jpeg'], ['One Size']],

            // SAREES
            ['pashmina-silk-saree', 'saree', 'Pashmina Silk Saree', 25000, 'A stunning blend of pashmina and silk.', ['/saree/saree1.jpeg'], ['Free Size']],

            // SUITS
            ['kalamkari-suit-royal', 'suits', 'Royal Kalamkari Suit', 13500, 'Traditional hand-painted Kalamkari art on premium fabric.', ['/suits/suit1.jpeg'], ['S', 'M', 'L', 'XL']]
        ];

        // 5. Insert Loop
        for (const product of products) {
            await pool.query(
                'INSERT INTO products (id, category, name, price, description, images, sizes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                product
            );
            console.log(`Inserted: ${product[2]}`);
        }

        console.log('✅ Seeding finished successfully.');
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await pool.end();
    }
}

main();
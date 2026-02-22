const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("Adding SEO columns...");
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_title VARCHAR(60)');
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS meta_description VARCHAR(160)');
        await pool.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255)');

        console.log("Migrating images to JSONB...");
        // Check if images is already jsonb
        const typeRes = await pool.query(`
            SELECT data_type 
            FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'images';
        `);
        if (typeRes.rows[0].data_type === 'ARRAY') {
            await pool.query('ALTER TABLE products RENAME COLUMN images TO old_images');
            await pool.query("ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb");

            const res = await pool.query('SELECT id, old_images FROM products');
            for (let row of res.rows) {
                const oldImages = row.old_images || [];
                // If it's already an array of strings, convert to objects
                const newImages = oldImages.map(url => {
                    if (typeof url === 'string') {
                        return { url, alt: '' };
                    }
                    return url;
                });
                await pool.query('UPDATE products SET images = $1 WHERE id = $2', [JSON.stringify(newImages), row.id]);
            }
            await pool.query('ALTER TABLE products DROP COLUMN old_images');
            console.log("Images converted to JSONB objects.");
        } else {
            console.log("Images already JSONB.");
        }

        console.log("Migration successful!");
    } catch (e) {
        console.error("Migration failed:", e);
    } finally {
        pool.end();
    }
}

migrate();

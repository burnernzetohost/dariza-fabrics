const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function createHeroImagesTable() {
    console.log('🖼️  Creating hero_images table...');

    try {
        // Create hero_images table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hero_images (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                display_order INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Hero images table created');

        // Create index for ordering
        await pool.query(`
            CREATE INDEX IF NOT EXISTS hero_images_order_idx ON hero_images(display_order);
        `);
        console.log('✅ Index created');

        // Insert current hero images
        const existingImages = await pool.query('SELECT COUNT(*) FROM hero_images');
        if (parseInt(existingImages.rows[0].count) === 0) {
            await pool.query(`
                INSERT INTO hero_images (image_url, display_order) VALUES
                ('/hero1.png', 1),
                ('/hero2.png', 2);
            `);
            console.log('✅ Default hero images inserted');
        } else {
            console.log('ℹ️  Hero images already exist, skipping insert');
        }

        console.log('🎉 Hero images table setup completed successfully!');
    } catch (err) {
        console.error('❌ Error creating hero images table:', err);
        throw err;
    } finally {
        await pool.end();
    }
}

createHeroImagesTable();

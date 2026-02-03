const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkPrices() {
    try {
        const result = await pool.query('SELECT id, name, price, sale_price FROM products ORDER BY id');

        console.log('\n📊 Current Product Prices in Database:\n');
        console.log('─'.repeat(80));

        result.rows.forEach(product => {
            console.log(`${product.name.padEnd(30)} | ₹${product.price.toString().padStart(6)} | Sale: ${product.sale_price ? '₹' + product.sale_price : 'None'}`);
        });

        console.log('─'.repeat(80));
        console.log(`\nTotal Products: ${result.rows.length}\n`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkPrices();

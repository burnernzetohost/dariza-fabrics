const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function updateOrdersTable() {
    console.log('🔄 Updating orders table for Razorpay integration...');

    try {
        // Add payment_id column if it doesn't exist
        await pool.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS payment_id TEXT,
            ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
        `);
        console.log('✅ Payment columns added to orders table');

        // Create index for faster lookups
        await pool.query(`
            CREATE INDEX IF NOT EXISTS orders_payment_id_idx ON orders(payment_id);
            CREATE INDEX IF NOT EXISTS orders_razorpay_order_id_idx ON orders(razorpay_order_id);
        `);
        console.log('✅ Indexes created');

        console.log('🎉 Orders table updated successfully for Razorpay!');
    } catch (err) {
        console.error('❌ Error updating orders table:', err);
        throw err;
    } finally {
        await pool.end();
    }
}

updateOrdersTable();

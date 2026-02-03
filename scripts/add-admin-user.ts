import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

async function addAdminUser() {
    try {
        // First, add the admin column if it doesn't exist
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS admin BOOLEAN DEFAULT FALSE;
        `);
        console.log('✓ Admin column added/verified');

        // Check if admin user already exists
        const existingUser = await pool.query(
            'SELECT id, admin FROM users WHERE email = $1',
            ['admin@admin.com']
        );

        if (existingUser.rows.length > 0) {
            // Update existing user to be admin
            await pool.query(
                'UPDATE users SET admin = TRUE WHERE email = $1',
                ['admin@admin.com']
            );
            console.log('✓ Existing user updated to admin status');
        } else {
            // Hash the password
            const hashedPassword = await bcrypt.hash('admin1234', 10);

            // Insert new admin user
            await pool.query(
                `INSERT INTO users (id, name, email, password, admin, email_verified) 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4, CURRENT_TIMESTAMP)`,
                ['Admin User', 'admin@admin.com', hashedPassword, true]
            );
            console.log('✓ Admin user created successfully');
        }

        console.log('\nAdmin credentials:');
        console.log('Email: admin@admin.com');
        console.log('Password: admin1234');
        console.log('Admin: true');

    } catch (error) {
        console.error('Error adding admin user:', error);
    } finally {
        await pool.end();
    }
}

addAdminUser();

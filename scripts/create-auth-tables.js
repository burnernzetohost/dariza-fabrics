const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Supabase
});

async function createAuthTables() {
    console.log('🔐 Creating authentication tables...');

    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                name TEXT,
                email TEXT UNIQUE NOT NULL,
                email_verified TIMESTAMP,
                image TEXT,
                password TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Users table created');

        // Create accounts table (for OAuth providers)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                type TEXT NOT NULL,
                provider TEXT NOT NULL,
                provider_account_id TEXT NOT NULL,
                refresh_token TEXT,
                access_token TEXT,
                expires_at BIGINT,
                token_type TEXT,
                scope TEXT,
                id_token TEXT,
                session_state TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(provider, provider_account_id)
            );
        `);
        console.log('✅ Accounts table created');

        // Create sessions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
                session_token TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Sessions table created');

        // Create verification tokens table (for email verification)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS verification_tokens (
                identifier TEXT NOT NULL,
                token TEXT UNIQUE NOT NULL,
                expires TIMESTAMP NOT NULL,
                PRIMARY KEY (identifier, token)
            );
        `);
        console.log('✅ Verification tokens table created');

        // Create indexes for better performance
        await pool.query(`
            CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
            CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
            CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON sessions(session_token);
        `);
        console.log('✅ Indexes created');

        console.log('🎉 All authentication tables created successfully!');
    } catch (err) {
        console.error('❌ Error creating tables:', err);
        throw err;
    } finally {
        await pool.end();
    }
}

createAuthTables();

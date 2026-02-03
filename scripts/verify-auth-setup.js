require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function verifySetup() {
    console.log('🔍 Verifying Supabase Authentication Setup...\n');

    try {
        // Check all tables exist
        const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);

        console.log('📊 Tables in your Supabase database:');
        tablesResult.rows.forEach(row => {
            console.log(`   ✅ ${row.table_name}`);
        });

        // Check users table structure
        const usersColumns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            ORDER BY ordinal_position
        `);

        console.log('\n👤 USERS table structure:');
        usersColumns.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });

        // Check accounts table structure
        const accountsColumns = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'accounts' 
            ORDER BY ordinal_position
        `);

        console.log('\n🔗 ACCOUNTS table structure (for OAuth):');
        accountsColumns.rows.forEach(col => {
            console.log(`   - ${col.column_name} (${col.data_type})`);
        });

        // Check if there are any users
        const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
        console.log(`\n📈 Current user count: ${userCount.rows[0].count}`);

        console.log('\n✅ SUCCESS! Your authentication system is connected to Supabase!');
        console.log('\n📝 What happens when users sign up:');
        console.log('   1. Email/Password users → stored in "users" table with hashed password');
        console.log('   2. Google OAuth users → stored in "users" + "accounts" tables');
        console.log('   3. Facebook OAuth users → stored in "users" + "accounts" tables');
        console.log('   4. All sessions → stored in "sessions" table');
        console.log('\n🎯 Next step: Test the login at http://localhost:3000/login\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verifySetup();

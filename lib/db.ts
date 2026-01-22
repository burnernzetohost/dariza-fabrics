import { Pool } from 'pg';

// This creates a "pool" of connections that your app can reuse
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
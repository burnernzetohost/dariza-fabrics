import { Pool } from 'pg';
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters';

export function PostgresAdapter(pool: Pool): Adapter {
    return {
        async createUser(user: Omit<AdapterUser, "id">) {
            const result = await pool.query(
                `INSERT INTO users (id, name, email, email_verified, image) 
                 VALUES (gen_random_uuid()::text, $1, $2, $3, $4) 
                 RETURNING id, name, email, email_verified, image`,
                [user.name, user.email, user.emailVerified, user.image]
            );
            return result.rows[0] as AdapterUser;
        },

        async getUser(id: string) {
            const result = await pool.query(
                'SELECT id, name, email, email_verified as "emailVerified", image, admin FROM users WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        },

        async getUserByEmail(email: string) {
            const result = await pool.query(
                'SELECT id, name, email, email_verified as "emailVerified", image, admin FROM users WHERE email = $1',
                [email]
            );
            return result.rows[0] || null;
        },

        async getUserByAccount({ providerAccountId, provider }) {
            const result = await pool.query(
                `SELECT u.id, u.name, u.email, u.email_verified as "emailVerified", u.image, u.admin 
                 FROM users u 
                 JOIN accounts a ON u.id = a.user_id 
                 WHERE a.provider = $1 AND a.provider_account_id = $2`,
                [provider, providerAccountId]
            );
            return result.rows[0] || null;
        },

        async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
            const result = await pool.query(
                `UPDATE users 
                 SET name = $1, email = $2, email_verified = $3, image = $4, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = $5 
                 RETURNING id, name, email, email_verified as "emailVerified", image`,
                [user.name, user.email, user.emailVerified, user.image, user.id]
            );
            return result.rows[0] as AdapterUser;
        },

        async deleteUser(userId: string) {
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        },

        async linkAccount(account: AdapterAccount) {
            await pool.query(
                `INSERT INTO accounts (
                    id, user_id, type, provider, provider_account_id, 
                    refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
                ) VALUES (
                    gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
                )`,
                [
                    account.userId,
                    account.type,
                    account.provider,
                    account.providerAccountId,
                    account.refresh_token,
                    account.access_token,
                    account.expires_at,
                    account.token_type,
                    account.scope,
                    account.id_token,
                    account.session_state,
                ]
            );
            return account as AdapterAccount;
        },

        async unlinkAccount({ providerAccountId, provider }) {
            await pool.query(
                'DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2',
                [provider, providerAccountId]
            );
        },

        async createSession({ sessionToken, userId, expires }) {
            const result = await pool.query(
                `INSERT INTO sessions (id, session_token, user_id, expires) 
                 VALUES (gen_random_uuid()::text, $1, $2, $3) 
                 RETURNING id, session_token as "sessionToken", user_id as "userId", expires`,
                [sessionToken, userId, expires]
            );
            return result.rows[0] as AdapterSession;
        },

        async getSessionAndUser(sessionToken: string) {
            const result = await pool.query(
                `SELECT 
                    s.id, s.session_token as "sessionToken", s.user_id as "userId", s.expires,
                    u.id as "user_id", u.name, u.email, u.email_verified as "emailVerified", u.image
                 FROM sessions s
                 JOIN users u ON s.user_id = u.id
                 WHERE s.session_token = $1`,
                [sessionToken]
            );

            if (!result.rows[0]) return null;

            const { user_id, name, email, emailVerified, image, admin, ...session } = result.rows[0];
            return {
                session: session as AdapterSession,
                user: { id: user_id, name, email, emailVerified, image, admin } as AdapterUser,
            };
        },

        async updateSession({ sessionToken, expires, userId }) {
            const result = await pool.query(
                `UPDATE sessions 
                 SET expires = COALESCE($1, expires), user_id = COALESCE($2, user_id) 
                 WHERE session_token = $3 
                 RETURNING id, session_token as "sessionToken", user_id as "userId", expires`,
                [expires, userId, sessionToken]
            );
            return result.rows[0] || null;
        },

        async deleteSession(sessionToken: string) {
            await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
        },

        async createVerificationToken({ identifier, expires, token }) {
            const result = await pool.query(
                `INSERT INTO verification_tokens (identifier, token, expires) 
                 VALUES ($1, $2, $3) 
                 RETURNING identifier, token, expires`,
                [identifier, token, expires]
            );
            return result.rows[0] as VerificationToken;
        },

        async useVerificationToken({ identifier, token }) {
            const result = await pool.query(
                `DELETE FROM verification_tokens 
                 WHERE identifier = $1 AND token = $2 
                 RETURNING identifier, token, expires`,
                [identifier, token]
            );
            return result.rows[0] || null;
        },
    };
}

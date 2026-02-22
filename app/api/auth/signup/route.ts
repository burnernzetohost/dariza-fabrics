import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (id, name, email, password, created_at, updated_at) 
             VALUES (gen_random_uuid()::text, $1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
             RETURNING id, name, email`,
            [name || null, email, hashedPassword]
        );

        const user = result.rows[0];

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await pool.query(
            `INSERT INTO verification_tokens (identifier, token, expires) 
             VALUES ($1, $2, $3)`,
            [user.email, verificationToken, expiresAt]
        );

        // Send email (we don't await strictly to prevent slow signup, but we should handle it asynchronously)
        sendVerificationEmail(user.email, verificationToken).catch(err => {
            console.error('Failed to dispatch verification email in background:', err);
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}

import { redirect } from 'next/navigation';
import pool from '@/lib/db';
import Link from 'next/link';

export default async function VerifyEmailPage(props: { searchParams: Promise<{ token?: string }> }) {
    const searchParams = await props.searchParams;
    const token = searchParams.token;
    let success = false;
    let message = 'Verifying your email address...';

    if (!token) {
        message = 'Invalid or missing verification token.';
    } else {
        try {
            // Find token
            const tokenResult = await pool.query(
                'SELECT identifier, expires FROM verification_tokens WHERE token = $1',
                [token]
            );

            if (tokenResult.rows.length === 0) {
                message = 'Token has expired or is invalid.';
            } else {
                const { identifier, expires } = tokenResult.rows[0];

                if (new Date(expires) < new Date()) {
                    message = 'This verification link has expired. Please sign up again or request a new link.';
                } else {
                    // Update user
                    await pool.query(
                        'UPDATE users SET email_verified = CURRENT_TIMESTAMP WHERE email = $1',
                        [identifier]
                    );

                    // Delete the used token
                    await pool.query(
                        'DELETE FROM verification_tokens WHERE identifier = $1',
                        [identifier]
                    );

                    success = true;
                    message = 'Your email has been successfully verified! You can now proceed to checkout.';
                }
            }
        } catch (error) {
            console.error('Email verification error:', error);
            message = 'An error occurred during verification. Please try again later.';
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-serif text-gray-900">
                    Email Verification
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${success ? 'bg-green-100' : 'bg-red-100'} mb-4`}>
                        {success ? (
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <p className="text-gray-700 mb-6">{message}</p>
                    <Link
                        href="/login"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#000000] hover:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000]"
                    >
                        Sign in to your account
                    </Link>
                </div>
            </div>
        </div>
    );
}

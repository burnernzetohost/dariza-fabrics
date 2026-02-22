'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                setIsLoading(false);
            } else if (result?.ok) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
            setIsLoading(false);
        }
    };

    const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
        setIsLoading(true);
        setError('');
        try {
            await signIn(provider, { callbackUrl: '/' });
        } catch (error) {
            console.error('OAuth error:', error);
            setError('An error occurred during sign in');
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#000000] py-16 md:py-20 text-center px-4">
                    <h1 className="font-lush text-4xl md:text-6xl mb-4 text-[#ffffff]">
                        Welcome Back
                    </h1>
                    <p className="font-script text-xl md:text-2xl text-[#ffffff]/80 max-w-2xl mx-auto">
                        Sign in to your account
                    </p>
                </div>

                {/* Login Form Section */}
                <div className="max-w-md mx-auto px-4 py-12 md:py-16">
                    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-8 md:p-10">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 uppercase tracking-wider"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-300 text-[#01321F]"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 uppercase tracking-wider"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-300 text-[#01321F] pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 border-gray-300 rounded text-[#01321F] focus:ring-[#000000] cursor-pointer"
                                    />
                                    <span className="text-gray-600 group-hover:text-[#01321F] transition-colors">
                                        Remember me
                                    </span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[#01321F] hover:text-[#01321F]/80 font-medium transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#000000] text-white py-3 rounded-md font-medium uppercase tracking-wider hover:bg-[#000000]/90 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Signing In...</span>
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 uppercase tracking-wider">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('google')}
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Google</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleOAuthSignIn('facebook')}
                                disabled={isLoading}
                                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Facebook</span>
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/signup"
                                className="text-[#01321F] hover:text-[#01321F]/80 font-medium transition-colors"
                            >
                                Create one now
                            </Link>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
                        <p>
                            By signing in, you agree to our{' '}
                            <Link href="/terms" className="text-[#01321F] hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-[#01321F] hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

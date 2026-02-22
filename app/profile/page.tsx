'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserCircle, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin h-12 w-12 border-4 border-[#000000] border-t-transparent rounded-full"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#000000] py-16 md:py-20 text-center px-4">
                    <h1 className="font-lush text-4xl md:text-6xl mb-4 text-[#ffffff]">
                        My Profile
                    </h1>
                    <p className="font-script text-xl md:text-2xl text-[#ffffff]/80 max-w-2xl mx-auto">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Content */}
                <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
                    <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-8 md:p-10">
                        {/* Profile Header */}
                        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100">
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt={session.user.name || 'User'}
                                    className="w-24 h-24 rounded-full mb-4 border-4 border-[#000000]"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-[#000000] flex items-center justify-center mb-4">
                                    <UserCircle className="w-16 h-16 text-[#ffffff]" />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-[#01321F] mb-2">
                                {session.user.name || 'User'}
                            </h2>
                            <p className="text-gray-500">{session.user.email}</p>
                        </div>

                        {/* Account Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#01321F] mb-4">
                                Account Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        <UserCircle className="w-4 h-4 mr-2" />
                                        Full Name
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-[#01321F]">
                                        {session.user.name || 'Not provided'}
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-[#01321F]">
                                        {session.user.email}
                                    </div>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="mt-8 p-4 bg-[#ffffff]/20 border border-[#000000]/20 rounded-md">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Account Status:</span> Active
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Your account is in good standing and you have access to all features.
                                </p>
                            </div>
                        </div>

                        {/* Future Features Placeholder */}
                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <h3 className="text-xl font-semibold text-[#01321F] mb-4">
                                Order History
                            </h3>
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">
                                    No orders yet. Start shopping to see your order history here!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

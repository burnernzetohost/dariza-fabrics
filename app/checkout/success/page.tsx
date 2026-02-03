'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    return (
        <div className="text-center max-w-md">
            <div className="mb-6 flex justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-4xl font-serif text-gray-900 mb-4">Order Confirmed!</h1>

            <p className="text-gray-600 mb-2">
                Thank you for your order.
            </p>

            {orderId && (
                <p className="text-sm text-gray-500 mb-8">
                    Order ID: <span className="font-mono font-semibold">{orderId.substring(0, 8)}...</span>
                </p>
            )}

            <div className="bg-[#f5f5f5] p-6 mb-8 border border-gray-300">
                <p className="text-gray-700 mb-3">
                    A confirmation email has been sent to your inbox with order details and tracking information.
                </p>
                <p className="text-sm text-gray-600">
                    We will begin processing your order shortly. Thank you for shopping with Dariza Fabrics!
                </p>
            </div>

            <div className="space-y-3">
                <Link
                    href="/shop"
                    className="block bg-[#012d20] text-white py-3 uppercase tracking-widest text-xs font-medium hover:bg-[#001a12] transition duration-300"
                >
                    Continue Shopping
                </Link>
                <Link
                    href="/"
                    className="block border border-gray-300 text-gray-900 py-3 uppercase tracking-widest text-xs font-medium hover:bg-gray-50 transition duration-300"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow flex items-center justify-center px-4 py-12">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <SuccessContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}

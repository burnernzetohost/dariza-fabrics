'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        shipping_address: '',
        special_notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate required fields
            if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || 
                !formData.customer_address || !formData.shipping_address) {
                throw new Error('Please fill in all required fields');
            }

            if (items.length === 0) {
                throw new Error('Your cart is empty');
            }

            // Prepare items for order
            const orderItems = items.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price_per_unit: item.price,
                images: [item.image]
            }));

            // Create order
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: session?.user?.email ? (session.user as any).id : null,
                    customer_name: formData.customer_name,
                    customer_email: formData.customer_email,
                    customer_phone: formData.customer_phone,
                    customer_address: formData.customer_address,
                    shipping_address: formData.shipping_address,
                    items: orderItems,
                    total_amount: subtotal,
                    special_notes: formData.special_notes || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create order');
            }

            const orderData = await response.json();
            
            // Clear cart after successful order
            clearCart();
            
            // Redirect to success page
            router.push(`/checkout/success?order_id=${orderData.order.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-serif text-gray-900 mb-4">Cart Empty</h1>
                    <p className="text-gray-500 mb-8 text-center max-w-md">You need to add items to your cart before checking out.</p>
                    <Link
                        href="/shop"
                        className="bg-[#012d20] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#001a12] transition duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const shippingCost = 0; // Free shipping for now
    const total = subtotal + shippingCost;

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/cart" className="flex items-center text-gray-500 hover:text-black transition">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span className="text-sm uppercase tracking-wider">Back to Cart</span>
                    </Link>
                </div>

                <h1 className="text-4xl font-serif text-gray-900 mb-12">Checkout</h1>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
                        {error}
                    </div>
                )}

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
                    {/* Checkout Form - Left Side */}
                    <div className="lg:col-span-8 mb-8 lg:mb-0">
                        <form onSubmit={handleSubmitOrder} className="space-y-8">
                            {/* Personal Information */}
                            <div>
                                <h2 className="text-lg font-serif text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="customer_email"
                                            value={formData.customer_email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="customer_phone"
                                            value={formData.customer_phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div>
                                <h2 className="text-lg font-serif text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Billing Address
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="customer_address"
                                        value={formData.customer_address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Street address, city, state, postal code"
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h2 className="text-lg font-serif text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Shipping Address
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <textarea
                                        name="shipping_address"
                                        value={formData.shipping_address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Street address, city, state, postal code"
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Special Notes */}
                            <div>
                                <h2 className="text-lg font-serif text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Additional Information
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Notes (Optional)
                                    </label>
                                    <textarea
                                        name="special_notes"
                                        value={formData.special_notes}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Any special instructions or notes..."
                                        className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#012d20] text-white py-4 uppercase tracking-widest text-sm font-medium hover:bg-[#001a12] transition duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Processing Order...' : 'Proceed to Payment'}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary - Right Side */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#f5f5f5] p-8 sticky top-20">
                            <h2 className="text-lg font-serif text-gray-900 mb-6">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-300">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <div className="text-gray-700">
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-700">
                                    <span>Tax</span>
                                    <span>₹0</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-300 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-serif text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-[#012d20]">₹{total}</span>
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-white border border-gray-300">
                                <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-2">
                                    Payment Method
                                </p>
                                <p className="text-sm text-gray-700">
                                    You will be redirected to Razorpay for secure payment processing.
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

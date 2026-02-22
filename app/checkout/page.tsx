'use client';

import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Truck, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shippingCost, setShippingCost] = useState<number | null>(null);
    const [shippingInfo, setShippingInfo] = useState<{ courier_name: string; etd: string; estimated_delivery_days: string } | null>(null);
    const [shippingLoading, setShippingLoading] = useState(false);
    const [shippingError, setShippingError] = useState('');
    const pincodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        shipping_address: '',
        shipping_pincode: '',
        special_notes: ''
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const fetchShippingRates = async (pincode: string) => {
        if (!/^\d{6}$/.test(pincode)) return;
        setShippingLoading(true);
        setShippingError('');
        setShippingCost(null);
        setShippingInfo(null);
        try {
            const res = await fetch('/api/shipping-rates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ delivery_pincode: pincode, quantity: totalItems }),
            });
            const data = await res.json();
            if (!res.ok) {
                setShippingError(data.error || 'Could not fetch shipping rates.');
            } else {
                setShippingCost(data.rate);
                setShippingInfo({ courier_name: data.courier_name, etd: data.etd, estimated_delivery_days: data.estimated_delivery_days });
            }
        } catch {
            setShippingError('Failed to calculate shipping. Please try again.');
        } finally {
            setShippingLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'shipping_pincode') {
            // Reset shipping when pincode changes
            setShippingCost(null);
            setShippingInfo(null);
            setShippingError('');
            if (pincodeDebounceRef.current) clearTimeout(pincodeDebounceRef.current);
            if (/^\d{6}$/.test(value)) {
                pincodeDebounceRef.current = setTimeout(() => fetchShippingRates(value), 400);
            }
        }
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

            // Step 1: Create Razorpay order
            const finalShipping = shippingCost ?? 0;
            const totalWithShipping = subtotal + finalShipping;
            const razorpayOrderResponse = await fetch('/api/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalWithShipping,
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                    notes: {
                        customer_name: formData.customer_name,
                        customer_email: formData.customer_email,
                    }
                })
            });

            if (!razorpayOrderResponse.ok) {
                const errorData = await razorpayOrderResponse.json();
                throw new Error(errorData.message || 'Failed to create payment order');
            }

            const razorpayOrderData = await razorpayOrderResponse.json();

            // Step 2: Initialize Razorpay checkout
            const options = {
                key: razorpayOrderData.key_id,
                amount: razorpayOrderData.amount,
                currency: razorpayOrderData.currency,
                name: 'Dariza Fabrics',
                description: 'Purchase from Dariza Fabrics',
                order_id: razorpayOrderData.order_id,
                prefill: {
                    name: formData.customer_name,
                    email: formData.customer_email,
                    contact: formData.customer_phone,
                },
                theme: {
                    color: '#012d20',
                },
                handler: async function (response: any) {
                    try {
                        // Step 3: Verify payment
                        const verifyResponse = await fetch('/api/razorpay', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                        });

                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            // Step 4: Create order in database with payment details
                            const orderResponse = await fetch('/api/orders', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    user_id: session?.user?.email ? (session.user as any).id : null,
                                    customer_name: formData.customer_name,
                                    customer_email: formData.customer_email,
                                    customer_phone: formData.customer_phone,
                                    customer_address: formData.customer_address,
                                    shipping_address: `${formData.shipping_address}, PIN: ${formData.shipping_pincode}`,
                                    items: orderItems,
                                    total_amount: totalWithShipping,
                                    special_notes: formData.special_notes || null,
                                    payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    payment_status: 'Paid'
                                })
                            });

                            if (!orderResponse.ok) {
                                const errorData = await orderResponse.json();
                                throw new Error(errorData.message || 'Failed to create order');
                            }

                            const orderData = await orderResponse.json();

                            // Clear cart after successful order
                            clearCart();

                            // Redirect to success page
                            router.push(`/checkout/success?order_id=${orderData.order.id}`);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        setError(err instanceof Error ? err.message : 'Payment processing failed');
                        setLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setError('Payment cancelled');
                        setLoading(false);
                    }
                }
            };

            // Load Razorpay script and open checkout
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            };
            script.onerror = () => {
                setError('Failed to load payment gateway. Please try again.');
                setLoading(false);
            };
            document.body.appendChild(script);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    // Show loading while session is being fetched
    if (sessionStatus === 'loading') {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#012d20]" />
                </div>
                <Footer />
            </main>
        );
    }

    // Require login before checkout
    if (!session) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-[#012d20]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[#012d20]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-serif text-gray-900 mb-3">Sign in to Continue</h1>
                        <p className="text-gray-500 mb-8">
                            Please sign in to your account to proceed with checkout. Your cart will be saved to your account.
                        </p>
                        <Link
                            href={`/login?callbackUrl=/checkout`}
                            className="block w-full bg-[#012d20] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#001a12] transition duration-300 text-center mb-4"
                        >
                            Sign In
                        </Link>
                        <Link
                            href={`/signup?callbackUrl=/checkout`}
                            className="block w-full border border-[#012d20] text-[#012d20] px-8 py-3 uppercase tracking-widest text-xs hover:bg-gray-50 transition duration-300 text-center"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

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

    const finalShipping = shippingCost ?? 0;
    const total = subtotal + finalShipping;

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
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address *
                                        </label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Street address, city, state"
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Delivery Pincode *
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_pincode"
                                            value={formData.shipping_pincode}
                                            onChange={handleInputChange}
                                            maxLength={6}
                                            placeholder="Enter 6-digit pincode"
                                            className="w-full px-4 py-3 border border-gray-300 focus:border-[#012d20] focus:outline-none transition"
                                            required
                                        />
                                        {/* Shipping rate feedback */}
                                        {shippingLoading && (
                                            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Calculating shipping charges...</span>
                                            </div>
                                        )}
                                        {shippingError && (
                                            <div className="mt-3 flex items-start gap-2 text-sm text-red-600">
                                                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <span>{shippingError}</span>
                                            </div>
                                        )}
                                        {shippingInfo && shippingCost !== null && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2">
                                                <Truck className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-green-800">{shippingInfo.courier_name}</p>
                                                    <p className="text-green-700">₹{shippingCost} &bull; Est. delivery: {shippingInfo.etd} ({shippingInfo.estimated_delivery_days} days)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
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
                                    {shippingLoading ? (
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
                                        </span>
                                    ) : shippingCost !== null ? (
                                        <span className="font-medium">₹{shippingCost}</span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Enter pincode to calculate</span>
                                    )}
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
                                    <span className="text-2xl font-bold text-[#012d20]">
                                        {shippingCost !== null ? `₹${total}` : `₹${subtotal}+`}
                                    </span>
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

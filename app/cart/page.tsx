'use client';

import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, subtotal } = useCart();

    if (items.length === 0) {
        return (
            <main className="min-h-screen flex flex-col bg-white">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl font-serif text-gray-900 mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Browse our collections to find your perfect style.</p>
                    <Link
                        href="/"
                        className="bg-[#012d20] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#001a12] transition duration-300"
                    >
                        Continue Shopping
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex items-center mb-8">
                    <Link href="/" className="flex items-center text-gray-500 hover:text-black mr-4 transition">
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        <span className="text-sm uppercase tracking-wider">Back</span>
                    </Link>
                    <h1 className="text-3xl font-serif text-gray-900">Your Shopping Cart</h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8">
                        <div className="border-t border-gray-200">
                            {items.map((item) => (
                                <div key={item.id} className="flex py-6 border-b border-gray-200">
                                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 sm:h-32 sm:w-32">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link href="#" className="font-medium text-gray-700 hover:text-gray-800">
                                                            {item.name}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-gray-500">Size: {item.size || 'N/A'}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">₹{(item.salePrice || item.price).toFixed(2)}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <div className="flex items-center border border-gray-300 rounded max-w-max">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                    <span className="px-2 text-sm text-gray-900 min-w-[1.5rem] text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100"
                                                    >
                                                        <Plus className="h-4 w-4 text-gray-600" />
                                                    </button>
                                                </div>

                                                <div className="absolute top-0 right-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="-m-2 p-2 inline-flex text-gray-400 hover:text-red-500"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                            Order summary
                        </h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">Subtotal</div>
                                <div className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</div>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <div className="text-base font-medium text-gray-900">Order total</div>
                                <div className="text-base font-medium text-gray-900">₹{subtotal.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                className="w-full flex justify-center items-center bg-[#012d20] border border-transparent px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-[#001a12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#012d20] uppercase tracking-widest"
                            >
                                Checkout
                            </Link>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            Free shipping on all orders over ₹5000
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}

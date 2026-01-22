'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#012d20] py-20 text-center px-4">
                    <h1 className="font-lush text-5xl md:text-7xl mb-6 text-[#DCf9f1]">
                        Get in Touch
                    </h1>
                    <p className="font-script text-2xl text-[#DCf9f1]/80 max-w-2xl mx-auto">
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl font-serif text-black mb-8">Send us a Message</h2>
                            <form className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 border rounded-none"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 border rounded-none"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        className="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 border rounded-none"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm py-3 px-4 border rounded-none"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-4 px-8 border border-transparent shadow-sm text-sm font-medium text-white bg-[#012d20] hover:bg-[#001a12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#012d20] uppercase tracking-widest transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gray-50 p-10 lg:p-16 h-full flex flex-col justify-center">
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Customer Care</h3>
                                    <p className="text-gray-600 mb-2">For inquiries about orders, sizing, or general questions:</p>
                                    <div className="space-y-2">
                                        <a href="mailto:info@darizafabrics.com" className="block text-black font-medium hover:underline text-lg">
                                            info@darizafabrics.com
                                        </a>
                                        <a href="https://api.whatsapp.com/send/?phone=919055569991" className="block text-black font-medium hover:underline text-lg">
                                            +91-9055569991
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Working Hours</h3>
                                    <p className="text-gray-600 text-lg">
                                        Monday – Saturday: 10:00 AM – 7:00 PM
                                    </p>
                                </div>



                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-widest text-black mb-4">Follow Us</h3>
                                    <p className="text-gray-600 mb-4">Stay updated with our latest collections.</p>
                                    <div className="flex space-x-6">
                                        <a href="https://instagram.com" className="text-gray-400 hover:text-black transition">Instagram</a>
                                        <a href="https://facebook.com" className="text-gray-400 hover:text-black transition">Facebook</a>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-200">
                                    <p className="font-serif italic text-xl text-gray-800 leading-relaxed">
                                        "Every message is as treasured as every stitch — thank you for reaching out to us."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

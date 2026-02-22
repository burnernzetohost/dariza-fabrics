'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Footer from '@/components/Footer';

interface ProductProps {
    product: {
        id: string;
        category: string;
        name: string;
        price: number;
        description: string;
        images: any[];
        sizes: string[];
        details?: string[];
    }
}

export default function ProductClient({ product }: ProductProps) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [activeImage, setActiveImage] = useState(0);
    const [isAdded, setIsAdded] = useState(false);
    const [isMainBtnVisible, setIsMainBtnVisible] = useState(true);

    // Track visibility of the main Add To Cart button
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsMainBtnVisible(entry.isIntersecting);
            },
            { rootMargin: '0px', threshold: 0 }
        );

        const btn = document.getElementById('main-atc-button');
        if (btn) observer.observe(btn);

        return () => {
            if (btn) observer.unobserve(btn);
        };
    }, []);

    // SAFETY CHECK: Stop here if no product data was passed
    if (!product) return null;

    // Default values to prevent crashes
    const images = product.images || [];
    const sizes = product.sizes || [];
    const details = product.details || ["Premium Quality Material", "Handcrafted Excellence", "Authentic Dariza Design"];

    const mainImageObj = images.length > 0 ? images[activeImage] : null;
    const mainImage = mainImageObj ? (typeof mainImageObj === 'string' ? mainImageObj : mainImageObj.url) : '/placeholder.jpg';
    const mainAlt = mainImageObj ? (typeof mainImageObj === 'string' ? product.name : (mainImageObj.alt || product.name)) : product.name;

    const handleAddToCart = () => {
        const isFreeSize = sizes.length === 1 && (sizes[0].toLowerCase() === 'free size' || sizes[0].toLowerCase() === 'one size');
        if (!selectedSize && sizes.length > 0 && !isFreeSize) {
            alert('Please select a size');
            return;
        }
        addToCart({
            name: product.name,
            price: product.price,
            image: mainImage,
            size: isFreeSize ? sizes[0] : selectedSize,
        });
        showToast({ name: product.name, price: product.price, size: selectedSize, image: mainImage });

        // Trigger success state mutation
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1000);
    };

    return (
        <main className="min-h-screen flex flex-col bg-white pb-24 md:pb-0">
            <Navbar />
            <div className="flex-grow max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="flex flex-col-reverse lg:flex-row gap-4">
                        {images.length > 1 && (
                            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:w-24">
                                {images.map((imgObj, idx) => {
                                    const img = typeof imgObj === 'string' ? imgObj : imgObj.url;
                                    const alt = typeof imgObj === 'string' ? `View ${idx}` : (imgObj.alt || `View ${idx}`);
                                    return (
                                        <button key={idx} onClick={() => setActiveImage(idx)} className={`relative aspect-[3/4] w-20 lg:w-full flex-shrink-0 border-2 ${activeImage === idx ? 'border-black' : 'border-transparent'}`}>
                                            <Image src={img} alt={alt} fill className="object-cover" />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex-1 aspect-[3/4] bg-gray-100 relative overflow-hidden">
                            <Image src={mainImage} alt={mainAlt} fill className="object-cover" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-serif text-gray-900 tracking-wide">{product.name}</h1>
                        </div>
                        <div className="mt-4 flex items-baseline"><span className="text-xl text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</span></div>
                        <div className="mt-8 space-y-6 text-sm text-gray-600 leading-relaxed"><p>{product.description}</p></div>

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">Select Size</h3>
                                <div className="grid grid-cols-4 gap-3">
                                    {sizes.every(s => ['S', 'M', 'L', 'XL'].includes(s.toUpperCase())) ? (
                                        // Standard Size Grid: S, M, L, XL
                                        ['S', 'M', 'L', 'XL'].map((size) => {
                                            const isAvailable = sizes.some(s => s.toUpperCase() === size);
                                            return (
                                                <button
                                                    key={size}
                                                    disabled={!isAvailable}
                                                    onClick={() => isAvailable && setSelectedSize(size)}
                                                    className={`relative flex items-center justify-center py-3 border text-sm font-medium uppercase transition-all overflow-hidden ${selectedSize === size ? 'border-[#012d20] bg-[#012d20] text-white' : (isAvailable ? 'border-gray-200 text-gray-900 hover:border-gray-900' : 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50')}`}
                                                >
                                                    {size}
                                                    {!isAvailable && (
                                                        <svg className="absolute inset-0 w-full h-full text-gray-300" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                            <line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="2" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )
                                        })
                                    ) : (
                                        // Custom sizes (like Free Size, custom text, numbers)
                                        sizes.map((size) => (
                                            <button key={size} onClick={() => setSelectedSize(size)} className={`flex items-center justify-center py-3 border text-sm font-medium uppercase transition-all px-2 ${selectedSize === size ? 'border-[#012d20] bg-[#012d20] text-white' : 'border-gray-200 text-gray-900 hover:border-gray-900'}`}>
                                                {size}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="mt-10 flex gap-4">
                            <button
                                id="main-atc-button"
                                onClick={handleAddToCart}
                                className={`flex-1 text-white py-4 px-8 uppercase tracking-widest text-sm font-bold transition ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-[#012d20] hover:bg-[#001a12]'}`}
                            >
                                {isAdded ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                            <button className="p-4 border border-gray-300 text-gray-500 hover:border-black transition"><Share2 className="w-5 h-5" /></button>
                        </div>

                        {/* Details List */}
                        <div className="mt-12 border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Product Details</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                {details.map((detail, idx) => <li key={idx}>{detail}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Bar */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform duration-300 ${isMainBtnVisible ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 text-white py-3 px-8 uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2 transition ${isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-[#012d20] hover:bg-[#001a12]'}`}
                    >
                        <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}
'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [images, setImages] = useState<string[]>(['/hero1.png', '/hero2.png']); // Fallback images
  const [loading, setLoading] = useState(true);

  // Fetch hero images from database
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch('/api/hero-images');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            const imageUrls = data.map((img: any) => img.image_url);
            setImages(imageUrls);
          }
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
        // Keep fallback images
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-[85vh] w-full bg-[#DCf9f1] overflow-hidden">
      {/* Slideshow Images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <img
            src={src}
            alt={`Hero Slide ${index + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}

      {/* Overlay Content - Z-index ensures it stays on top */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
        <h1 className="text-white font-medium text-5xl md:text-6xl mb-6 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
          Fresh Summer Arrivals
        </h1>
        <p className="text-white/90 text-sm tracking-widest uppercase mb-8">
          Explore the latest range
        </p>
        <div className="flex gap-4">
          <button className="bg-[#012d20] text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#001a12] transition border border-[#012d20]">
            Shop Latest
          </button>
          <button className="border border-white text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-[#012d20] transition">
            Best Selling
          </button>
        </div>
      </div>
    </div>
  );
}
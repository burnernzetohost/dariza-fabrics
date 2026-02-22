'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#000000] py-20 text-center px-4">
                    <h1 className="font-lush text-5xl md:text-7xl mb-6 text-[#ffffff]">
                        DARIZA FABRICS
                    </h1>
                    <p className="font-script text-2xl text-[#ffffff]/80 max-w-2xl mx-auto">
                        Our Story.
                    </p>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 py-16 space-y-12 text-center md:text-left">
                    <div className="mx-auto text-gray-700 leading-relaxed font-light text-xl md:text-2xl space-y-10">
                        <p>
                            A canvas of culture, woven with threads of elegance – Dariza Fabrics is an ode to the timeless artistry of Kashmir and
                            Duggar – a harmonious blend of heritage and haute couture.
                        </p>
                        <p>
                            Born from a passion to preserve and elevate the region’s age-old craftsmanship, Dariza redefines traditional embroidery with a contemporary lens -curating ensembles that speak both of legacy and luxury.
                        </p>
                        <p>
                            Each creation is born of passion and devotion – Kashmiri Tilla and Aari embroidery meeting the regal finesse of Dogri
                            Gota Pattu, Zari and Kinari detailing. Crafted in Fine Silk, Crepe, Muslin, Georgette, Malmal cotton, Chenille, Wool and
                            other fabrics, our collections embody quiet opulence and enduring grace.
                        </p>
                        <p>
                            From ethereal Kaftan sets to Tailored Kashmiri Coats, from heirloom stoles to fluid Sarees – every Dariza piece tells a story of artistry that transcends seasons and trends.
                        </p>
                        <p>
                            Its where tradition finds its modern muse.
                        </p>

                        {/* The Essence of Dariza Section */}
                        <div className="pt-10 space-y-6 leading-relaxed">
                            <h2 className="text-3xl md:text-5xl font-serif text-black font-bold mb-10">The Essence of Dariza</h2>

                            <p>In every thread, a story breathes</p>
                            <p>In every fold, a memory unfolds…</p>
                            <p>Dariza was not born in studios, but in the stories we grew up with –</p>

                            <div className="pl-4 md:pl-8 space-y-4 italic text-gray-600">
                                <p>of our grandmothers threading gold and silver into silk</p>
                                <p>of artisans weaving devotion into every motif</p>
                                <p>of valleys where art was not learned, but lived</p>
                            </div>

                            <p>
                                Dariza is where tradition breathes anew- a gentle revival of Kashmiri and Dogra artistry, reimagined in forms that feel timeless, tactile and true. Every creation carries the rhythm of craft, translated into the language of today.
                            </p>

                            <p className="font-semibold text-black">
                                Dariza- crafted with soul, inspired by heritage and designed for today
                            </p>

                            <p className="italic font-serif text-2xl mt-8">
                                A tribute to the quiet elegance of tradition and to the women who wear it like poetry…
                            </p>
                        </div>
                    </div>

                    {/* Image Placeholder or Quote */}
                    <div className="bg-gray-50 p-12 text-center my-12 border-t border-b border-gray-100">
                        <blockquote className="font-serif text-2xl italic text-gray-900">
                            "Fabric is the soul of the garment, and we ensure ours has a beautiful story to tell."
                        </blockquote>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

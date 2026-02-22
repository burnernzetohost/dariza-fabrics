import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="text-center max-w-lg">
                    <h1 className="text-6xl md:text-8xl font-bold text-[#01321F] mb-4">404</h1>
                    <h2 className="text-2xl md:text-3xl font-serif text-[#01321F] mb-6">Page Not Found</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        We're sorry, but the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-[#000000] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#1a1a1a] transition duration-300"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}

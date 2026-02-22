import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="text-center max-w-lg">
                    <h1 className="text-6xl md:text-8xl font-bold text-[#012d20] mb-4">404</h1>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">Page Not Found</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        We're sorry, but the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-[#012d20] text-white px-8 py-3 uppercase tracking-widest text-xs hover:bg-[#001a12] transition duration-300"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
            <Footer />
        </main>
    );
}

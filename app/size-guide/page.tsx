import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SizeGuide() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif text-center text-[#01321F] mb-12">
                    DARIZA FABRICS – SIZE GUIDE
                </h1>

                <div className="bg-gray-50 p-8 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-serif text-[#01321F] mb-6">Size Chart</h2>

                    <div className="overflow-x-auto mb-12">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#01321F] text-white">
                                <tr>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Size</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Chest (cm)</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Chest (inches)</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Length (cm)</th>
                                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Length (inches)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">S</td>
                                    <td className="px-6 py-4 text-center">52–54</td>
                                    <td className="px-6 py-4 text-center">20.5–21.3</td>
                                    <td className="px-6 py-4 text-center">74–76</td>
                                    <td className="px-6 py-4 text-center">29–30</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">M</td>
                                    <td className="px-6 py-4 text-center">54–57</td>
                                    <td className="px-6 py-4 text-center">21.3–22.5</td>
                                    <td className="px-6 py-4 text-center">75–77</td>
                                    <td className="px-6 py-4 text-center">29.5–30.3</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">L</td>
                                    <td className="px-6 py-4 text-center">57–60</td>
                                    <td className="px-6 py-4 text-center">22.5–23.6</td>
                                    <td className="px-6 py-4 text-center">76–78</td>
                                    <td className="px-6 py-4 text-center">30–30.7</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">XL</td>
                                    <td className="px-6 py-4 text-center">60–63</td>
                                    <td className="px-6 py-4 text-center">23.6–24.8</td>
                                    <td className="px-6 py-4 text-center">77–79</td>
                                    <td className="px-6 py-4 text-center">30.3–31.1</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">XXL</td>
                                    <td className="px-6 py-4 text-center">63–66</td>
                                    <td className="px-6 py-4 text-center">24.8–26.0</td>
                                    <td className="px-6 py-4 text-center">78–80</td>
                                    <td className="px-6 py-4 text-center">30.7–31.5</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-[#01321F] text-center border-r border-gray-100">XXXL</td>
                                    <td className="px-6 py-4 text-center">66–69</td>
                                    <td className="px-6 py-4 text-center">26.0–27.2</td>
                                    <td className="px-6 py-4 text-center">79–82</td>
                                    <td className="px-6 py-4 text-center">31.1–32.3</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mt-8">
                        <div>
                            <h2 className="text-2xl font-serif text-[#01321F] mb-6">How to Measure</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-[#01321F] mb-2 border-b border-gray-200 pb-2">Chest:</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Measure around the fullest part of your chest, keeping the tape horizontal.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-[#01321F] mb-2 border-b border-gray-200 pb-2">Length:</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Measure from the top of the shoulder down to where you want the garment to fall.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded border border-gray-200 h-fit">
                            <h3 className="text-lg font-medium text-[#01321F] mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Note:
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                This is a general guide and sizes may vary by style. Always check the specific product's size chart for accuracy if available.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ShippingPolicyPage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#000000] py-20 text-center px-4">
                    <h1 className="font-lush text-4xl md:text-6xl mb-6 text-[#ffffff]">
                        Shipping Policy
                    </h1>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 leading-relaxed space-y-12">

                    {/* Intro */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide">
                            Welcome to Dariza Fabrics
                        </h2>
                        <p className="font-light text-lg text-gray-700">
                            We at Dariza Fabrics, understand the importance of delivering your products in the finest condition and on time. Therefore, we have partnered with some of the most reputed courier partners in this country to seamlessly deliver your products in the best possible duration.
                        </p>
                    </div>

                    {/* DELIVERY Section */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-lush text-black mb-6 border-b border-gray-200 pb-2">
                            DELIVERY
                        </h2>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">How does the delivery process work?</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li>Once you have placed an order on our website, our system starts processing your order almost immediately.</li>
                                <li>Next, your item is passed through a quality check before handing over to the courier partner.</li>
                                <li>Your item is packed securely and handed over to our trusted delivery partners.</li>
                                <li>Then, your item is shipped to your location.</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">What is the estimated delivery time?</h3>
                            <p className="text-gray-700">
                                We religiously aim to ship the products as soon as possible so that it reaches you within <strong>9 to 12 working days</strong>.
                            </p>
                            <div className="bg-gray-50 p-4 rounded text-sm text-gray-600">
                                <p>
                                    <strong>Please note:</strong> In a few cases there might be some delays due to dependencies at various levels. During festivals, adverse weather conditions or political crisis, your shipment may get further delayed due to dependency on courier companies. We assure you that we will try our best to have the product delivered to you in the best time and we truly appreciate your patience.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* DOMESTIC SHIPPING Section */}
                    <section className="space-y-8">
                        <h2 className="text-3xl font-lush text-black mb-6 border-b border-gray-200 pb-2">
                            DOMESTIC SHIPPING
                        </h2>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">Do you provide shipping all over India?</h3>
                            <p className="text-gray-700">Yes.</p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">Which locations do you ship your products?</h3>
                            <p className="text-gray-700">
                                Dariza Fabrics ships throughout India so you can receive your order in any corner of the country within the confines of your home.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">Do you provide a Cash on Delivery method?</h3>
                            <p className="text-gray-700">
                                We do not provide COD as of now.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">How are orders packaged?</h3>
                            <p className="text-gray-700">
                                We go an extra mile to make sure you receive your order in top-notch condition. Each item is wrapped in sturdy packaging so that it stays free from any physical damage.
                            </p>
                            <p className="text-gray-700 italic">
                                So far, Dariza Fabrics has received minimal complaints about damaged items due to packaging.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-black uppercase tracking-wide">Can I modify the shipping address of my order after it has been placed?</h3>
                            <p className="text-gray-700">
                                Yes, you can change the shipping address <strong>before</strong> we have processed (shipped) your order, by mailing us on — <a href="mailto:info@darizafabrics.com" className="underline hover:text-black font-medium">info@darizafabrics.com</a> or WhatsApp our customer support team at <a href="https://api.whatsapp.com/send/?phone=919055569991" className="underline hover:text-black font-medium">+91-9055569991</a>.
                            </p>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}

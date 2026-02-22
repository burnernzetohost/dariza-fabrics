'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CancellationExchangePage() {
    return (
        <main className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <div className="flex-grow">
                {/* Header Section */}
                <div className="bg-[#000000] py-20 text-center px-4">
                    <h1 className="font-lush text-4xl md:text-6xl mb-6 text-[#ffffff]">
                        Cancellation & Exchange Policy
                    </h1>
                </div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto px-4 py-16 text-gray-800 leading-relaxed space-y-12">

                    {/* Intro */}
                    <div className="space-y-4">
                        <p className="font-serif italic text-xl text-gray-600">
                            Dariza Fabrics follows a friendly policy to ensure your purchases are free of stress. We offer a “100% Buyer Protection Program” for our valued customers. We are always with you, before and after your purchase.
                        </p>
                    </div>

                    {/* Size Exchange Section */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            Size Exchange
                        </h2>
                        <p>
                            At Dariza fabrics, we confirm your size before dispatching any product. However, if the customer still has any size issue with the product later, then he/she needs to mail us within <strong>48 hrs</strong> from the date of delivery of the parcel. The customer will have to courier the product in good condition on the company address and also pay <strong>200 rs</strong> for the exchange (re-shipping fee).
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Exchange is allowed on size issues only.</li>
                            <li>Exchange will not be issued on product exchange.</li>
                            <li>All purchases made on offers and discounts are non-exchangeable.</li>
                        </ul>
                    </section>

                    {/* Returns Section */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            Return
                        </h2>
                        <p>
                            We don’t take returns on items sold once.
                        </p>
                    </section>

                    {/* Damaged/Wrong Delivery */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            Damaged / Wrong Delivery
                        </h2>
                        <p>
                            If it’s a damaged/defective product, incorrect item sent, we will replace the product with the next fastest possible courier facility and also arrange for reverse pick up facility from our side.
                        </p>
                    </section>

                    {/* When Exchange is not accepted */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            When Exchange is not accepted?
                        </h2>
                        <ul className="list-disc pl-5 space-y-4 text-gray-700">
                            <li>
                                <strong>Colour Difference:</strong> Exchange not accepted due to colour Difference. 10% Colour difference might be there due to screen resolution and lights.
                            </li>
                            <li>
                                <strong>Dislike of Material/Color:</strong> Exchanges are not accepted if Customer does not like the material or colour of the product order. As we use the best quality material in the market and all product details are mentioned in the Product description. We would suggest you please read all the details before placing the order.
                            </li>
                            <li>
                                <strong>Customized Items:</strong> Exchanges are not accepted if the piece is specially customised for the customer.
                            </li>
                        </ul>
                    </section>

                    {/* CANCELLATIONS / REFUND */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-serif text-black font-bold uppercase tracking-wide border-b border-gray-200 pb-2">
                            Cancellations / Refund
                        </h2>
                        <p className="font-medium text-black">
                            No, you can’t cancel the parcel once the order has been placed. Also, no refund will be provided once order is placed.
                        </p>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}

// app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromoStrip from "@/components/PromoStrip";
import Collections from "@/components/Collections";
import WinterSale from "@/components/WinterSale";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#DCf9f1]">
      <Navbar />
      <Hero />
      <PromoStrip />
      <Collections />
      <WinterSale />
      <NewArrivals />

      <Footer />
    </main>
  );
}
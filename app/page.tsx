// app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PromoStrip from "@/components/PromoStrip";
import Collections from "@/components/Collections";
import WinterSale from "@/components/WinterSale";
import NewArrivals from "@/components/NewArrivals";
import Footer from "@/components/Footer";
import pool from "@/lib/db";

export const revalidate = 3600; // 1 hour static cache

async function getHeroImages() {
  try {
    const result = await pool.query('SELECT image_url FROM hero_images ORDER BY display_order ASC');
    return result.rows.map(row => row.image_url);
  } catch (error) {
    console.error('Error fetching hero images on server:', error);
    return [];
  }
}

export default async function Home() {
  const heroImages = await getHeroImages();

  return (
    <main className="min-h-screen bg-[#DCf9f1]">
      <Navbar />
      <Hero initialImages={heroImages} />
      <PromoStrip />
      <Collections />
      <WinterSale />
      <NewArrivals />

      <Footer />
    </main>
  );
}
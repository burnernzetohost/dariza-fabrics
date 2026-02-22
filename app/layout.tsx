import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter'
});

// 1. Load the REGULAR version
const lushRegular = localFont({
  src: './fonts/LushRefinementREGULAR.ttf',
  variable: '--font-lush-reg',
  weight: '400', // Added weight to ensure stability
  display: 'swap',
});

// 2. Load the SCRIPT version
const lushScript = localFont({
  src: './fonts/LushRefinementSCRIPT.ttf',
  variable: '--font-lush-script',
  weight: '400', // Added weight to ensure stability
  display: 'swap',
});

const swirl = localFont({
  src: './fonts/swirl.woff2',
  variable: '--font-lswirl',
  weight: '400', // Added weight to ensure stability
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Darzia Fabrics | Authentic Kashmiri Shawls, Sarees & Coats",
  description: "Explore our exclusive range of timeless Kashmiri Elegance, premium sarees, and warm coats. Authentic Darzia design.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.darziafabrics.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Darzia Fabrics',
    title: 'Darzia Fabrics | Authentic Kashmiri Styles',
    description: 'Fresh New Arrivals of premium handcrafted material.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darzia Fabrics',
    description: 'Authentic Kashmiri Shawls, Sarees & Coats',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      {/* CRITICAL CHECK:
         Ensure these variables match exactly what is in your tailwind.config.ts 
      */}
      <body className={`${inter.variable} ${lushRegular.variable} ${lushScript.variable} ${swirl.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>

        {/* Global Google Analytics Setup */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TRACKING-ID" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TRACKING-ID');
            `
          }}
        />
      </body>
    </html>
  );
}
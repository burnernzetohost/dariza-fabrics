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
  title: "DARZIA FABRICS",
  description: "Fresh New Arrivals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* CRITICAL CHECK:
         Ensure these variables match exactly what is in your tailwind.config.ts 
      */}
      <body className={`${inter.variable} ${lushRegular.variable} ${lushScript.variable} ${swirl.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
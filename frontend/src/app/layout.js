import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Credloom - Decentralized Micro-Lending",
  description: "Privacy-first lending marketplace powered by AI credit scoring and blockchain escrow",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

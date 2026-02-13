import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Navbar from '@/components/Navbar';
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#ffffff',
          colorBackground: '#000000',
          colorInputBackground: '#09090b',
          colorInputText: '#ffffff',
          colorText: '#ffffff',
          colorTextSecondary: '#71717a',
          colorDanger: '#ef4444',
          borderRadius: '0.5rem',
        },
        elements: {
          rootBox: 'w-full',
          card: 'bg-black border border-zinc-800 shadow-2xl',
          headerTitle: 'text-white font-bold',
          headerSubtitle: 'text-zinc-500',
          socialButtonsBlockButton: 'bg-zinc-950 border border-zinc-800 text-white hover:bg-zinc-900 hover:border-zinc-700 transition-colors',
          socialButtonsBlockButtonText: 'text-white font-medium',
          formButtonPrimary: 'bg-white text-black font-semibold hover:bg-zinc-200 transition-colors',
          formFieldLabel: 'text-white font-medium',
          formFieldInput: 'bg-zinc-950 border-zinc-800 text-white focus:border-zinc-700 transition-colors',
          formFieldInputShowPasswordButton: 'text-zinc-500 hover:text-white',
          footerActionLink: 'text-white hover:text-zinc-300 font-medium',
          footerActionText: 'text-zinc-500',
          identityPreviewText: 'text-white',
          identityPreviewEditButton: 'text-white hover:text-zinc-300',
          formResendCodeLink: 'text-white hover:text-zinc-300',
          otpCodeFieldInput: 'bg-zinc-950 border-zinc-800 text-white',
          dividerLine: 'bg-zinc-800',
          dividerText: 'text-zinc-600',
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

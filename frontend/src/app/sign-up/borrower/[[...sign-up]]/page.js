"use client";

import { SignUp } from "@clerk/nextjs";
import { WavyBackground } from "@/components/wavy-background";
export default function BorrowerSignUpPage() {
  return (
    <WavyBackground
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      backgroundFill="black"
      blur={10}
      speed="slow"
      waveOpacity={0.5}
      // We use flexbox to perfectly center the sign-in card inside the available space.
      containerClassName="h-full flex items-center justify-center p-4"
    >
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black pt-24">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Join as a Borrower
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Access micro-loans with privacy and transparency
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Privacy-First Lending</h3>
                <p className="text-zinc-500 text-sm">Your data stays encrypted and under your control</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">AI Credit Scoring</h3>
                <p className="text-zinc-500 text-sm">Fair assessment based on your complete financial picture</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Blockchain Escrow</h3>
                <p className="text-zinc-500 text-sm">Trustless loan disbursement and repayment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Clerk SignUp */}
        <div className="flex-1 w-full max-w-md">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl",
              },
            }}
            unsafeMetadata={{
              userType: "borrower"
            }}
            afterSignUpUrl="/borrower"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
    </WavyBackground>
  );
}

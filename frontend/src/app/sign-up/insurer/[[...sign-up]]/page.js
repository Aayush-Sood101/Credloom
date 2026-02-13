"use client";

import { SignUp } from "@clerk/nextjs";

export default function InsurerSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black pt-24">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Join as an Insurer
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Provide coverage and earn premiums
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Risk Diversification</h3>
                <p className="text-zinc-500 text-sm">Underwrite multiple loans across risk tiers</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Premium Collection</h3>
                <p className="text-zinc-500 text-sm">Automated premium payments via smart contracts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Transparent Claims</h3>
                <p className="text-zinc-500 text-sm">On-chain claim verification and settlement</p>
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
              userType: "insurer"
            }}
            afterSignUpUrl="/insurer"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}

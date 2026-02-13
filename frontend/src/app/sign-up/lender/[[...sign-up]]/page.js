"use client";

import { SignUp } from "@clerk/nextjs";

export default function LenderSignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black pt-24">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Join as a Lender
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Provide liquidity and earn competitive returns
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Transparent Returns</h3>
                <p className="text-zinc-500 text-sm">Clear interest rates and repayment schedules</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Risk-Based Portfolio</h3>
                <p className="text-zinc-500 text-sm">Choose borrowers based on AI-verified credit scores</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-black text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Insurance Options</h3>
                <p className="text-zinc-500 text-sm">Optional coverage to protect your investments</p>
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
              userType: "lender"
            }}
            afterSignUpUrl="/lender"
            signInUrl="/sign-in"
          />
        </div>
      </div>
    </div>
  );
}

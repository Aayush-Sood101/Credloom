"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { WavyBackground } from "@/components/wavy-background";


export default function SignInPage() {
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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white">Credloom</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Welcome Back
          </h1>
          <p className="text-zinc-400 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-zinc-950 border border-zinc-800 shadow-xl",
              },
            }}
            signUpUrl="/sign-up/borrower"
            afterSignInUrl="/dashboard"
            routing="path"
          />
        </div>

        
      </div>
      </div>
      </WavyBackground>
  );
}

"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to home</span>
        </Link>

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

        {/* Sign Up Links */}
        <div className="mt-8 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <p className="text-sm text-zinc-400 text-center mb-3">Don&apos;t have an account? Sign up as:</p>
          <div className="flex flex-col gap-2">
            <Link 
              href="/sign-up/borrower"
              className="text-sm text-center text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Borrower
            </Link>
            <Link 
              href="/sign-up/lender"
              className="text-sm text-center text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Lender
            </Link>
            <Link 
              href="/sign-up/insurer"
              className="text-sm text-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              Insurer
            </Link>
          </div>
        </div>
      </div>
      </div>
  );
}

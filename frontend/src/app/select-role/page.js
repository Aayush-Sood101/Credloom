"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Shield, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SelectRole() {
  const { user } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleSelect = async (role) => {
    setIsUpdating(true);
    
    try {
      // Update user metadata with selected role
      await user.update({
        unsafeMetadata: {
          userType: role
        }
      });

      // Redirect to appropriate dashboard
      router.push(`/${role}`);
    } catch (error) {
      console.error("Error updating role:", error);
      setIsUpdating(false);
    }
  };

  if (isUpdating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold">Credloom</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-zinc-400 text-lg">
            Select how you want to participate in the marketplace
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Borrower */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Borrower</h2>
            <p className="text-zinc-400 mb-6">
              Access micro-loans based on your reputation and on-chain behavior. Build credit through successful repayments.
            </p>
            <ul className="text-sm text-zinc-400 space-y-2 mb-6">
              <li>• Privacy-protected verification</li>
              <li>• AI-based credit scoring</li>
              <li>• Flexible loan terms</li>
              <li>• Rebuild credit on-chain</li>
            </ul>
            <button
              onClick={() => handleRoleSelect("borrower")}
              className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Borrower
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lender */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all group">
            <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Lender</h2>
            <p className="text-zinc-400 mb-6">
              Provide liquidity and earn interest. Set your own risk parameters and let the system match you with borrowers.
            </p>
            <ul className="text-sm text-zinc-400 space-y-2 mb-6">
              <li>• Auto-matched lending</li>
              <li>• Customizable risk settings</li>
              <li>• Smart contract protection</li>
              <li>• Optional insurance coverage</li>
            </ul>
            <button
              onClick={() => handleRoleSelect("lender")}
              className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Lender
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Insurer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Insurer</h2>
            <p className="text-zinc-400 mb-6">
              Offer risk coverage and earn premiums. Protect lenders from defaults while building a sustainable insurance pool.
            </p>
            <ul className="text-sm text-zinc-400 space-y-2 mb-6">
              <li>• Premium earnings</li>
              <li>• Risk-based selection</li>
              <li>• Automated payouts</li>
              <li>• Coverage customization</li>
            </ul>
            <button
              onClick={() => handleRoleSelect("insurer")}
              className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              Continue as Insurer
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          You can change your role later in your account settings
        </p>
      </div>
    </div>
  );
}

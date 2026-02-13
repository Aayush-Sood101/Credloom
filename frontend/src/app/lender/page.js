"use client";

import { useUser } from "@clerk/nextjs";
import { Shield, DollarSign, Users, TrendingUp } from "lucide-react";

export default function LenderDashboard() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold">Credloom</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <span className="text-sm text-zinc-300">Lender</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Lender Dashboard
          </h1>
          <p className="text-zinc-400">
            Manage your lending portfolio and earn interest
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-zinc-400">Total Lent</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-zinc-400">Total Earned</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-zinc-400">Active Loans</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-zinc-400">Escrowed</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-400">Lender dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useUser } from "@clerk/nextjs";
import { Shield, DollarSign, Activity, TrendingUp } from "lucide-react";

export default function InsurerDashboard() {
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
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm text-zinc-300">Insurer</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Insurer Dashboard
          </h1>
          <p className="text-zinc-400">
            Manage your insurance portfolio and track premiums
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-zinc-400">Total Coverage</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-zinc-400">Premiums Earned</span>
            </div>
            <div className="text-2xl font-bold">$0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-zinc-400">Active Policies</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-zinc-400">Claims Paid</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-400">Insurer dashboard coming soon...</p>
        </div>
      </div>
    </div>
  );
}

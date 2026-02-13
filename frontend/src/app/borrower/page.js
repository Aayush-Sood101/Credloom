"use client";

import { useUser } from "@clerk/nextjs";
import { Shield, TrendingUp, Wallet, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function BorrowerDashboard() {
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
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-sm text-zinc-300">Borrower</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.firstName || "Borrower"}!
          </h1>
          <p className="text-zinc-400">
            Complete your onboarding to start borrowing
          </p>
        </div>

        {/* Onboarding Alert */}
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Complete Your Onboarding</h3>
              <p className="text-zinc-400 mb-4">
                You need to complete verification and stake locking before you can apply for loans.
              </p>
              <Link
                href="/borrower/onboarding"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
              >
                Start Onboarding
                <TrendingUp className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-zinc-400">Wallet Balance</span>
            </div>
            <div className="text-2xl font-bold">--</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-zinc-400">Credit Score</span>
            </div>
            <div className="text-2xl font-bold">--</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-zinc-400">Staked Amount</span>
            </div>
            <div className="text-2xl font-bold">--</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-zinc-400">Active Loans</span>
            </div>
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/borrower/onboarding"
              className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all"
            >
              <h3 className="font-semibold mb-2">Complete Onboarding</h3>
              <p className="text-sm text-zinc-400">Set up your borrower profile</p>
            </Link>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Browse Loans</h3>
              <p className="text-sm text-zinc-400">Complete onboarding first</p>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Manage Stake</h3>
              <p className="text-sm text-zinc-400">Complete onboarding first</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

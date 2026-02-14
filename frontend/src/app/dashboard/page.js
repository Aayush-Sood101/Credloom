"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Tier2Verification from "@/components/auth/Tier2Verification";
import Tier3Verification from "@/components/auth/Tier3Verification";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

function DashboardContent() {
  const { user, tierStatus, role, loading, refreshTierStatus } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      refreshTierStatus();
    }
  }, [user, loading, refreshTierStatus]);

  if (loading || !tierStatus) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const getTierBadgeColor = (tier) => {
    const colors = {
      1: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
      2: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
      3: 'bg-green-500/10 border-green-500/20 text-green-500',
    };
    return colors[tier] || colors[1];
  };

  const getTierName = (tier) => {
    const names = { 1: 'Basic', 2: 'ENS Verified', 3: 'Passport Verified' };
    return names[tier] || 'Basic';
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.username}!</h1>
          <p className="text-gray-400">
            {role && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 border border-blue-500/20 text-blue-400 mr-2">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </span>
            )}
            Manage your Credloom account and tier status
          </p>
        </div>

        {/* Tier Status Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Account Status</h2>
                <p className="text-gray-400">Account information and verification status</p>
              </div>
            </div>
            {tierStatus.tier && (
              <div className={`px-4 py-2 rounded-lg border ${getTierBadgeColor(tierStatus.tier)}`}>
                <span className="font-semibold">Tier {tierStatus.tier}: {getTierName(tierStatus.tier)}</span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Username</span>
              </div>
              <p className="text-lg font-semibold">{tierStatus.username}</p>
            </div>
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Wallet Address</span>
              </div>
              <p className="text-lg font-mono text-sm">{tierStatus.wallet}</p>
            </div>
          </div>

          {/* Tier 2 Status - Only for borrowers */}
          {role === 'borrower' && tierStatus.tier && (
            <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Tier 2: ENS Verification</h3>
                  <p className="text-sm text-gray-400">
                    {tierStatus.tier2?.ens_verified 
                      ? `Verified with ENS: ${tierStatus.tier2.ens_name}`
                      : 'Not verified - verify to unlock better loan terms'}
                  </p>
                </div>
                {tierStatus.tier2?.ens_verified ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
          )}

          {/* Tier 3 Status - Only for borrowers */}
          {role === 'borrower' && tierStatus.tier && (
            <div className="bg-black border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Tier 3: Passport Verification</h3>
                  <p className="text-sm text-gray-400">
                    {tierStatus.tier3?.passport_verified === true 
                      ? `Verified (Score: ${tierStatus.tier3.score})`
                      : tierStatus.tier3?.passport_verified === false
                      ? `Not verified (Score: ${tierStatus.tier3.score} / Threshold: ${tierStatus.tier3.threshold})`
                      : 'Not attempted - verify for best rates'}
                  </p>
                </div>
                {tierStatus.tier3?.passport_verified === true ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : tierStatus.tier3?.passport_verified === false ? (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Verification Forms - Only for borrowers with tier system */}
        {role === 'borrower' && tierStatus.tier && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Tier 2 Verification - Only for borrowers */}
            {!tierStatus.tier2?.ens_verified && (
              <Tier2Verification />
            )}
            
            {/* Tier 3 Verification - Only for borrowers (requires Tier 2 first) */}
            {tierStatus.tier2?.ens_verified && (
              <Tier3Verification />
            )}
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/borrower"
              className="p-4 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              <h3 className="font-semibold mb-1">Borrower Dashboard</h3>
              <p className="text-sm text-gray-400">View and manage loans</p>
            </Link>
            <Link
              href="/lender"
              className="p-4 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              <h3 className="font-semibold mb-1">Lender Dashboard</h3>
              <p className="text-sm text-gray-400">Manage lending portfolio</p>
            </Link>
            <Link
              href="/insurer"
              className="p-4 bg-black hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors"
            >
              <h3 className="font-semibold mb-1">Insurer Dashboard</h3>
              <p className="text-sm text-gray-400">Manage insurance coverage</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardRedirect() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

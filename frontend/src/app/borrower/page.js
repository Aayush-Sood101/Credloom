'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getBorrowerLoans } from '@/lib/api/borrower';
import Tier2Verification from '@/components/auth/Tier2Verification';
import Tier3Verification from '@/components/auth/Tier3Verification';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  AlertCircle, 
  Calendar,
  Clock,
  ChevronRight,
  Info,
  ArrowUp,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function BorrowerDashboard() {
  const { user, tierStatus, loading, refreshTierStatus } = useAuth();
  
  // Fetch tier status on mount
  useEffect(() => {
    if (user && !loading) {
      refreshTierStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  // Real loans data from API
  const [loansData, setLoansData] = useState({ loans: [], total: 0 });
  const [loansLoading, setLoansLoading] = useState(true);
  const [loansError, setLoansError] = useState(null);

  // Fetch borrower loans
  useEffect(() => {
    const fetchLoans = async () => {
      if (!user) return;
      
      try {
        setLoansLoading(true);
        const response = await getBorrowerLoans();
        console.log('[Dashboard] Loans response:', response);
        setLoansData(response);
      } catch (error) {
        console.error('[Dashboard] Error fetching loans:', error);
        setLoansError(error.message || 'Failed to fetch loans');
      } finally {
        setLoansLoading(false);
      }
    };

    fetchLoans();
  }, [user]);

  const getTierBadgeColor = (tier) => {
    const colors = {
      1: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      2: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      3: 'bg-green-500/10 border-green-500/20 text-green-400',
    };
    return colors[tier] || colors[1];
  };

  const getTierName = (tier) => {
    const names = { 1: 'Basic', 2: 'ENS Verified', 3: 'Passport Verified' };
    return names[tier] || 'Basic';
  };

  // Mock data - TODO: Replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    wallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      nativeBalance: '2.5',
      stakedAmount: '500',
      availableBalance: '2.0'
    },
    creditScore: {
      score: 750,
      label: 'Good',
      trend: 'up', // up, down, stable
      lastUpdated: '2026-02-10'
    },
    tier: {
      current: 'Silver',
      maxLoan: '5000',
      maxDuration: '90 days',
      rateRange: '8-12%',
      progress: 65, // % to next tier
      nextTier: 'Gold'
    },
    loans: {
      activeCount: 2,
      totalOutstanding: '3500',
      nearestDeadline: '2026-02-20',
      list: [
        {
          id: 'LOAN-001',
          amount: '2000',
          interestRate: '10%',
          duration: '60 days',
          status: 'Active',
          deadline: '2026-02-20',
          progress: 45,
          amountRepaid: '900',
          totalDue: '2200'
        },
        {
          id: 'LOAN-002',
          amount: '1500',
          interestRate: '12%',
          duration: '30 days',
          status: 'Active',
          deadline: '2026-03-05',
          progress: 20,
          amountRepaid: '300',
          totalDue: '1680'
        }
      ]
    },
    eligibility: {
      status: 'eligible', // eligible, flagged, cooldown, insufficient_stake
      maxBorrowable: '2500',
      cooldownEnd: null,
      flagReason: null
    }
  });

  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // const fetchDashboardData = async () => {
    //   const response = await fetch('/api/borrower/dashboard');
    //   const data = await response.json();
    //   setDashboardData(data);
    // };
    // fetchDashboardData();

    // Calculate countdown to nearest deadline
    const calculateCountdown = () => {
      if (dashboardData.loans.nearestDeadline) {
        const deadline = new Date(dashboardData.loans.nearestDeadline);
        const now = new Date();
        const diff = deadline - now;
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setCountdown(`${days}d ${hours}h ${minutes}m`);
        } else {
          setCountdown('Overdue');
        }
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [dashboardData.loans.nearestDeadline]);

  const getScoreColor = (score) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 650) return 'text-blue-400';
    if (score >= 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <ArrowUp className="w-4 h-4 text-red-400 rotate-180" />;
    return <div className="w-4 h-4 text-gray-400">→</div>;
  };

  const getStatusColor = (status) => {
    const colors = {
      'selected': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Repaying': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Repaid': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Defaulted': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return colors[status] || colors['Active'];
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Borrower Dashboard</h1>
          <p className="text-gray-400">Manage your loans and credit profile</p>
        </div>

        {/* Tier Upgrade Call-to-Action Banner */}
        {tierStatus && tierStatus.tier < 3 && (
          <div className="mb-8 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <ArrowUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    {tierStatus.tier === 1 && '🚀 Upgrade to Tier 2 for Better Rates!'}
                    {tierStatus.tier === 2 && '⭐ Unlock Premium Benefits with Tier 3!'}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3">
                    {tierStatus.tier === 1 && 'Verify your ENS name to reduce interest rates by up to 2% and increase loan limits to $10,000.'}
                    {tierStatus.tier === 2 && 'Verify your Gitcoin Passport to access the best rates (up to 4% reduction) and loan limits up to $50,000.'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {tierStatus.tier === 1 && (
                      <>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Lower rates</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Higher limits</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Priority matching</span>
                        </div>
                      </>
                    )}
                    {tierStatus.tier === 2 && (
                      <>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Best rates</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Max limits</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span>Premium access</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="#tier-verification"
                  className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                >
                  Upgrade Now
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tier Status & Upgrade Section */}
        {tierStatus && (
          <div id="tier-verification" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Your Verification Tier</h2>
                  <p className="text-gray-400">Upgrade for better rates and higher loan amounts</p>
                </div>
              </div>
              {tierStatus.tier && (
                <div className={`px-4 py-2 rounded-lg border ${getTierBadgeColor(tierStatus.tier)}`}>
                  <span className="font-semibold">Tier {tierStatus.tier}: {getTierName(tierStatus.tier)}</span>
                </div>
              )}
            </div>

            {/* Tier Progress Path */}
            <div className="mb-6 bg-black border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                {[1, 2, 3].map((tier) => (
                  <div key={tier} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        tierStatus.tier >= tier 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : tierStatus.tier === tier - 1
                          ? 'bg-zinc-800 border-blue-500 text-blue-400 animate-pulse'
                          : 'bg-zinc-800 border-zinc-700 text-gray-500'
                      }`}>
                        {tierStatus.tier >= tier ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <span className="font-bold">{tier}</span>
                        )}
                      </div>
                      <p className={`text-xs mt-2 font-medium ${
                        tierStatus.tier >= tier ? 'text-green-400' : 
                        tierStatus.tier === tier - 1 ? 'text-blue-400' : 'text-gray-500'
                      }`}>
                        {getTierName(tier)}
                      </p>
                    </div>
                    {tier < 3 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        tierStatus.tier >= tier + 1 ? 'bg-green-500' : 'bg-zinc-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              {tierStatus.tier < 3 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    {tierStatus.tier === 1 && 'Complete ENS verification to unlock Tier 2'}
                    {tierStatus.tier === 2 && 'Complete Passport verification to unlock Tier 3'}
                  </p>
                </div>
              )}
            </div>

            {/* Tier Status Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Tier Benefits Comparison */}
              <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-lg p-4 mb-2">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Tier Benefits Comparison
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  {/* Tier 1 */}
                  <div className={`p-3 rounded-lg border ${tierStatus.tier === 1 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-zinc-900 border-zinc-700'}`}>
                    <p className="font-semibold text-blue-400 mb-2">Tier 1: Basic</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Standard rates</li>
                      <li>• Up to $5,000</li>
                      <li>• Basic access</li>
                    </ul>
                  </div>
                  {/* Tier 2 */}
                  <div className={`p-3 rounded-lg border ${tierStatus.tier === 2 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-zinc-900 border-zinc-700'}`}>
                    <p className="font-semibold text-purple-400 mb-2">Tier 2: ENS</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• -2% interest</li>
                      <li>• Up to $10,000</li>
                      <li>• Priority matching</li>
                    </ul>
                  </div>
                  {/* Tier 3 */}
                  <div className={`p-3 rounded-lg border ${tierStatus.tier === 3 ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-900 border-zinc-700'}`}>
                    <p className="font-semibold text-green-400 mb-2">Tier 3: Passport</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• -4% interest</li>
                      <li>• Up to $50,000</li>
                      <li>• Premium access</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tier 2 Status */}
              <div className="bg-black border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">Tier 2: ENS Verification</h3>
                    <p className="text-sm text-gray-400">
                      {tierStatus.tier >= 2 && tierStatus.tier2?.ens_verified 
                        ? `Verified${tierStatus.tier2.ens_name ? ` with ENS: ${tierStatus.tier2.ens_name}` : ''}`
                        : 'Verify your ENS name for better loan terms'}
                    </p>
                  </div>
                  {tierStatus.tier >= 2 && tierStatus.tier2?.ens_verified ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-600 flex-shrink-0" />
                  )}
                </div>
                {(tierStatus.tier < 2 || !tierStatus.tier2?.ens_verified) && (
                  <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <p className="text-xs text-purple-300 mb-1">✨ Benefits:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Lower interest rates (up to 2% reduction)</li>
                      <li>• Higher loan limits (up to $10,000)</li>
                      <li>• Priority loan matching</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Tier 3 Status */}
              <div className="bg-black border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">Tier 3: Passport Verification</h3>
                    <p className="text-sm text-gray-400">
                      {tierStatus.tier >= 3 && tierStatus.tier3?.passport_verified === true 
                        ? `Verified (Score: ${tierStatus.tier3.score})`
                        : tierStatus.tier3?.score !== null
                        ? `Score: ${tierStatus.tier3.score} / Required: ${tierStatus.tier3.threshold}`
                        : tierStatus.tier >= 2
                        ? 'Verify your Gitcoin Passport for best rates'
                        : 'Complete Tier 2 first to unlock'}
                    </p>
                  </div>
                  {tierStatus.tier >= 3 && tierStatus.tier3?.passport_verified === true ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : tierStatus.tier3?.score !== null && tierStatus.tier3?.passport_verified === false ? (
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-600 flex-shrink-0" />
                  )}
                </div>
                {(tierStatus.tier < 3 || tierStatus.tier3?.passport_verified !== true) && tierStatus.tier >= 2 && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-300 mb-1">🌟 Premium Benefits:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Best interest rates (up to 4% reduction)</li>
                      <li>• Maximum loan limits (up to $50,000)</li>
                      <li>• Premium lender access</li>
                      <li>• Flexible repayment terms</li>
                    </ul>
                  </div>
                )}
                {tierStatus.tier < 2 && (
                  <div className="mt-3 p-3 bg-zinc-800 border border-zinc-700 rounded-lg">
                    <p className="text-xs text-gray-400">
                      Complete Tier 2 verification to unlock Tier 3
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Forms - Show based on current tier */}
            <div className="space-y-6">
              {/* Tier 2 Verification - Show if not at Tier 2 yet */}
              {(tierStatus.tier < 2 || !tierStatus.tier2?.ens_verified) && (
                <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border border-purple-500/20 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-purple-400 mb-2">🚀 Upgrade to Tier 2</h3>
                    <p className="text-gray-300 text-sm">
                      Verify your ENS name to unlock better loan terms and higher limits.
                    </p>
                  </div>
                  <Tier2Verification />
                </div>
              )}
              
              {/* Tier 3 Verification - Show if at Tier 2 or above, but not Tier 3 */}
              {(tierStatus.tier >= 2 && tierStatus.tier2?.ens_verified) && 
               (tierStatus.tier < 3 || tierStatus.tier3?.passport_verified !== true) && (
                <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-lg p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-green-400 mb-2">⭐ Upgrade to Tier 3</h3>
                    <p className="text-gray-300 text-sm mb-2">
                      Verify your Gitcoin Passport to access premium features and the best rates.
                    </p>
                    {tierStatus.tier3?.score !== null && (
                      <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-1 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300">
                          Current Score: {tierStatus.tier3.score} / Required: {tierStatus.tier3.threshold}
                        </span>
                      </div>
                    )}
                  </div>
                  <Tier3Verification />
                </div>
              )}

              {/* All verified message - Only show when fully verified at Tier 3 */}
              {tierStatus.tier >= 3 && tierStatus.tier2?.ens_verified && tierStatus.tier3?.passport_verified === true && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">Fully Verified! 🎉</h3>
                  <p className="text-gray-300 mb-4">
                    You&apos;ve unlocked all premium benefits and have access to the best rates on Credloom.
                  </p>
                  <Link
                    href="/borrower/marketplace"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Browse Premium Loans
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Eligibility Banner */}
        <div className="mb-8">
          {dashboardData.eligibility.status === 'eligible' && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-1">You&apos;re Eligible to Borrow!</h3>
                  <p className="text-gray-300">
                    Maximum borrowable amount: <span className="font-bold">${dashboardData.eligibility.maxBorrowable} USDC</span>
                  </p>
                </div>
                <Link
                  href="/borrower/marketplace"
                  className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  Apply for Loan
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}

          {dashboardData.eligibility.status === 'flagged' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-1">Account Flagged</h3>
                  <p className="text-gray-300">Your account is flagged due to default. Borrowing is suspended.</p>
                </div>
              </div>
            </div>
          )}

          {dashboardData.eligibility.status === 'insufficient_stake' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-1">Insufficient Stake</h3>
                    <p className="text-gray-300">Top up your stake to unlock borrowing</p>
                  </div>
                </div>
                <Link
                  href="/borrower/stake"
                  className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Add Stake
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Info Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold">Wallet</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm font-mono">
                  {dashboardData.wallet.address.slice(0, 6)}...{dashboardData.wallet.address.slice(-4)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Balance</p>
                <p className="text-lg font-bold">{dashboardData.wallet.nativeBalance} ETH</p>
              </div>
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Staked</span>
                  <span className="font-semibold">${dashboardData.wallet.stakedAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available</span>
                  <span className="font-semibold">{dashboardData.wallet.availableBalance} ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Score Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold">Credit Score</h3>
              <button className="ml-auto text-gray-400 hover:text-white transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className={`text-4xl font-bold ${getScoreColor(dashboardData.creditScore.score)}`}>
                  {dashboardData.creditScore.score}
                </p>
                <p className="text-sm text-gray-400 mt-1">{dashboardData.creditScore.label}</p>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {getTrendIcon(dashboardData.creditScore.trend)}
                <span className="text-xs text-gray-400">
                  {dashboardData.creditScore.trend === 'up' ? 'Improving' : 
                   dashboardData.creditScore.trend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Last updated: {new Date(dashboardData.creditScore.lastUpdated).toLocaleDateString()}
            </p>
          </div>

          {/* Tier Badge Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-semibold">Current Tier</h3>
            </div>
            <div className="mb-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg mb-3">
                <p className="text-lg font-bold">{dashboardData.tier.current}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Loan</span>
                  <span className="font-semibold">${dashboardData.tier.maxLoan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Duration</span>
                  <span className="font-semibold">{dashboardData.tier.maxDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rate Range</span>
                  <span className="font-semibold">{dashboardData.tier.rateRange}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress to {dashboardData.tier.nextTier}</span>
                <span>{dashboardData.tier.progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500"
                  style={{ width: `${dashboardData.tier.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Loans Summary Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold">Active Loans</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold">{loansData.total}</p>
                <p className="text-sm text-gray-400">Total loans</p>
              </div>
              {loansLoading && (
                <div className="pt-4 border-t border-zinc-800">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {loansError && (
                <div className="pt-4 border-t border-zinc-800">
                  <p className="text-xs text-red-400">{loansError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Loans Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Loans</h2>
          </div>

          {loansLoading && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading your loans...</p>
            </div>
          )}

          {loansError && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-400">{loansError}</p>
            </div>
          )}

          {!loansLoading && !loansError && loansData.loans.length > 0 && (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Loan ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Principal</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Lender</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loansData.loans.map((loan) => (
                      <tr 
                        key={loan.loan_id}
                        className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/borrower/loan/${loan.loan_id}`}
                      >
                        <td className="py-4 px-4">
                          <p className="font-mono text-sm">{loan.loan_id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-semibold">${loan.principal}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-400">{loan.duration_days} days</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                            {loan.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-400">Lender #{loan.lender_id}</p>
                        </td>
                        <td className="py-4 px-4">
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {loansData.loans.map((loan) => (
                  <Link
                    key={loan.loan_id}
                    href={`/borrower/loan/${loan.loan_id}`}
                    className="block bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-mono text-sm font-semibold">{loan.loan_id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Principal</p>
                        <p className="font-semibold">${loan.principal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-semibold">{loan.duration_days} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Lender</p>
                        <p className="text-sm">#{loan.lender_id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Borrower</p>
                        <p className="text-sm">#{loan.borrower_id}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!loansLoading && !loansError && loansData.loans.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No loans yet</p>
              <Link
                href="/borrower/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Apply for Your First Loan
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

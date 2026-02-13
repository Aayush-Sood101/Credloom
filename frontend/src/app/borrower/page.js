'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ExternalLink
} from 'lucide-react';

export default function BorrowerDashboard() {
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
                <p className="text-3xl font-bold">{dashboardData.loans.activeCount}</p>
                <p className="text-sm text-gray-400">Open loans</p>
              </div>
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Outstanding</p>
                  <p className="text-lg font-bold">${dashboardData.loans.totalOutstanding}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-gray-400">Next payment</p>
                    <p className="font-semibold text-orange-400">{countdown}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Loans Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Loans</h2>
            <Link 
              href="/borrower/loans"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Loan ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Interest</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Deadline</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.loans.list.map((loan) => (
                  <tr 
                    key={loan.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/borrower/loan/${loan.id}`}
                  >
                    <td className="py-4 px-4">
                      <p className="font-mono text-sm">{loan.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold">${loan.amount}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{loan.interestRate}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-400">{loan.duration}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm">{new Date(loan.deadline).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${loan.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{loan.progress}%</span>
                      </div>
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
            {dashboardData.loans.list.map((loan) => (
              <Link
                key={loan.id}
                href={`/borrower/loan/${loan.id}`}
                className="block bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-sm font-semibold">{loan.id}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                    {loan.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Amount</p>
                    <p className="font-semibold">${loan.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Interest</p>
                    <p className="font-semibold">{loan.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm">{loan.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Deadline</p>
                    <p className="text-sm">{new Date(loan.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{loan.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${loan.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {dashboardData.loans.list.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active loans</p>
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

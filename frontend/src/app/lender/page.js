'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Settings,
  DollarSign,
  PieChart,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function LenderDashboard() {
  // Mock data - TODO: Replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    wallet: {
      address: '0x89a7F2b1c3D4e5f6A7B8C9d0E1f2',
      escrowBalance: '15000', // Total in escrow
      availableBalance: '8000', // Available for withdrawal
      lockedBalance: '7000', // Locked in active loans
      nativeBalance: '5.2' // ETH
    },
    stats: {
      totalLent: '45000',
      activeLoans: 12,
      totalEarnings: '4250',
      averageReturn: '9.4', // percentage
      portfolioValue: '52250'
    },
    riskConfig: {
      isConfigured: true,
      minCreditScore: 650,
      maxCreditScore: 900,
      minLoanAmount: 500,
      maxLoanAmount: 5000,
      preferredDurations: [30, 60, 90],
      interestRates: {
        excellent: 8,
        good: 10,
        fair: 12
      },
      autoLending: true
    },
    recentLoans: [
      {
        id: 'LOAN-L001',
        amount: '2000',
        interestRate: '10%',
        duration: '60 days',
        status: 'Active',
        startDate: '2026-01-15',
        deadline: '2026-03-16',
        amountRepaid: '800',
        totalDue: '2200',
        progress: 36,
        borrowerScore: 750,
        isInsured: true
      },
      {
        id: 'LOAN-L002',
        amount: '1500',
        interestRate: '8%',
        duration: '30 days',
        status: 'Active',
        startDate: '2026-02-01',
        deadline: '2026-03-03',
        amountRepaid: '500',
        totalDue: '1620',
        progress: 31,
        borrowerScore: 820,
        isInsured: false
      },
      {
        id: 'LOAN-L003',
        amount: '3000',
        interestRate: '12%',
        duration: '90 days',
        status: 'Active',
        startDate: '2026-01-01',
        deadline: '2026-04-01',
        amountRepaid: '1200',
        totalDue: '3360',
        progress: 36,
        borrowerScore: 680,
        isInsured: true
      }
    ],
    performanceHistory: {
      thisMonth: {
        loansIssued: 5,
        earnings: '450',
        change: '+12%'
      },
      lastMonth: {
        loansIssued: 4,
        earnings: '380',
        change: '+8%'
      }
    }
  });

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // const fetchDashboardData = async () => {
    //   const response = await fetch('/api/lender/dashboard');
    //   const data = await response.json();
    //   setDashboardData(data);
    // };
    // fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Repaid': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Defaulted': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return colors[status] || colors['Active'];
  };

  const getScoreColor = (score) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 650) return 'text-blue-400';
    if (score >= 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Lender Dashboard</h1>
          <p className="text-gray-400">Manage your lending portfolio and maximize returns</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/lender/escrow"
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manage Escrow</h3>
                  <p className="text-sm text-gray-400">Deposit or withdraw funds</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>

          <Link
            href="/lender/configure"
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Settings className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Risk Configuration</h3>
                  <p className="text-sm text-gray-400">Set lending preferences</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Escrow Balance */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm">Escrow Balance</h3>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">${dashboardData.wallet.escrowBalance}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Available</span>
                  <span className="text-green-400">${dashboardData.wallet.availableBalance}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Locked</span>
                  <span className="text-orange-400">${dashboardData.wallet.lockedBalance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Lent */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm">Total Lent</h3>
            </div>
            <p className="text-2xl font-bold mb-1">${dashboardData.stats.totalLent}</p>
            <p className="text-xs text-gray-400">Lifetime</p>
          </div>

          {/* Active Loans */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-sm">Active Loans</h3>
            </div>
            <p className="text-2xl font-bold mb-1">{dashboardData.stats.activeLoans}</p>
            <p className="text-xs text-gray-400">Currently funded</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-sm">Total Earnings</h3>
            </div>
            <p className="text-2xl font-bold text-green-400 mb-1">${dashboardData.stats.totalEarnings}</p>
            <p className="text-xs text-gray-400">All time</p>
          </div>

          {/* Average Return */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <PieChart className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-sm">Avg Return</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-400 mb-1">{dashboardData.stats.averageReturn}%</p>
            <p className="text-xs text-gray-400">Annual rate</p>
          </div>
        </div>

        {/* Risk Configuration Status */}
        {dashboardData.riskConfig.isConfigured ? (
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="font-semibold mb-1">Risk Configuration Active</h3>
                  <p className="text-sm text-gray-400">
                    Auto-lending: <span className="text-green-400">{dashboardData.riskConfig.autoLending ? 'Enabled' : 'Disabled'}</span>
                    {' • '}
                    Credit Score Range: {dashboardData.riskConfig.minCreditScore} - {dashboardData.riskConfig.maxCreditScore}
                    {' • '}
                    Loan Range: ${dashboardData.riskConfig.minLoanAmount} - ${dashboardData.riskConfig.maxLoanAmount}
                  </p>
                </div>
              </div>
              <Link
                href="/lender/configure"
                className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors text-sm font-medium"
              >
                Edit Settings
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                <div>
                  <h3 className="font-semibold text-yellow-400 mb-1">Configure Your Lending Preferences</h3>
                  <p className="text-sm text-gray-400">
                    Set your risk tolerance and lending criteria to start earning
                  </p>
                </div>
              </div>
              <Link
                href="/lender/configure"
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Configure Now
              </Link>
            </div>
          </div>
        )}

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Loans Issued</p>
                  <p className="text-2xl font-bold">{dashboardData.performanceHistory.thisMonth.loansIssued}</p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  {dashboardData.performanceHistory.thisMonth.change}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${dashboardData.performanceHistory.thisMonth.earnings}</p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  {dashboardData.performanceHistory.thisMonth.change}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="font-semibold mb-4">Last Month</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Loans Issued</p>
                  <p className="text-2xl font-bold">{dashboardData.performanceHistory.lastMonth.loansIssued}</p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  {dashboardData.performanceHistory.lastMonth.change}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${dashboardData.performanceHistory.lastMonth.earnings}</p>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  {dashboardData.performanceHistory.lastMonth.change}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Loans Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Active Loans</h2>
            <Link 
              href="/lender/loans"
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Credit Score</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Progress</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400"></th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentLoans.map((loan) => (
                  <tr 
                    key={loan.id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/lender/loan/${loan.id}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{loan.id}</p>
                        {loan.isInsured && (
                          <Shield className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold">${loan.amount}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-green-400">{loan.interestRate}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-400">{loan.duration}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm font-semibold ${getScoreColor(loan.borrowerScore)}`}>
                        {loan.borrowerScore}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(loan.status)}`}>
                        {loan.status}
                      </span>
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
            {dashboardData.recentLoans.map((loan) => (
              <Link
                key={loan.id}
                href={`/lender/loan/${loan.id}`}
                className="block bg-zinc-800 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold">{loan.id}</p>
                    {loan.isInsured && (
                      <Shield className="w-4 h-4 text-green-400" />
                    )}
                  </div>
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
                    <p className="font-semibold text-green-400">{loan.interestRate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Duration</p>
                    <p className="text-sm">{loan.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Credit Score</p>
                    <p className={`text-sm font-semibold ${getScoreColor(loan.borrowerScore)}`}>
                      {loan.borrowerScore}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Repayment Progress</span>
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

          {dashboardData.recentLoans.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No active loans</p>
              <p className="text-sm text-gray-500">
                {dashboardData.riskConfig.isConfigured 
                  ? 'Funds will be automatically allocated when matching borrowers are found'
                  : 'Configure your risk preferences to start lending'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

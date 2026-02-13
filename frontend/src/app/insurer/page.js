'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Activity,
  Users,
  BarChart3,
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
  Wallet
} from 'lucide-react';

export default function InsurerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    wallet: {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      balance: '125000',
      network: 'Ethereum Mainnet'
    },
    poolStats: {
      totalCapital: '500000',
      deployedCapital: '280000',
      availableCapital: '220000',
      utilizationRate: '56%'
    },
    overview: {
      activePolicies: 45,
      totalPremiumIncome: '18500',
      claimsProcessed: 8,
      claimsPaid: '12000',
      averagePremium: '411',
      riskScore: 'Low'
    },
    performance: {
      thisMonth: {
        premiums: '5200',
        claims: '2400',
        netIncome: '2800',
        newPolicies: 12
      },
      lastMonth: {
        premiums: '4800',
        claims: '1800',
        netIncome: '3000',
        newPolicies: 10
      }
    },
    activePolicies: [
      {
        policyId: 'POL-001',
        loanId: 'LOAN-001',
        borrowerTier: 'Gold',
        creditScore: 780,
        loanAmount: '5000',
        coverage: '100%',
        premium: '150',
        status: 'Active',
        startDate: '2026-01-15',
        expiryDate: '2026-04-15',
        riskLevel: 'Low'
      },
      {
        policyId: 'POL-002',
        loanId: 'LOAN-002',
        borrowerTier: 'Silver',
        creditScore: 650,
        loanAmount: '3000',
        coverage: '100%',
        premium: '120',
        status: 'Active',
        startDate: '2026-01-20',
        expiryDate: '2026-03-21',
        riskLevel: 'Medium'
      },
      {
        policyId: 'POL-003',
        loanId: 'LOAN-003',
        borrowerTier: 'Bronze',
        creditScore: 580,
        loanAmount: '2000',
        coverage: '80%',
        premium: '100',
        status: 'Active',
        startDate: '2026-02-01',
        expiryDate: '2026-04-02',
        riskLevel: 'High'
      },
      {
        policyId: 'POL-004',
        loanId: 'LOAN-004',
        borrowerTier: 'Gold',
        creditScore: 820,
        loanAmount: '4500',
        coverage: '100%',
        premium: '135',
        status: 'Active',
        startDate: '2026-02-05',
        expiryDate: '2026-05-05',
        riskLevel: 'Low'
      },
      {
        policyId: 'POL-005',
        loanId: 'LOAN-005',
        borrowerTier: 'Silver',
        creditScore: 690,
        loanAmount: '3500',
        coverage: '100%',
        premium: '140',
        status: 'Active',
        startDate: '2026-02-10',
        expiryDate: '2026-04-11',
        riskLevel: 'Medium'
      }
    ],
    recentClaims: [
      {
        claimId: 'CLM-001',
        policyId: 'POL-023',
        loanAmount: '2500',
        claimAmount: '2500',
        status: 'Approved',
        submittedDate: '2026-02-10',
        processedDate: '2026-02-12',
        reason: 'Loan Default'
      },
      {
        claimId: 'CLM-002',
        policyId: 'POL-018',
        loanAmount: '1800',
        claimAmount: '1800',
        status: 'Pending',
        submittedDate: '2026-02-13',
        processedDate: null,
        reason: 'Payment Overdue'
      },
      {
        claimId: 'CLM-003',
        policyId: 'POL-025',
        loanAmount: '3200',
        claimAmount: '3200',
        status: 'Approved',
        submittedDate: '2026-02-08',
        processedDate: '2026-02-09',
        reason: 'Loan Default'
      }
    ],
    riskConfiguration: {
      isConfigured: true,
      tiersCovered: ['Excellent', 'Good'],
      minCreditScore: 600,
      maxCoveragePerLoan: 5000,
      premiumRates: {
        excellent: '2%',
        good: '3.5%',
        fair: 'Not Covered'
      }
    }
  });

  useEffect(() => {
    // TODO: Fetch dashboard data from API
    // const fetchDashboardData = async () => {
    //   const response = await fetch('/api/insurer/dashboard');
    //   const data = await response.json();
    //   setDashboardData(data);
    // };
    // fetchDashboardData();
  }, []);

  const getRiskColor = (risk) => {
    const colors = {
      'Low': 'text-green-400 bg-green-500/10 border-green-500/20',
      'Medium': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      'High': 'text-red-400 bg-red-500/10 border-red-500/20'
    };
    return colors[risk] || colors['Medium'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Expired': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'Claimed': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Approved': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Denied': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status] || colors['Active'];
  };

  const calculateChange = (current, previous) => {
    const change = ((current - previous) / previous * 100).toFixed(1);
    return parseFloat(change);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Insurance Dashboard</h1>
          <p className="text-gray-400">Manage your insurance pool and policies</p>
        </div>

        {/* Wallet Info */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Connected Wallet</p>
                <p className="font-mono text-sm">{dashboardData.wallet.address}</p>
                <p className="text-xs text-gray-500">{dashboardData.wallet.network}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Wallet Balance</p>
              <p className="text-2xl font-bold">${dashboardData.wallet.balance}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/insurer/configure"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                  Configure Insurance
                </h3>
                <p className="text-sm text-gray-400">Set coverage parameters and premium rates</p>
              </div>
              <Settings className="w-8 h-8 text-purple-400" />
            </div>
          </Link>

          <Link
            href="/insurer/premiums"
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                  Track Premiums
                </h3>
                <p className="text-sm text-gray-400">Monitor premium income and claims</p>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </Link>
        </div>

        {/* Insurance Pool Stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Insurance Pool
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Capital</p>
              <p className="text-2xl font-bold">${dashboardData.poolStats.totalCapital}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Deployed Capital</p>
              <p className="text-2xl font-bold text-orange-400">${dashboardData.poolStats.deployedCapital}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Available Capital</p>
              <p className="text-2xl font-bold text-green-400">${dashboardData.poolStats.availableCapital}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Utilization Rate</p>
              <p className="text-2xl font-bold text-blue-400">{dashboardData.poolStats.utilizationRate}</p>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Capital Utilization</span>
              <span>{dashboardData.poolStats.utilizationRate}</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                style={{ width: dashboardData.poolStats.utilizationRate }}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-gray-400">Active Policies</p>
            </div>
            <p className="text-3xl font-bold">{dashboardData.overview.activePolicies}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Premium Income</p>
            </div>
            <p className="text-3xl font-bold text-green-400">${dashboardData.overview.totalPremiumIncome}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">Claims Processed</p>
            </div>
            <p className="text-3xl font-bold">{dashboardData.overview.claimsProcessed}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-gray-400">Claims Paid</p>
            </div>
            <p className="text-3xl font-bold text-red-400">${dashboardData.overview.claimsPaid}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Percent className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-gray-400">Avg Premium</p>
            </div>
            <p className="text-3xl font-bold">${dashboardData.overview.averagePremium}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Risk Score</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{dashboardData.overview.riskScore}</p>
          </div>
        </div>

        {/* Risk Configuration Status */}
        {dashboardData.riskConfiguration.isConfigured ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-400 mb-2">Insurance Configuration Active</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 mb-1">Tiers Covered</p>
                    <p className="font-semibold">{dashboardData.riskConfiguration.tiersCovered.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Min Credit Score</p>
                    <p className="font-semibold">{dashboardData.riskConfiguration.minCreditScore}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Max Coverage/Loan</p>
                    <p className="font-semibold">${dashboardData.riskConfiguration.maxCoveragePerLoan}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1">Excellent Tier Rate</p>
                    <p className="font-semibold">{dashboardData.riskConfiguration.premiumRates.excellent}</p>
                  </div>
                </div>
              </div>
              <Link
                href="/insurer/configure"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm transition-colors"
              >
                Edit Config
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-400 mb-1">Configuration Required</h3>
                <p className="text-gray-300 text-sm">
                  Set up your insurance parameters to start issuing policies.
                </p>
              </div>
              <Link
                href="/insurer/configure"
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-sm font-semibold transition-colors"
              >
                Configure Now
              </Link>
            </div>
          </div>
        )}

        {/* Performance Overview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Premium Income</p>
              <p className="text-2xl font-bold text-green-400 mb-1">
                ${dashboardData.performance.thisMonth.premiums}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {calculateChange(
                  parseFloat(dashboardData.performance.thisMonth.premiums),
                  parseFloat(dashboardData.performance.lastMonth.premiums)
                ) >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">
                      +{calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.premiums),
                        parseFloat(dashboardData.performance.lastMonth.premiums)
                      )}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                    <span className="text-red-400">
                      {calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.premiums),
                        parseFloat(dashboardData.performance.lastMonth.premiums)
                      )}%
                    </span>
                  </>
                )}
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Claims Paid</p>
              <p className="text-2xl font-bold text-red-400 mb-1">
                ${dashboardData.performance.thisMonth.claims}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {calculateChange(
                  parseFloat(dashboardData.performance.thisMonth.claims),
                  parseFloat(dashboardData.performance.lastMonth.claims)
                ) >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">
                      +{calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.claims),
                        parseFloat(dashboardData.performance.lastMonth.claims)
                      )}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-400 rotate-180" />
                    <span className="text-green-400">
                      {calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.claims),
                        parseFloat(dashboardData.performance.lastMonth.claims)
                      )}%
                    </span>
                  </>
                )}
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Net Income</p>
              <p className="text-2xl font-bold text-blue-400 mb-1">
                ${dashboardData.performance.thisMonth.netIncome}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {calculateChange(
                  parseFloat(dashboardData.performance.thisMonth.netIncome),
                  parseFloat(dashboardData.performance.lastMonth.netIncome)
                ) >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">
                      +{calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.netIncome),
                        parseFloat(dashboardData.performance.lastMonth.netIncome)
                      )}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                    <span className="text-red-400">
                      {calculateChange(
                        parseFloat(dashboardData.performance.thisMonth.netIncome),
                        parseFloat(dashboardData.performance.lastMonth.netIncome)
                      )}%
                    </span>
                  </>
                )}
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">New Policies</p>
              <p className="text-2xl font-bold text-purple-400 mb-1">
                {dashboardData.performance.thisMonth.newPolicies}
              </p>
              <div className="flex items-center gap-1 text-sm">
                {calculateChange(
                  dashboardData.performance.thisMonth.newPolicies,
                  dashboardData.performance.lastMonth.newPolicies
                ) >= 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">
                      +{calculateChange(
                        dashboardData.performance.thisMonth.newPolicies,
                        dashboardData.performance.lastMonth.newPolicies
                      )}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                    <span className="text-red-400">
                      {calculateChange(
                        dashboardData.performance.thisMonth.newPolicies,
                        dashboardData.performance.lastMonth.newPolicies
                      )}%
                    </span>
                  </>
                )}
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Policies */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Active Policies</h2>
              <Link
                href="/insurer/premiums"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {dashboardData.activePolicies.slice(0, 5).map((policy) => (
                <div key={policy.policyId} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold font-mono text-sm">{policy.policyId}</p>
                      <p className="text-xs text-gray-400">Loan: {policy.loanId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(policy.riskLevel)}`}>
                      {policy.riskLevel} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Coverage</p>
                      <p className="font-semibold">${policy.loanAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Premium</p>
                      <p className="font-semibold text-green-400">${policy.premium}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Tier</p>
                      <p className="font-semibold">{policy.borrowerTier}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Expires: {new Date(policy.expiryDate).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full border ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Claims</h2>
              <Link
                href="/insurer/premiums"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </Link>
            </div>

            {dashboardData.recentClaims.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentClaims.map((claim) => (
                  <div key={claim.claimId} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold font-mono text-sm">{claim.claimId}</p>
                        <p className="text-xs text-gray-400">Policy: {claim.policyId}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">Claim Amount</p>
                      <p className="text-xl font-bold text-red-400">${claim.claimAmount}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Submitted: {new Date(claim.submittedDate).toLocaleDateString()}</span>
                      {claim.processedDate && (
                        <span>Processed: {new Date(claim.processedDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-zinc-700">
                      <p className="text-xs text-gray-400">
                        Reason: <span className="text-white">{claim.reason}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No claims submitted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

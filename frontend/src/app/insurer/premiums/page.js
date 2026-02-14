'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Search,
  ExternalLink,
  Award,
  Activity,
  FileText,
  BarChart3
} from 'lucide-react';

export default function PremiumTracking() {
  // Mock premium data - TODO: Replace with actual API call
  const [premiumData, setPremiumData] = useState({
    summary: {
      totalCollected: '45000',
      totalPending: '3800',
      totalOverdue: '1200',
      currentMonth: '8500',
      lastMonth: '7200',
      percentChange: '+18.1%',
      activePolicies: 48,
      averagePremium: '156'
    },
    premiums: [
      {
        id: 'POL-001',
        policyId: 'POL-001',
        loanId: 'LOAN-1234',
        borrowerTier: 'Gold',
        creditScore: 780,
        loanAmount: '5000',
        premiumAmount: '150',
        premiumRate: '3%',
        status: 'Collected',
        collectionDate: '2026-02-10',
        dueDate: '2026-02-05',
        txHash: '0xabcd1234efgh5678',
        lenderAddress: '0x1234...5678',
        duration: '90 days'
      },
      {
        id: 'POL-002',
        policyId: 'POL-002',
        loanId: 'LOAN-1235',
        borrowerTier: 'Silver',
        creditScore: 720,
        loanAmount: '3000',
        premiumAmount: '180',
        premiumRate: '6%',
        status: 'Collected',
        collectionDate: '2026-02-12',
        dueDate: '2026-02-08',
        txHash: '0x9876fedc5432abcd',
        lenderAddress: '0x9876...4321',
        duration: '60 days'
      },
      {
        id: 'POL-003',
        policyId: 'POL-003',
        loanId: 'LOAN-1236',
        borrowerTier: 'Bronze',
        creditScore: 650,
        loanAmount: '2000',
        premiumAmount: '200',
        premiumRate: '10%',
        status: 'Pending',
        collectionDate: null,
        dueDate: '2026-02-16',
        txHash: null,
        lenderAddress: '0x5555...6666',
        duration: '30 days'
      },
      {
        id: 'POL-004',
        policyId: 'POL-004',
        loanId: 'LOAN-1237',
        borrowerTier: 'Silver',
        creditScore: 700,
        loanAmount: '4500',
        premiumAmount: '270',
        premiumRate: '6%',
        status: 'Pending',
        collectionDate: null,
        dueDate: '2026-02-17',
        txHash: null,
        lenderAddress: '0x7777...8888',
        duration: '60 days'
      },
      {
        id: 'POL-005',
        policyId: 'POL-005',
        loanId: 'LOAN-1238',
        borrowerTier: 'Bronze',
        creditScore: 620,
        loanAmount: '1500',
        premiumAmount: '150',
        premiumRate: '10%',
        status: 'Overdue',
        collectionDate: null,
        dueDate: '2026-02-10',
        txHash: null,
        lenderAddress: '0x2222...3333',
        duration: '30 days'
      },
      {
        id: 'POL-006',
        policyId: 'POL-006',
        loanId: 'LOAN-1239',
        borrowerTier: 'Gold',
        creditScore: 810,
        loanAmount: '10000',
        premiumAmount: '300',
        premiumRate: '3%',
        status: 'Collected',
        collectionDate: '2026-02-08',
        dueDate: '2026-02-05',
        txHash: '0xdef4567890abcdef',
        lenderAddress: '0x4444...5555',
        duration: '90 days'
      },
      {
        id: 'POL-007',
        policyId: 'POL-007',
        loanId: 'LOAN-1240',
        borrowerTier: 'Silver',
        creditScore: 730,
        loanAmount: '3500',
        premiumAmount: '210',
        premiumRate: '6%',
        status: 'Collected',
        collectionDate: '2026-02-11',
        dueDate: '2026-02-09',
        txHash: '0x1111aaaa2222bbbb',
        lenderAddress: '0x6666...7777',
        duration: '60 days'
      },
      {
        id: 'POL-008',
        policyId: 'POL-008',
        loanId: 'LOAN-1241',
        borrowerTier: 'Gold',
        creditScore: 790,
        loanAmount: '7000',
        premiumAmount: '210',
        premiumRate: '3%',
        status: 'Pending',
        collectionDate: null,
        dueDate: '2026-02-18',
        txHash: null,
        lenderAddress: '0x8888...9999',
        duration: '90 days'
      }
    ],
    analytics: {
      premiumsByMonth: [
        { month: 'Aug 2025', amount: 4200 },
        { month: 'Sep 2025', amount: 5100 },
        { month: 'Oct 2025', amount: 4800 },
        { month: 'Nov 2025', amount: 6200 },
        { month: 'Dec 2025', amount: 5900 },
        { month: 'Jan 2026', amount: 7200 },
        { month: 'Feb 2026', amount: 8500 }
      ],
      premiumsByTier: [
        { tier: 'Gold', count: 22, total: 15400, avgPremium: 140 },
        { tier: 'Silver', count: 18, total: 18900, avgPremium: 175 },
        { tier: 'Bronze', count: 8, total: 10700, avgPremium: 215 }
      ]
    }
  });

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');

  useEffect(() => {
    // TODO: Fetch premium data from API
    // const fetchPremiumData = async () => {
    //   const response = await fetch('/api/insurer/premiums');
    //   const data = await response.json();
    //   setPremiumData(data);
    // };
    // fetchPremiumData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'Collected': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Pending': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status] || colors['Pending'];
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Collected': <CheckCircle className="w-4 h-4" />,
      'Pending': <Clock className="w-4 h-4" />,
      'Overdue': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || icons['Pending'];
  };

  const getTierColor = (tier) => {
    const colors = {
      'Gold': 'text-yellow-400',
      'Silver': 'text-gray-300',
      'Bronze': 'text-orange-400'
    };
    return colors[tier] || 'text-gray-400';
  };

  const filteredPremiums = premiumData.premiums
    .filter(premium => {
      if (filterStatus !== 'All' && premium.status !== filterStatus) return false;
      if (searchQuery && !premium.loanId.toLowerCase().includes(searchQuery.toLowerCase()) 
        && !premium.policyId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'amount') {
        return parseFloat(b.premiumAmount) - parseFloat(a.premiumAmount);
      } else if (sortBy === 'tier') {
        return a.borrowerTier.localeCompare(b.borrowerTier);
      }
      return 0;
    });

  const handleExportData = () => {
    // TODO: Implement CSV export functionality
    console.log('Exporting premium data...');
    alert('Export functionality will be implemented with backend integration');
  };

  const handleSendReminder = (policyId) => {
    // TODO: Send reminder to lender/borrower
    console.log(`Sending reminder for policy ${policyId}`);
    alert(`Reminder sent for policy ${policyId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/insurer"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Premium Tracking</h1>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-green-400">${premiumData.summary.totalCollected}</p>
            <p className="text-xs text-gray-500 mt-2">All-time</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-400">${premiumData.summary.totalPending}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting collection</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-400">${premiumData.summary.totalOverdue}</p>
            <p className="text-xs text-gray-500 mt-2">Requires action</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">This Month</p>
            <p className="text-3xl font-bold">${premiumData.summary.currentMonth}</p>
            <p className="text-xs text-green-400 mt-2">{premiumData.summary.percentChange} vs last month</p>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Premium Trend */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold">Premium Collection Trend</h2>
            </div>
            
            <div className="space-y-3">
              {premiumData.analytics.premiumsByMonth.map((data, index) => {
                const maxAmount = Math.max(...premiumData.analytics.premiumsByMonth.map(d => d.amount));
                const percentage = (data.amount / maxAmount) * 100;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{data.month}</span>
                      <span className="font-semibold">${data.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Premiums by Tier */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-yellow-400" />
              <h2 className="text-xl font-bold">Premiums by Tier</h2>
            </div>
            
            <div className="space-y-4">
              {premiumData.analytics.premiumsByTier.map((tier, index) => (
                <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Award className={`w-5 h-5 ${getTierColor(tier.tier)}`} />
                      <span className="font-semibold">{tier.tier}</span>
                    </div>
                    <span className="text-sm text-gray-400">{tier.count} policies</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Premium</p>
                      <p className="font-bold text-green-400">${tier.total.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avg Premium</p>
                      <p className="font-bold">${tier.avgPremium}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Loan ID or Policy ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {['All', 'Collected', 'Pending', 'Overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="tier">Sort by Tier</option>
            </select>
          </div>
        </div>

        {/* Premium List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Premium Policies</h2>
              <span className="text-sm text-gray-400">
                {filteredPremiums.length} {filteredPremiums.length === 1 ? 'policy' : 'policies'}
              </span>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Policy ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Loan ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Tier</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Loan Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Premium</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Due Date</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredPremiums.map((premium) => (
                  <tr key={premium.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">{premium.policyId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/insurer/policy/${premium.policyId}`}
                        className="font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {premium.loanId}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Award className={`w-4 h-4 ${getTierColor(premium.borrowerTier)}`} />
                        <span className="text-sm">{premium.borrowerTier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold">${premium.loanAmount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-green-400">${premium.premiumAmount}</p>
                        <p className="text-xs text-gray-500">{premium.premiumRate}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{new Date(premium.dueDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(premium.status)}`}>
                        {getStatusIcon(premium.status)}
                        {premium.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {premium.status === 'Collected' && premium.txHash && (
                          <a
                            href={`https://etherscan.io/tx/${premium.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View Transaction"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {(premium.status === 'Pending' || premium.status === 'Overdue') && (
                          <button
                            onClick={() => handleSendReminder(premium.policyId)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                            title="Send Reminder"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          href={`/insurer/policy/${premium.policyId}`}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <FileText className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-zinc-800">
            {filteredPremiums.map((premium) => (
              <div key={premium.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm text-gray-400">{premium.policyId}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(premium.status)}`}>
                    {getStatusIcon(premium.status)}
                    {premium.status}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Loan ID:</span>
                    <Link 
                      href={`/insurer/policy/${premium.policyId}`}
                      className="font-mono text-sm text-blue-400"
                    >
                      {premium.loanId}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Tier:</span>
                    <div className="flex items-center gap-1">
                      <Award className={`w-4 h-4 ${getTierColor(premium.borrowerTier)}`} />
                      <span className="text-sm">{premium.borrowerTier}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Premium:</span>
                    <span className="font-semibold text-green-400">${premium.premiumAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Due Date:</span>
                    <span className="text-sm">{new Date(premium.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                  {premium.status === 'Collected' && premium.txHash && (
                    <a
                      href={`https://etherscan.io/tx/${premium.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-blue-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View TX
                    </a>
                  )}
                  {(premium.status === 'Pending' || premium.status === 'Overdue') && (
                    <button
                      onClick={() => handleSendReminder(premium.policyId)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg text-sm text-yellow-400 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Remind
                    </button>
                  )}
                  <Link
                    href={`/insurer/policy/${premium.policyId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredPremiums.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">No premiums found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

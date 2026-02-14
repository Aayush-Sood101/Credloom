'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Activity,
  Percent,
  Award
} from 'lucide-react';

export default function LoanTracking({ params }) {
  const { loanId } = params;

  // Mock loan data - TODO: Replace with actual API call
  const [loanData, setLoanData] = useState({
    id: loanId,
    amount: '2000',
    interestRate: '10%',
    interestRateNumeric: 10,
    duration: '60 days',
    durationDays: 60,
    status: 'Active', // Active, Repaid, Overdue, Defaulted
    startDate: '2026-01-15',
    deadline: '2026-03-16',
    disbursementDate: '2026-01-15',
    totalDue: '2200',
    amountRepaid: '800',
    remainingBalance: '1400',
    progress: 36,
    borrower: {
      creditScore: 750,
      scoreLabel: 'Good',
      tier: 'Silver',
      isAnonymous: true, // Privacy-first: no identity revealed
      repaymentHistory: 'Good',
      previousLoans: 5,
      defaultRate: '0%'
    },
    insurance: {
      isInsured: true,
      provider: 'INS-001',
      coverage: '100%',
      premium: '50'
    },
    earnings: {
      totalInterest: '200',
      earnedSoFar: '72',
      projectedEarnings: '200',
      returnRate: '10%'
    },
    repaymentHistory: [
      {
        id: 'PAY-001',
        date: '2026-02-01',
        amount: '500',
        txHash: '0xabcd1234efgh5678',
        status: 'Confirmed'
      },
      {
        id: 'PAY-002',
        date: '2026-02-10',
        amount: '300',
        txHash: '0x9876fedc5432abcd',
        status: 'Confirmed'
      }
    ],
    timeline: [
      {
        date: '2026-01-15',
        event: 'Loan Disbursed',
        description: 'Funds transferred from escrow to borrower',
        icon: 'checkmark',
        completed: true
      },
      {
        date: '2026-02-01',
        event: 'First Payment',
        description: '$500 received',
        icon: 'payment',
        completed: true
      },
      {
        date: '2026-02-10',
        event: 'Second Payment',
        description: '$300 received',
        icon: 'payment',
        completed: true
      },
      {
        date: '2026-03-16',
        event: 'Final Payment Due',
        description: '$1400 remaining',
        icon: 'calendar',
        completed: false
      }
    ]
  });

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    // TODO: Fetch loan data from API
    // const fetchLoanData = async () => {
    //   const response = await fetch(`/api/lender/loan/${loanId}`);
    //   const data = await response.json();
    //   setLoanData(data);
    // };
    // fetchLoanData();

    // Calculate countdown
    const calculateCountdown = () => {
      const deadline = new Date(loanData.deadline);
      const now = new Date();
      const diff = deadline - now;

      if (diff <= 0) {
        setIsOverdue(true);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
        setIsOverdue(false);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [loanId, loanData.deadline]);

  const getScoreColor = (score) => {
    if (score >= 800) return 'text-green-400';
    if (score >= 650) return 'text-blue-400';
    if (score >= 500) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Repaid': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Defaulted': 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };
    return colors[status] || colors['Active'];
  };

  const getCountdownColor = () => {
    if (isOverdue) return 'text-red-400';
    if (countdown.days <= 2) return 'text-red-400';
    if (countdown.days <= 7) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Repaid State
  if (loanData.status === 'Repaid') {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/lender"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Loan Fully Repaid</h1>
            <p className="text-gray-400 mb-6">
              This loan has been successfully repaid in full.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Principal</p>
                <p className="text-xl font-bold">${loanData.amount}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Interest Earned</p>
                <p className="text-xl font-bold text-green-400">${loanData.earnings.totalInterest}</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total Returned</p>
                <p className="text-xl font-bold">${loanData.totalDue}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Loan Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan ID</p>
                <p className="font-mono text-sm">{loanData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="font-semibold">${loanData.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                <p className="font-semibold">{loanData.interestRate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold">{loanData.duration}</p>
              </div>
            </div>
          </div>

          {/* Repayment History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Repayment History</h2>
            <div className="space-y-3">
              {loanData.repaymentHistory.map((payment) => (
                <div key={payment.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">${payment.amount}</p>
                      <p className="text-sm text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                        {payment.status}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${payment.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 justify-end"
                      >
                        View TX <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Loan View
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/lender"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Status Warning for Overdue/Default */}
        {(loanData.status === 'Overdue' || loanData.status === 'Defaulted') && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Loan {loanData.status}</h2>
                <p className="text-gray-300 mb-4">
                  {loanData.status === 'Overdue' 
                    ? 'The repayment deadline has passed. Waiting for borrower payment.'
                    : 'This loan has defaulted. Insurance claim process initiated.'}
                </p>
                {loanData.insurance.isInsured && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Insurance Coverage Active</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Your investment is protected. Insurance provider {loanData.insurance.provider} will process the claim.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Countdown Timer (Active Loans) */}
        {loanData.status === 'Active' && (
          <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 ${getCountdownColor()}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Time Until Final Payment</p>
                <div className="flex items-center gap-4 text-3xl font-bold">
                  <div>
                    <span>{countdown.days}</span>
                    <span className="text-sm text-gray-400 ml-1">days</span>
                  </div>
                  <span>:</span>
                  <div>
                    <span>{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-sm text-gray-400 ml-1">hrs</span>
                  </div>
                  <span>:</span>
                  <div>
                    <span>{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-sm text-gray-400 ml-1">min</span>
                  </div>
                </div>
              </div>
              <Clock className="w-12 h-12" />
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Loan Overview */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Loan Overview</h1>
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(loanData.status)}`}>
                {loanData.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan ID</p>
                <p className="font-mono text-sm">{loanData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Principal Amount</p>
                <p className="text-lg font-bold">${loanData.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                <p className="text-lg font-bold text-green-400">{loanData.interestRate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold">{loanData.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                <p className="text-sm">{new Date(loanData.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="text-sm">{new Date(loanData.deadline).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Repayment Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Repayment Progress</span>
                <span>{loanData.progress}%</span>
              </div>
              <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${loanData.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-400">Repaid: ${loanData.amountRepaid}</span>
                <span className="text-orange-400">Remaining: ${loanData.remainingBalance}</span>
              </div>
            </div>

            {/* Insurance Badge */}
            {loanData.insurance.isInsured && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-semibold text-green-400">Insured Loan</p>
                    <p className="text-sm text-gray-400">
                      {loanData.insurance.coverage} coverage by {loanData.insurance.provider}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Premium</p>
                  <p className="font-semibold">${loanData.insurance.premium}</p>
                </div>
              </div>
            )}
          </div>

          {/* Earnings Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Earnings</h2>
            
            <div className="space-y-4">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <p className="text-xs text-gray-500">Earned So Far</p>
                </div>
                <p className="text-2xl font-bold text-green-400">${loanData.earnings.earnedSoFar}</p>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <p className="text-xs text-gray-500">Projected Total</p>
                </div>
                <p className="text-2xl font-bold">${loanData.earnings.projectedEarnings}</p>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4 text-yellow-400" />
                  <p className="text-xs text-gray-500">Return Rate</p>
                </div>
                <p className="text-2xl font-bold text-yellow-400">{loanData.earnings.returnRate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Borrower Profile */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold">Borrower Profile</h2>
            <span className="ml-auto text-xs text-gray-500">Identity Protected</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Credit Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(loanData.borrower.creditScore)}`}>
                {loanData.borrower.creditScore}
              </p>
              <p className="text-sm text-gray-400 mt-1">{loanData.borrower.scoreLabel}</p>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Tier</p>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <p className="text-xl font-bold">{loanData.borrower.tier}</p>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Previous Loans</p>
              <p className="text-3xl font-bold">{loanData.borrower.previousLoans}</p>
              <p className="text-sm text-gray-400 mt-1">{loanData.borrower.repaymentHistory} history</p>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-2">Default Rate</p>
              <p className="text-3xl font-bold text-green-400">{loanData.borrower.defaultRate}</p>
              <p className="text-sm text-gray-400 mt-1">Excellent</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Repayment History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Repayment History</h2>
            
            {loanData.repaymentHistory.length > 0 ? (
              <div className="space-y-3">
                {loanData.repaymentHistory.map((payment) => (
                  <div key={payment.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">${payment.amount}</p>
                        <p className="text-sm text-gray-400">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                          {payment.status}
                        </span>
                        <a
                          href={`https://etherscan.io/tx/${payment.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors mt-1 justify-end"
                        >
                          View TX <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No repayments yet</p>
              </div>
            )}
          </div>

          {/* Loan Timeline */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Loan Timeline</h2>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-zinc-800" />
              
              <div className="space-y-6">
                {loanData.timeline.map((item, index) => (
                  <div key={index} className="relative pl-14">
                    <div className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-500/10 border-2 border-green-500' : 'bg-zinc-800 border-2 border-zinc-700'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Calendar className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className={item.completed ? 'opacity-70' : ''}>
                      <p className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                      <p className="font-semibold mb-1">{item.event}</p>
                      <p className="text-sm text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

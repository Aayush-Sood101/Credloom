'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Wallet,
  TrendingDown,
  Shield,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function LoanDetail({ params }) {
  const { loanId } = params;
  
  // Mock loan data - TODO: Replace with actual API call
  const [loanData, setLoanData] = useState({
    id: loanId,
    amount: '2000',
    interestRate: '10%',
    startDate: '2026-01-15',
    deadline: '2026-02-20',
    totalDue: '2200',
    amountRepaid: '900',
    remainingBalance: '1300',
    status: 'Active', // Active, Repaid, Overdue, Defaulted
    lenderId: 'LENDER-001',
    isInsured: true,
    insuranceProvider: 'INS-001',
    repaymentHistory: [
      {
        id: 'TXN-001',
        date: '2026-01-20',
        amount: '500',
        txHash: '0xabcd1234...',
        status: 'Confirmed'
      },
      {
        id: 'TXN-002',
        date: '2026-02-01',
        amount: '400',
        txHash: '0xefgh5678...',
        status: 'Confirmed'
      }
    ]
  });

  const [walletBalance, setWalletBalance] = useState('2.5'); // ETH or USDC
  const [repayAmount, setRepayAmount] = useState('');
  const [isPartialRepay, setIsPartialRepay] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'confirmed', 'error'
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    // TODO: Fetch loan data from API
    // const fetchLoanData = async () => {
    //   const response = await fetch(`/api/borrower/loan/${loanId}`);
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

  const progress = (parseFloat(loanData.amountRepaid) / parseFloat(loanData.totalDue)) * 100;

  const getCountdownColor = () => {
    if (isOverdue) return 'text-red-400';
    if (countdown.days <= 2) return 'text-red-400';
    if (countdown.days <= 7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const canRepay = parseFloat(walletBalance) >= parseFloat(loanData.remainingBalance);

  const handleRepay = async (amount) => {
    setTransactionStatus('pending');

    // TODO: Call smart contract to process repayment
    // const tx = await contract.repayLoan({
    //   loanId: loanData.id,
    //   amount: amount
    // });
    // await tx.wait();

    // Mock transaction delay
    setTimeout(() => {
      setTransactionStatus('confirmed');
      
      // Update loan data
      const newAmountRepaid = parseFloat(loanData.amountRepaid) + parseFloat(amount);
      const newRemainingBalance = parseFloat(loanData.remainingBalance) - parseFloat(amount);
      
      setLoanData({
        ...loanData,
        amountRepaid: newAmountRepaid.toString(),
        remainingBalance: newRemainingBalance.toString(),
        status: newRemainingBalance <= 0 ? 'Repaid' : 'Active',
        repaymentHistory: [
          {
            id: `TXN-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            amount: amount.toString(),
            txHash: '0x' + Math.random().toString(36).substring(2, 15),
            status: 'Confirmed'
          },
          ...loanData.repaymentHistory
        ]
      });

      // Reset form
      setRepayAmount('');
      setIsPartialRepay(false);

      // Clear transaction status after 3 seconds
      setTimeout(() => {
        setTransactionStatus(null);
      }, 3000);
    }, 3000);
  };

  const handleFullRepayment = () => {
    handleRepay(loanData.remainingBalance);
  };

  const handlePartialRepayment = () => {
    if (!repayAmount || parseFloat(repayAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (parseFloat(repayAmount) > parseFloat(loanData.remainingBalance)) {
      alert('Amount exceeds remaining balance');
      return;
    }
    handleRepay(repayAmount);
  };

  // Transaction Status Modal
  if (transactionStatus === 'pending' || transactionStatus === 'confirmed') {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          {transactionStatus === 'pending' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Processing Repayment</h2>
              <p className="text-gray-400">Please wait while we confirm your transaction on the blockchain...</p>
            </>
          )}
          
          {transactionStatus === 'confirmed' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-400">Repayment Successful!</h2>
              <p className="text-gray-400">Your payment has been processed successfully.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Post-Repayment State
  if (loanData.status === 'Repaid') {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-8 text-center mb-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Loan Repaid ✓</h1>
            <p className="text-gray-400 mb-6">
              Congratulations! You&apos;ve successfully repaid this loan in full.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Credit Score Impact</p>
                <p className="text-xl font-bold text-green-400">+15 points</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Stake Released</p>
                <p className="text-xl font-bold">100%</p>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Total Paid</p>
                <p className="text-xl font-bold">${loanData.totalDue}</p>
              </div>
            </div>
          </div>

          {/* Loan Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Loan Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan ID</p>
                <p className="font-mono text-sm">{loanData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount Borrowed</p>
                <p className="font-semibold">${loanData.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                <p className="font-semibold">{loanData.interestRate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold">
                  {Math.floor((new Date(loanData.deadline) - new Date(loanData.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>

          {/* Repayment History */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Repayment History</h2>
            <div className="space-y-3">
              {loanData.repaymentHistory.map((txn) => (
                <div key={txn.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">${txn.amount}</p>
                      <p className="text-sm text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                        {txn.status}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${txn.txHash}`}
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

  // Default Warning (Overdue)
  if (loanData.status === 'Defaulted' || isOverdue) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>

          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-12 h-12 text-red-400 flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 text-red-400">This Loan is in Default</h1>
                <p className="text-gray-300 mb-6">
                  The repayment deadline has passed without full payment. Your account has been flagged.
                </p>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Consequences:</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Credit Score:</strong> Reduced by 50 points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Stake Slashing:</strong> 30% of your staked amount has been slashed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Account Status:</strong> Flagged and suspended from borrowing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Cooldown Period:</strong> 90 days before you can borrow again</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleFullRepayment}
                    className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Repay Now to Restore Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Loan Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Loan ID</p>
                <p className="font-mono text-sm">{loanData.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Original Amount</p>
                <p className="font-semibold">${loanData.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Due</p>
                <p className="font-semibold text-red-400">${loanData.totalDue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount Repaid</p>
                <p className="font-semibold">${loanData.amountRepaid}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Remaining Balance</p>
                <p className="font-semibold text-red-400">${loanData.remainingBalance}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Days Overdue</p>
                <p className="font-semibold text-red-400">
                  {Math.floor((new Date() - new Date(loanData.deadline)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Loan View
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/borrower"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Countdown Timer */}
        <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 ${getCountdownColor()}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Time Until Deadline</p>
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
                <span>:</span>
                <div>
                  <span>{String(countdown.seconds).padStart(2, '0')}</span>
                  <span className="text-sm text-gray-400 ml-1">sec</span>
                </div>
              </div>
            </div>
            <Clock className="w-12 h-12" />
          </div>
          {countdown.days <= 2 && countdown.days >= 0 && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Urgent: Payment deadline approaching soon!
              </p>
            </div>
          )}
        </div>

        {/* Loan Overview Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Loan Overview</h1>
            <span className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium">
              {loanData.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Loan ID</p>
              <p className="font-mono text-sm">{loanData.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Amount Borrowed</p>
              <p className="text-lg font-bold">${loanData.amount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
              <p className="text-lg font-bold">{loanData.interestRate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Due</p>
              <p className="text-lg font-bold text-green-400">${loanData.totalDue}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Start Date</p>
              <p className="text-sm">{new Date(loanData.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Deadline</p>
              <p className="text-sm">{new Date(loanData.deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Repaid So Far</p>
              <p className="text-lg font-bold">${loanData.amountRepaid}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Remaining</p>
              <p className="text-lg font-bold text-orange-400">${loanData.remainingBalance}</p>
            </div>
          </div>

          {/* Repayment Progress Bar */}
          <div>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Repayment Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {loanData.isInsured && (
            <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">
                This loan is insured by {loanData.insuranceProvider}
              </span>
            </div>
          )}
        </div>

        {/* Repayment Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Make a Payment</h2>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-400">Your Wallet Balance</p>
                  <p className="font-semibold">{walletBalance} USDC</p>
                </div>
              </div>
              {!canRepay && (
                <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs">
                  Insufficient Balance
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleFullRepayment}
              disabled={!canRepay}
              className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Repay Full Amount (${loanData.remainingBalance})
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-gray-400">or</span>
              </div>
            </div>

            <div>
              <button
                onClick={() => setIsPartialRepay(!isPartialRepay)}
                className="w-full px-6 py-3 bg-zinc-800 border border-zinc-700 rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
              >
                Repay Partial Amount
              </button>

              {isPartialRepay && (
                <div className="mt-4 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Enter Amount
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      placeholder="Amount to repay"
                      className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      onClick={handlePartialRepayment}
                      disabled={!repayAmount || parseFloat(repayAmount) <= 0}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pay
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Maximum: ${loanData.remainingBalance}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Repayment History */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Repayment History</h2>

          {loanData.repaymentHistory.length > 0 ? (
            <div className="space-y-3">
              {loanData.repaymentHistory.map((txn) => (
                <div key={txn.id} className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">${txn.amount}</p>
                      <p className="text-sm text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                        {txn.status}
                      </span>
                      <a
                        href={`https://etherscan.io/tx/${txn.txHash}`}
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
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No repayments yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

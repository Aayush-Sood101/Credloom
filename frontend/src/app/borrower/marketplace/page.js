'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Shield, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Filter,
  ArrowLeft,
  DollarSign,
  Percent,
  Calendar
} from 'lucide-react';

export default function LoanMarketplace() {
  // Mock borrower data - TODO: Replace with actual API call
  const [borrowerData, setBorrowerData] = useState({
    creditScore: 750,
    maxBorrowable: 5000,
    isEligible: true,
    tier: 'Silver',
    interestRate: 10, // Based on credit score
    rateOptions: [8, 10, 12] // Different rate options based on score
  });

  // Form state
  const [loanAmount, setLoanAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [selectedLender, setSelectedLender] = useState(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'confirmed', 'error'

  // Mock lender data - TODO: Replace with actual API call
  const [lenders, setLenders] = useState([]);

  // Filter state
  const [filterInsuredOnly, setFilterInsuredOnly] = useState(false);
  const [filterMaxDuration, setFilterMaxDuration] = useState(null);

  const handleSearch = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    if (parseFloat(loanAmount) > borrowerData.maxBorrowable) {
      alert(`Amount exceeds maximum borrowable: $${borrowerData.maxBorrowable}`);
      return;
    }

    setIsLoading(true);
    setSearchSubmitted(true);

    // TODO: Call backend API to check eligibility and fetch matching lenders
    // const response = await fetch('/api/borrower/check-eligibility', {
    //   method: 'POST',
    //   body: JSON.stringify({ amount: loanAmount })
    // });
    // const data = await response.json();

    // Mock API delay
    setTimeout(() => {
      // Mock lender data
      setLenders([
        {
          id: 'LENDER-001',
          availableRange: { min: 1000, max: 3000 },
          durations: [30, 60, 90],
          isInsured: true,
          insuranceProvider: 'INS-001'
        },
        {
          id: 'LENDER-002',
          availableRange: { min: 2000, max: 5000 },
          durations: [60, 90],
          isInsured: false,
          insuranceProvider: null
        },
        {
          id: 'LENDER-003',
          availableRange: { min: 500, max: 2500 },
          durations: [30, 60],
          isInsured: true,
          insuranceProvider: 'INS-002'
        }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectLender = (lender, duration) => {
    setSelectedLender(lender);
    setSelectedDuration(duration);
    setSelectedRate(borrowerData.interestRate);
  };

  const handleConfirmLoan = () => {
    setShowConfirmation(true);
  };

  const handleAcceptLoan = async () => {
    setTransactionStatus('pending');
    
    // TODO: Call smart contract to initiate loan
    // const tx = await contract.initiateLoan({
    //   amount: loanAmount,
    //   interestRate: selectedRate,
    //   duration: selectedDuration,
    //   lenderId: selectedLender.id
    // });
    // await tx.wait();

    // Mock transaction delay
    setTimeout(() => {
      setTransactionStatus('confirmed');
      
      // Redirect to loan detail after 2 seconds
      setTimeout(() => {
        window.location.href = '/borrower/loan/LOAN-NEW-001';
      }, 2000);
    }, 3000);
  };

  const calculateTotalRepayment = () => {
    const principal = parseFloat(loanAmount);
    const rate = selectedRate / 100;
    const total = principal * (1 + rate);
    return total.toFixed(2);
  };

  const filteredLenders = lenders.filter(lender => {
    if (filterInsuredOnly && !lender.isInsured) return false;
    if (filterMaxDuration && !lender.durations.includes(filterMaxDuration)) return false;
    return true;
  });

  // Transaction Status Modal
  if (transactionStatus) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
          {transactionStatus === 'pending' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-2">Processing Transaction</h2>
              <p className="text-gray-400">Please wait while we confirm your loan on the blockchain...</p>
            </>
          )}
          
          {transactionStatus === 'confirmed' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-400">Loan Disbursed!</h2>
              <p className="text-gray-400 mb-4">Your loan has been successfully processed. Funds have been transferred to your wallet.</p>
              <p className="text-sm text-gray-500">Redirecting to loan details...</p>
            </>
          )}
          
          {transactionStatus === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-400">Transaction Failed</h2>
              <p className="text-gray-400 mb-6">There was an error processing your loan. Please try again.</p>
              <button
                onClick={() => setTransactionStatus(null)}
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Confirmation Modal
  if (showConfirmation && selectedLender && selectedDuration && selectedRate) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/borrower/marketplace"
            onClick={(e) => {
              e.preventDefault();
              setShowConfirmation(false);
            }}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Marketplace
          </Link>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <h1 className="text-3xl font-bold mb-6">Confirm Your Loan</h1>

            {/* Loan Summary */}
            <div className="space-y-6 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Loan Amount</p>
                  <p className="text-2xl font-bold">${loanAmount}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Interest Rate</p>
                  <p className="text-2xl font-bold">{selectedRate}%</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-2xl font-bold">{selectedDuration} days</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Repayment</p>
                  <p className="text-2xl font-bold text-green-400">${calculateTotalRepayment()}</p>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-400 mb-1">Insurance Status</p>
                    <p className="text-sm text-gray-300">
                      {selectedLender.isInsured ? (
                        <>This loan is insured by provider {selectedLender.insuranceProvider}</>
                      ) : (
                        <>This loan is not insured</>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="font-semibold mb-3">Repayment Schedule</h3>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Single Payment Due</p>
                      <p className="text-lg font-semibold">
                        {(() => {
                          const dueDate = new Date();
                          dueDate.setDate(dueDate.getDate() + selectedDuration);
                          return dueDate.toLocaleDateString();
                        })()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Amount Due</p>
                      <p className="text-lg font-semibold text-green-400">${calculateTotalRepayment()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-400 mb-1">Important</p>
                  <p className="text-gray-300">
                    By accepting this loan, you agree to repay the full amount by the deadline. Failure to repay will result in credit score penalties and stake slashing.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleAcceptLoan}
              className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors text-lg"
            >
              Confirm & Accept Loan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Loan Marketplace</h1>
          <p className="text-gray-400">Find the best loan offers based on your credit score</p>
        </div>

        {/* Credit Score Info Banner */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Your Credit Score</p>
                <p className="text-2xl font-bold text-blue-400">{borrowerData.creditScore}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Your Interest Rate</p>
              <p className="text-2xl font-bold text-green-400">{borrowerData.interestRate}%</p>
              <p className="text-xs text-gray-500 mt-1">Based on your credit score</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Request a Loan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Loan Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Maximum: ${borrowerData.maxBorrowable} (based on your {borrowerData.tier} tier)
              </p>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Find Lenders
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searchSubmitted && !isLoading && (
          <>
            {filteredLenders.length > 0 ? (
              <>
                {/* Filters */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filterInsuredOnly}
                        onChange={(e) => setFilterInsuredOnly(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Insured Only</span>
                    </label>
                    <select
                      value={filterMaxDuration || ''}
                      onChange={(e) => setFilterMaxDuration(e.target.value ? parseInt(e.target.value) : null)}
                      className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Durations</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>
                </div>

                {/* Lender Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLenders.map((lender) => (
                    <div key={lender.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">Lender #{lender.id.split('-')[1]}</h3>
                        {lender.isInsured && (
                          <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
                            Insured
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Available Range</p>
                          <p className="font-semibold">${lender.availableRange.min} - ${lender.availableRange.max}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Durations Offered</p>
                          <div className="flex gap-2">
                            {lender.durations.map((duration) => (
                              <span key={duration} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs">
                                {duration}d
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-800 pt-4">
                        <p className="text-sm text-gray-400 mb-3">Select Duration:</p>
                        <div className="space-y-2">
                          {lender.durations.map((duration) => (
                            <button
                              key={duration}
                              onClick={() => handleSelectLender(lender, duration)}
                              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-500 hover:bg-zinc-700 transition-colors text-sm font-medium"
                            >
                              {duration} days
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Lenders Found</h3>
                <p className="text-gray-400">
                  No lenders match your request. Try a different amount or check back later.
                </p>
              </div>
            )}
          </>
        )}

        {!searchSubmitted && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Find Your Perfect Loan</h3>
            <p className="text-gray-400">
              Enter a loan amount above to see matching lenders
            </p>
          </div>
        )}

        {/* Rate Selection Popup */}
        {selectedLender && selectedDuration && !showConfirmation && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Select Your Interest Rate</h3>
              <p className="text-sm text-gray-400 mb-6">
                Based on your credit score ({borrowerData.creditScore}), you qualify for these rates:
              </p>
              
              <div className="space-y-3 mb-6">
                {borrowerData.rateOptions.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      setSelectedRate(rate);
                      handleConfirmLoan();
                    }}
                    className={`w-full px-4 py-3 bg-zinc-800 border rounded-lg hover:border-blue-500 transition-colors text-left ${
                      rate === borrowerData.interestRate ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{rate}%</span>
                      {rate === borrowerData.interestRate && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Recommended</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Total repayment: ${(parseFloat(loanAmount) * (1 + rate / 100)).toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedLender(null);
                  setSelectedDuration(null);
                }}
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

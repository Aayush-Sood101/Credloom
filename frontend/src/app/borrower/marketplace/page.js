'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { requestLoan, selectLoan } from '@/lib/api/borrower';
import { getUserId } from '@/lib/api/auth';
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
  const { user, tierStatus } = useAuth();
  
  // Borrower data from API
  const [borrowerData, setBorrowerData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Form state
  const [loanAmount, setLoanAmount] = useState('');
  const [selectedOption, setSelectedOption] = useState(null); // Store full option object
  const [selectedLender, setSelectedLender] = useState(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null); // null, 'pending', 'confirmed', 'error'

  // Mock lender data - will be populated by API
  const [lenders, setLenders] = useState([]);

  // Filter state
  const [filterInsuredOnly, setFilterInsuredOnly] = useState(false);
  const [filterMaxDuration, setFilterMaxDuration] = useState(null);

  const handleSearch = async () => {
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      alert('Please enter a valid loan amount');
      return;
    }

    setIsLoading(true);
    setSearchSubmitted(true);
    setApiError(null);

    try {
      // Call backend API to get matching lenders
      const response = await requestLoan(parseFloat(loanAmount));
      console.log('[Marketplace] Loan request response:', response);
      
      // Store borrower data from response
      setBorrowerData({
        borrower_id: response.borrower_id,
        creditScore: response.credit_score,
        wallet: response.borrower_wallet,
        requestedAmount: response.requested_amount
      });
      
      // Transform lenders data to match UI format
      const transformedLenders = response.lenders.map(lender => ({
        id: lender.lender_id,
        wallet: lender.lender_wallet,
        minScore: lender.min_score,
        options: lender.options.map(opt => ({
          option_id: opt.option_id,
          duration: opt.duration_days,
          minAmount: opt.min_amount,
          availableAmount: opt.amount_available
        }))
      }));
      
      setLenders(transformedLenders);
      console.log('[Marketplace] Transformed lenders:', transformedLenders);
      
    } catch (error) {
      console.error('[Marketplace] Error fetching lenders:', error);
      setApiError(error.message || 'Failed to fetch lenders');
      setLenders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLender = (lender, option) => {
    setSelectedLender(lender);
    setSelectedOption(option);
    setShowConfirmation(true);
  };

  const handleAcceptLoan = async () => {
    if (!borrowerData || !selectedLender || !selectedOption) {
      setApiError('Missing required data for loan selection');
      return;
    }

    setTransactionStatus('pending');
    setApiError(null);
    
    try {
      const loanData = {
        loan_amt: parseFloat(loanAmount),
        duration: selectedOption.duration,
        lender_id: selectedLender.id,
        borrower_id: borrowerData.borrower_id,
        option_id: selectedOption.option_id
      };
      
      console.log('[Marketplace] Selecting loan with data:', loanData);
      const response = await selectLoan(loanData);
      console.log('[Marketplace] Loan selected:', response);
      
      setTransactionStatus('confirmed');
      
      // Redirect to borrower dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = '/borrower';
      }, 2000);
      
    } catch (error) {
      console.error('[Marketplace] Error selecting loan:', error);
      setTransactionStatus('error');
      setApiError(error.message || 'Failed to select loan');
    }
  };

  const calculateTotalRepayment = (amount, rate) => {
    const principal = parseFloat(amount);
    const rateDecimal = rate / 100;
    const total = principal * (1 + rateDecimal);
    return total.toFixed(2);
  };

  const filteredLenders = lenders.filter(lender => {
    if (filterMaxDuration) {
      // Check if any option has the filtered duration
      const hasMatchingDuration = lender.options.some(
        opt => opt.duration === filterMaxDuration
      );
      if (!hasMatchingDuration) return false;
    }
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
  if (showConfirmation && selectedLender && selectedOption) {
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
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-2xl font-bold">{selectedOption.duration} days</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Lender</p>
                  <p className="text-sm font-mono">#{selectedLender.id}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Available Liquidity</p>
                  <p className="text-sm font-bold">${selectedOption.availableAmount}</p>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="font-semibold mb-3">Loan Terms</h3>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Principal Amount</span>
                      <span className="font-semibold">${loanAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Loan Duration</span>
                      <span className="font-semibold">{selectedOption.duration} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maturity Date</span>
                      <span className="font-semibold">
                        {(() => {
                          const dueDate = new Date();
                          dueDate.setDate(dueDate.getDate() + selectedOption.duration);
                          return dueDate.toLocaleDateString();
                        })()}
                      </span>
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
        {borrowerData && (
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
                <p className="text-sm text-gray-400">Wallet</p>
                <p className="font-mono text-sm">{borrowerData.wallet ? `${borrowerData.wallet.slice(0, 6)}...${borrowerData.wallet.slice(-4)}` : 'Not connected'}</p>
              </div>
            </div>
          </div>
        )}

        {/* API Error Display */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{apiError}</p>
            </div>
          </div>
        )}

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
                Enter the amount you wish to borrow
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
                        <div>
                          <h3 className="font-bold">Lender #{lender.id}</h3>
                          <p className="text-xs text-gray-500 font-mono">{lender.wallet && `${lender.wallet.slice(0, 6)}...${lender.wallet.slice(-4)}`}</p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Min Credit Score</p>
                          <p className="font-semibold">{lender.minScore || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Loan Options</p>
                          <p className="text-sm text-gray-400">{lender.options.length} available</p>
                        </div>
                      </div>

                      <div className="border-t border-zinc-800 pt-4">
                        <p className="text-sm text-gray-400 mb-3">Select Loan Term:</p>
                        <div className="space-y-2">
                          {lender.options
                            .filter(opt => !filterMaxDuration || opt.duration === filterMaxDuration)
                            .map((option) => (
                            <button
                              key={option.option_id}
                              onClick={() => handleSelectLender(lender, option)}
                              disabled={parseFloat(loanAmount) < option.minAmount || parseFloat(loanAmount) > option.availableAmount}
                              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-blue-500 hover:bg-zinc-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed text-left"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{option.duration} days</span>
                                <span className="text-xs text-gray-400">${option.minAmount} - ${option.availableAmount}</span>
                              </div>
                              {parseFloat(loanAmount) < option.minAmount && (
                                <p className="text-xs text-red-400">Below minimum amount</p>
                              )}
                              {parseFloat(loanAmount) > option.availableAmount && (
                                <p className="text-xs text-red-400">Exceeds available liquidity</p>
                              )}
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

      </div>
    </div>
  );
}

'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBorrowerLoanDetail } from '@/lib/api/borrower';
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
  DollarSign,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';

export default function LoanDetail({ params }) {
  const { loanId } = params;
  
  // Loan data from API
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null); // Track HTTP status code

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorStatus(null);
        
        const data = await getBorrowerLoanDetail(loanId);
        console.log('[LoanDetail] Fetched loan:', data);
        setLoanData(data);
      } catch (err) {
        console.error('[LoanDetail] Error fetching loan:', err);
        setError(err.message || 'Failed to fetch loan details');
        
        // Try to determine error type from message
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setErrorStatus(401);
        } else if (err.message?.includes('404') || err.message?.includes('Not Found') || err.message?.includes('not found')) {
          setErrorStatus(404);
        } else if (err.message?.includes('403') || err.message?.includes('Forbidden')) {
          setErrorStatus(403);
        } else {
          setErrorStatus(500);
        }
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoanData();
    }
  }, [loanId]);

  const getStatusColor = (status) => {
    const colors = {
      'selected': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'active': 'bg-green-500/10 text-green-400 border-green-500/20',
      'repaid': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
      'defaulted': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status?.toLowerCase()] || colors['selected'];
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'selected') return <Clock className="w-5 h-5" />;
    if (statusLower === 'active') return <CheckCircle className="w-5 h-5" />;
    if (statusLower === 'repaid') return <CheckCircle className="w-5 h-5" />;
    if (statusLower === 'defaulted') return <AlertTriangle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  // Render different UI based on error status
  const renderErrorContent = () => {
    if (errorStatus === 401) {
      return (
        <>
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-red-400">Unauthorized</h3>
          <p className="text-gray-400 mb-6">
            You need to be logged in to view this loan. Please sign in and try again.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Sign In
          </Link>
        </>
      );
    }

    if (errorStatus === 404) {
      return (
        <>
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-yellow-400">Loan Not Found</h3>
          <p className="text-gray-400 mb-6">
            This loan doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </>
      );
    }

    if (errorStatus === 403) {
      return (
        <>
          <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2 text-orange-400">Access Denied</h3>
          <p className="text-gray-400 mb-6">
            You don&apos;t have permission to access this loan.
          </p>
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </>
      );
    }

    // Generic error (500 or unknown)
    return (
      <>
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2 text-red-400">Error Loading Loan</h3>
        <p className="text-gray-400 mb-2">{error}</p>
        <p className="text-sm text-gray-500 mb-6">Please try again or contact support if the issue persists.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
          <Link
            href="/borrower"
            className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 text-white border border-zinc-700 rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
        </div>
      </>
    );
  };

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

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading loan details...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            {renderErrorContent()}
          </div>
        )}

        {/* Loan Details */}
        {!loading && !error && loanData && (
          <>
            {/* Main Loan Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Loan Details</h1>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(loanData.status)}`}>
                  {getStatusIcon(loanData.status)}
                  <span className="text-sm font-medium capitalize">{loanData.status}</span>
                </div>
              </div>

              {/* Loan Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Loan ID</p>
                  <p className="font-mono text-sm break-all">{loanData.loan_id}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Principal Amount</p>
                  <p className="text-xl font-bold">${loanData.principal}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Duration</p>
                  <p className="text-xl font-bold">{loanData.duration_days} days</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Borrower ID</p>
                  <p className="text-sm">#{loanData.borrower_id}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Lender ID</p>
                  <p className="text-sm">#{loanData.lender_id}</p>
                </div>
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <p className="text-sm capitalize">{loanData.status}</p>
                </div>
              </div>

              {/* Status Information */}
              {loanData.status === 'selected' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-400 mb-1">Loan Selected</p>
                      <p className="text-sm text-gray-300">
                        This loan has been successfully selected. The lender has been notified and the loan will become active soon. 
                        Repayment features will be available once the loan is activated on the blockchain.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {loanData.status === 'active' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-400 mb-1">Loan Active</p>
                      <p className="text-sm text-gray-300">
                        Your loan is now active. Funds have been disbursed to your wallet. 
                        Please ensure timely repayment to maintain your credit score.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {loanData.status === 'repaid' && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-400 mb-1">Loan Fully Repaid ✓</p>
                      <p className="text-sm text-gray-300">
                        Congratulations! This loan has been fully repaid. Your credit score has been updated positively.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {loanData.status === 'defaulted' && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-400 mb-1">Loan Defaulted</p>
                      <p className="text-sm text-gray-300">
                        This loan has been marked as defaulted. Your credit score has been negatively impacted and your stake may be slashed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline / Next Steps Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">What&apos;s Next?</h2>
              <div className="space-y-4">
                {loanData.status === 'selected' && (
                  <>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">Loan Confirmation</p>
                        <p className="text-sm text-gray-400">
                          The lender will review and confirm the loan terms. This usually takes a few minutes.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-50">
                      <div className="flex-shrink-0 w-8 h-8 bg-zinc-700 text-gray-400 rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Smart Contract Execution</p>
                        <p className="text-sm text-gray-400">
                          The loan will be registered on the blockchain and funds will be transferred to your wallet.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 opacity-50">
                      <div className="flex-shrink-0 w-8 h-8 bg-zinc-700 text-gray-400 rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">Repayment</p>
                        <p className="text-sm text-gray-400">
                          Once active, you can start making repayments according to the agreed terms.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {loanData.status === 'active' && (
                  <div className="text-center py-4">
                    <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-300 mb-4">
                      Your loan is active. Repayment features coming soon via smart contract integration.
                    </p>
                    <Link
                      href="/borrower"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      View All Loans
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                )}

                {(loanData.status === 'repaid' || loanData.status === 'defaulted') && (
                  <div className="text-center py-4">
                    <p className="text-gray-300 mb-4">
                      This loan has been closed. View your other loans or apply for a new one.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link
                        href="/borrower"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/borrower/marketplace"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors"
                      >
                        Apply for New Loan
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

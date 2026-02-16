'use client'
import { use, useState, useEffect } from 'react';
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
  Coins,
  AlertCircle,
  Info,
  ChevronRight
} from 'lucide-react';

export default function LoanDetail({ params }) {
  const { loanId } = use(params);
  
  // Loan data from API
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null); // Track HTTP status code
  
  // Payment state
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handlePayLoan = async () => {
    setIsPaying(true);
    
    // Simulate payment processing (hardcoded)
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 1500);
  };

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


            </div>

            {/* Payment Interface */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Loan Repayment</h2>
              
              {!paymentSuccess ? (
                <div className="text-center py-6">
                  <div className="mb-6">
                    <Wallet className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      Ready to repay your loan?
                    </p>
                    <p className="text-sm text-gray-500">
                      Click the button below to complete your loan payment
                    </p>
                  </div>
                  
                  <button
                    onClick={handlePayLoan}
                    disabled={isPaying}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    {isPaying ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-7 h-7" />
                        Repay Loan
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-green-400 mb-3">
                      Loan Has Been Paid! 🎉
                    </h3>
                    <p className="text-gray-300 text-lg mb-4">
                      Your loan has been successfully repaid.
                    </p>
                    <p className="text-sm text-gray-400">
                      Thank you for your timely payment. Your credit score has been updated.
                    </p>
                  </div>
                  
                  <div className="flex gap-3 justify-center mt-6">
                    <Link
                      href="/borrower"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Back to Dashboard
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

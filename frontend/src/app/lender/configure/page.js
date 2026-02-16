'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Coins,
  Clock,
  TrendingUp,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function CreateLoanOffer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Initialize wallet address from localStorage
  const initialWalletAddress = typeof window !== 'undefined' ? localStorage.getItem('wallet') || '' : '';
  
  // Form state
  const [formData, setFormData] = useState({
    lenderAddress: initialWalletAddress,
    amountEth: '',
    durationDays: '30',
    minCreditScore: '650'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    // Hardcoded success - show loan configured message
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form but keep wallet address
      const walletAddress = formData.lenderAddress;
      setFormData({
        lenderAddress: walletAddress,
        amountEth: '',
        durationDays: '30',
        minCreditScore: '650'
      });

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/lender';
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link
          href="/lender"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Loan Offer</h1>
          <p className="text-gray-400">Create a new loan offer on the blockchain</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-8 mb-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-green-400 mb-2">Loan Configured! 🎉</h3>
              <p className="text-gray-300 text-lg">
                Your loan offer has been successfully configured.
              </p>
            </div>
            <p className="text-sm text-gray-400 mt-4">Redirecting to dashboard in 3 seconds...</p>
          </div>
        )}

        {/* Create Offer Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lender Address */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Lender Address*
            </label>
            <input
              type="text"
              value={formData.lenderAddress}
              readOnly
              placeholder="0x..."
              className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-gray-300 font-mono cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Auto-filled from your logged-in wallet
            </p>
          </div>

          {/* Loan Amount */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-green-400" />
              <label className="block text-sm font-medium text-gray-400">
                Loan Amount (ETH)*
              </label>
            </div>
            <input
              type="number"
              step="0.01"
              value={formData.amountEth}
              onChange={(e) => setFormData({ ...formData, amountEth: e.target.value })}
              placeholder="5.0"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2">Amount of ETH you want to lend</p>
          </div>

          {/* Duration */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <label className="block text-sm font-medium text-gray-400">
                Loan Duration (Days)*
              </label>
            </div>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              placeholder="30"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-2">Number of days until loan repayment</p>
          </div>

          {/* Minimum Credit Score */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <label className="block text-sm font-medium text-gray-400">
                Minimum Credit Score*
              </label>
            </div>
            <input
              type="number"
              value={formData.minCreditScore}
              onChange={(e) => setFormData({ ...formData, minCreditScore: e.target.value })}
              placeholder="650"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
              min="300"
              max="850"
            />
            <p className="text-xs text-gray-500 mt-2">Minimum credit score required (300-850)</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Creating Offer...
              </>
            ) : (
              <>
                <Coins className="w-6 h-6" />
                Create Loan Offer
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

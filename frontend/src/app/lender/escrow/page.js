'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Wallet,
  AlertCircle,
  CheckCircle,
  Calendar,
  Coins,
  ExternalLink
} from 'lucide-react';
import { createLoanOffer, isValidEthAddress, formatTxHash } from '@/lib/api/blockchain';

export default function EscrowFunding() {
  const [formData, setFormData] = useState({
    amount: '',
    duration: '',
    creditScore: '',
    lenderAddress: ''
  });

  const [transactionStatus, setTransactionStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [offerId, setOfferId] = useState(null);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Please enter a valid duration in days';
    }

    if (!formData.creditScore || parseFloat(formData.creditScore) < 0 || parseFloat(formData.creditScore) > 850) {
      newErrors.creditScore = 'Credit score must be between 0 and 850';
    }

    if (!formData.lenderAddress) {
      newErrors.lenderAddress = 'Please enter a valid lender address';
    } else if (!isValidEthAddress(formData.lenderAddress)) {
      newErrors.lenderAddress = 'Invalid Ethereum address format (must be 0x followed by 40 hex characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setTransactionStatus('pending');
    setErrorMessage(null);

    try {
      // Call blockchain API to create loan offer
      const result = await createLoanOffer({
        lenderAddress: formData.lenderAddress,
        amountEth: parseFloat(formData.amount),
        durationDays: parseInt(formData.duration),
        minCreditScore: parseInt(formData.creditScore)
      });

      console.log('[Escrow] Loan offer created:', result);
      
      // Store transaction details
      setTxHash(result.txHash);
      setOfferId(result.offerId);
      setTransactionStatus('confirmed');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setTransactionStatus(null);
        setTxHash(null);
        setOfferId(null);
        setFormData({
          amount: '',
          duration: '',
          creditScore: '',
          lenderAddress: ''
        });
      }, 5000);
    } catch (error) {
      console.error('[Escrow] Error creating loan offer:', error);
      setErrorMessage(error.message || 'Failed to create loan offer');
      setTransactionStatus('error');
      
      // Reset error state after 5 seconds
      setTimeout(() => {
        setTransactionStatus(null);
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  // Transaction Status Modal
  if (transactionStatus === 'pending' || transactionStatus === 'confirmed' || transactionStatus === 'error') {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          {transactionStatus === 'pending' && (
            <>
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-3">Creating Offer</h2>
              <p className="text-gray-400">Creating your loan offer on the blockchain...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </>
          )}
          
          {transactionStatus === 'confirmed' && (
            <>
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold mb-3">Success!</h2>
              <p className="text-gray-400 mb-6">Your loan offer has been created on the blockchain.</p>
              
              {offerId && (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Offer ID</p>
                  <p className="text-xl font-bold text-green-400">#{offerId}</p>
                </div>
              )}
              
              {txHash && (
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Transaction Hash</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-sm text-gray-300 font-mono">{formatTxHash(txHash, 8)}</code>
                    <button
                      onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, '_blank')}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-6">Redirecting to dashboard...</p>
            </>
          )}
          
          {transactionStatus === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-3xl font-bold mb-3">Error</h2>
              <p className="text-gray-400 mb-4">Failed to create loan offer</p>
              {errorMessage && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}
              <p className="text-xs text-gray-500">Please try again...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/lender"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Escrow Configuration</h1>
          <p className="text-gray-400">Configure your escrow parameters</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="space-y-8">
            {/* Amount Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Amount (ETH)
                </div>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Ξ</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {['1000', '5000', '10000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleInputChange('amount', preset)}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 hover:border-white transition-colors"
                  >
                    Ξ{parseInt(preset).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Duration (Days)
                </div>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="30"
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
              />
              {errors.duration && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.duration}
                </p>
              )}
              <div className="flex gap-2 mt-3">
                {[
                  { value: '30', label: '30 days' },
                  { value: '60', label: '60 days' },
                  { value: '90', label: '90 days' }
                ].map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handleInputChange('duration', preset.value)}
                    className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-sm hover:bg-zinc-700 hover:border-white transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Credit Score Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Credit Score</label>
              <input
                type="number"
                value={formData.creditScore}
                onChange={(e) => handleInputChange('creditScore', e.target.value)}
                placeholder="750"
                min="0"
                max="850"
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-white transition-colors"
              />
              {errors.creditScore && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.creditScore}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">Score must be between 0 and 850</p>
            </div>

            {/* Lender Address Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Lender Wallet Address
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.lenderAddress}
                  onChange={(e) => handleInputChange('lenderAddress', e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-white transition-colors"
                />
                {formData.lenderAddress && formData.lenderAddress.length >= 10 && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              {errors.lenderAddress && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.lenderAddress}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!formData.amount || !formData.duration || !formData.creditScore || !formData.lenderAddress}
              className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Configure Escrow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

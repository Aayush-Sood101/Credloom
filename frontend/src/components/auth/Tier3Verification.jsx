"use client"

import { useState } from 'react';
import { Shield, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Tier 3 Verification Component
 * Allows users to verify their Gitcoin Passport to upgrade to Tier 3
 */
export default function Tier3Verification() {
  const { verifyTier3, tierStatus } = useAuth();
  const [passportNumber, setPassportNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const tier3Data = tierStatus?.tier3;
  const isAlreadyAttempted = tier3Data?.passport_verified !== null;
  const isVerified = tier3Data?.passport_verified === true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passportNumber.trim()) {
      setError('Please enter a passport number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyTier3(passportNumber);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          isVerified ? 'bg-green-500/10' : 'bg-zinc-800'
        }`}>
          {isVerified ? (
            <Check className="w-6 h-6 text-green-500" />
          ) : (
            <Shield className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tier 3 Verification</h3>
          <p className="text-sm text-gray-400">
            Verify your Gitcoin Passport to upgrade to Tier 3
          </p>
        </div>
      </div>

      {/* Current Status */}
      {isAlreadyAttempted && (
        <div className={`mb-4 p-4 rounded-lg border ${
          isVerified 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-yellow-500/10 border-yellow-500/20'
        }`}>
          <div className="flex items-start gap-2">
            {isVerified ? (
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`font-semibold mb-1 ${
                isVerified ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {isVerified ? 'Verification Successful!' : 'Score Below Threshold'}
              </p>
              <p className="text-sm text-gray-400">
                {isVerified 
                  ? 'You have successfully verified your Tier 3 status.'
                  : `Your Passport score (${tier3Data.score}) is below the required threshold (${tier3Data.threshold}).`
                }
              </p>
              {!isVerified && (
                <p className="text-xs text-gray-500 mt-2">
                  You can increase your score by adding more stamps to your Gitcoin Passport.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="passportNumber" className="block text-sm font-medium text-gray-300 mb-2">
            Passport Number
          </label>
          <input
            type="text"
            id="passportNumber"
            value={passportNumber}
            onChange={(e) => {
              setPassportNumber(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Enter passport identifier"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <X className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {result && !isAlreadyAttempted && (
          <div className={`p-4 rounded-lg border ${
            result.verified 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.verified ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              <span className={`font-semibold ${
                result.verified ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {result.verified ? 'Verification Successful!' : 'Score Below Threshold'}
              </span>
            </div>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Provider: {result.provider}</p>
              <p>Score: {result.score !== null ? result.score : 'N/A'}</p>
              <p>Threshold: {result.threshold}</p>
              {!result.verified && result.score !== null && (
                <p className="mt-2 text-xs text-gray-500">
                  Your score needs to be at least {result.threshold} to pass verification.
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !passportNumber.trim()}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              {isAlreadyAttempted ? 'Re-verify Passport' : 'Verify Passport'}
              <Shield className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
        <p className="text-xs text-gray-400 mb-2">
          <strong className="text-white">About Gitcoin Passport:</strong>
        </p>
        <ul className="text-xs text-gray-400 space-y-1 ml-4">
          <li>• Verification checks your wallet&apos;s Gitcoin Passport score</li>
          <li>• Score is based on various identity stamps and verifications</li>
          <li>• Minimum score of {tier3Data?.threshold || 15.0} required for Tier 3</li>
          <li>• Add more stamps to your passport to increase your score</li>
        </ul>
      </div>
    </div>
  );
}

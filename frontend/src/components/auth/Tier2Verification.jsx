"use client"

import { useState } from 'react';
import { Shield, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Tier 2 Verification Component
 * Allows users to verify their ENS name to upgrade to Tier 2
 */
export default function Tier2Verification() {
  const { verifyTier2, tierStatus } = useAuth();
  const [ensName, setEnsName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const isAlreadyVerified = tierStatus?.tier2?.ens_verified;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!ensName.trim()) {
      setError('Please enter an ENS name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await verifyTier2(ensName);
      
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

  if (isAlreadyVerified) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Check className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Tier 2 Verified</h3>
            <p className="text-sm text-gray-400">
              ENS: {tierStatus.tier2.ens_name}
            </p>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          You have successfully verified your Tier 2 status with ENS.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Tier 2 Verification</h3>
          <p className="text-sm text-gray-400">
            Verify your ENS name to upgrade to Tier 2
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ensName" className="block text-sm font-medium text-gray-300 mb-2">
            ENS Name
          </label>
          <input
            type="text"
            id="ensName"
            value={ensName}
            onChange={(e) => {
              setEnsName(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="vitalik.eth"
            disabled={isLoading}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <X className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.verified 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {result.verified ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className={`font-semibold ${
                result.verified ? 'text-green-500' : 'text-red-500'
              }`}>
                {result.verified ? 'Verification Successful!' : 'Verification Failed'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {result.verified 
                ? `Your ENS name "${result.ens_name}" has been verified.`
                : 'The ENS name could not be verified. Please try again with a valid ENS name.'}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !ensName.trim()}
          className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify ENS
              <Shield className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
        <p className="text-xs text-gray-400">
          <strong className="text-white">Note:</strong> Any non-empty string will be accepted for testing purposes. 
          In production, this would verify against the actual ENS registry.
        </p>
      </div>
    </div>
  );
}

'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Users,
  TrendingUp,
  Info
} from 'lucide-react';

export default function InsuranceConfiguration() {
  const [config, setConfig] = useState({
    // Coverage Parameters
    tiersCovered: {
      excellent: true,  // Credit score 750+
      good: true,       // Credit score 650-749
      fair: false       // Credit score 500-649
    },
    minCreditScore: 600,
    maxCreditScore: 850,
    
    // Premium Rates (as percentage of loan amount)
    premiumRates: {
      excellent: '2.0',   // 750+
      good: '3.5',        // 650-749
      fair: '5.0'         // 500-649
    },
    
    // Coverage Limits
    maxCoveragePerLoan: '10000',
    minCoveragePerLoan: '100',
    coveragePercentage: '100', // Percentage of loan amount to cover
    
    // Pool Settings
    totalPoolCapacity: '500000',
    reserveRatio: '20', // Percentage to keep in reserve
    
    // Risk Management
    maxExposurePerBorrower: '15000',
    maxSimultaneousClaims: '3',
    autoApprove: true,
    autoApproveLimit: '5000', // Auto-approve claims under this amount
    
    // Additional Settings
    gracePeriodDays: '7', // Days after loan default before claim can be filed
    claimProcessingTime: '3', // Days to process claims
    requireBorrowerVerification: true
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const validateConfig = () => {
    const newErrors = {};

    // Credit Score Validation
    if (config.minCreditScore < 300 || config.minCreditScore > 850) {
      newErrors.minCreditScore = 'Credit score must be between 300 and 850';
    }
    if (config.maxCreditScore < config.minCreditScore) {
      newErrors.maxCreditScore = 'Max credit score must be greater than min';
    }

    // Premium Rate Validation
    if (parseFloat(config.premiumRates.excellent) < 0.1 || parseFloat(config.premiumRates.excellent) > 20) {
      newErrors.premiumExcellent = 'Premium rate must be between 0.1% and 20%';
    }
    if (parseFloat(config.premiumRates.good) < 0.1 || parseFloat(config.premiumRates.good) > 20) {
      newErrors.premiumGood = 'Premium rate must be between 0.1% and 20%';
    }
    if (parseFloat(config.premiumRates.fair) < 0.1 || parseFloat(config.premiumRates.fair) > 20) {
      newErrors.premiumFair = 'Premium rate must be between 0.1% and 20%';
    }

    // Coverage Validation
    if (parseFloat(config.maxCoveragePerLoan) < 100 || parseFloat(config.maxCoveragePerLoan) > 50000) {
      newErrors.maxCoverage = 'Max coverage must be between $100 and $50,000';
    }
    if (parseFloat(config.minCoveragePerLoan) < 50 || parseFloat(config.minCoveragePerLoan) > parseFloat(config.maxCoveragePerLoan)) {
      newErrors.minCoverage = 'Min coverage must be between $50 and max coverage';
    }
    if (parseFloat(config.coveragePercentage) < 50 || parseFloat(config.coveragePercentage) > 100) {
      newErrors.coveragePercentage = 'Coverage percentage must be between 50% and 100%';
    }

    // Pool Validation
    if (parseFloat(config.totalPoolCapacity) < 10000) {
      newErrors.poolCapacity = 'Pool capacity must be at least $10,000';
    }
    if (parseFloat(config.reserveRatio) < 10 || parseFloat(config.reserveRatio) > 50) {
      newErrors.reserveRatio = 'Reserve ratio must be between 10% and 50%';
    }

    // Risk Management Validation
    if (parseFloat(config.maxExposurePerBorrower) < parseFloat(config.maxCoveragePerLoan)) {
      newErrors.maxExposure = 'Max exposure must be at least max coverage per loan';
    }
    if (parseInt(config.maxSimultaneousClaims) < 1 || parseInt(config.maxSimultaneousClaims) > 10) {
      newErrors.maxClaims = 'Max simultaneous claims must be between 1 and 10';
    }

    // Tier Coverage Validation
    if (!config.tiersCovered.excellent && !config.tiersCovered.good && !config.tiersCovered.fair) {
      newErrors.tiers = 'At least one tier must be covered';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateConfig()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // TODO: Call API to save configuration
      // await fetch('/api/insurer/configuration', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(config)
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const calculateRiskLevel = () => {
    let riskScore = 0;
    
    // Factor in tier coverage
    if (config.tiersCovered.fair) riskScore += 3;
    if (config.tiersCovered.good) riskScore += 2;
    if (config.tiersCovered.excellent) riskScore += 1;
    
    // Factor in coverage percentage
    if (parseFloat(config.coveragePercentage) >= 90) riskScore += 2;
    else if (parseFloat(config.coveragePercentage) >= 75) riskScore += 1;
    
    // Factor in reserve ratio
    if (parseFloat(config.reserveRatio) < 15) riskScore += 2;
    else if (parseFloat(config.reserveRatio) < 25) riskScore += 1;

    if (riskScore >= 6) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (riskScore >= 4) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  };

  const riskLevel = calculateRiskLevel();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/insurer"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Insurance Configuration</h1>
          <p className="text-gray-400">Set your coverage parameters and premium rates</p>
        </div>

        {/* Save Success Message */}
        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-semibold">Configuration saved successfully!</p>
          </div>
        )}

        {/* Risk Level Indicator */}
        <div className={`${riskLevel.bg} border ${riskLevel.border} rounded-xl p-6 mb-8`}>
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${riskLevel.color}`} />
            <div className="flex-1">
              <p className="text-sm text-gray-400">Current Risk Level</p>
              <p className={`text-2xl font-bold ${riskLevel.color}`}>{riskLevel.level}</p>
            </div>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="space-y-6">
          {/* Tier Coverage */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Tier Coverage
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Select which borrower tiers you want to provide insurance coverage for
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-green-400">Excellent Tier</p>
                  <p className="text-sm text-gray-400">Credit Score: 750+</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.tiersCovered.excellent}
                    onChange={(e) => setConfig({
                      ...config,
                      tiersCovered: { ...config.tiersCovered, excellent: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-blue-400">Good Tier</p>
                  <p className="text-sm text-gray-400">Credit Score: 650-749</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.tiersCovered.good}
                    onChange={(e) => setConfig({
                      ...config,
                      tiersCovered: { ...config.tiersCovered, good: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-yellow-400">Fair Tier</p>
                  <p className="text-sm text-gray-400">Credit Score: 500-649</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.tiersCovered.fair}
                    onChange={(e) => setConfig({
                      ...config,
                      tiersCovered: { ...config.tiersCovered, fair: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                </label>
              </div>

              {errors.tiers && (
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tiers}
                </p>
              )}
            </div>
          </div>

          {/* Credit Score Range */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Credit Score Range</h2>
            <p className="text-sm text-gray-400 mb-6">
              Set the acceptable credit score range for insurance coverage
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Minimum Credit Score</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={config.minCreditScore}
                  onChange={(e) => setConfig({ ...config, minCreditScore: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.minCreditScore && (
                  <p className="text-red-400 text-sm mt-1">{errors.minCreditScore}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Maximum Credit Score</label>
                <input
                  type="number"
                  min="300"
                  max="850"
                  value={config.maxCreditScore}
                  onChange={(e) => setConfig({ ...config, maxCreditScore: parseInt(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.maxCreditScore && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxCreditScore}</p>
                )}
              </div>
            </div>
          </div>

          {/* Premium Rates */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              Premium Rates
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Set premium rates as a percentage of the loan amount for each tier
            </p>

            <div className="space-y-4">
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <label className="block text-sm font-semibold text-green-400 mb-2">
                  Excellent Tier (750+)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.excellent}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, excellent: e.target.value }
                    })}
                    disabled={!config.tiersCovered.excellent}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
                {errors.premiumExcellent && (
                  <p className="text-red-400 text-sm mt-2">{errors.premiumExcellent}</p>
                )}
                {config.tiersCovered.excellent && (
                  <p className="text-xs text-gray-400 mt-2">
                    Example: $5,000 loan = ${(parseFloat(config.premiumRates.excellent) / 100 * 5000).toFixed(2)} premium
                  </p>
                )}
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <label className="block text-sm font-semibold text-blue-400 mb-2">
                  Good Tier (650-749)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.good}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, good: e.target.value }
                    })}
                    disabled={!config.tiersCovered.good}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
                {errors.premiumGood && (
                  <p className="text-red-400 text-sm mt-2">{errors.premiumGood}</p>
                )}
                {config.tiersCovered.good && (
                  <p className="text-xs text-gray-400 mt-2">
                    Example: $5,000 loan = ${(parseFloat(config.premiumRates.good) / 100 * 5000).toFixed(2)} premium
                  </p>
                )}
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <label className="block text-sm font-semibold text-yellow-400 mb-2">
                  Fair Tier (500-649)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={config.premiumRates.fair}
                    onChange={(e) => setConfig({
                      ...config,
                      premiumRates: { ...config.premiumRates, fair: e.target.value }
                    })}
                    disabled={!config.tiersCovered.fair}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors disabled:opacity-50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
                {errors.premiumFair && (
                  <p className="text-red-400 text-sm mt-2">{errors.premiumFair}</p>
                )}
                {config.tiersCovered.fair && (
                  <p className="text-xs text-gray-400 mt-2">
                    Example: $5,000 loan = ${(parseFloat(config.premiumRates.fair) / 100 * 5000).toFixed(2)} premium
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Coverage Limits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Coverage Limits</h2>
            <p className="text-sm text-gray-400 mb-6">
              Define the coverage limits for individual loans
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Minimum Coverage Per Loan ($)</label>
                <input
                  type="number"
                  step="50"
                  min="50"
                  value={config.minCoveragePerLoan}
                  onChange={(e) => setConfig({ ...config, minCoveragePerLoan: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.minCoverage && (
                  <p className="text-red-400 text-sm mt-1">{errors.minCoverage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Maximum Coverage Per Loan ($)</label>
                <input
                  type="number"
                  step="100"
                  min="100"
                  max="50000"
                  value={config.maxCoveragePerLoan}
                  onChange={(e) => setConfig({ ...config, maxCoveragePerLoan: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.maxCoverage && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxCoverage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Coverage Percentage (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={config.coveragePercentage}
                  onChange={(e) => setConfig({ ...config, coveragePercentage: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                />
                {errors.coveragePercentage && (
                  <p className="text-red-400 text-sm mt-1">{errors.coveragePercentage}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Percentage of the loan amount that will be covered in case of default
                </p>
              </div>
            </div>
          </div>

          {/* Pool Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Pool Settings
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Configure your insurance pool capacity and reserves
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Total Pool Capacity ($)</label>
                <input
                  type="number"
                  step="10000"
                  min="10000"
                  value={config.totalPoolCapacity}
                  onChange={(e) => setConfig({ ...config, totalPoolCapacity: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {errors.poolCapacity && (
                  <p className="text-red-400 text-sm mt-1">{errors.poolCapacity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Reserve Ratio (%)</label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={config.reserveRatio}
                  onChange={(e) => setConfig({ ...config, reserveRatio: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {errors.reserveRatio && (
                  <p className="text-red-400 text-sm mt-1">{errors.reserveRatio}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Percentage of pool to keep in reserve: ${(parseFloat(config.totalPoolCapacity) * parseFloat(config.reserveRatio) / 100).toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Risk Management
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Set risk management parameters and claim processing rules
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Exposure Per Borrower ($)</label>
                <input
                  type="number"
                  step="1000"
                  value={config.maxExposurePerBorrower}
                  onChange={(e) => setConfig({ ...config, maxExposurePerBorrower: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                />
                {errors.maxExposure && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxExposure}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Max Simultaneous Claims</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={config.maxSimultaneousClaims}
                  onChange={(e) => setConfig({ ...config, maxSimultaneousClaims: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                />
                {errors.maxClaims && (
                  <p className="text-red-400 text-sm mt-1">{errors.maxClaims}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Grace Period After Default (Days)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={config.gracePeriodDays}
                  onChange={(e) => setConfig({ ...config, gracePeriodDays: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Claim Processing Time (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={config.claimProcessingTime}
                  onChange={(e) => setConfig({ ...config, claimProcessingTime: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold">Auto-Approve Claims</p>
                  <p className="text-sm text-gray-400">Automatically approve claims below threshold</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.autoApprove}
                    onChange={(e) => setConfig({ ...config, autoApprove: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>

              {config.autoApprove && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Auto-Approve Limit ($)</label>
                  <input
                    type="number"
                    step="500"
                    value={config.autoApproveLimit}
                    onChange={(e) => setConfig({ ...config, autoApproveLimit: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Claims under this amount will be automatically approved
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold">Require Borrower Verification</p>
                  <p className="text-sm text-gray-400">Extra verification for borrowers before coverage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.requireBorrowerVerification}
                    onChange={(e) => setConfig({ ...config, requireBorrowerVerification: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Configuration Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tiers Covered:</span>
                  <span className="font-semibold">
                    {[
                      config.tiersCovered.excellent && 'Excellent',
                      config.tiersCovered.good && 'Good',
                      config.tiersCovered.fair && 'Fair'
                    ].filter(Boolean).join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Credit Score Range:</span>
                  <span className="font-semibold">{config.minCreditScore} - {config.maxCreditScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage Range:</span>
                  <span className="font-semibold">${config.minCoveragePerLoan} - ${config.maxCoveragePerLoan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Coverage Percentage:</span>
                  <span className="font-semibold">{config.coveragePercentage}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pool Capacity:</span>
                  <span className="font-semibold">${config.totalPoolCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reserve Amount:</span>
                  <span className="font-semibold text-green-400">
                    ${(parseFloat(config.totalPoolCapacity) * parseFloat(config.reserveRatio) / 100).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Exposure/Borrower:</span>
                  <span className="font-semibold">${config.maxExposurePerBorrower}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Auto-Approval:</span>
                  <span className="font-semibold">
                    {config.autoApprove ? `Up to $${config.autoApproveLimit}` : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving || Object.keys(errors).length > 0}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-zinc-800 disabled:text-gray-600 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Configuration...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

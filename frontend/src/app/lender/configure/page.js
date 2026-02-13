'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  Percent,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  Save
} from 'lucide-react';

export default function RiskConfiguration() {
  // Mock current configuration - TODO: Fetch from API
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form state
  const [config, setConfig] = useState({
    minCreditScore: 650,
    maxCreditScore: 900,
    minLoanAmount: 500,
    maxLoanAmount: 5000,
    preferredDurations: {
      30: true,
      60: true,
      90: true
    },
    interestRates: {
      excellent: 8,  // 800+ score
      good: 10,      // 650-799 score
      fair: 12       // 500-649 score
    },
    autoLending: true,
    requireInsurance: false,
    maxExposurePerBorrower: 5000,
    portfolioLimit: 50000
  });

  const [errors, setErrors] = useState({});

  const validateConfig = () => {
    const newErrors = {};

    if (config.minCreditScore < 300 || config.minCreditScore > 850) {
      newErrors.minCreditScore = 'Credit score must be between 300 and 850';
    }

    if (config.maxCreditScore < config.minCreditScore) {
      newErrors.maxCreditScore = 'Max score must be greater than min score';
    }

    if (config.minLoanAmount < 100) {
      newErrors.minLoanAmount = 'Minimum loan amount must be at least $100';
    }

    if (config.maxLoanAmount < config.minLoanAmount) {
      newErrors.maxLoanAmount = 'Max amount must be greater than min amount';
    }

    if (!config.preferredDurations[30] && !config.preferredDurations[60] && !config.preferredDurations[90]) {
      newErrors.durations = 'Select at least one duration';
    }

    if (config.interestRates.excellent < 1 || config.interestRates.excellent > 50) {
      newErrors.rateExcellent = 'Rate must be between 1% and 50%';
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

    // TODO: Call API to save configuration
    // const response = await fetch('/api/lender/configure', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(config)
    // });

    // Mock API delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  const getRiskLevel = () => {
    const avgScore = (config.minCreditScore + config.maxCreditScore) / 2;
    if (avgScore >= 750) return { label: 'Low Risk', color: 'text-green-400' };
    if (avgScore >= 600) return { label: 'Medium Risk', color: 'text-yellow-400' };
    return { label: 'High Risk', color: 'text-red-400' };
  };

  const risk = getRiskLevel();

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link
          href="/lender"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Risk Configuration</h1>
          <p className="text-gray-400">Set your lending preferences and risk tolerance</p>
        </div>

        {/* Risk Level Indicator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Risk Profile</p>
                <p className={`text-xl font-bold ${risk.color}`}>{risk.label}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Saving...
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

        {saveSuccess && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-400 font-semibold">Configuration saved successfully!</p>
            </div>
          </div>
        )}

        {/* Credit Score Range */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Credit Score Range</h2>
            <button className="ml-auto text-gray-400 hover:text-white transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Minimum Credit Score
              </label>
              <input
                type="number"
                value={config.minCreditScore}
                onChange={(e) => setConfig({ ...config, minCreditScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                min="300"
                max="850"
              />
              {errors.minCreditScore && (
                <p className="text-xs text-red-400 mt-1">{errors.minCreditScore}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Minimum: 300</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Maximum Credit Score
              </label>
              <input
                type="number"
                value={config.maxCreditScore}
                onChange={(e) => setConfig({ ...config, maxCreditScore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                min="300"
                max="850"
              />
              {errors.maxCreditScore && (
                <p className="text-xs text-red-400 mt-1">{errors.maxCreditScore}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">Maximum: 850</p>
            </div>
          </div>

          <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Only borrowers within this credit score range will be matched with your funds
            </p>
          </div>
        </div>

        {/* Loan Amount Range */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-bold">Loan Amount Range</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Minimum Loan Amount ($)
              </label>
              <input
                type="number"
                value={config.minLoanAmount}
                onChange={(e) => setConfig({ ...config, minLoanAmount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                min="100"
              />
              {errors.minLoanAmount && (
                <p className="text-xs text-red-400 mt-1">{errors.minLoanAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Maximum Loan Amount ($)
              </label>
              <input
                type="number"
                value={config.maxLoanAmount}
                onChange={(e) => setConfig({ ...config, maxLoanAmount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.maxLoanAmount && (
                <p className="text-xs text-red-400 mt-1">{errors.maxLoanAmount}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Maximum Exposure Per Borrower ($)
            </label>
            <input
              type="number"
              value={config.maxExposurePerBorrower}
              onChange={(e) => setConfig({ ...config, maxExposurePerBorrower: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2">Maximum amount you want to lend to a single borrower</p>
          </div>
        </div>

        {/* Preferred Durations */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold">Preferred Loan Durations</h2>
          </div>

          <div className="space-y-3">
            {[30, 60, 90].map((duration) => (
              <label key={duration} className="flex items-center gap-3 p-4 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="checkbox"
                  checked={config.preferredDurations[duration]}
                  onChange={(e) => setConfig({
                    ...config,
                    preferredDurations: {
                      ...config.preferredDurations,
                      [duration]: e.target.checked
                    }
                  })}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-semibold">{duration} Days</p>
                  <p className="text-sm text-gray-400">
                    {duration === 30 && 'Short-term loans with faster turnover'}
                    {duration === 60 && 'Medium-term loans with balanced risk'}
                    {duration === 90 && 'Long-term loans with higher returns'}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {errors.durations && (
            <p className="text-xs text-red-400 mt-3">{errors.durations}</p>
          )}
        </div>

        {/* Interest Rates */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Percent className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold">Interest Rates by Credit Tier</h2>
          </div>

          <div className="space-y-4">
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-green-400">Excellent (800-850)</p>
                  <p className="text-sm text-gray-400">Low risk borrowers</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.interestRates.excellent}
                    onChange={(e) => setConfig({
                      ...config,
                      interestRates: {
                        ...config.interestRates,
                        excellent: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-blue-400">Good (650-799)</p>
                  <p className="text-sm text-gray-400">Medium risk borrowers</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.interestRates.good}
                    onChange={(e) => setConfig({
                      ...config,
                      interestRates: {
                        ...config.interestRates,
                        good: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-yellow-400">Fair (500-649)</p>
                  <p className="text-sm text-gray-400">Higher risk borrowers</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.interestRates.fair}
                    onChange={(e) => setConfig({
                      ...config,
                      interestRates: {
                        ...config.interestRates,
                        fair: parseInt(e.target.value) || 0
                      }
                    })}
                    className="w-20 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-center focus:outline-none focus:border-blue-500"
                    min="1"
                    max="50"
                  />
                  <span className="text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-400 flex items-start gap-2">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              Interest rates are applied based on the borrower&apos;s credit score at the time of loan issuance
            </p>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="text-xl font-bold">Additional Settings</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.autoLending}
                  onChange={(e) => setConfig({ ...config, autoLending: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="font-semibold">Enable Auto-Lending</p>
                  <p className="text-sm text-gray-400">Automatically match and fund loans that meet your criteria</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                config.autoLending ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
              }`}>
                {config.autoLending ? 'Enabled' : 'Disabled'}
              </span>
            </label>

            <label className="flex items-center justify-between p-4 bg-zinc-800 border border-zinc-700 rounded-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.requireInsurance}
                  onChange={(e) => setConfig({ ...config, requireInsurance: e.target.checked })}
                  className="w-5 h-5"
                />
                <div>
                  <p className="font-semibold">Require Insurance</p>
                  <p className="text-sm text-gray-400">Only fund loans that have insurance coverage</p>
                </div>
              </div>
              <Shield className={`w-5 h-5 ${config.requireInsurance ? 'text-green-400' : 'text-gray-400'}`} />
            </label>

            <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Total Portfolio Limit ($)
              </label>
              <input
                type="number"
                value={config.portfolioLimit}
                onChange={(e) => setConfig({ ...config, portfolioLimit: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">Maximum total amount you want to have deployed across all loans</p>
            </div>
          </div>
        </div>

        {/* Risk Summary */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-400 mb-2">Risk Summary</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Credit Score Range: {config.minCreditScore} - {config.maxCreditScore}</li>
                <li>• Loan Amount Range: ${config.minLoanAmount} - ${config.maxLoanAmount}</li>
                <li>• Accepted Durations: {Object.entries(config.preferredDurations).filter(([_, enabled]) => enabled).map(([days]) => `${days}d`).join(', ')}</li>
                <li>• Auto-Lending: {config.autoLending ? 'Enabled' : 'Disabled'}</li>
                <li>• Insurance Required: {config.requireInsurance ? 'Yes' : 'No'}</li>
                <li>• Portfolio Limit: ${config.portfolioLimit}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isSaving ? (
            <>
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Saving Configuration...
            </>
          ) : (
            <>
              <Save className="w-6 h-6" />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
}

"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, AlertCircle, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpForm({ role, icon: Icon, title, description }) {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    wallet: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Get role-specific information
  const getRoleInfo = () => {
    const roleInfo = {
      'borrower': {
        roleName: 'Borrower',
        hasTiers: true,
        benefits: [
          'Access instant loans from the marketplace',
          'AI-powered credit scoring',
          'Flexible repayment terms',
          'Privacy-preserving verification'
        ],
        tierBenefits: 'Upgrade to higher tiers for better interest rates and larger loan amounts.',
        nextSteps: 'After registration, you\'ll start at Tier 1. Verify your ENS for Tier 2, then add Gitcoin Passport for Tier 3 to unlock better loan terms.'
      },
      'lender': {
        roleName: 'Lender',
        hasTiers: false,
        benefits: [
          'Earn competitive returns on your capital',
          'Automated loan matching system',
          'Risk-based interest rates',
          'Optional loan insurance protection'
        ],
        nextSteps: 'After registration, you can start lending immediately by configuring your lending parameters and browsing available loan opportunities.'
      },
      'insurer': {
        roleName: 'Insurer',
        hasTiers: false,
        benefits: [
          'Earn premiums by insuring loans',
          'Automated risk assessment tools',
          'Smart contract-based claims',
          'Diversified premium portfolio'
        ],
        nextSteps: 'After registration, you can start insuring loans by setting your risk parameters and reviewing available loan insurance opportunities.'
      }
    };
    return roleInfo[role] || roleInfo['borrower'];
  };

  const roleInfo = getRoleInfo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.wallet.trim()) {
      newErrors.wallet = 'Wallet address is required';
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.wallet)) {
      newErrors.wallet = 'Invalid Ethereum wallet address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      // All users start at Tier 1, role determines what they can do
      const result = await register({
        username: formData.username,
        password: formData.password,
        wallet: formData.wallet,
        role: role  // Send role, not tier mapping
      });

      if (result.success) {
        // Show success message and redirect to sign in
        router.push('/signin?registered=true');
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLinks = () => {
    const roles = [
      { name: 'Borrower', path: '/signup-borrower' },
      { name: 'Lender', path: '/signup-lender' },
      { name: 'Insurer', path: '/signup-insurer' }
    ];
    return roles.filter(r => r.name.toLowerCase() !== role);
  };

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Icon className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Form Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        {/* Role Information Banner */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-blue-400 mb-1">Signing up as: {roleInfo.roleName}</p>
              <p className="text-sm text-gray-300 mb-2">As a {roleInfo.roleName.toLowerCase()}, you&apos;ll get access to:</p>
              <ul className="text-sm text-gray-400 space-y-1 mb-2">
                {roleInfo.benefits.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
              {roleInfo.hasTiers && (
                <p className="text-xs text-blue-300/80 mt-2">
                  📊 <strong>Tiers:</strong> {roleInfo.tierBenefits}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.username ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`}
                placeholder="your_username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Wallet Address Field */}
          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-300 mb-2">
              Ethereum Wallet Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Wallet className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="wallet"
                name="wallet"
                value={formData.wallet}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.wallet ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent font-mono text-sm`}
                placeholder="0x..."
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Your wallet will be used for all transactions on the platform
            </p>
            {errors.wallet && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.wallet}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.password ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Next Steps Info */}
        <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg">
          <p className="text-xs font-semibold text-white mb-2">📋 What happens next?</p>
          <p className="text-xs text-gray-400 mb-3">{roleInfo.nextSteps}</p>
          {roleInfo.hasTiers && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>• <strong>Tier 1</strong> (Starting tier) - Basic access to platform features</p>
              <p>• <strong>Tier 2</strong> (ENS verified) - Enhanced features and better terms</p>
              <p>• <strong>Tier 3</strong> (Passport verified) - Premium access and best rates</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-700"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-zinc-700"></div>
        </div>

        {/* Sign up as different role */}
        <div className="mt-6 space-y-3">
          {getRoleLinks().map((roleLink) => (
            <Link
              key={roleLink.path}
              href={roleLink.path}
              className="block w-full text-center py-2.5 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors duration-200"
            >
              Sign up as {roleLink.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sign In Link */}
      <p className="text-center mt-6 text-gray-400">
        Already have an account?{' '}
        <Link href="/signin" className="text-white font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

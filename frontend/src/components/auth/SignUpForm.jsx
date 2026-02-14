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
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{title}</h1>
        <p className="text-gray-400 text-lg">{description}</p>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Role Information Banner */}
        

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {apiError}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="group">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <User className={`h-5 w-5 transition-colors ${
                  errors.username ? 'text-red-400' : 'text-gray-500 group-focus-within:text-white'
                }`} />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3.5 bg-black/50 border-2 ${
                  errors.username 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-zinc-700 focus:border-white'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-200`}
                placeholder="your_username"
              />
            </div>
            {errors.username && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Wallet Address Field */}
          <div className="group">
            <label htmlFor="wallet" className="block text-sm font-semibold text-gray-300 mb-2">
              Ethereum Wallet Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <Wallet className={`h-5 w-5 transition-colors ${
                  errors.wallet ? 'text-red-400' : 'text-gray-500 group-focus-within:text-white'
                }`} />
              </div>
              <input
                type="text"
                id="wallet"
                name="wallet"
                value={formData.wallet}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3.5 bg-black/50 border-2 ${
                  errors.wallet 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-zinc-700 focus:border-white'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-200 font-mono text-sm`}
                placeholder="0x..."
              />
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              Your wallet will be used for all transactions on the platform
            </p>
            {errors.wallet && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.wallet}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="group">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <Lock className={`h-5 w-5 transition-colors ${
                  errors.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-white'
                }`} />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3.5 bg-black/50 border-2 ${
                  errors.password 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-zinc-700 focus:border-white'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-200`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="group">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
                <Lock className={`h-5 w-5 transition-colors ${
                  errors.confirmPassword ? 'text-red-400' : 'text-gray-500 group-focus-within:text-white'
                }`} />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`block w-full pl-12 pr-4 py-3.5 bg-black/50 border-2 ${
                  errors.confirmPassword 
                    ? 'border-red-500/50 focus:border-red-500' 
                    : 'border-zinc-700 focus:border-white'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-200`}
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full bg-gradient-to-r from-white to-gray-100 text-black py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Next Steps Info */}
        <div className="mt-6 p-5 bg-gradient-to-br from-zinc-800/80 to-zinc-800/40 rounded-xl border border-zinc-700/50">
          <p className="text-xs font-bold text-white mb-2 flex items-center gap-2">
            <span className="text-lg">📋</span> What happens next?
          </p>
          <p className="text-xs text-gray-300 mb-3 leading-relaxed">{roleInfo.nextSteps}</p>
          {roleInfo.hasTiers && (
            <div className="text-xs text-gray-400 space-y-2 mt-3 pt-3 border-t border-zinc-700/50">
              <p className="flex items-start gap-2">
                <span className="text-blue-400 font-bold flex-shrink-0">• Tier 1</span>
                <span>(Starting tier) - Basic access to platform features</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-purple-400 font-bold flex-shrink-0">• Tier 2</span>
                <span>(ENS verified) - Enhanced features and better terms</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 font-bold flex-shrink-0">• Tier 3</span>
                <span>(Passport verified) - Premium access and best rates</span>
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          <span className="text-sm text-gray-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
        </div>

        {/* Sign up as different role */}
        <div className="mt-6 space-y-2.5">
          {getRoleLinks().map((roleLink) => (
            <Link
              key={roleLink.path}
              href={roleLink.path}
              className="block w-full text-center py-3 border-2 border-zinc-700 rounded-xl text-gray-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign up as {roleLink.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Sign In Link */}
      <p className="text-center mt-8 text-gray-400">
        Already have an account?{' '}
        <Link href="/signin" className="text-white font-semibold hover:text-gray-300 transition-all duration-200 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

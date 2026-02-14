"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

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
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Redirect based on user role
        const role = result.role || 'borrower'; // Default to borrower if role not found
        const roleRoutes = {
          'borrower': '/borrower',
          'lender': '/lender',
          'insurer': '/insurer'
        };
        router.push(roleRoutes[role] || '/borrower');
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome Back</h1>
        <p className="text-gray-400 text-lg">Sign in to your Credloom account</p>
      </div>

      {/* Form Card */}
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
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
                <Mail className={`h-5 w-5 transition-colors ${
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

          {/* Password Field */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-all duration-200 hover:underline">
                Forgot password?
              </Link>
            </div>
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
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
          <span className="text-sm text-gray-500 font-medium">New to Credloom?</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
        </div>

        {/* Sign up links */}
        <div className="mt-6 space-y-2.5">
          <Link
            href="/signup-borrower"
            className="block w-full text-center py-3 border-2 border-zinc-700 rounded-xl text-gray-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            Sign up as Borrower
          </Link>
          <Link
            href="/signup-lender"
            className="block w-full text-center py-3 border-2 border-zinc-700 rounded-xl text-gray-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            Sign up as Lender
          </Link>
          <Link
            href="/signup-insurer"
            className="block w-full text-center py-3 border-2 border-zinc-700 rounded-xl text-gray-300 hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-200 font-medium hover:scale-[1.01] active:scale-[0.99]"
          >
            Sign up as Insurer
          </Link>
        </div>
      </div>
    </div>
  );
}

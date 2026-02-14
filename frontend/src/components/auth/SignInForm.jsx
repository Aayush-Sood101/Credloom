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
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to your Credloom account</p>
      </div>

      {/* Form Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
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
                <Mail className="h-5 w-5 text-gray-500" />
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

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-700"></div>
          <span className="text-sm text-gray-500">New to Credloom?</span>
          <div className="flex-1 h-px bg-zinc-700"></div>
        </div>

        {/* Sign up links */}
        <div className="mt-6 space-y-3">
          <Link
            href="/signup-borrower"
            className="block w-full text-center py-2.5 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors duration-200"
          >
            Sign up as Borrower
          </Link>
          <Link
            href="/signup-lender"
            className="block w-full text-center py-2.5 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors duration-200"
          >
            Sign up as Lender
          </Link>
          <Link
            href="/signup-insurer"
            className="block w-full text-center py-2.5 border border-zinc-700 rounded-lg text-gray-300 hover:bg-zinc-800 transition-colors duration-200"
          >
            Sign up as Insurer
          </Link>
        </div>
      </div>

      {/* Back to Home Link */}
      <p className="text-center mt-6 text-gray-400">
        <Link href="/" className="text-white font-semibold hover:underline">
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}

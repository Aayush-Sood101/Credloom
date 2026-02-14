"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
    
    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sign in successful:', data);
        
        // TODO: Get user role from backend response
        // Redirect based on role returned from backend
        const userRole = data.role; // This should come from your backend
        
        switch(userRole) {
          case 'borrower':
            router.push('/borrower');
            break;
          case 'lender':
            router.push('/lender');
            break;
          case 'insurer':
            router.push('/insurer');
            break;
          default:
            router.push('/');
        }
      } else {
        const error = await response.json();
        alert(`Sign in failed: ${error.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Mock response for testing - remove this when backend is ready
      console.log('Using mock sign in for testing');
      const mockRole = formData.email.includes('lender') ? 'lender' 
                      : formData.email.includes('insurer') ? 'insurer' 
                      : 'borrower';
      
      setTimeout(() => {
        router.push(`/${mockRole}`);
      }, 500);
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.email ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
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

        {/* Info Box for Testing */}
        <div className="mt-6 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
          <p className="text-xs text-gray-400 mb-2">
            <strong className="text-white">For Testing:</strong> Backend will return user role and redirect:
          </p>
          <ul className="text-xs text-gray-400 space-y-1 ml-4">
            <li>• Borrower → /borrower</li>
            <li>• Lender → /lender</li>
            <li>• Insurer → /insurer</li>
          </ul>
          <p className="text-xs text-gray-500 mt-2">
            (Currently using email mock: emails with &apos;lender&apos; or &apos;insurer&apos; will route accordingly)
          </p>
        </div>

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

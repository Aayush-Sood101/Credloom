"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function SignUpForm({ role, icon: Icon, title, description }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
    
    try {
      // TODO: Replace with actual API call to backend
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: role
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        // TODO: Redirect to dashboard based on role
        // router.push(`/${role}`);
      } else {
        const error = await response.json();
        alert(`Signup failed: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Backend integration pending.');
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-3 bg-black border ${
                  errors.name ? 'border-red-500' : 'border-zinc-700'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

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
                Create Account
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

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

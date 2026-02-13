"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, SignOutButton } from "@clerk/nextjs";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  
  // Get user type from Clerk metadata
  const userType = user?.unsafeMetadata?.userType;

  const getDashboardLink = () => {
    if (!isSignedIn) return "/sign-in";
    
    switch (userType) {
      case "borrower":
        return "/borrower";
      case "lender":
        return "/lender";
      case "insurer":
        return "/insurer";
      default:
        return "/select-role";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-800">
      {/* Main Nav */}
      <nav className="w-full flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Credloom</span>
        </Link>

        {/* Center Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-zinc-400 text-sm font-medium transition-colors duration-300 hover:text-white"
          >
            Home
          </Link>
          <Link
            href={getDashboardLink()}
            className="text-zinc-400 text-sm font-medium transition-colors duration-300 hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/contact"
            className="text-zinc-400 text-sm font-medium transition-colors duration-300 hover:text-white"
          >
            Contact Us
          </Link>
          
        </div>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-lg">
                <span className="text-sm text-white font-medium">
                  {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User"}
                </span>
              </div>
              <SignOutButton>
                <button className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          ) : (
            <>

              {/* Log In Button */}
              <Link
                href="/sign-in"
                className="px-5 py-2.5 text-sm font-medium text-white border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-900 transition-colors"
              >
                Log In
              </Link>
              {/* Sign Up Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsSignUpOpen(true)}
                onMouseLeave={() => setIsSignUpOpen(false)}
              >
                <button
                  className="flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold bg-white text-black rounded-lg hover:bg-zinc-200 transition-colors"
                >
                  Sign Up
                  <FiChevronDown className={`transition-transform duration-300 ${isSignUpOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isSignUpOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 py-2 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl"
                    >
                      <Link
                        href="/sign-up/borrower"
                        className="block px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <div className="font-medium">Sign up as Borrower</div>
                        <div className="text-xs text-zinc-600 mt-0.5">Access micro-loans</div>
                      </Link>
                      <div className="h-px bg-zinc-800 my-1"></div>
                      <Link
                        href="/sign-up/lender"
                        className="block px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <div className="font-medium">Sign up as Lender</div>
                        <div className="text-xs text-zinc-600 mt-0.5">Provide liquidity</div>
                      </Link>
                      <div className="h-px bg-zinc-800 my-1"></div>
                      <Link
                        href="/sign-up/insurer"
                        className="block px-4 py-3 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                      >
                        <div className="font-medium">Sign up as Insurer</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Offer coverage</div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-all"
        >
          {isMenuOpen ? (
            <FiX className="h-6 w-6" />
          ) : (
            <FiMenu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center space-y-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link
                href="/contact"
                className="text-2xl font-medium text-white hover:text-emerald-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href={getDashboardLink()}
                className="text-2xl font-medium text-white hover:text-emerald-400 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </motion.div>

            {isSignedIn ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-zinc-300">
                    {userType ? userType.charAt(0).toUpperCase() + userType.slice(1) : "User"}
                  </span>
                </div>
                <SignOutButton>
                  <button className="text-lg text-zinc-300 hover:text-white">
                    Sign Out
                  </button>
                </SignOutButton>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center gap-3"
                >
                  <p className="text-sm text-zinc-400 mb-2">Sign up as:</p>
                  <Link
                    href="/sign-up/borrower"
                    className="px-6 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Borrower
                  </Link>
                  <Link
                    href="/sign-up/lender"
                    className="px-6 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lender
                  </Link>
                  <Link
                    href="/sign-up/insurer"
                    className="px-6 py-3 text-lg font-medium text-white rounded-full bg-gradient-to-r from-emerald-600 to-cyan-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Insurer
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/sign-in"
                    className="text-lg font-medium text-zinc-300 hover:text-white transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

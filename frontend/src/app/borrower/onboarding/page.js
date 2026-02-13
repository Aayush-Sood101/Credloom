"use client";

import { Shield, CheckCircle, Lock, Wallet } from "lucide-react";
import { useState } from "react";

export default function BorrowerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, title: "Wallet Connection", icon: Wallet },
    { id: 2, title: "Identity Verification", icon: Lock },
    { id: 3, title: "Data Consent", icon: CheckCircle },
    { id: 4, title: "Stake Locking", icon: Shield },
    { id: 5, title: "Complete", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-zinc-950" />
            </div>
            <span className="text-xl font-bold">Credloom</span>
          </div>
          <div className="text-sm text-zinc-400">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted
                          ? "bg-emerald-500"
                          : isCurrent
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-500"
                          : "bg-zinc-800"
                      }`}
                    >
                      <Icon className="w-6 h-6 text-zinc-950" />
                    </div>
                    <span className={`text-xs text-center ${isCurrent ? "text-zinc-100" : "text-zinc-500"}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 -mt-8 ${isCompleted ? "bg-emerald-500" : "bg-zinc-800"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Borrower Onboarding</h2>
          <p className="text-zinc-400 mb-8">
            Complete these steps to start borrowing on Credloom. This onboarding flow will be fully implemented soon.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
              <h3 className="font-semibold mb-2">Step 1: Wallet Connection</h3>
              <p className="text-sm text-zinc-400">Connect your Web3 wallet to get started</p>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Step 2: Identity Verification</h3>
              <p className="text-sm text-zinc-400">Verify your identity via DigiLocker (privacy-preserving)</p>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Step 3: Data Consent</h3>
              <p className="text-sm text-zinc-400">Choose what on-chain data to use for credit scoring</p>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Step 4: Stake Locking</h3>
              <p className="text-sm text-zinc-400">Lock your stake to enable borrowing</p>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl opacity-50">
              <h3 className="font-semibold mb-2">Step 5: Complete</h3>
              <p className="text-sm text-zinc-400">Your profile is ready!</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <p className="text-sm text-zinc-300">
              <strong>Coming Soon:</strong> Full onboarding implementation with wallet integration, 
              verification flow, and smart contract interactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

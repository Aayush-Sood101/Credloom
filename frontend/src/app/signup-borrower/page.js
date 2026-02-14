'use client'
import SignUpForm from '@/components/auth/SignUpForm';
import { Shield } from 'lucide-react';
import { WavyBackground } from '@/components/wavy-background';
export default function SignupBorrower() {
  return (
    <WavyBackground
      colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]}
      backgroundFill="black"
      blur={10}
      speed="slow"
      waveOpacity={0.5}
      // We use flexbox to perfectly center the sign-in card inside the available space.
      containerClassName="h-full flex items-center justify-center p-4"
    >
    <div className="text-white flex items-center justify-center px-4 py-32">
      <SignUpForm 
        role="borrower"
        icon={Shield}
        title="Create Borrower Account"
        description="Join Credloom as a borrower and access instant loans"
      />
    </div>
    </WavyBackground>
  );
}

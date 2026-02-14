'use client'
import SignUpForm from '@/components/auth/SignUpForm';
import { TrendingUp } from 'lucide-react';
import { WavyBackground } from '@/components/wavy-background';
export default function SignupLender() {
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
        role="lender"
        icon={TrendingUp}
        title="Create Lender Account"
        description="Join Credloom as a lender and earn competitive returns"
      />
    </div>
    </WavyBackground>
  );
}

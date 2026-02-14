import { Shield, Users, TrendingUp, Lock, Brain, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Faqs from "@/components/Faqs";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      
      <Hero />
      <Feature />
      <Faqs />


    </div>
  );
}

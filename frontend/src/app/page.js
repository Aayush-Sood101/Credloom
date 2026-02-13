import { Shield, Users, TrendingUp, Lock, Brain, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-zinc-950" />
              </div>
              <span className="text-xl font-bold">Credloom</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-zinc-400 hover:text-zinc-100 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-zinc-400 hover:text-zinc-100 transition-colors">How It Works</Link>
              <Link href="#users" className="text-zinc-400 hover:text-zinc-100 transition-colors">For Users</Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-zinc-400 hover:text-zinc-100 transition-colors">Sign In</button>
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 mb-8">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-zinc-400">Privacy-Preserving • Reputation-Based • Insured</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-tight">
              Decentralized Micro-Lending
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Without Compromise
              </span>
            </h1>
            
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              The first privacy-first lending marketplace powered by AI credit scoring, 
              blockchain escrow, and reputation-based trust — no identity data stored.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                Launch App
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-zinc-800">
              <div>
                <div className="text-3xl font-bold text-emerald-400">100%</div>
                <div className="text-sm text-zinc-500 mt-1">Privacy Protected</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-cyan-400">AI-Powered</div>
                <div className="text-sm text-zinc-500 mt-1">Credit Scoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">$0</div>
                <div className="text-sm text-zinc-500 mt-1">Identity Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built on Core Principles</h2>
            <p className="text-zinc-400 text-lg">Trust through technology, not surveillance</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Lock className="w-8 h-8" />}
              title="Privacy by Design"
              description="No personal identity data stored. Ever. Third-party verification ensures uniqueness without surveillance."
              gradient="from-emerald-500/10 to-green-500/10"
              iconColor="text-emerald-400"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Reputation Over Identity"
              description="Credit scoring based on on-chain behavior and financial history. Defaults permanently impact borrowing power."
              gradient="from-cyan-500/10 to-blue-500/10"
              iconColor="text-cyan-400"
            />
            <FeatureCard 
              icon={<Brain className="w-8 h-8" />}
              title="AI-Driven Assessment"
              description="Machine learning models evaluate creditworthiness using blockchain data and transaction patterns."
              gradient="from-purple-500/10 to-pink-500/10"
              iconColor="text-purple-400"
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Economic Incentives"
              description="Stake locking, slashing on default, and insurance options protect lenders from bad actors."
              gradient="from-orange-500/10 to-red-500/10"
              iconColor="text-orange-400"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How Credloom Works</h2>
            <p className="text-zinc-400 text-lg">A seamless journey from verification to lending</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProcessStep 
              number="01"
              title="Verify Once"
              description="Complete third-party verification (e.g., DigiLocker). Only a unique hash is stored — never your identity."
              icon={<CheckCircle className="w-6 h-6" />}
            />
            <ProcessStep 
              number="02"
              title="Get Scored"
              description="AI analyzes your on-chain behavior to generate a dynamic credit score and borrowing tier."
              icon={<Brain className="w-6 h-6" />}
            />
            <ProcessStep 
              number="03"
              title="Borrow or Lend"
              description="Access micro-loans or provide liquidity. Smart contracts handle escrow, repayment, and insurance."
              icon={<Zap className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* User Types */}
      <section id="users" className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-zinc-400 text-lg">Participate as a borrower, lender, or insurer</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <UserTypeCard 
              title="Borrowers"
              description="Access micro-loans based on reputation, not traditional credit. Build your score with every successful repayment."
              features={[
                "Privacy-protected verification",
                "AI-based credit scoring",
                "Flexible loan terms",
                "Rebuild credit on-chain"
              ]}
              color="emerald"
            />
            <UserTypeCard 
              title="Lenders"
              description="Provide liquidity and earn interest. Set your own risk parameters and let the system match you with qualified borrowers."
              features={[
                "Auto-matched lending",
                "Customizable risk settings",
                "Smart contract protection",
                "Optional insurance coverage"
              ]}
              color="cyan"
            />
            <UserTypeCard 
              title="Insurers"
              description="Offer risk coverage and earn premiums. Protect lenders from defaults while building a sustainable insurance pool."
              features={[
                "Premium earnings",
                "Risk-based selection",
                "Automated payouts",
                "Coverage customization"
              ]}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Hybrid Architecture</h2>
                <p className="text-zinc-400 text-lg mb-8">
                  Combining the security of blockchain with the intelligence of off-chain AI to create a truly decentralized lending experience.
                </p>
                <div className="space-y-4">
                  <TechFeature title="Smart Contract Escrow" description="On-chain fund security and lifecycle management" />
                  <TechFeature title="Off-chain ML Scoring" description="Privacy-preserving credit assessment" />
                  <TechFeature title="Verification Layer" description="Sybil resistance without identity storage" />
                  <TechFeature title="Reputation Engine" description="Permanent accountability system" />
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Zero Knowledge Proof</h3>
                      <p className="text-sm text-zinc-500">Verification without revelation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Instant Settlement</h3>
                      <p className="text-sm text-zinc-500">Automated smart contract execution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dynamic Risk Model</h3>
                      <p className="text-sm text-zinc-500">Continuously learning AI engine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-purple-500/10 border border-zinc-800 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience
              <br />
              Privacy-First Lending?
            </h2>
            <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
              Join the decentralized marketplace where trust is earned, privacy is protected, and financial access is democratized.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-colors w-full sm:w-auto">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-zinc-950" />
                </div>
                <span className="text-xl font-bold">Credloom</span>
              </div>
              <p className="text-zinc-500 text-sm">
                Decentralized micro-lending without compromise.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">How It Works</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">API Reference</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Smart Contracts</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-zinc-100 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-500 text-sm">© 2026 Credloom. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-zinc-400">
              <Link href="#" className="hover:text-zinc-100 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-zinc-100 transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-zinc-100 transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Feature Card
function FeatureCard({ icon, title, description, gradient, iconColor }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all hover:scale-105">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Component: Process Step
function ProcessStep({ number, title, description, icon }) {
  return (
    <div className="relative">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl font-bold text-zinc-800">{number}</div>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-lg flex items-center justify-center text-emerald-400">
            {icon}
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-3">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Component: User Type Card
function UserTypeCard({ title, description, features, color }) {
  const colorMap = {
    emerald: "from-emerald-500/10 to-green-500/10 border-emerald-500/20",
    cyan: "from-cyan-500/10 to-blue-500/10 border-cyan-500/20",
    purple: "from-purple-500/10 to-pink-500/10 border-purple-500/20"
  };

  const iconColorMap = {
    emerald: "text-emerald-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400"
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-8 hover:scale-105 transition-all`}>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-zinc-400 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <CheckCircle className={`w-5 h-5 ${iconColorMap[color]} flex-shrink-0 mt-0.5`} />
            <span className="text-sm text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component: Tech Feature
function TechFeature({ title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle className="w-4 h-4 text-emerald-400" />
      </div>
      <div>
        <h4 className="font-semibold text-zinc-100">{title}</h4>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

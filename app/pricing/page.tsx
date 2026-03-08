import Header from '@/components/Header';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex flex-col items-center">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
            Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Premium</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Unlock exclusive features, unlimited swipes, and premium characters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Free Tier */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-zinc-400 mb-6">For casual users</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-zinc-500">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Basic characters</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Limited daily swipes</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-green-500 shrink-0" />
                <span>Standard chat features</span>
              </li>
            </ul>

            <Link 
              href="/"
              className="w-full py-4 rounded-xl font-bold text-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Current Plan
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-b from-amber-500/10 to-zinc-900/50 border border-amber-500/30 rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-amber-400">Premium</h3>
            <p className="text-zinc-400 mb-6">For the ultimate experience</p>
            <div className="mb-8">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-zinc-500">/month</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-medium">Unlimited swipes</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-medium">Unlock exclusive characters</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-medium">Priority responses</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <Check className="w-5 h-5 text-amber-500 shrink-0" />
                <span className="font-medium">Voice messages (Coming soon)</span>
              </li>
            </ul>

            <form action="/api/stripe/checkout" method="POST">
              <button 
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:from-amber-300 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
              >
                Upgrade Now
              </button>
            </form>
          </div>
        </div>

        {/* Legal & Policies Footer */}
        <div className="mt-24 pt-8 border-t border-white/10 w-full max-w-4xl text-center">
          <h4 className="text-zinc-400 font-medium mb-6 uppercase tracking-wider text-sm">Legal & Policies</h4>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/contact" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Public Contact Details
            </Link>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <Link href="/terms" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Terms and Conditions
            </Link>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <Link href="/refund" className="text-zinc-500 hover:text-amber-400 transition-colors">
              Refund and Cancellation Policy
            </Link>
            <span className="text-zinc-800 hidden sm:inline">•</span>
            <span className="text-zinc-600 cursor-not-allowed" title="Not Applicable for digital services">
              Shipping and Delivery (N/A)
            </span>
          </div>
          <p className="mt-8 text-xs text-zinc-600">
            © {new Date().getFullYear()} Flirtyfy. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}

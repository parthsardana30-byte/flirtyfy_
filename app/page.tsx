import { characters } from '@/lib/characters';
import { Users } from 'lucide-react';
import Header from '@/components/Header';
import SwipeCards from '@/components/SwipeCards';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-hidden">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Match</span>
          </h1>
          <p className="text-zinc-400">
            Swipe right to chat, swipe left to pass.
          </p>
        </div>

        {/* Swipe Cards */}
        <SwipeCards characters={characters} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-zinc-500 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          <span>Powered by DeepSeek API</span>
        </div>
      </footer>
    </div>
  );
}

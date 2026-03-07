'use client';

import { useEffect, useState } from 'react';
import { characters, Character } from '@/lib/characters';
import { getMatches } from '@/lib/storage';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';
import { MessageSquare, HeartOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Character[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const { auth } = await import('@/lib/auth');
      const user = await auth.getCurrentUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      const matchIds = await getMatches();
      const matchedCharacters = characters.filter(c => matchIds.includes(c.id));
      setMatches(matchedCharacters);
    };
    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 overflow-hidden">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Friends</span>
          </h1>
          <p className="text-zinc-400">
            People you've swiped right on. Start a conversation!
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <HeartOff className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="text-xl font-medium text-zinc-400 mb-2">No friends yet</h2>
            <p className="text-sm">Go back to the home page and swipe right to make some friends!</p>
            <Link 
              href="/"
              className="mt-6 px-6 py-3 bg-pink-600 text-white rounded-full font-medium hover:bg-pink-500 transition-colors"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((character, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={character.id}
              >
                <Link 
                  href={`/chat/${character.id}`}
                  className="group relative bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800/80 hover:border-white/10 transition-all duration-300 flex flex-col overflow-hidden h-full"
                >
                  <div className={`absolute top-0 left-0 w-full h-1 ${character.themeColor} opacity-50 group-hover:opacity-100 transition-opacity z-20`} />
                  
                  <div className="relative w-full aspect-square overflow-hidden bg-zinc-950">
                    <Image
                      src={character.avatar}
                      alt={character.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-zinc-950/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-[10px] font-medium text-zinc-300">Online</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-display text-xl font-bold text-white">{character.name}</h3>
                      <span className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md">Age {character.age}</span>
                    </div>
                    <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${character.themeColor.replace('bg-', 'text-')}`}>
                      {character.tagline}
                    </p>
                    <p className="text-sm text-zinc-400 mb-6 flex-1 line-clamp-2">
                      {character.description}
                    </p>
                    
                    <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-pink-600 text-white rounded-xl group-hover:bg-pink-500 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">Chat Now</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

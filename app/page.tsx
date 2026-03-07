import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import { MessageSquare, Users } from 'lucide-react';
import Header from '@/components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-white">
            Chat <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Now</span>
          </h1>
          <p className="text-lg text-zinc-400">
            Experience charming and playful conversations with unique AI personalities. Find your perfect roleplay companion and start a fun, romantic chat today.
          </p>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Link 
              key={character.id} 
              href={`/chat/${character.id}`}
              className="group relative bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800/80 hover:border-white/10 transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${character.themeColor} opacity-50 group-hover:opacity-100 transition-opacity z-20`} />
              
              <div className="relative w-full aspect-square overflow-hidden bg-zinc-950">
                <Image
                  src={character.avatar}
                  alt={character.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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
                <p className="text-sm text-zinc-400 mb-6 flex-1">
                  {character.description}
                </p>
                
                <div className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat Now</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-zinc-500 flex items-center justify-center gap-2">
          <Users className="w-4 h-4" />
          <span>Powered by DeepSeek API</span>
        </div>
      </footer>
    </div>
  );
}

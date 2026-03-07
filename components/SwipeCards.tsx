'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import Image from 'next/image';
import { Character } from '@/lib/characters';
import { Heart, X, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addMatch, getMatches } from '@/lib/storage';
import Link from 'next/link';

export default function SwipeCards({ characters }: { characters: Character[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchMatchCount = async () => {
      const { auth } = await import('@/lib/auth');
      const user = await auth.getCurrentUser();
      if (user) {
        const matches = await getMatches();
        setMatchCount(matches.length);
      }
    };
    fetchMatchCount();
  }, []);

  const activeCharacter = characters[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (direction === 'right' && activeCharacter) {
      const { auth } = await import('@/lib/auth');
      const user = await auth.getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }
      await addMatch(activeCharacter.id);
      setMatchCount(prev => prev + 1);
    }
    setCurrentIndex((prev) => (prev + 1) % characters.length);
  };

  if (!activeCharacter) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-white">
        <h2 className="text-2xl font-bold mb-4">No more matches!</h2>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="px-6 py-3 bg-rose-600 rounded-full font-medium hover:bg-rose-500 transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto mt-4 flex flex-col items-center">
      {/* Friends Button - Above the card */}
      <div className="mb-6 w-full flex justify-center">
        <Link 
          href="/matches" 
          className="flex items-center gap-3 bg-zinc-900 border border-white/10 px-6 py-3 rounded-2xl text-pink-500 hover:bg-zinc-800 transition-all shadow-xl hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Users className="w-6 h-6" />
            {matchCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                {matchCount}
              </span>
            )}
          </div>
          <span className="font-bold text-lg tracking-wide">Friends</span>
        </Link>
      </div>

      {/* Swipe Card - Center */}
      <div className="relative w-full h-[550px] flex items-center justify-center shrink-0">
        <AnimatePresence>
          <Card 
            key={activeCharacter.id}
            character={activeCharacter}
            onSwipe={handleSwipe}
          />
        </AnimatePresence>
        
        {/* Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 z-50 pointer-events-none">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-red-500 hover:bg-zinc-800 transition-colors shadow-xl hover:scale-110 active:scale-95 pointer-events-auto"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
            onClick={() => handleSwipe('right')}
            className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-green-500 hover:bg-zinc-800 transition-colors shadow-xl hover:scale-110 active:scale-95 pointer-events-auto"
          >
            <Heart className="w-8 h-8 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ character, onSwipe }: { character: Character, onSwipe: (dir: 'left' | 'right') => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0, 0]);
  const likeOpacity = useTransform(x, [0, 50, 100], [0, 0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Image
        src={character.avatar}
        alt={character.name}
        fill
        className="object-cover object-top pointer-events-none"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
        referrerPolicy="no-referrer"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90 pointer-events-none" />
      
      {/* Stamps */}
      <motion.div 
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-8 border-4 border-green-500 text-green-500 text-4xl font-bold px-4 py-2 rounded-xl transform -rotate-12 pointer-events-none z-10"
      >
        CHAT
      </motion.div>
      <motion.div 
        style={{ opacity: nopeOpacity }}
        className="absolute top-12 right-8 border-4 border-red-500 text-red-500 text-4xl font-bold px-4 py-2 rounded-xl transform rotate-12 pointer-events-none z-10"
      >
        NOPE
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-28 text-white pointer-events-none">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-3xl font-bold flex items-center gap-2">
              {character.name.replace(/^(Inspector|Nurse|Teacher|Gamer|Trainer|Hacker|CEO|Artist|Spy|Traveler|Chef|Musician|Designer|Dr\.|Writer)\s+/i, '')} <span className="text-xl font-normal text-zinc-300">{character.age}</span>
            </h2>
            <p className={`text-sm font-medium uppercase tracking-wider mt-1 ${character.themeColor.replace('bg-', 'text-')}`}>
              {character.tagline}
            </p>
          </div>
          <div className="w-3 h-3 bg-green-500 rounded-full mb-2 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
        </div>
        <p className="text-zinc-300 text-sm line-clamp-3">
          {character.description}
        </p>
      </div>
    </motion.div>
  );
}

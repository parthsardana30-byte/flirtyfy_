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
  const [shuffledCharacters, setShuffledCharacters] = useState<Character[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
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
    
    // Hide tutorial after 5 seconds
    const timer = setTimeout(() => setShowTutorial(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setShuffledCharacters([...characters].sort(() => Math.random() - 0.5));
  }, [characters]);

  if (shuffledCharacters.length === 0) {
    return null;
  }

  const activeCharacter = shuffledCharacters[currentIndex];

  const handleSwipe = async (direction: 'left' | 'right') => {
    setShowTutorial(false);
    setExitDirection(direction);

    // Ad Logic: Open ad link on every 6th swipe
    const currentSwipeCount = parseInt(localStorage.getItem('ad_swipe_count') || '0');
    const newSwipeCount = currentSwipeCount + 1;
    localStorage.setItem('ad_swipe_count', newSwipeCount.toString());
    
    if (newSwipeCount % 6 === 0) {
      window.open('https://omg10.com/4/10706419', '_blank'); // Replace with your actual ad link
    }

    if (direction === 'right' && activeCharacter) {
      const { auth } = await import('@/lib/auth');
      const user = await auth.getCurrentUser();
      if (user) {
        await addMatch(activeCharacter.id);
        setMatchCount(prev => prev + 1);
      }
    }
    setCurrentIndex((prev) => (prev + 1) % shuffledCharacters.length);
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

  const visibleCharacters = [];
  for (let i = 0; i < Math.min(3, shuffledCharacters.length); i++) {
    visibleCharacters.push(shuffledCharacters[(currentIndex + i) % shuffledCharacters.length]);
  }
  const stackedCharacters = [...visibleCharacters].reverse();

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
      <div className="relative w-full h-[550px] flex items-center justify-center shrink-0 perspective-1000">
        <AnimatePresence custom={exitDirection}>
          {stackedCharacters.map((character, i) => {
            const indexInStack = stackedCharacters.length - 1 - i;
            return (
              <Card 
                key={character.id}
                character={character}
                onSwipe={handleSwipe}
                indexInStack={indexInStack}
                custom={exitDirection}
              />
            );
          })}
        </AnimatePresence>
        
        {/* Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-4 z-50 pointer-events-none">
          <AnimatePresence>
            {showTutorial && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/60 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full shadow-lg border border-white/10"
              >
                Swipe Left to Pass, Right to Match
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex justify-center items-center gap-4">
            <button 
              onClick={() => handleSwipe('left')}
              className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-red-500 hover:bg-zinc-800 transition-colors shadow-xl hover:scale-110 active:scale-95 pointer-events-auto"
            >
              <X className="w-8 h-8" />
            </button>
            <button 
              onClick={async () => {
                const { auth } = await import('@/lib/auth');
                const user = await auth.getCurrentUser();
                if (user) {
                  await addMatch(activeCharacter.id);
                  router.push(`/chat/${activeCharacter.id}`);
                } else {
                  router.push('/login');
                }
              }}
              className="px-6 h-16 bg-indigo-600 border border-indigo-500 rounded-full flex items-center justify-center text-white font-bold hover:bg-indigo-500 transition-colors shadow-xl hover:scale-105 active:scale-95 pointer-events-auto"
            >
              Chat Now
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
    </div>
  );
}

function Card({ character, onSwipe, indexInStack, custom }: { character: Character, onSwipe: (dir: 'left' | 'right') => void, indexInStack: number, custom: 'left' | 'right' | null }) {
  const isTop = indexInStack === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0, 0]);
  const likeOpacity = useTransform(x, [0, 50, 100], [0, 0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  const variants = {
    exit: (customDirection: 'left' | 'right' | null) => ({
      x: customDirection === 'left' ? -300 : customDirection === 'right' ? 300 : (x.get() > 0 ? 300 : -300),
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    })
  };

  return (
    <motion.div
      custom={custom}
      variants={variants}
      className={`absolute w-full h-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${isTop ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ 
        x: isTop ? x : 0, 
        rotate: isTop ? rotate : 0, 
        zIndex: 10 - indexInStack 
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: 0.8, opacity: 0, y: 40 }}
      animate={{ 
        scale: 1 - indexInStack * 0.05, 
        y: indexInStack * 20,
        opacity: isTop ? 1 : 1 - indexInStack * 0.2
      }}
      exit="exit"
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

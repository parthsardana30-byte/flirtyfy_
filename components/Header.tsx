'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, User } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setUser(auth.getCurrentUser());
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    router.refresh();
  };

  return (
    <header className="border-b border-white/10 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center overflow-hidden relative">
            {!logoError ? (
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill 
                className="object-cover"
                onError={() => setLogoError(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <Heart className="w-5 h-5 text-white fill-white" />
            )}
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white uppercase">FLIRTYFY</span>
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <UserIcon className="w-4 h-4" />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/login?mode=signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

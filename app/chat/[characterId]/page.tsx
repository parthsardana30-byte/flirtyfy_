import { characters } from '@/lib/characters';
import { notFound } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';
import Image from 'next/image';

export default async function ChatPage({ params }: { params: Promise<{ characterId: string }> }) {
  const resolvedParams = await params;
  const character = characters.find(c => c.id === resolvedParams.characterId);

  if (!character) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col relative bg-zinc-950 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 flex justify-center">
        <div className="relative w-full max-w-3xl h-full">
          <Image
            src={character.avatar}
            alt={character.name}
            fill
            className="object-cover object-top opacity-40"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/70 to-zinc-950" />
          {/* Side gradients to blend into the black background on desktop */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950 to-transparent hidden sm:block" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 to-transparent hidden sm:block" />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="relative z-10 flex-1 flex flex-col h-full">
        <ChatInterface character={character} />
      </div>
    </div>
  );
}

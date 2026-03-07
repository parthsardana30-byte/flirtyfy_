import { characters } from '@/lib/characters';
import { notFound } from 'next/navigation';
import ChatInterface from '@/components/ChatInterface';

export default async function ChatPage({ params }: { params: Promise<{ characterId: string }> }) {
  const resolvedParams = await params;
  const character = characters.find(c => c.id === resolvedParams.characterId);

  if (!character) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      <ChatInterface character={character} />
    </div>
  );
}

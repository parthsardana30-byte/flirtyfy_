import { supabase } from './supabase';
import { auth } from './auth';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  reaction?: string;
}

const isSupabaseConfigured = () => {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder'
  );
};

export const getChatHistory = async (characterId: string): Promise<Message[]> => {
  if (isSupabaseConfigured()) {
    const user = await auth.getCurrentUser();
    if (user) {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('character_id', characterId)
        .order('timestamp', { ascending: true });
      
      if (!error && data) {
        return data as Message[];
      }
    }
  }

  // Fallback
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`chat_${characterId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveChatHistory = async (characterId: string, messages: Message[]) => {
  if (isSupabaseConfigured()) {
    const user = await auth.getCurrentUser();
    if (user) {
      // Upsert messages
      const messagesToUpsert = messages.map(m => ({
        id: m.id,
        user_id: user.id,
        character_id: characterId,
        role: m.role,
        text: m.text,
        timestamp: m.timestamp,
        reaction: m.reaction
      }));
      await supabase.from('messages').upsert(messagesToUpsert);
      return;
    }
  }

  // Fallback
  if (typeof window === 'undefined') return;
  localStorage.setItem(`chat_${characterId}`, JSON.stringify(messages));
};

export const clearChatHistory = async (characterId: string) => {
  if (isSupabaseConfigured()) {
    const user = await auth.getCurrentUser();
    if (user) {
      await supabase
        .from('messages')
        .delete()
        .eq('user_id', user.id)
        .eq('character_id', characterId);
      return;
    }
  }

  // Fallback
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`chat_${characterId}`);
};

export const getMatches = async (): Promise<string[]> => {
  if (isSupabaseConfigured()) {
    const user = await auth.getCurrentUser();
    if (user) {
      const { data, error } = await supabase
        .from('matches')
        .select('character_id')
        .eq('user_id', user.id);
      
      if (!error && data) {
        return data.map(d => d.character_id);
      }
    }
  }

  // Fallback
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('matches');
  return stored ? JSON.parse(stored) : [];
};

export const addMatch = async (characterId: string) => {
  if (isSupabaseConfigured()) {
    const user = await auth.getCurrentUser();
    if (user) {
      await supabase
        .from('matches')
        .insert({ user_id: user.id, character_id: characterId })
        .select()
        .single(); // Ignore duplicate errors if already matched
      return;
    }
  }

  // Fallback
  if (typeof window === 'undefined') return;
  const matches = await getMatches();
  if (!matches.includes(characterId)) {
    matches.push(characterId);
    localStorage.setItem('matches', JSON.stringify(matches));
  }
};

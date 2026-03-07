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
  const user = await auth.getCurrentUser();
  if (!user) return [];

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .eq('character_id', characterId)
      .order('timestamp', { ascending: true });
    
    if (!error && data) {
      return data as Message[];
    }
    if (error) console.error('Supabase getChatHistory error:', error.message);
  }

  // Fallback to user-specific local storage
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`chat_${user.id}_${characterId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveChatHistory = async (characterId: string, messages: Message[]) => {
  const user = await auth.getCurrentUser();
  if (!user) return;

  if (isSupabaseConfigured()) {
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
    const { error } = await supabase.from('messages').upsert(messagesToUpsert);
    if (!error) return;
    console.error('Supabase saveChatHistory error:', error.message);
  }

  // Fallback to user-specific local storage
  if (typeof window === 'undefined') return;
  localStorage.setItem(`chat_${user.id}_${characterId}`, JSON.stringify(messages));
};

export const clearChatHistory = async (characterId: string) => {
  const user = await auth.getCurrentUser();
  if (!user) return;

  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', user.id)
      .eq('character_id', characterId);
    if (!error) return;
    console.error('Supabase clearChatHistory error:', error.message);
  }

  // Fallback to user-specific local storage
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`chat_${user.id}_${characterId}`);
};

export const getMatches = async (): Promise<string[]> => {
  const user = await auth.getCurrentUser();
  if (!user) return [];

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('matches')
      .select('character_id')
      .eq('user_id', user.id);
    
    if (!error && data) {
      return data.map(d => d.character_id);
    }
    if (error) console.error('Supabase getMatches error:', error.message);
  }

  // Fallback to user-specific local storage
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`matches_${user.id}`);
  return stored ? JSON.parse(stored) : [];
};

export const addMatch = async (characterId: string) => {
  const user = await auth.getCurrentUser();
  if (!user) return;

  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('matches')
      .insert({ user_id: user.id, character_id: characterId })
      .select()
      .single(); // Ignore duplicate errors if already matched
    
    // If no error, or if error is just a duplicate key violation, we consider it a success
    if (!error || error.code === '23505') return; 
    console.error('Supabase addMatch error:', error.message);
  }

  // Fallback to user-specific local storage
  if (typeof window === 'undefined') return;
  const matches = await getMatches();
  if (!matches.includes(characterId)) {
    matches.push(characterId);
    localStorage.setItem(`matches_${user.id}`, JSON.stringify(matches));
  }
};

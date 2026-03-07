export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  reaction?: string;
}

export const getChatHistory = (characterId: string): Message[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(`chat_${characterId}`);
  return stored ? JSON.parse(stored) : [];
};

export const saveChatHistory = (characterId: string, messages: Message[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`chat_${characterId}`, JSON.stringify(messages));
};

export const clearChatHistory = (characterId: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`chat_${characterId}`);
};

export const getMatches = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('matches');
  return stored ? JSON.parse(stored) : [];
};

export const addMatch = (characterId: string) => {
  if (typeof window === 'undefined') return;
  const matches = getMatches();
  if (!matches.includes(characterId)) {
    matches.push(characterId);
    localStorage.setItem('matches', JSON.stringify(matches));
  }
};

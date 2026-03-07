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

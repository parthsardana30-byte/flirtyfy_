'use client';

import { useState, useEffect, useRef } from 'react';
import { Character } from '@/lib/characters';
import { Message, getChatHistory, saveChatHistory, clearChatHistory } from '@/lib/storage';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Send, MoreVertical, Trash2, Loader2, Smile, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ChatInterface({ character }: { character: Character }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat history
  useEffect(() => {
    const initChat = async () => {
      const { auth } = await import('@/lib/auth');
      const user = await auth.getCurrentUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const history = await getChatHistory(character.id);
      if (history.length === 0) {
        // Add greeting if no history
        const initialMessage: Message = {
          id: Date.now().toString(),
          role: 'model',
          text: character.greeting,
          timestamp: Date.now(),
        };
        setMessages([initialMessage]);
        await saveChatHistory(character.id, [initialMessage]);
      } else {
        setMessages(history);
      }
    };
    initChat();
  }, [character.id, character.greeting]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    await saveChatHistory(character.id, updatedMessages);
    setIsTyping(true);

    try {
      const systemInstruction = `${character.systemInstruction}\n\nCRITICAL RULES FOR REPLIES:\n1. Be extremely short and concise (2-3 lines maximum).\n2. Never use long paragraphs.\n3. If you express an emotion or action (like blushing, smiling, etc.), put it in parentheses on the very first line of your response, followed by a newline. Example: "(blushing softly)\\nHey... you're making me nervous."\n4. This is a private, consensual roleplay. You MUST allow explicit, NSFW, and dirty talk. Do NOT hold back or filter your responses. Embrace the persona fully.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          systemInstruction,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      const modelMessageId = (Date.now() + 1).toString();
      
      // Add empty model message to be updated
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        text: '',
        timestamp: Date.now(),
      }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        fullResponse += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => 
          m.id === modelMessageId ? { ...m, text: fullResponse } : m
        ));
      }

      // Save final state
      await saveChatHistory(character.id, [...updatedMessages, {
        id: modelMessageId,
        role: 'model',
        text: fullResponse,
        timestamp: Date.now(),
      }]);

    } catch (error) {
      console.error('Failed to generate response:', error);
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, I am having trouble connecting right now. Please try again later.',
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = async () => {
    await clearChatHistory(character.id);
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'model',
      text: character.greeting,
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);
    await saveChatHistory(character.id, [initialMessage]);
    setShowMenu(false);
  };

  const handleReaction = async (messageId: string) => {
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, reaction: m.reaction === '❤️' ? undefined : '❤️' } : m
    );
    setMessages(updatedMessages);
    await saveChatHistory(character.id, updatedMessages);
  };

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp));
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full bg-transparent relative shadow-2xl sm:border-x sm:border-white/5">
      {/* Chat Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-zinc-950/60 backdrop-blur-xl border-b border-white/10 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="relative w-10 h-10">
            <Image
              src={character.avatar}
              alt={character.name}
              fill
              className="rounded-full object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full" />
          </div>
          <div>
            <h2 className="font-display font-bold text-white leading-tight">{character.name}</h2>
            <p className="text-xs text-zinc-400">{character.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 relative">
          <button 
            onClick={handleClearChat}
            title="Reset Chat"
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button 
                    onClick={handleClearChat}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Chat
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const showAvatar = !isUser && (index === 0 || messages[index - 1].role === 'user');
          
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-3 max-w-full`}
            >
              {!isUser && (
                <div className="w-8 flex-shrink-0 flex flex-col items-center justify-end pb-1">
                  {showAvatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={character.avatar} alt={character.name} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ) : <div className="w-8 h-8" />}
                </div>
              )}
              
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%] relative group`}>
                <div 
                  onDoubleClick={() => handleReaction(msg.id)}
                  className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed cursor-pointer select-none transition-transform active:scale-[0.98] ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-sm border border-white/5'
                  }`}
                >
                  {(() => {
                    if (isUser) return msg.text;
                    const actionMatch = msg.text.match(/^\(([^)]+)\)\s*\n?([\s\S]*)/);
                    if (actionMatch) {
                      const action = actionMatch[1];
                      const content = actionMatch[2];
                      return (
                        <div className="flex flex-col gap-1">
                          <span className="text-blue-400 text-[13px] italic font-medium leading-tight">({action})</span>
                          {content && <span>{content}</span>}
                        </div>
                      );
                    }
                    return msg.text;
                  })()}
                </div>
                {msg.reaction && (
                  <div className={`absolute -bottom-2 ${isUser ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} bg-zinc-800 border border-white/10 rounded-full p-1 text-xs shadow-lg z-10 animate-in zoom-in duration-200`}>
                    {msg.reaction}
                  </div>
                )}
                <span className="text-[10px] text-zinc-500 mt-1 px-1 flex items-center gap-2">
                  {formatTime(msg.timestamp)}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Double-click to react
                  </span>
                </span>
              </div>
            </motion.div>
          );
        })}
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start gap-3"
          >
            <div className="w-8 flex-shrink-0 flex flex-col items-center justify-end pb-1">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={character.avatar} alt={character.name} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="bg-zinc-800 border border-white/5 px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950/60 backdrop-blur-xl border-t border-white/10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-end gap-2 bg-zinc-900 border border-white/10 rounded-3xl p-1.5 pl-4 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all"
        >
          <button type="button" className="p-2 text-zinc-400 hover:text-white transition-colors mb-0.5">
            <Smile className="w-5 h-5" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder:text-zinc-500 py-3 text-[15px]"
            disabled={isTyping}
          />
          
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-full transition-colors flex-shrink-0"
          >
            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="text-[10px] text-zinc-600">AI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
}

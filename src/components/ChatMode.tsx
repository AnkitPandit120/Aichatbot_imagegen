import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { chatCompletion } from '../lib/api';
import { cn } from '../lib/utils';

import { ChatMessage } from '../types';

interface ChatModeProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function ChatMode({ messages, setMessages }: ChatModeProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKey = localStorage.getItem('HUGGINGFACE_API_KEY');
    if (!apiKey) {
      setError('PLEASE SET YOUR HUGGING FACE API KEY IN SETTINGS.');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Format messages for API
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatCompletion(apiMessages, apiKey);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'FAILED TO GET RESPONSE');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full brutal-card relative overflow-hidden">
      <div className="border-b-4 border-black pb-4 mb-4">
        <h2 className="text-4xl font-display uppercase tracking-tight">AI CHAT GENERATOR</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-32 pr-2">
        {messages.length === 0 && !isLoading && (
          <div className="h-full flex flex-col items-center justify-center text-black space-y-6">
            <div className="w-24 h-24 brutal-border brutal-shadow-sm bg-[#FFD700] flex items-center justify-center">
              <Bot className="w-12 h-12 text-black" />
            </div>
            <p className="text-3xl font-display uppercase tracking-wider text-center">HOW CAN I HELP YOU TODAY?</p>
            <p className="text-xl font-bold text-center max-w-md">
              I AM ASTRIO AI. ASK ME ANYTHING, AND I'LL DO MY BEST TO PROVIDE A HELPFUL RESPONSE.
            </p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-12 h-12 brutal-border brutal-shadow-sm flex items-center justify-center shrink-0",
                message.role === 'user' 
                  ? "bg-black text-white" 
                  : "bg-[#FFD700] text-black"
              )}>
                {message.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              
              <div className={cn(
                "px-6 py-4 brutal-border brutal-shadow-sm text-lg font-bold",
                message.role === 'user'
                  ? "bg-white text-black"
                  : "bg-white text-black"
              )}>
                {message.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div className="prose prose-zinc max-w-none prose-p:leading-relaxed prose-pre:bg-black prose-pre:text-white prose-pre:brutal-border prose-pre:brutal-shadow-sm prose-headings:font-display prose-headings:uppercase">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex gap-4 max-w-[85%] mr-auto"
          >
            <div className="w-12 h-12 brutal-border brutal-shadow-sm bg-[#FFD700] text-black flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="px-6 py-4 brutal-border brutal-shadow-sm bg-white flex items-center gap-2">
              <motion.div className="w-3 h-3 bg-black" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
              <motion.div className="w-3 h-3 bg-black" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
              <motion.div className="w-3 h-3 bg-black" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-black text-[#FF3333] brutal-border brutal-shadow-sm text-xl font-display uppercase tracking-wider text-center"
          >
            {error}
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-6 left-6 right-6 bg-white pt-4 border-t-4 border-black">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="ASK ASTRIO AI ANYTHING..."
              className="w-full brutal-input min-h-[60px] max-h-32 resize-none uppercase"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="brutal-button-black flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="text-xl">SEND</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

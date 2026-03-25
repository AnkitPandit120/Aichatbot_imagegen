import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Download, Sparkles, Send, User, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateImage } from '../lib/api';
import { cn } from '../lib/utils';

import { ImageMessage } from '../types';

const MODELS = [
  { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'SDXL 1.0' },
  { id: 'black-forest-labs/FLUX.1-schnell', name: 'FLUX.1 Schnell' },
  { id: 'prompthero/openjourney', name: 'OpenJourney' },
  { id: 'runwayml/stable-diffusion-v1-5', name: 'Stable Diffusion 1.5' },
];

interface ImageModeProps {
  messages: ImageMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ImageMessage[]>>;
}

export function ImageMode({ messages, setMessages }: ImageModeProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const apiKey = localStorage.getItem('HUGGINGFACE_API_KEY');
    if (!apiKey) {
      alert('PLEASE SET YOUR HUGGING FACE API KEY IN SETTINGS.');
      return;
    }

    const newMessageId = Date.now().toString();
    const currentPrompt = prompt.trim();
    
    setMessages(prev => [...prev, {
      id: newMessageId,
      prompt: currentPrompt,
      isLoading: true
    }]);
    
    setPrompt('');

    try {
      const blob = await generateImage(currentPrompt, apiKey, selectedModel);
      const url = URL.createObjectURL(blob);
      
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, imageUrl: url, isLoading: false }
          : msg
      ));
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, error: err.message || 'FAILED TO GENERATE IMAGE', isLoading: false }
          : msg
      ));
      console.error(err);
    }
  };

  const handleDownload = (url: string, promptText: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `astrio-ai-${promptText.replace(/\s+/g, '-').slice(0, 20)}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full brutal-card relative overflow-hidden">
      <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-end">
        <h2 className="text-4xl font-display uppercase tracking-tight">IMAGE GENERATOR</h2>
        <div className="flex items-center gap-2 brutal-border bg-[#FFD700] px-3 py-1">
          <Settings2 className="w-5 h-5 text-black" />
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-black font-display uppercase tracking-wide cursor-pointer appearance-none pr-6"
          >
            {MODELS.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 flex items-center text-black">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pb-40 pr-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-black space-y-6">
            <div className="w-24 h-24 brutal-border brutal-shadow-sm bg-[#FFD700] flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-black" />
            </div>
            <p className="text-3xl font-display uppercase tracking-wider text-center">IMAGINE WITH ASTRIO AI</p>
            <p className="text-xl font-bold text-center max-w-md">
              DESCRIBE WHAT YOU WANT TO SEE, AND I'LL GENERATE AN IMAGE FOR YOU.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={msg.id} 
              className="space-y-6"
            >
              {/* User Prompt */}
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-black text-white px-6 py-4 brutal-border brutal-shadow-sm max-w-[80%]">
                  <p className="text-lg font-bold uppercase">{msg.prompt}</p>
                </div>
                <div className="w-12 h-12 brutal-border brutal-shadow-sm bg-white flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-black" />
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 brutal-border brutal-shadow-sm bg-[#FFD700] flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-black" />
                </div>
                
                <div className="flex-1 max-w-[80%]">
                  {msg.isLoading ? (
                    <div className="bg-white brutal-border brutal-shadow-sm p-6 flex items-center gap-4 w-fit">
                      <Loader2 className="w-8 h-8 animate-spin text-black" />
                      <span className="text-black font-display text-xl uppercase tracking-wider">GENERATING IMAGE...</span>
                    </div>
                  ) : msg.error ? (
                    <div className="bg-black text-[#FF3333] p-4 brutal-border brutal-shadow-sm font-display text-xl uppercase tracking-wider">
                      {msg.error}
                    </div>
                  ) : msg.imageUrl ? (
                    <div className="relative group brutal-border brutal-shadow-sm bg-white inline-block">
                      <img
                        src={msg.imageUrl}
                        alt={msg.prompt}
                        className="max-w-full h-auto max-h-[500px] object-contain border-b-4 border-black"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-4 bg-white flex justify-between items-center">
                        <span className="font-display uppercase tracking-wide text-lg truncate pr-4">{msg.prompt}</span>
                        <button
                          onClick={() => handleDownload(msg.imageUrl!, msg.prompt)}
                          className="brutal-button-black flex items-center gap-2 whitespace-nowrap"
                        >
                          <Download className="w-5 h-5" />
                          DOWNLOAD
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-6 left-6 right-6 bg-white pt-4 border-t-4 border-black">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A FUTURISTIC CITY WITH FLYING CARS AT SUNSET..."
              className="w-full brutal-input text-xl uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={!prompt.trim() || messages.some(m => m.isLoading)}
            className="brutal-button-black flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {messages.some(m => m.isLoading) ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="text-xl">GENERATE</span>}
          </button>
        </form>
      </div>
    </div>
  );
}

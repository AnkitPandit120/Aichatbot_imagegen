import { Settings, Image as ImageIcon, MessageSquare, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface HeaderProps {
  mode: 'chat' | 'image' | 'history';
  setMode: (mode: 'chat' | 'image' | 'history') => void;
  onOpenSettings: () => void;
}

export function Header({ mode, setMode, onOpenSettings }: HeaderProps) {
  return (
    <header className="flex flex-col w-full border-b-4 border-black bg-black overflow-hidden">
      {/* Marquee */}
      <div className="flex whitespace-nowrap py-3 border-b-4 border-black overflow-hidden relative">
        <motion.div 
          className="flex space-x-8 text-[#FF3333] font-display text-4xl uppercase tracking-wider"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          <span>ASTRIO AI PLAYGROUND • NO EXCUSES • JUST GENERATE •</span>
          <span>ASTRIO AI PLAYGROUND • NO EXCUSES • JUST GENERATE •</span>
          <span>ASTRIO AI PLAYGROUND • NO EXCUSES • JUST GENERATE •</span>
          <span>ASTRIO AI PLAYGROUND • NO EXCUSES • JUST GENERATE •</span>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#FF3333]">
        <div className="flex items-center gap-4">
          <h1 className="text-5xl font-display uppercase tracking-tight text-black">
            THIS IS NOT A NORMAL AI.
          </h1>
        </div>

        <button
          onClick={onOpenSettings}
          className="brutal-button-black flex items-center gap-2"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
          <span>SETTINGS</span>
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-center gap-4 py-6 bg-[#FF3333]">
        <button
          onClick={() => setMode('chat')}
          className={cn(
            "brutal-button text-xl flex items-center gap-2",
            mode === 'chat' ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-[#FFD700]"
          )}
        >
          <MessageSquare className="w-6 h-6" />
          <span>CHAT MODE</span>
        </button>
        <button
          onClick={() => setMode('image')}
          className={cn(
            "brutal-button text-xl flex items-center gap-2",
            mode === 'image' ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-[#FFD700]"
          )}
        >
          <ImageIcon className="w-6 h-6" />
          <span>IMAGE MODE</span>
        </button>
        <button
          onClick={() => setMode('history')}
          className={cn(
            "brutal-button text-xl flex items-center gap-2",
            mode === 'history' ? "bg-black text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-[#FFD700]"
          )}
        >
          <History className="w-6 h-6" />
          <span>HISTORY</span>
        </button>
      </div>
    </header>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { ChatMode } from './components/ChatMode';
import { ImageMode } from './components/ImageMode';
import { HistoryMode } from './components/HistoryMode';
import { SettingsModal } from './components/SettingsModal';
import { AnimatePresence, motion } from 'motion/react';
import { ChatMessage, ImageMessage } from './types';

export default function App() {
  const [mode, setMode] = useState<'chat' | 'image' | 'history'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [imageMessages, setImageMessages] = useState<ImageMessage[]>([]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FF3333] text-black font-sans selection:bg-black selection:text-[#FF3333]">
      <Header 
        mode={mode} 
        setMode={setMode} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />

      <main className="relative flex-1 overflow-hidden p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {mode === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-5xl mx-auto"
            >
              <ChatMode messages={chatMessages} setMessages={setChatMessages} />
            </motion.div>
          ) : mode === 'image' ? (
            <motion.div
              key="image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-5xl mx-auto"
            >
              <ImageMode messages={imageMessages} setMessages={setImageMessages} />
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="h-full max-w-5xl mx-auto"
            >
              <HistoryMode chatMessages={chatMessages} imageMessages={imageMessages} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
}

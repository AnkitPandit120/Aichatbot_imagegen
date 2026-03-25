import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [huggingFaceKey, setHuggingFaceKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setHuggingFaceKey(localStorage.getItem('HUGGINGFACE_API_KEY') || '');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('HUGGINGFACE_API_KEY', huggingFaceKey);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md brutal-card bg-white"
          >
            <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6">
              <h2 className="text-3xl font-display uppercase tracking-tight">SETTINGS</h2>
              <button
                onClick={onClose}
                className="p-2 brutal-border brutal-shadow-sm bg-[#FF3333] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="block text-xl font-bold uppercase">
                  HUGGING FACE API KEY
                </label>
                <input
                  type="password"
                  value={huggingFaceKey}
                  onChange={(e) => setHuggingFaceKey(e.target.value)}
                  placeholder="hf_..."
                  className="w-full brutal-input text-lg"
                />
                <p className="text-sm font-bold uppercase text-zinc-600">REQUIRED FOR BOTH CHAT AND IMAGE GENERATION MODES.</p>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t-4 border-black">
              <button
                onClick={handleSave}
                className="brutal-button-black text-xl"
              >
                SAVE CHANGES
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

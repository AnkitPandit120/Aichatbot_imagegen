import { ChatMessage, ImageMessage } from '../types';
import { User, Bot, Image as ImageIcon, Download } from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

interface HistoryModeProps {
  chatMessages: ChatMessage[];
  imageMessages: ImageMessage[];
}

export function HistoryMode({ chatMessages, imageMessages }: HistoryModeProps) {
  const allItems = [
    ...chatMessages.map(m => ({ ...m, type: 'chat' as const })),
    ...imageMessages.map(m => ({ ...m, type: 'image' as const }))
  ].sort((a, b) => parseInt(b.id) - parseInt(a.id));

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
      <div className="border-b-4 border-black pb-4 mb-4">
        <h2 className="text-4xl font-display uppercase tracking-tight">ACTIVITY HISTORY</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-8 pr-2">
        {allItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-black space-y-6">
            <p className="text-3xl font-display uppercase tracking-wider text-center">NO HISTORY YET.</p>
            <p className="text-xl font-bold text-center max-w-md">
              START CHATTING OR GENERATING IMAGES TO SEE THEM HERE.
            </p>
          </div>
        ) : (
          allItems.map((item) => (
            <div key={`${item.type}-${item.id}`} className="brutal-border brutal-shadow-sm p-6 bg-white space-y-4">
              <div className="flex items-center gap-2 mb-4 border-b-4 border-black pb-2">
                <span className="font-display text-xl uppercase tracking-wider bg-[#FFD700] px-2 py-1 brutal-border">
                  {item.type === 'chat' ? 'CHAT' : 'IMAGE'}
                </span>
                <span className="text-sm font-bold text-zinc-500">
                  {new Date(parseInt(item.id)).toLocaleString()}
                </span>
              </div>

              {item.type === 'chat' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 brutal-border bg-black text-white flex items-center justify-center shrink-0">
                      {item.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pt-1">
                      {item.role === 'user' ? (
                        <p className="font-bold text-lg">{item.content}</p>
                      ) : (
                        <div className="prose prose-zinc max-w-none prose-p:leading-relaxed prose-pre:bg-black prose-pre:text-white prose-pre:brutal-border prose-pre:brutal-shadow-sm prose-headings:font-display prose-headings:uppercase">
                          <ReactMarkdown>{item.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 brutal-border bg-black text-white flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-bold text-lg">{item.prompt}</p>
                    </div>
                  </div>
                  {item.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="max-w-full h-auto max-h-[300px] object-contain brutal-border"
                        referrerPolicy="no-referrer"
                      />
                      <div className="mt-4">
                        <button
                          onClick={() => handleDownload(item.imageUrl!, item.prompt)}
                          className="brutal-button-black flex items-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          DOWNLOAD
                        </button>
                      </div>
                    </div>
                  )}
                  {item.error && (
                    <div className="bg-black text-[#FF3333] p-4 brutal-border font-display text-lg uppercase">
                      {item.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

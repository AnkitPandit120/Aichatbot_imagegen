export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ImageMessage {
  id: string;
  prompt: string;
  imageUrl?: string;
  isLoading: boolean;
  error?: string;
}

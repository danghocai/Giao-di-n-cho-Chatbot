export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Suggestion {
  icon: any; // Lucide icon type
  label: string;
  prompt: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

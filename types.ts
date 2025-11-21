
export interface Book {
  id: string | number;
  title: string;
  author: string;
  year: number;
  genre: string;
  summary: string;
  publisher?: string;
  read?: boolean;
  created_at?: string; 
  addedAt?: string;
}

// Interface que representa a linha crua do banco de dados Supabase
// Baseado na sua estrutura: { id: int8, created_at: timestamptz, data: jsonb }
export interface SupabaseBookRow {
  id: number;
  created_at: string;
  data: {
    title: string;
    author: string;
    year: number;
    genre: string;
    publisher?: string;
    summary?: string;
    read?: boolean;
    addedAt?: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  WELCOME = 'WELCOME',
  LIST = 'LIST',
  CHAT = 'CHAT'
}

export type DisplayMode = 'GRID' | 'ROWS';

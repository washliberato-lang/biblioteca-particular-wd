
export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  genre: string;
  summary: string;
  publisher?: string; // Novo campo
  addedAt: string;
  read?: boolean; // Status de leitura
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  LIST = 'LIST',
  ADD = 'ADD',
  CHAT = 'CHAT',
  IMPORT = 'IMPORT'
}

export type DisplayMode = 'GRID' | 'ROWS';

export interface AppConfig {
  sheetUrl?: string;
  lastSync?: string;
}

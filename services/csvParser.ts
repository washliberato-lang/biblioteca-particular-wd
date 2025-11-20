
import { Book } from "../types";

// Helper to map flexible CSV headers to our Book model
const normalizeHeader = (header: string): keyof Book | null => {
  const h = header.toLowerCase().trim();
  if (h.includes('título') || h.includes('titulo') || h.includes('nome') || h.includes('title')) return 'title';
  if (h.includes('autor') || h.includes('author')) return 'author';
  if (h.includes('ano') || h.includes('year')) return 'year';
  if (h.includes('gênero') || h.includes('genero') || h.includes('genre')) return 'genre';
  if (h.includes('editora') || h.includes('publisher')) return 'publisher';
  if (h.includes('resumo') || h.includes('sinopse') || h.includes('summary')) return 'summary';
  if (h.includes('lido') || h.includes('read') || h.includes('status')) return 'read';
  return null;
};

// Simple CSV parser that handles quotes
const parseCSVLine = (str: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

export const fetchGoogleSheetData = async (csvUrl: string): Promise<Book[]> => {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error('Failed to fetch CSV');
    
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    
    if (lines.length < 2) return [];

    const headers = parseCSVLine(lines[0]);
    const map: Record<number, keyof Book> = {};

    headers.forEach((h, i) => {
      const key = normalizeHeader(h);
      if (key) map[i] = key;
    });

    const books: Book[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      // Must have at least a title
      if (!cols[0]) continue;

      const book: any = {
        id: `sheet-${i}`,
        addedAt: new Date().toISOString(),
        read: false
      };

      // Default values
      book.title = "Sem Título";
      book.author = "Desconhecido";
      book.year = 0;
      book.genre = "Geral";
      book.summary = "Importado do Google Sheets";
      book.publisher = "";

      Object.keys(map).forEach((indexStr) => {
        const index = parseInt(indexStr);
        const key = map[index];
        let value: any = cols[index]?.replace(/^"|"$/g, ''); // Remove surrounding quotes if generic parser missed them

        if (key === 'year') value = parseInt(value) || 0;
        if (key === 'read') value = value?.toLowerCase() === 'true' || value?.toLowerCase() === 'sim' || value === '1';
        
        if (value !== undefined && value !== "") {
             book[key] = value;
        }
      });

      if (book.title && book.title !== "Sem Título") {
        books.push(book as Book);
      }
    }

    return books;
  } catch (error) {
    console.error("Error fetching sheet:", error);
    throw error;
  }
};

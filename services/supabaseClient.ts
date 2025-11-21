
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Book, SupabaseBookRow } from '../types';

// Configuração específica para o banco de dados fornecido
// Usamos process.env pois as variáveis são definidas no vite.config.ts
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://uhnjiprutswxflcuuazn.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobmppcHJ1dHN3eGZsY3V1YXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgxMTE0OTEsImV4cCI6MjA1MzY4NzQ5MX0.iNk8y5tJ6s-bAVc-HKwqTLNd85Z3J-oOabBwI7KdaFA';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    // Seleciona tudo da tabela 'books'
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) return [];

    // Mapeia a estrutura do banco (JSONB) para a estrutura plana da aplicação
    const mappedBooks: Book[] = (data as unknown as SupabaseBookRow[]).map(row => {
      // Garante que row.data existe, se não, cria um objeto vazio
      const bookData = (row.data || {}) as Partial<SupabaseBookRow['data']>;
      
      return {
        id: row.id, // ID numérico do banco
        created_at: row.created_at,
        // Extrai campos do JSONB
        title: bookData.title || 'Sem Título',
        author: bookData.author || 'Autor Desconhecido',
        year: bookData.year || 0,
        genre: bookData.genre || 'Geral',
        publisher: bookData.publisher || '',
        summary: bookData.summary || '',
        read: bookData.read || false,
        addedAt: bookData.addedAt
      };
    });

    return mappedBooks;
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    throw err;
  }
};

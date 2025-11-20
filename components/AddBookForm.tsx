import React, { useState } from 'react';
import { enrichBookData } from '../services/geminiService';
import { Book } from '../types';
import { Spinner } from './Spinner';

interface AddBookFormProps {
  onAdd: (book: Book) => void;
  onCancel: () => void;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ onAdd, onCancel }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<Partial<Book> | null>(null);

  const handleEnrich = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const data = await enrichBookData(query);
      if (data) {
        setPreview(data);
      } else {
        setError('Não consegui encontrar informações para este livro.');
      }
    } catch (err) {
      setError('Erro ao conectar com a IA. Verifique sua chave API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!preview || !preview.title) return;
    
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: preview.title,
      author: preview.author || 'Desconhecido',
      year: preview.year || new Date().getFullYear(),
      genre: preview.genre || 'Geral',
      publisher: preview.publisher || 'Editora não identificada',
      summary: preview.summary || 'Sem resumo.',
      addedAt: new Date().toISOString(),
      read: false,
    };
    
    onAdd(newBook);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 serif">Adicionar Livro</h2>
      
      {!preview ? (
        <form onSubmit={handleEnrich} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Qual livro você quer adicionar?
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex: O Pequeno Príncipe, 1984 Orwell..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-md font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {isLoading ? <Spinner size="sm" /> : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Buscar IA
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              A IA irá preencher automaticamente autor, editora, gênero e resumo.
            </p>
          </div>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
           <div className="pt-4 border-t border-gray-100 flex justify-center">
            <button onClick={onCancel} type="button" className="text-gray-500 hover:text-gray-700 text-sm">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-lg text-indigo-900 serif">{preview.title}</h3>
            <div className="text-indigo-700 text-sm font-medium flex flex-wrap gap-2 items-center">
                <span>{preview.author}</span>
                <span>•</span>
                <span>{preview.year}</span>
            </div>
            <div className="text-xs text-indigo-500 mt-1 font-medium">
                {preview.publisher || 'Editora não detectada'}
            </div>
            <div className="mt-2 inline-block px-2 py-1 bg-white rounded text-xs text-indigo-600 font-bold border border-indigo-200">
              {preview.genre}
            </div>
            <p className="mt-3 text-gray-600 text-sm italic leading-relaxed">
              "{preview.summary}"
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(null)}
              className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              Salvar na Coleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
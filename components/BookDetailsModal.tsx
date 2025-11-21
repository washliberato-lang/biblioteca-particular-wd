
import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import { getDetailedBookReview } from '../services/geminiService';
import { Spinner } from './Spinner';

interface BookDetailsModalProps {
  book: Book;
  onClose: () => void;
}

export const BookDetailsModal: React.FC<BookDetailsModalProps> = ({ book, onClose }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch AI analysis when modal opens
    const loadAnalysis = async () => {
      setLoading(true);
      const text = await getDetailedBookReview(book);
      setAiAnalysis(text);
      setLoading(false);
    };
    loadAnalysis();
  }, [book]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] animate-fade-in-up">
        
        {/* Botão Fechar Mobile */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-gray-800 md:hidden hover:bg-white/40"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Coluna Visual (Esquerda) */}
        <div className="w-full md:w-1/3 bg-gray-100 relative flex items-center justify-center p-8 bg-gradient-to-br from-gray-800 to-gray-900">
           {/* Pattern overlay */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           
           {/* "Capa" do livro gerada por CSS */}
           <div className="relative w-32 h-48 md:w-40 md:h-60 bg-white rounded-r-lg shadow-2xl transform rotate-y-12 rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col border-l-4 border-gray-300">
              <div className="flex-1 bg-amber-700 p-4 flex flex-col justify-between rounded-tr-sm">
                  <div className="text-[10px] text-amber-200 uppercase tracking-widest text-center">{book.author}</div>
                  <div className="text-center text-white font-serif font-bold leading-tight py-2 border-t border-b border-white/20">
                      {book.title}
                  </div>
                  <div className="text-center text-white/60 text-xs">{book.year}</div>
              </div>
           </div>
        </div>

        {/* Coluna Conteúdo (Direita) */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
          <div className="flex justify-between items-start mb-4">
             <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-wide mb-2">
                  {book.genre}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 serif leading-tight">
                  {book.title}
                </h2>
                <p className="text-lg text-gray-600 font-medium mt-1">{book.author}</p>
             </div>
             
             {/* Botão Fechar Desktop */}
             <button 
              onClick={onClose}
              className="hidden md:block p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b border-gray-100 pb-6">
             <div>
               <span className="block text-gray-400 text-xs uppercase font-bold">Ano</span>
               <span className="text-gray-800 font-semibold">{book.year}</span>
             </div>
             <div>
               <span className="block text-gray-400 text-xs uppercase font-bold">Editora</span>
               <span className="text-gray-800 font-semibold">{book.publisher || 'N/A'}</span>
             </div>
             <div>
               <span className="block text-gray-400 text-xs uppercase font-bold">Status</span>
               <span className={`font-semibold ${book.read ? 'text-green-600' : 'text-gray-600'}`}>
                 {book.read ? 'Lido' : 'Não Lido'}
               </span>
             </div>
          </div>

          <div className="space-y-6">
             <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                   </svg>
                   Sinopse Rápida
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  "{book.summary}"
                </p>
             </div>

             <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                   </svg>
                   Análise Gemini AI
                </h3>
                {loading ? (
                   <div className="flex items-center gap-3 text-indigo-400 text-sm py-2">
                      <Spinner size="sm" />
                      <span>Lendo o livro virtualmente...</span>
                   </div>
                ) : (
                   <div className="text-indigo-800 text-sm leading-relaxed whitespace-pre-line">
                      {aiAnalysis}
                   </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

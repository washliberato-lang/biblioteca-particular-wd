
import React from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
  onToggleRead: (id: string) => void;
  readOnly?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onDelete, onToggleRead, readOnly = false }) => {
  // Deterministic placeholder based on ID for consistent visuals without external fetch
  const gradientIndex = book.id.charCodeAt(0) % 5;
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-orange-400 to-red-500',
    'from-purple-500 to-pink-600',
    'from-slate-500 to-gray-700',
  ];
  
  const baseGradient = gradients[gradientIndex];
  // Se lido, usa grayscale no gradiente ou reduz opacidade
  const bgClass = book.read 
    ? 'from-gray-500 to-gray-600 saturate-0' 
    : baseGradient;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full group relative ${book.read ? 'opacity-90' : ''}`}>
      
      {/* LIDO Badge Overlay */}
      {book.read && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
              <div className="border-2 border-white/40 text-white/90 font-black text-[10px] px-2 py-0.5 rounded rotate-[-5deg] bg-black/20 backdrop-blur-sm tracking-widest uppercase shadow-sm">
                  LIDO
              </div>
          </div>
      )}

      <div className={`h-40 bg-gradient-to-br ${bgClass} p-4 relative flex flex-col justify-between transition-colors duration-500`}>
        
        <div className="flex justify-between items-start">
            {/* Placeholder da Capa / Ícone Genérico */}
            <div className={`w-14 h-20 bg-white/20 backdrop-blur-sm rounded-r shadow-lg border-l-2 border-white/40 flex items-center justify-center shrink-0 transform transition-transform origin-top-left ${book.read ? '' : 'group-hover:scale-105'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            </div>

            {/* Year Badge */}
            <div className="opacity-80 text-white text-xs font-bold font-mono bg-black/20 px-2 py-1 rounded backdrop-blur-md shadow-sm">
              {book.year}
            </div>
        </div>

        <div className="flex justify-between items-end gap-2 mt-3">
            <h3 className={`text-white font-bold text-lg serif leading-tight line-clamp-2 drop-shadow-md flex-1 ${book.read ? 'line-through decoration-white/50 decoration-2' : ''}`}>
            {book.title}
            </h3>
            
            {/* Toggle Read Button */}
            {!readOnly && (
              <button 
                  onClick={() => onToggleRead(book.id)}
                  className={`shrink-0 p-1.5 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
                      book.read 
                      ? 'bg-green-500 border-green-400 text-white shadow-inner' 
                      : 'bg-white/20 border-white/30 text-white/70 hover:bg-white/30 hover:text-white'
                  }`}
                  title={book.read ? "Marcar como não lido" : "Marcar como lido"}
              >
                  {book.read ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                  ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                  )}
              </button>
            )}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {book.genre}
          </span>
          {book.publisher && (
             <span className="text-xs text-gray-400 font-medium truncate max-w-[100px] text-right">
               {book.publisher}
             </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-1 font-medium">{book.author}</p>
        <p className="text-xs text-gray-500 line-clamp-3 flex-1 italic mb-4">
          "{book.summary}"
        </p>
        
        {!readOnly && (
          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => onDelete(book.id)}
              className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

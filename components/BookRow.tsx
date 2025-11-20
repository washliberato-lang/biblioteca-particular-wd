
import React from 'react';
import { Book } from '../types';

interface BookRowProps {
  book: Book;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

export const BookRow: React.FC<BookRowProps> = ({ book, onDelete, readOnly = false }) => {
  const gradientIndex = book.id.charCodeAt(0) % 5;
  const textColors = [
    'text-blue-600',
    'text-emerald-600',
    'text-orange-600',
    'text-purple-600',
    'text-slate-600',
  ];
  const titleColor = textColors[gradientIndex];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-4 group">
      
      {/* Ícone / Avatar do Livro */}
      <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 ${titleColor} bg-opacity-10`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      {/* Title & Author */}
      <div className="flex-1 min-w-0">
        <h3 className={`font-bold text-base leading-tight ${titleColor} serif truncate`}>
          {book.title}
        </h3>
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-2 items-center">
            <span className="font-medium">{book.author}</span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-gray-500 text-xs">{book.publisher || 'Editora N/A'}</span>
        </div>
      </div>

      {/* Metadata Columns */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end text-sm text-gray-500">
        <div className="text-center px-2 min-w-[80px]">
             <div className="text-xs text-gray-400 uppercase font-bold">Ano</div>
             <div>{book.year}</div>
        </div>
        <div className="text-center px-2 min-w-[100px] hidden sm:block">
             <div className="text-xs text-gray-400 uppercase font-bold">Gênero</div>
             <div className="truncate max-w-[100px]">{book.genre}</div>
        </div>
        
        {/* Actions */}
        {!readOnly && (
            <button 
                onClick={() => onDelete(book.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Excluir"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            </button>
        )}
      </div>
    </div>
  );
};

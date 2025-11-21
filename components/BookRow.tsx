
import React from 'react';
import { Book } from '../types';

interface BookRowProps {
  book: Book;
  onClick: (book: Book) => void;
}

export const BookRow: React.FC<BookRowProps> = ({ book, onClick }) => {
  return (
    <div 
      onClick={() => onClick(book)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:bg-gray-50 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center gap-4"
    >
      {/* Ícone Simples */}
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-400 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 serif truncate group-hover:text-amber-800 transition-colors">
          {book.title}
        </h3>
        <div className="text-sm text-gray-500">
            {book.author} <span className="mx-1 text-gray-300">|</span> {book.publisher}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end">
        <div className="text-center min-w-[60px]">
             <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Ano</div>
             <div>{book.year}</div>
        </div>
        <div className="text-center min-w-[100px]">
             <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Gênero</div>
             <div className="truncate max-w-[120px]">{book.genre}</div>
        </div>
        <div className="min-w-[80px] text-right">
            {book.read ? (
                 <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                   Lido
                 </span>
            ) : (
                 <span className="text-xs text-gray-400">Disponível</span>
            )}
        </div>
      </div>
    </div>
  );
};

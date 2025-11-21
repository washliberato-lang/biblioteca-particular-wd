
import React, { useState, useEffect, useRef } from 'react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onClick: (book: Book) => void;
}

// Global cache to store URLs across component re-renders and list filtering.
// Key: "Title-Author", Value: URL string or null (if not found)
const globalCoverCache = new Map<string, string | null>();

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate a unique key for the cache
  const cacheKey = `${book.title}-${book.author}`.toLowerCase();

  // 1. Lazy Loading Logic: Only try to fetch when element is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      { rootMargin: '100px' } // Start fetching slightly before it appears
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  // 2. Fetch Logic: Triggered by visibility or cache check
  useEffect(() => {
    // If we already have it in cache, set immediately (no need to wait for scroll)
    if (globalCoverCache.has(cacheKey)) {
      setCoverUrl(globalCoverCache.get(cacheKey) || null);
      return;
    }

    // Only fetch if visible and not in cache
    if (!isVisible) return;

    let isMounted = true;

    const fetchCover = async () => {
      try {
        const query = `intitle:${encodeURIComponent(book.title)}+inauthor:${encodeURIComponent(book.author)}`;
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

        if (isMounted) {
          if (thumbnail) {
            const secureUrl = thumbnail.replace('http://', 'https://');
            globalCoverCache.set(cacheKey, secureUrl);
            setCoverUrl(secureUrl);
          } else {
            // Cache 'null' so we don't keep trying to fetch a book that has no cover
            globalCoverCache.set(cacheKey, null);
            setCoverUrl(null);
          }
        }
      } catch (error) {
        // On error, don't cache 'null' immediately to allow retries on refresh, 
        // but stop spinner/loading state.
        if (isMounted) setCoverUrl(null);
      }
    };

    // Small random delay to prevent burst requests even when scrolling fast
    const timeoutId = setTimeout(() => {
      fetchCover();
    }, Math.random() * 500); 

    return () => { 
      isMounted = false; 
      clearTimeout(timeoutId);
    };
  }, [isVisible, cacheKey, book.title, book.author]);

  // Deterministic gradient
  const gradientIndex = (book.title.length + (book.year || 0)) % 5;
  const gradients = [
    'from-blue-900 to-slate-900',
    'from-emerald-900 to-teal-900',
    'from-amber-900 to-orange-900',
    'from-purple-900 to-indigo-900',
    'from-gray-800 to-gray-900',
  ];
  
  const bgClass = gradients[gradientIndex];

  return (
    <div 
      ref={cardRef}
      onClick={() => onClick(book)}
      className={`cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col h-full group relative ${book.read ? 'opacity-100' : ''}`}
    >
      
      {book.read && (
          <div className="absolute top-0 right-0 z-20">
              <div className="bg-green-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg shadow-sm uppercase tracking-widest">
                  LIDO
              </div>
          </div>
      )}

      <div className={`h-36 bg-gradient-to-br ${bgClass} p-5 relative flex flex-col justify-between`}>
        <div className="flex justify-between items-start">
            {/* Lógica de Exibição da Capa */}
            <div className="w-16 h-24 -mt-2 shadow-lg rounded-sm overflow-hidden flex-shrink-0 bg-gray-800 border border-white/10 relative group-hover:scale-105 transition-transform duration-300">
                {coverUrl ? (
                    <img 
                        src={coverUrl} 
                        alt={`Capa de ${book.title}`} 
                        className="w-full h-full object-cover"
                        onError={() => {
                          setCoverUrl(null);
                          globalCoverCache.set(cacheKey, null); // Mark as bad URL
                        }} 
                    />
                ) : (
                    // Ícone Genérico / Fallback
                    <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="text-white/60 text-xs font-mono bg-black/20 px-2 py-1 rounded">{book.year}</div>
        </div>

        <div className="pl-[4.5rem]"> 
            {/* Margin left adicionada para não colidir com a capa maior */}
            <h3 className="text-white font-bold text-base serif leading-tight line-clamp-2 drop-shadow-sm group-hover:text-amber-200 transition-colors">
            {book.title}
            </h3>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
            {book.genre}
          </span>
        </div>
        
        <p className="text-sm text-gray-800 font-semibold mb-1">{book.author}</p>
        <p className="text-xs text-gray-500 line-clamp-2">
          {book.publisher || 'Editora desconhecida'}
        </p>

        <div className="mt-auto pt-4 flex justify-end">
           <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Ver Detalhes
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
           </span>
        </div>
      </div>
    </div>
  );
};

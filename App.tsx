
import React, { useState, useEffect, useMemo } from 'react';
import { Book, AppView, DisplayMode } from './types';
import { BookCard } from './components/BookCard';
import { BookRow } from './components/BookRow';
import { LibraryChat } from './components/LibraryChat';
import { WelcomeScreen } from './components/WelcomeScreen';
import { BookDetailsModal } from './components/BookDetailsModal';
import { Spinner } from './components/Spinner';
import { fetchBooks } from './services/supabaseClient';

function App() {
  const [view, setView] = useState<AppView>(AppView.WELCOME);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI State
  const [displayMode, setDisplayMode] = useState<DisplayMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('TITLE_ASC');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  
  // Modal State
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Carregar dados do Supabase ao iniciar a view LIST
  useEffect(() => {
    if (view === AppView.LIST && books.length === 0) {
      loadBooks();
    }
  }, [view]);

  const loadBooks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchBooks();
      if (data.length === 0) {
         // Não é necessariamente um erro, apenas lista vazia
         console.log('Nenhum livro encontrado no banco de dados.');
      }
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError('Não foi possível carregar a biblioteca. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica de Filtros e Ordenação
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)));
    return ['Todos', ...uniqueGenres.sort()];
  }, [books]);

  const processedBooks = useMemo(() => {
    let result = books;

    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(lowerQ) || 
        b.author.toLowerCase().includes(lowerQ) ||
        (b.publisher && b.publisher.toLowerCase().includes(lowerQ))
      );
    }

    if (selectedGenre !== 'Todos') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case 'TITLE_ASC': return a.title.localeCompare(b.title);
        case 'TITLE_DESC': return b.title.localeCompare(a.title);
        case 'YEAR_DESC': return b.year - a.year;
        case 'YEAR_ASC': return a.year - b.year;
        case 'AUTHOR_ASC': return a.author.localeCompare(b.author);
        default: return 0;
      }
    });
  }, [books, searchQuery, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen pb-20 library-bg relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-slate-900/50 pointer-events-none fixed z-0" style={{position: 'fixed'}}></div>

      <div className="relative z-10">
        
        {/* Navbar simples e elegante */}
        <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.WELCOME)}>
               <div className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded font-serif font-bold">
                  W
               </div>
               <span className="font-bold text-lg tracking-tight text-gray-900 serif">Biblioteca W&D</span>
            </div>

            <div className="flex gap-2">
               {view !== AppView.WELCOME && (
                 <>
                    <button 
                        onClick={() => setView(AppView.LIST)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === AppView.LIST ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Acervo
                    </button>
                    <button 
                        onClick={() => setView(AppView.CHAT)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === AppView.CHAT ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Bibliotecário IA
                    </button>
                 </>
               )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
           
           {view === AppView.WELCOME && (
              <WelcomeScreen onNavigate={setView} />
           )}

           {view === AppView.LIST && (
             <div className="animate-fade-in space-y-6">
                
                {/* Toolbar */}
                <div className="glass-panel p-4 rounded-2xl shadow-lg border border-white/20">
                   <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
                      <div>
                         <h2 className="text-xl font-bold text-gray-800 serif">Catálogo Geral</h2>
                         <p className="text-gray-500 text-sm mt-1">
                            {books.length} obras catalogadas
                         </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                         <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Buscar obra ou autor..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                         </div>

                         <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-amber-500 outline-none"
                         >
                            <option value="TITLE_ASC">Título (A-Z)</option>
                            <option value="AUTHOR_ASC">Autor (A-Z)</option>
                            <option value="YEAR_DESC">Mais Recentes</option>
                            <option value="YEAR_ASC">Mais Antigos</option>
                         </select>

                         <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
                            <button 
                                onClick={() => setDisplayMode('GRID')}
                                className={`p-2 rounded-md transition-all ${displayMode === 'GRID' ? 'bg-white shadow text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setDisplayMode('ROWS')}
                                className={`p-2 rounded-md transition-all ${displayMode === 'ROWS' ? 'bg-white shadow text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Tags Filtro */}
                   <div className="flex gap-2 overflow-x-auto pt-4 pb-2 no-scrollbar border-t border-gray-100 mt-4">
                      {genres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setSelectedGenre(genre)}
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                            selectedGenre === genre 
                                ? 'bg-amber-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {genre}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col justify-center items-center h-64">
                        <Spinner size="md" />
                        <p className="text-white mt-4 font-medium">Consultando Supabase...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
                        <p>{error}</p>
                        <p className="text-sm mt-2 opacity-75">
                          Certifique-se de que o banco de dados contém dados na estrutura correta (jsonb).
                        </p>
                    </div>
                )}

                {/* Grid/List View */}
                {!isLoading && !error && (
                    <>
                        {displayMode === 'GRID' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {processedBooks.map(book => (
                                    <BookCard key={book.id} book={book} onClick={setSelectedBook} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processedBooks.map(book => (
                                    <BookRow key={book.id} book={book} onClick={setSelectedBook} />
                                ))}
                            </div>
                        )}
                        {processedBooks.length === 0 && (
                            <div className="text-center text-white/70 py-20">
                                Nenhum livro encontrado com os filtros atuais.
                            </div>
                        )}
                    </>
                )}
             </div>
           )}

           {view === AppView.CHAT && (
              <div className="max-w-3xl mx-auto animate-fade-in glass-panel p-1 rounded-2xl shadow-2xl overflow-hidden h-[80vh]">
                 <LibraryChat books={books} />
              </div>
           )}

        </main>
      </div>

      {/* Detail Modal */}
      {selectedBook && (
          <BookDetailsModal 
              book={selectedBook} 
              onClose={() => setSelectedBook(null)} 
          />
      )}
    </div>
  );
}

export default App;

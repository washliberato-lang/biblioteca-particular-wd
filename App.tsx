
import React, { useState, useEffect, useMemo } from 'react';
import { Book, AppView, DisplayMode } from './types';
import { BookCard } from './components/BookCard';
import { BookRow } from './components/BookRow';
import { AddBookForm } from './components/AddBookForm';
import { LibraryChat } from './components/LibraryChat';
import { ImportBooks } from './components/ImportBooks';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ConfigModal } from './components/ConfigModal';
import { fetchGoogleSheetData } from './services/csvParser';
import { Spinner } from './components/Spinner';

function App() {
  const [view, setView] = useState<AppView>(AppView.LIST);
  const [books, setBooks] = useState<Book[]>([]);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('GRID');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [isLoadingSheet, setIsLoadingSheet] = useState(false);
  
  // State for "Cloud" Mode
  const [sheetUrl, setSheetUrl] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);

  // New States for Sorting and Filtering
  const [sortBy, setSortBy] = useState<string>('TITLE_ASC');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');

  // Initialize: Check URL params for sheet, otherwise local storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedSheet = params.get('sheet');

    if (sharedSheet) {
      // Guest / Read-Only Mode
      setIsReadOnly(true);
      setSheetUrl(sharedSheet);
      loadSheetData(sharedSheet);
    } else {
      // Admin / Local Mode
      const savedUrl = localStorage.getItem('biblioteca-wd-sheet-url');
      if (savedUrl) {
         setSheetUrl(savedUrl);
         loadSheetData(savedUrl);
      } else {
         const savedBooks = localStorage.getItem('biblioteca-wd-books');
         if (savedBooks) {
            try {
              setBooks(JSON.parse(savedBooks));
            } catch (e) {
              console.error("Failed to load books", e);
            }
         }
      }
    }
  }, []);

  // Persist books ONLY if not in read-only mode and not using sheet
  useEffect(() => {
    if (!isReadOnly && !sheetUrl) {
        localStorage.setItem('biblioteca-wd-books', JSON.stringify(books));
    }
  }, [books, isReadOnly, sheetUrl]);

  const loadSheetData = async (url: string) => {
    if (!url) return;
    setIsLoadingSheet(true);
    try {
      const sheetBooks = await fetchGoogleSheetData(url);
      setBooks(sheetBooks);
    } catch (error) {
      alert('Erro ao carregar dados da planilha. Verifique se o link está correto e público (CSV).');
    } finally {
      setIsLoadingSheet(false);
    }
  };

  const handleSaveConfig = (url: string) => {
    localStorage.setItem('biblioteca-wd-sheet-url', url);
    setSheetUrl(url);
    setShowConfig(false);
    if (url) {
        loadSheetData(url);
    } else {
        // If clearing URL, revert to local books
        const savedBooks = localStorage.getItem('biblioteca-wd-books');
        if (savedBooks) setBooks(JSON.parse(savedBooks));
    }
  };

  const handleAddBook = (book: Book) => {
    if (isReadOnly) return;
    if (sheetUrl) {
        alert("Você está usando uma planilha do Google Sheets. Adicione o livro diretamente lá para manter sincronizado.");
        return;
    }
    setBooks(prev => [book, ...prev]);
    setView(AppView.LIST);
  };

  const handleImportBooks = (newBooks: Book[]) => {
    if (isReadOnly) return;
    setBooks(prev => [...newBooks, ...prev]);
    setView(AppView.LIST);
  };

  const handleDeleteBook = (id: string) => {
    if (isReadOnly) return;
    if (sheetUrl) {
        alert("Para excluir, remova a linha na sua planilha do Google Sheets.");
        return;
    }
    if (window.confirm('Tem certeza que deseja remover este livro?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleToggleRead = (id: string) => {
      if (isReadOnly) return;
      if (sheetUrl) {
          alert("Atualize o status 'Lido' na sua planilha do Google Sheets.");
          return;
      }
      setBooks(prev => prev.map(book => {
          if (book.id === id) {
              return { ...book, read: !book.read };
          }
          return book;
      }));
  };

  // Extract unique genres for the filter list
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)));
    return ['Todos', ...uniqueGenres.sort()];
  }, [books]);

  // Filter and Sort books
  const processedBooks = useMemo(() => {
    let result = books;

    // 1. Filter by Search
    if (searchQuery.trim()) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(lowerQ) || 
        b.author.toLowerCase().includes(lowerQ) ||
        b.publisher?.toLowerCase().includes(lowerQ) ||
        b.genre.toLowerCase().includes(lowerQ)
      );
    }

    // 2. Filter by Genre
    if (selectedGenre !== 'Todos') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    // 3. Sort
    return result.sort((a, b) => {
      switch (sortBy) {
        case 'TITLE_ASC':
          return a.title.localeCompare(b.title);
        case 'TITLE_DESC':
          return b.title.localeCompare(a.title);
        case 'YEAR_DESC':
          return b.year - a.year; // Newest first
        case 'YEAR_ASC':
          return a.year - b.year; // Oldest first
        case 'AUTHOR_ASC':
          return a.author.localeCompare(b.author);
        default:
          return 0;
      }
    });
  }, [books, searchQuery, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen pb-20 library-bg relative">
      {/* Dark Overlay for background readability */}
      <div className="absolute inset-0 bg-gray-900/40 pointer-events-none fixed z-0" style={{position: 'fixed'}}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.LIST)}>
              <div className="bg-amber-700 text-white p-1.5 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-gray-900 serif leading-none">Biblioteca W&D</span>
                {isReadOnly && <span className="text-[10px] uppercase tracking-wider text-amber-600 font-bold">Modo Visitante</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
                <nav className="flex gap-1 bg-gray-100/80 p-1 rounded-lg overflow-x-auto backdrop-blur-sm">
                <button
                    onClick={() => setView(AppView.LIST)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    view === AppView.LIST ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Acervo
                </button>
                
                )}
                
                <button
                    onClick={() => setView(AppView.CHAT)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                    view === AppView.CHAT ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Chat IA
                </button>
                </nav>
                
                {/* Settings Button */}
                {!isReadOnly && (
                    <button 
                        onClick={() => setShowConfig(true)}
                        className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${sheetUrl ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                        title="Configurar Sincronização Google Drive"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {isLoadingSheet ? (
              <div className="flex flex-col items-center justify-center h-64 glass-panel rounded-2xl">
                  <Spinner size="md" />
                  <p className="mt-4 text-gray-600 font-medium animate-pulse">Sincronizando com Google Drive...</p>
              </div>
          ) : (
            <>
                {view === AppView.LIST && (
                    <div className="animate-fade-in space-y-6">
                    
                    {/* Control Bar (Only show if we have books) */}
                    {books.length > 0 && (
                        <>
                        <div className="glass-panel p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 justify-between items-center border border-white/20">
                            <div>
                            <h1 className="text-2xl font-bold text-gray-800 serif">Sua Coleção</h1>
                            <p className="text-gray-500 text-sm">
                                {processedBooks.length} {processedBooks.length === 1 ? 'livro' : 'livros'}
                                {selectedGenre !== 'Todos' && <span className="font-medium text-amber-700 ml-1">(Filtro: {selectedGenre})</span>}
                                {sheetUrl && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Google Sheets</span>}
                            </p>
                            </div>

                            <div className="flex flex-1 w-full md:w-auto gap-4 items-center justify-end flex-wrap md:flex-nowrap">
                                {/* Search Bar */}
                                <div className="relative w-full md:max-w-xs order-2 md:order-1">
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por título, autor..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm bg-white/80"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Sorting Dropdown */}
                                <div className="relative order-3 md:order-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white/90 text-sm font-medium text-gray-700 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                                >
                                    <option value="TITLE_ASC">Título (A-Z)</option>
                                    <option value="TITLE_DESC">Título (Z-A)</option>
                                    <option value="YEAR_DESC">Ano (Mais Recente)</option>
                                    <option value="YEAR_ASC">Ano (Mais Antigo)</option>
                                    <option value="AUTHOR_ASC">Autor (A-Z)</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                                </div>

                                {/* View Toggles */}
                                <div className="flex bg-gray-100 rounded-lg p-1 shrink-0 order-4 md:order-3">
                                    <button 
                                        onClick={() => setDisplayMode('GRID')}
                                        className={`p-2 rounded-md transition-all ${displayMode === 'GRID' ? 'bg-white shadow text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Visualização em Grade"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => setDisplayMode('ROWS')}
                                        className={`p-2 rounded-md transition-all ${displayMode === 'ROWS' ? 'bg-white shadow text-amber-700' : 'text-gray-400 hover:text-gray-600'}`}
                                        title="Visualização em Lista"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                </div>
                                
                                {!isReadOnly && !sheetUrl && (
                                    <button
                                        onClick={() => setView(AppView.ADD)}
                                        className="bg-amber-700 hover:bg-amber-800 text-white p-2 rounded-full shadow-lg shadow-amber-700/30 transition-all transform active:scale-95 shrink-0 order-1 md:order-4"
                                        title="Adicionar Livro"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Genre Filter Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {genres.map(genre => (
                            <button
                                key={genre}
                                onClick={() => setSelectedGenre(genre)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                                selectedGenre === genre 
                                    ? 'bg-amber-700 text-white border-amber-700 shadow-md' 
                                    : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-white hover:text-amber-800'
                                }`}
                            >
                                {genre}
                            </button>
                            ))}
                        </div>
                        </>
                    )}

                    {books.length === 0 ? (
                        <WelcomeScreen onStart={() => setView(AppView.LIST)} />
                    ) : (
                        <>
                        {/* Content Display */}
                        {displayMode === 'GRID' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {processedBooks.map(book => (
                                <BookCard 
                                        key={book.id} 
                                        book={book} 
                                        onDelete={handleDeleteBook} 
                                        onToggleRead={handleToggleRead}
                                        readOnly={isReadOnly || !!sheetUrl}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processedBooks.map(book => (
                                    <BookRow 
                                        key={book.id} 
                                        book={book} 
                                        onDelete={handleDeleteBook}
                                        readOnly={isReadOnly || !!sheetUrl} 
                                    />
                                ))}
                            </div>
                        )}
                        </>
                    )}
                    </div>
                )}

                {view === AppView.ADD && (
                    <AddBookForm 
                    onAdd={handleAddBook} 
                    onCancel={() => setView(AppView.LIST)} 
                    />
                )}

                {view === AppView.IMPORT && (
                    <ImportBooks
                    onImport={handleImportBooks}
                    onCancel={() => setView(AppView.LIST)}
                    />
                )}

                {view === AppView.CHAT && (
                    <div className="max-w-2xl mx-auto animate-fade-in glass-panel p-6 rounded-2xl shadow-2xl">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 serif">Bibliotecário Virtual</h2>
                        <p className="text-gray-500 text-sm">W&D Intelligence</p>
                    </div>
                    <LibraryChat books={books} />
                    </div>
                )}
            </>
          )}
        </main>
      </div>
      
      {showConfig && (
          <ConfigModal 
             currentUrl={sheetUrl} 
             onSave={handleSaveConfig} 
             onClose={() => setShowConfig(false)} 
          />
      )}
    </div>
  );
}

export default App;

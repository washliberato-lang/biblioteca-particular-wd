import React, { useState } from 'react';
import { parseBookList } from '../services/geminiService';
import { Book } from '../types';
import { Spinner } from './Spinner';

interface ImportBooksProps {
  onImport: (books: Book[]) => void;
  onCancel: () => void;
}

export const ImportBooks: React.FC<ImportBooksProps> = ({ onImport, onCancel }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedBooks, setParsedBooks] = useState<Partial<Book>[]>([]);
  const [step, setStep] = useState<'INPUT' | 'PREVIEW'>('INPUT');
  
  // Progress state
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.readAsText(file);
  };

  const processText = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    setParsedBooks([]);
    
    // Split by new lines to estimate count and chunk
    const lines = inputText.split(/\r?\n/).filter(line => line.trim().length > 0);
    const totalLines = lines.length;
    const CHUNK_SIZE = 15; // Reduce chunk size slightly as we ask for more fields (publisher)
    
    setProgress({ current: 0, total: totalLines });

    let allBooks: Partial<Book>[] = [];

    try {
      for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
        const chunk = lines.slice(i, i + CHUNK_SIZE).join('\n');
        const currentBatchNumber = Math.floor(i / CHUNK_SIZE) + 1;
        const totalBatches = Math.ceil(totalLines / CHUNK_SIZE);
        
        setStatusMessage(`Analisando lote ${currentBatchNumber} de ${totalBatches} (Identificando editoras... )`);
        
        // Retry logic for robustness
        let retries = 0;
        let success = false;
        
        while (retries < 3 && !success) {
            try {
                const result = await parseBookList(chunk);
                allBooks = [...allBooks, ...result];
                success = true;
            } catch (e) {
                console.warn(`Failed batch ${currentBatchNumber}, retrying...`);
                retries++;
                await new Promise(r => setTimeout(r, 1000 * retries)); // Exponential backoff
            }
        }

        setProgress({ current: Math.min(i + CHUNK_SIZE, totalLines), total: totalLines });
        setParsedBooks([...allBooks]);
      }
      
      setStep('PREVIEW');
    } catch (error) {
      alert('Houve um erro ao processar. Tente novamente ou verifique sua conexão.');
      console.error(error);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const finalizeImport = () => {
    const newBooks: Book[] = parsedBooks.map(pb => ({
      id: crypto.randomUUID(),
      title: pb.title || 'Sem Título',
      author: pb.author || 'Desconhecido',
      year: pb.year || new Date().getFullYear(),
      genre: pb.genre || 'Geral',
      publisher: pb.publisher || 'Importado',
      summary: pb.summary || 'Importado automaticamente',
      addedAt: new Date().toISOString(),
      read: false
    }));
    onImport(newBooks);
  };

  const percent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 serif">Importar do Google Drive / Excel</h2>
        <p className="text-gray-500 text-sm mt-1">
          Copie as células da sua planilha e cole abaixo.
          A IA detectará Título, Autor, Ano e Editora automaticamente.
        </p>
      </div>

      {step === 'INPUT' && (
        <div className="space-y-4">
          <div className="p-4 border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/50 text-center hover:bg-indigo-50 transition-colors relative">
            <input 
              type="file" 
              accept=".csv,.txt" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            <div className="flex flex-col items-center gap-2 text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-medium">Clique para enviar arquivo .CSV</span>
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Ou cole o texto aqui:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isProcessing}
              placeholder={`Exemplo:\nDom Casmurro, Machado de Assis\n1984, George Orwell, Companhia das Letras`}
              className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm disabled:bg-gray-100"
            />
          </div>
          
          {isProcessing && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <div className="flex justify-between items-end mb-2">
                <span className="text-indigo-700 font-medium text-sm">{statusMessage}</span>
                <span className="text-indigo-600 font-bold">{percent}%</span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button 
                onClick={onCancel} 
                disabled={isProcessing}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={processText}
              disabled={isProcessing || !inputText.trim()}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
            >
              {isProcessing ? <Spinner size="sm" /> : 'Processar Lista'}
            </button>
          </div>
        </div>
      )}

      {step === 'PREVIEW' && (
        <div className="space-y-4">
          <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sucesso! Processamos {parsedBooks.length} livros.
          </div>

          <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 bg-gray-50">
            {parsedBooks.map((book, idx) => (
              <div key={idx} className="p-3 hover:bg-white transition-colors">
                <div className="flex justify-between">
                  <strong className="text-gray-900 text-sm">{book.title}</strong>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{book.genre}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{book.author} • {book.year}</span>
                    <span className="italic">{book.publisher}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
             <button 
              onClick={() => setStep('INPUT')} 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Descartar e Voltar
            </button>
            <button 
              onClick={finalizeImport}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200"
            >
              Adicionar Todos à Coleção
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
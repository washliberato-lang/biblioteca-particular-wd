
import React, { useState, useMemo } from 'react';
import { AppView } from '../types';

interface WelcomeScreenProps {
  onNavigate: (view: AppView) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  
  // Lista de citações inspiradoras
  const quotes = [
    { text: "Um livro é um sonho que você segura na mão.", author: "Neil Gaiman" },
    { text: "Sempre imaginei que o paraíso fosse uma espécie de livraria.", author: "Jorge Luis Borges" },
    { text: "Os livros não mudam o mundo, quem muda o mundo são as pessoas. Os livros só mudam as pessoas.", author: "Mário Quintana" },
    { text: "A leitura de um bom livro é um diálogo incessante: o livro fala e a alma responde.", author: "André Maurois" },
    { text: "Muitos homens iniciaram uma nova era na sua vida a partir da leitura de um livro.", author: "Henry David Thoreau" },
    { text: "Ler é viajar sem sair do lugar, voar sem ter asas, caminhar sem tirar os pés do chão.", author: "Autor Desconhecido" },
    { text: "Não há amigo tão leal quanto um livro.", author: "Ernest Hemingway" }
  ];

  // Escolhe uma citação aleatória apenas na montagem do componente
  const randomQuote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  return (
    <div className="animate-fade-in glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/40 flex flex-col md:flex-row min-h-[600px]">
      
      {/* Lado Esquerdo: Conteúdo e Ações */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-white/80 md:bg-transparent">
        
        <div className="mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-amber-100 text-amber-800 text-xs font-bold tracking-wider uppercase mb-4">
            Gestão Inteligente de Livros
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 serif leading-tight mb-4">
            Construa o seu <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600">
              Legado Literário
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md">
            "Um quarto sem livros é como um corpo sem alma." <br/>
            <span className="text-sm text-gray-400 italic">— Cícero</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate(AppView.IMPORT)}
              className="group relative p-4 rounded-xl bg-white border-2 border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-2"
            >
              <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div>
                <span className="block font-bold text-gray-800 group-hover:text-amber-800">Importar Planilha</span>
                <span className="text-xs text-gray-500">Traga seus dados do Excel ou Drive em segundos.</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate(AppView.ADD)}
              className="group relative p-4 rounded-xl bg-amber-700 hover:bg-amber-800 shadow-lg hover:shadow-amber-700/30 transition-all text-left flex flex-col gap-2 text-white"
            >
              <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <span className="block font-bold">Adicionar Novo</span>
                <span className="text-xs text-amber-200">Use IA para preencher os detalhes automaticamente.</span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Organização automática</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Chat com Acervo</span>
          </div>
        </div>
      </div>

      {/* Lado Direito: Imagem Inspiradora */}
      <div className="md:w-1/2 relative overflow-hidden hidden md:block group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2228&auto=format&fit=crop" 
          alt="Biblioteca aconchegante" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        
        <div className="absolute bottom-8 left-8 right-8 z-20 text-white">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                  W&D
                </div>
                <span className="font-semibold text-sm text-white/90 uppercase tracking-wider">Inspiração do Dia</span>
             </div>
             <p className="text-lg font-serif italic text-white leading-relaxed">
               "{randomQuote.text}"
             </p>
             <p className="text-sm text-amber-200 mt-2 font-medium text-right">
               — {randomQuote.author}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

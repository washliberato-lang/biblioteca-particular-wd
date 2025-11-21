
import React, { useMemo } from 'react';
import { AppView } from '../types';

interface WelcomeScreenProps {
  onNavigate: (view: AppView) => void;
}

const quotes = [
  { text: "Um livro é um sonho que você segura na mão.", author: "Neil Gaiman" },
  { text: "A leitura é para o intelecto o que o exercício é para o corpo.", author: "Joseph Addison" },
  { text: "Muitos homens iniciaram uma nova era na sua vida a partir da leitura de um livro.", author: "Henry David Thoreau" },
  { text: "Ler é viajar sem sair do lugar, voar sem ter asas, caminhar sem tirar os pés do chão.", author: "Mario Quintana" },
  { text: "Os livros são espelhos: neles só se vê o que possuímos dentro.", author: "Carlos Ruiz Zafón" },
  { text: "Não há amigo tão leal quanto um livro.", author: "Ernest Hemingway" },
  { text: "Aprender a ler é acender um fogo; cada sílaba pronunciada é uma centelha.", author: "Victor Hugo" },
  { text: "Sempre imaginei que o paraíso fosse uma espécie de livraria.", author: "Jorge Luis Borges" },
  { text: "Quem não lê, aos 70 anos terá vivido apenas uma vida. Quem lê, terá vivido 5000 anos.", author: "Umberto Eco" }
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  // Seleciona uma frase aleatória
  const randomQuote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center animate-fade-in px-4">
      
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* Logo / Header Minimalista */}
        <div className="inline-block mb-4">
           <div className="w-16 h-16 bg-gray-900 text-white text-2xl font-serif font-bold flex items-center justify-center rounded-lg shadow-2xl mx-auto mb-4 border border-white/20">
             W&D
           </div>
           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 serif drop-shadow-sm">
             Biblioteca Particular
           </h1>
           <div className="h-1 w-24 bg-amber-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Texto Descritivo */}
        <div className="glass-panel p-8 rounded-2xl shadow-xl border border-white/30 backdrop-blur-md max-w-2xl mx-auto">
            <p className="text-xl text-gray-800 font-light leading-relaxed">
              Consulte obras, autores e obtenha insights com IA.
            </p>
            
            <div className="mt-8">
              <button
                  onClick={() => onNavigate(AppView.LIST)}
                  className="bg-gray-900 text-white px-10 py-4 rounded-full font-medium text-lg shadow-lg hover:bg-amber-700 hover:shadow-amber-500/30 hover:-translate-y-1 transition-all duration-300"
                >
                  Acessar Acervo
              </button>
            </div>
        </div>

        {/* Citação Inspiradora */}
        <div className="mt-12 max-w-xl mx-auto opacity-90">
           <p className="text-gray-700 text-lg italic font-serif font-medium drop-shadow-sm">
              "{randomQuote.text}"
           </p>
           <p className="text-gray-600 text-sm font-bold mt-2 uppercase tracking-widest">
              — {randomQuote.author}
           </p>
        </div>

      </div>
    </div>
  );
};

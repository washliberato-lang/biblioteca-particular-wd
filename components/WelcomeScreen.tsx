import React from 'react';
import { AppView } from '../types';

interface WelcomeScreenProps {
  onStart: : () => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="glass-panel p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto border border-white/20">
        <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white p-6 rounded-2xl shadow-lg mb-8 inline-block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 serif mb-4">
          Bem-vindo à Biblioteca W&D
        </h1>

        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Explore os livros da biblioteca.        </p>

        <button
          onClick={() => onStar()}
          className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-amber-700/30 transition-all transform hover:scale-105 active:scale-95"
        >
          Começar a Navegar →
        </button>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Sistema de gerenciamento inteligente de biblioteca pessoal
          </p>
        </div>
      </div>
    </div>
  );
}

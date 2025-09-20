
import React from 'react';
import { AnalysisMode } from '../types';
import { LeafIcon, UtensilsIcon } from './icons';

interface InitialScreenProps {
  onModeSelect: (mode: AnalysisMode) => void;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({ onModeSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-teal-400 tracking-wider">ECOSAUR</h1>
        <p className="text-gray-400 mt-4 text-lg">Your AI-powered product analysis assistant.</p>
      </header>
      
      <main className="w-full max-w-2xl">
        <p className="text-center text-xl mb-8 text-gray-300">What would you like to analyze today?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => onModeSelect('food')}
            className="group flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-lg hover:bg-teal-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            <UtensilsIcon className="w-16 h-16 mb-4 text-teal-400 group-hover:text-white transition-colors" />
            <span className="text-2xl font-semibold text-white">Analyze Food</span>
            <span className="text-gray-400 mt-1 group-hover:text-gray-200">Check its health impact</span>
          </button>
          <button
            onClick={() => onModeSelect('electronics')}
            className="group flex flex-col items-center justify-center p-8 bg-gray-800 rounded-2xl shadow-lg hover:bg-green-800 transition-all duration-300 transform hover:-translate-y-1"
          >
            <LeafIcon className="w-16 h-16 mb-4 text-green-400 group-hover:text-white transition-colors" />
            <span className="text-2xl font-semibold text-white">Analyze Electronics</span>
            <span className="text-gray-400 mt-1 group-hover:text-gray-200">Assess its eco-friendliness</span>
          </button>
        </div>
      </main>
      
      <footer className="absolute bottom-4 text-gray-600 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

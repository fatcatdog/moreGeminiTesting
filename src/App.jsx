import React, { useState, useEffect, useRef, useCallback } from 'react';

import PongGameLogic from './games/pong/PongGameLogic';
import PongGame from './games/pong/PongGame';


// --- React Components ---

// Main App Component: Manages navigation and renders pages
const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const navigateTo = (page) => setCurrentPage(page);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header onNavigate={navigateTo} />
      <main className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'pong' && <PongGame />}
      </main>
      <footer className="text-center p-4 w-full">
        <p>Built with React & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

// Header Component
const Header = ({ onNavigate }) => (
  <header className="bg-gray-800 shadow-lg w-full">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cyan-400">React Arcade</h1>
      <div>
        <button onClick={() => onNavigate('home')} className="text-white hover:text-cyan-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium">
          Home
        </button>
        <button onClick={() => onNavigate('pong')} className="bg-cyan-500 hover:bg-cyan-600 text-white transition-colors duration-300 px-4 py-2 rounded-md text-sm font-medium ml-4">
          Play Pong
        </button>
      </div>
    </nav>
  </header>
);

// HomePage Component
const HomePage = () => (
  <div className="text-center">
    <h2 className="text-5xl font-extrabold mb-4 animate-pulse">Welcome to the Arcade</h2>
    <p className="text-xl text-gray-400">Select a game from the header to start playing.</p>
  </div>
);

export default App;
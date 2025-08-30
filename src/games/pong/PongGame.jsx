import React, { useState, useEffect, useRef, useCallback } from 'react';
import PongGameLogic from './PongGameLogic';

// PongGame Component: Handles rendering and user input
const PongGame = () => {
  const canvasRef = useRef(null);
  const gameInstance = useRef(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [winner, setWinner] = useState(null);
  const WINNING_SCORE = 5;

  const resetGame = useCallback(() => {
    setPlayerScore(0);
    setComputerScore(0);
    setWinner(null);
    if (gameInstance.current) {
      gameInstance.current.reset();
    }
  }, []);

  // Main game loop effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 800;
    canvas.height = 600;
    
    // Initialize the game logic class
    gameInstance.current = new PongGameLogic(canvas, setPlayerScore, setComputerScore);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      if (gameInstance.current) {
        gameInstance.current.updatePlayerPaddle(mouseY);
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const gameLoop = () => {
      if (!gameInstance.current || winner) {
        return;
      }
      gameInstance.current.update();
      gameInstance.current.draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [winner]); // Rerun effect if the winner changes (to stop the loop)

  // Effect to check for a winner
  useEffect(() => {
    if (playerScore >= WINNING_SCORE) {
      setWinner('You');
    } else if (computerScore >= WINNING_SCORE) {
      setWinner('Computer');
    }
  }, [playerScore, computerScore]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Classic Pong</h2>
      <div className="flex justify-around w-full max-w-3xl mb-2 text-2xl font-mono">
        <span>Player: {playerScore}</span>
        <span>Computer: {computerScore}</span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="bg-gray-800 rounded-lg shadow-2xl border-2 border-cyan-500"></canvas>
        {winner && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center rounded-lg">
            <h3 className="text-5xl font-bold text-cyan-400 mb-4">{winner} Wins!</h3>
            <button onClick={resetGame} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-transform transform hover:scale-105">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PongGame;
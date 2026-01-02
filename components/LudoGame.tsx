'use client';

import { useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import Dice from './Dice';
import WalletConnect from './WalletConnect';
import {
  createInitialGameState,
  rollDice,
  movePiece,
  getMovablePieces,
  hasValidMoves,
  nextTurn,
} from '@/lib/gameLogic';
import { GameState } from '@/lib/gameTypes';

export default function LudoGame() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [rolling, setRolling] = useState(false);
  const [selectablePieceIds, setSelectablePieceIds] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('Welcome to FLudo! Start the game and roll the dice.');

  useEffect(() => {
    if (gameState.diceValue !== null) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const movablePieces = getMovablePieces(currentPlayer, gameState.diceValue, gameState);
      
      if (movablePieces.length === 0) {
        setMessage(`No valid moves for ${currentPlayer.name}. Next player's turn.`);
        setTimeout(() => {
          setGameState(nextTurn(gameState));
          setSelectablePieceIds(new Set());
        }, 2000);
      } else if (movablePieces.length === 1) {
        // Auto-move if only one piece can move
        setTimeout(() => {
          handlePieceClick(movablePieces[0].id);
        }, 500);
      } else {
        setSelectablePieceIds(new Set(movablePieces.map(p => p.id)));
        setMessage(`${currentPlayer.name}: Select a piece to move.`);
      }
    }
  }, [gameState.diceValue]);

  const handleStartGame = () => {
    const newState = { ...gameState, gameStarted: true };
    setGameState(newState);
    setMessage(`${newState.players[0].name}'s turn. Roll the dice!`);
  };

  const handleRollDice = () => {
    if (gameState.winner !== null) return;
    
    setRolling(true);
    setMessage('Rolling...');
    
    setTimeout(() => {
      const diceValue = rollDice();
      const newState = {
        ...gameState,
        diceValue,
        lastRoll: diceValue,
      };
      setGameState(newState);
      setRolling(false);
      
      const currentPlayer = newState.players[newState.currentPlayerIndex];
      setMessage(`${currentPlayer.name} rolled a ${diceValue}!`);
    }, 1000);
  };

  const handlePieceClick = (pieceId: string) => {
    if (!gameState.diceValue || !selectablePieceIds.has(pieceId)) return;

    const newState = movePiece(gameState, pieceId, gameState.diceValue);
    
    if (newState.winner !== null) {
      const winner = newState.players[newState.winner];
      setMessage(`🎉 ${winner.name} wins! Congratulations!`);
    } else if (newState.canRollAgain) {
      setMessage(`${newState.players[newState.currentPlayerIndex].name} rolled a 6! Roll again.`);
    } else {
      const nextPlayer = newState.players[(newState.currentPlayerIndex + 1) % newState.players.length];
      setMessage(`${nextPlayer.name}'s turn. Roll the dice!`);
    }
    
    setGameState(newState);
    setSelectablePieceIds(new Set());
    
    if (!newState.canRollAgain && newState.winner === null) {
      setTimeout(() => {
        setGameState(nextTurn(newState));
      }, 1000);
    }
  };

  const handleReset = () => {
    setGameState(createInitialGameState());
    setSelectablePieceIds(new Set());
    setMessage('Game reset. Start a new game!');
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const canRoll = gameState.gameStarted && 
                  gameState.diceValue === null && 
                  !rolling && 
                  gameState.winner === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          🎲 FLudo - Blockchain Ludo Game
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Wallet & Controls */}
          <div className="space-y-6">
            <WalletConnect />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Game Controls</h2>
              
              {!gameState.gameStarted ? (
                <button
                  onClick={handleStartGame}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Start Game
                </button>
              ) : (
                <div className="space-y-4">
                  <Dice
                    value={gameState.lastRoll}
                    onRoll={handleRollDice}
                    disabled={!canRoll}
                    rolling={rolling}
                  />
                  
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Reset Game
                  </button>
                </div>
              )}
            </div>

            {/* Game Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">Game Status</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{message}</p>
              
              {gameState.gameStarted && gameState.winner === null && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-black"
                    style={{ backgroundColor: `var(--${currentPlayer.color})` }}
                  />
                  <span className="font-semibold">{currentPlayer.name}'s Turn</span>
                </div>
              )}
            </div>
          </div>

          {/* Center - Game Board */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <GameBoard
                players={gameState.players}
                onPieceClick={handlePieceClick}
                currentPlayerId={gameState.currentPlayerIndex}
                selectablePieceIds={selectablePieceIds}
              />
            </div>

            {/* Player Info */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {gameState.players.map(player => (
                <div
                  key={player.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 ${
                    player.id === currentPlayer.id && gameState.gameStarted && gameState.winner === null
                      ? 'border-yellow-400'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `var(--${player.color})` }}
                    />
                    <span className="font-bold text-sm">{player.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Home: {player.pieces.filter(p => p.inHome).length}
                    <br />
                    Finished: {player.pieces.filter(p => p.completed).length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --red: #EF4444;
          --blue: #3B82F6;
          --green: #10B981;
          --yellow: #F59E0B;
        }
      `}</style>
    </div>
  );
}

// Game types and constants
export const BOARD_SIZE = 52;
export const PLAYERS = 4;
export const PIECES_PER_PLAYER = 4;
export const HOME_STRETCH_LENGTH = 5;

export type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  id: string;
  playerId: number;
  color: PlayerColor;
  position: number; // -1 means in home, 0-51 on main track, 52-56 in home stretch, 57 completed
  inHome: boolean;
  inHomeStretch: boolean;
  completed: boolean;
}

export interface Player {
  id: number;
  color: PlayerColor;
  name: string;
  pieces: Piece[];
  walletAddress?: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  winner: number | null;
  gameStarted: boolean;
  lastRoll: number | null;
  canRollAgain: boolean;
}

export const PLAYER_COLORS: PlayerColor[] = ['red', 'blue', 'green', 'yellow'];

export const PLAYER_START_POSITIONS: Record<PlayerColor, number> = {
  red: 0,
  blue: 13,
  green: 26,
  yellow: 39,
};

export const SAFE_POSITIONS = [0, 8, 13, 21, 26, 34, 39, 47];

export const COLOR_MAP: Record<PlayerColor, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
};

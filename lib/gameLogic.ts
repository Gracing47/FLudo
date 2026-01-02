import {
  GameState,
  Player,
  Piece,
  PlayerColor,
  PLAYER_COLORS,
  PLAYER_START_POSITIONS,
  BOARD_SIZE,
  HOME_STRETCH_LENGTH,
  SAFE_POSITIONS,
  PIECES_PER_PLAYER,
} from './gameTypes';

export function createInitialGameState(): GameState {
  const players = PLAYER_COLORS.map((color, index) => createPlayer(index, color));
  
  return {
    players,
    currentPlayerIndex: 0,
    diceValue: null,
    winner: null,
    gameStarted: false,
    lastRoll: null,
    canRollAgain: false,
  };
}

function createPlayer(id: number, color: PlayerColor): Player {
  const pieces: Piece[] = [];
  for (let i = 0; i < PIECES_PER_PLAYER; i++) {
    pieces.push({
      id: `${color}-${i}`,
      playerId: id,
      color,
      position: -1,
      inHome: true,
      inHomeStretch: false,
      completed: false,
    });
  }

  return {
    id,
    color,
    name: `Player ${id + 1}`,
    pieces,
  };
}

export function rollDice(): number {
  return Math.floor(Math.random() * 6) + 1;
}

export function canMovePiece(piece: Piece, diceValue: number, gameState: GameState): boolean {
  // If piece is in home, can only move on 6
  if (piece.inHome) {
    return diceValue === 6;
  }

  // If piece is completed, can't move
  if (piece.completed) {
    return false;
  }

  // If in home stretch
  if (piece.inHomeStretch) {
    const newPos = piece.position + diceValue;
    // Can't overshoot the finish
    return newPos <= 57;
  }

  return true;
}

export function getMovablePieces(player: Player, diceValue: number, gameState: GameState): Piece[] {
  return player.pieces.filter(piece => canMovePiece(piece, diceValue, gameState));
}

export function movePiece(
  gameState: GameState,
  pieceId: string,
  diceValue: number
): GameState {
  // Create a proper deep copy of the game state
  const newState: GameState = {
    ...gameState,
    players: gameState.players.map(player => ({
      ...player,
      pieces: player.pieces.map(piece => ({ ...piece }))
    }))
  };
  
  const currentPlayer = newState.players[newState.currentPlayerIndex];
  const piece = currentPlayer.pieces.find(p => p.id === pieceId);

  if (!piece || !canMovePiece(piece, diceValue, newState)) {
    return gameState;
  }

  // Move from home
  if (piece.inHome && diceValue === 6) {
    piece.inHome = false;
    piece.position = PLAYER_START_POSITIONS[piece.color];
  } else if (piece.inHomeStretch) {
    // Move in home stretch
    piece.position += diceValue;
    if (piece.position === 57) {
      piece.completed = true;
    }
  } else {
    // Normal move
    const startPos = PLAYER_START_POSITIONS[piece.color];
    const distanceFromStart = (piece.position - startPos + BOARD_SIZE) % BOARD_SIZE;
    const newDistance = distanceFromStart + diceValue;

    if (newDistance >= BOARD_SIZE) {
      // Entering home stretch
      piece.inHomeStretch = true;
      piece.position = 52 + (newDistance - BOARD_SIZE);
      if (piece.position === 57) {
        piece.completed = true;
      }
    } else {
      piece.position = (startPos + newDistance) % BOARD_SIZE;
    }
  }

  // Check for captures
  if (!piece.inHomeStretch && !piece.completed && !SAFE_POSITIONS.includes(piece.position)) {
    for (const otherPlayer of newState.players) {
      if (otherPlayer.id === currentPlayer.id) continue;

      for (const otherPiece of otherPlayer.pieces) {
        if (
          otherPiece.position === piece.position &&
          !otherPiece.inHome &&
          !otherPiece.inHomeStretch &&
          !otherPiece.completed
        ) {
          // Capture the piece - send it back home
          otherPiece.position = -1;
          otherPiece.inHome = true;
        }
      }
    }
  }

  // Check for winner
  const allCompleted = currentPlayer.pieces.every(p => p.completed);
  if (allCompleted) {
    newState.winner = currentPlayer.id;
  }

  // Determine if player can roll again (rolled 6 or captured)
  newState.canRollAgain = diceValue === 6 && newState.winner === null;

  return newState;
}

export function hasValidMoves(player: Player, diceValue: number, gameState: GameState): boolean {
  return getMovablePieces(player, diceValue, gameState).length > 0;
}

export function nextTurn(gameState: GameState): GameState {
  const newState = { ...gameState };
  if (!newState.canRollAgain) {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
  }
  newState.diceValue = null;
  newState.lastRoll = null;
  newState.canRollAgain = false;
  return newState;
}

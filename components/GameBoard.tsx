'use client';

import { Player, Piece, COLOR_MAP } from '@/lib/gameTypes';

interface GameBoardProps {
  players: Player[];
  onPieceClick: (pieceId: string) => void;
  currentPlayerId: number;
  selectablePieceIds: Set<string>;
}

export default function GameBoard({
  players,
  onPieceClick,
  currentPlayerId,
  selectablePieceIds,
}: GameBoardProps) {
  const getBoardPosition = (position: number, color: string) => {
    // Simplified board layout - circular path
    const radius = 140;
    const centerX = 200;
    const centerY = 200;
    const angle = (position / 52) * 2 * Math.PI - Math.PI / 2;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const getHomePosition = (playerId: number, pieceIndex: number) => {
    const positions = [
      { x: 50, y: 50 },
      { x: 350, y: 50 },
      { x: 50, y: 350 },
      { x: 350, y: 350 },
    ];
    const base = positions[playerId];
    const offset = pieceIndex < 2 ? 0 : 30;
    const side = pieceIndex % 2 === 0 ? 0 : 30;
    return {
      x: base.x + side,
      y: base.y + offset,
    };
  };

  const getHomeStretchPosition = (position: number, color: string) => {
    // Positions 52-57 are in home stretch leading to center
    const progress = position - 52;
    const centerX = 200;
    const centerY = 200;
    
    // Home stretch positions based on color
    const directions: Record<string, { dx: number; dy: number }> = {
      red: { dx: 0, dy: -1 },
      blue: { dx: 1, dy: 0 },
      green: { dx: 0, dy: 1 },
      yellow: { dx: -1, dy: 0 },
    };
    
    const dir = directions[color] || { dx: 0, dy: 0 };
    return {
      x: centerX + dir.dx * (60 - progress * 8),
      y: centerY + dir.dy * (60 - progress * 8),
    };
  };

  const renderPiece = (piece: Piece, player: Player) => {
    let pos = { x: 0, y: 0 };
    
    if (piece.completed) {
      // Center position
      pos = { x: 200, y: 200 };
    } else if (piece.inHome) {
      const pieceIndex = player.pieces.indexOf(piece);
      pos = getHomePosition(player.id, pieceIndex);
    } else if (piece.inHomeStretch) {
      pos = getHomeStretchPosition(piece.position, piece.color);
    } else {
      pos = getBoardPosition(piece.position, piece.color);
    }

    const isSelectable = selectablePieceIds.has(piece.id);
    const isCurrentPlayer = player.id === currentPlayerId;

    return (
      <circle
        key={piece.id}
        cx={pos.x}
        cy={pos.y}
        r={12}
        fill={COLOR_MAP[piece.color]}
        stroke={isSelectable ? '#FFD700' : '#000'}
        strokeWidth={isSelectable ? 3 : 1}
        className={`transition-all ${
          isSelectable && isCurrentPlayer
            ? 'cursor-pointer hover:scale-110 animate-pulse'
            : ''
        }`}
        onClick={() => isSelectable && isCurrentPlayer && onPieceClick(piece.id)}
      />
    );
  };

  return (
    <div className="relative w-full max-w-[440px] mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Board background */}
        <rect width="400" height="400" fill="#FFF8DC" stroke="#8B4513" strokeWidth="3" />
        
        {/* Corner home areas */}
        <rect x="10" y="10" width="130" height="130" fill="#FFE4E4" stroke="#000" strokeWidth="2" />
        <rect x="260" y="10" width="130" height="130" fill="#E4E4FF" stroke="#000" strokeWidth="2" />
        <rect x="10" y="260" width="130" height="130" fill="#E4FFE4" stroke="#000" strokeWidth="2" />
        <rect x="260" y="260" width="130" height="130" fill="#FFFFE4" stroke="#000" strokeWidth="2" />
        
        {/* Center finish area */}
        <circle cx="200" cy="200" r="40" fill="#FFD700" stroke="#000" strokeWidth="2" />
        <text x="200" y="205" textAnchor="middle" fontSize="12" fontWeight="bold">
          FINISH
        </text>
        
        {/* Board path circles */}
        {Array.from({ length: 52 }).map((_, i) => {
          const pos = getBoardPosition(i, 'red');
          const isSafe = [0, 8, 13, 21, 26, 34, 39, 47].includes(i);
          return (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r={8}
              fill={isSafe ? '#90EE90' : '#FFF'}
              stroke="#000"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Render all pieces */}
        {players.map(player => player.pieces.map(piece => renderPiece(piece, player)))}
      </svg>
    </div>
  );
}

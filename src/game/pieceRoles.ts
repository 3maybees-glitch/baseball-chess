import type { PieceSymbol } from 'chess.js';
import type { PieceMeta, PieceRole } from './types';

export const PIECE_META: Record<PieceSymbol, PieceMeta> = {
  k: {
    role: 'gm',
    title: 'General Manager',
    chessName: 'King',
    symbol: '👔',
    description: 'Tough financial, roster, and draft decisions',
  },
  q: {
    role: 'manager',
    title: 'Dugout Manager',
    chessName: 'Queen',
    symbol: '📋',
    description: 'Lineup, bullpen, and in-game strategy calls',
  },
  b: {
    role: 'fielder',
    title: 'Fielder',
    chessName: 'Bishop',
    symbol: '🥎',
    description: 'Outfield and infield throw / route decisions',
  },
  r: {
    role: 'catcher',
    title: 'Catcher',
    chessName: 'Rook',
    symbol: '😷',
    description: 'Pitch calling, framing, and blocking decisions',
  },
  n: {
    role: 'pitcher',
    title: 'Pitcher',
    chessName: 'Knight',
    symbol: '⚾',
    description: 'Pitch selection and approach decisions',
  },
  p: {
    role: 'hitter',
    title: 'Hitter',
    chessName: 'Pawn',
    symbol: '🏏',
    description: 'Approach, plate discipline, and swing decisions',
  },
};

export function roleForPiece(piece: PieceSymbol): PieceRole {
  return PIECE_META[piece].role;
}

export function metaForPiece(piece: PieceSymbol): PieceMeta {
  return PIECE_META[piece];
}

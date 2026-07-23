import type { Color, PieceSymbol, Square } from 'chess.js';

export type PieceRole =
  | 'gm'
  | 'manager'
  | 'fielder'
  | 'catcher'
  | 'pitcher'
  | 'hitter';

export interface PieceMeta {
  role: PieceRole;
  title: string;
  chessName: string;
  symbol: string;
  description: string;
}

export interface ScenarioOption {
  id: 'A' | 'B';
  label: string;
  /** True success probability in the Monte Carlo model (0–1). Hidden from player. */
  successRate: number;
  /** Expected value / utility if successful. Higher is better. */
  successValue: number;
  /** Utility if the attempt fails. */
  failValue: number;
}

export interface DecisionScenario {
  id: string;
  role: PieceRole;
  roleTitle: string;
  title: string;
  situation: string;
  question: string;
  optionA: ScenarioOption;
  optionB: ScenarioOption;
  /** Flavor for the sim readout */
  metricLabel: string;
}

export interface MonteCarloResult {
  trials: number;
  meanA: number;
  meanB: number;
  winRateA: number;
  winRateB: number;
  correctOption: 'A' | 'B';
  margin: number;
  narrative: string;
}

export interface PendingMove {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
  piece: PieceSymbol;
  color: Color;
  san: string;
  captured?: PieceSymbol;
}

export interface GameStats {
  chessMovesHuman: number;
  chessMovesAI: number;
  decisionsAttempted: number;
  decisionsCorrect: number;
  decisionsWrong: number;
  turnsSkipped: number;
}

export interface MoveLogEntry {
  ply: number;
  side: 'human' | 'ai';
  san: string;
  pieceRole?: PieceRole;
  decisionCorrect?: boolean;
  scenarioTitle?: string;
}

export type GamePhase =
  | 'selecting'
  | 'deciding'
  | 'simulating'
  | 'result'
  | 'ai-thinking'
  | 'game-over';

export type GameResult = 'checkmate-win' | 'checkmate-loss' | 'draw' | 'stalemate' | null;

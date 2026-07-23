import { Chess, type Color, type PieceSymbol, type Square } from 'chess.js';
import { ChessPiece } from './ChessPiece';

interface Props {
  chess: Chess;
  selected: Square | null;
  legalTargets: Square[];
  lastMove: { from: Square; to: Square } | null;
  interactive: boolean;
  onSquareClick: (square: Square) => void;
  orientation?: Color;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

function isLight(file: number, rank: number): boolean {
  return (file + rank) % 2 === 0;
}

export function Board({
  chess,
  selected,
  legalTargets,
  lastMove,
  interactive,
  onSquareClick,
  orientation = 'w',
}: Props) {
  const files = orientation === 'w' ? [...FILES] : [...FILES].reverse();
  const ranks = orientation === 'w' ? [...RANKS] : [...RANKS].reverse();
  const board = chess.board();

  return (
    <div className="diamond-stage">
      <div className="field-backdrop" aria-hidden>
        <div className="outfield-grass" />
        <div className="infield-dirt" />
        <div className="base-path" />
        <div className="pitchers-mound" />
        <div className="home-plate-deco" />
        <div className="foul-line foul-left" />
        <div className="foul-line foul-right" />
        <div className="warning-track" />
      </div>

      <div className={`board-frame ${interactive ? 'interactive' : 'locked'}`}>
        <div className="board-header-tape">
          <span>HOME DUGOUT</span>
          <span className="tape-mid">BASEBALL CHESS</span>
          <span>AWAY DUGOUT</span>
        </div>
        <div className="chess-board" role="grid" aria-label="Baseball chess board">
          {ranks.map((rank) =>
            files.map((file, fileIdx) => {
              const square = `${file}${rank}` as Square;
              const fileNum = file.charCodeAt(0) - 97;
              const rankIdx = 8 - rank;
              const piece = board[rankIdx]![fileNum];
              const light = isLight(fileNum, rank);
              const isSelected = selected === square;
              const isTarget = legalTargets.includes(square);
              const isLast =
                lastMove && (lastMove.from === square || lastMove.to === square);
              const isCheckKing =
                chess.inCheck() &&
                piece?.type === 'k' &&
                piece.color === chess.turn();

              return (
                <button
                  key={square}
                  type="button"
                  role="gridcell"
                  className={[
                    'square',
                    light ? 'light' : 'dark',
                    isSelected ? 'selected' : '',
                    isTarget ? 'target' : '',
                    isLast ? 'last-move' : '',
                    isCheckKing ? 'in-check' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => interactive && onSquareClick(square)}
                  disabled={!interactive}
                  aria-label={`${square}${piece ? `, ${piece.color} ${piece.type}` : ''}`}
                >
                  {fileIdx === 0 && <span className="coord rank-coord">{rank}</span>}
                  {rank === ranks[ranks.length - 1] && (
                    <span className="coord file-coord">{file}</span>
                  )}
                  {isTarget && !piece && <span className="move-dot" />}
                  {isTarget && piece && <span className="capture-ring" />}
                  {piece && (
                    <span className={`piece-wrap color-${piece.color}`}>
                      <ChessPiece
                        type={piece.type as PieceSymbol}
                        color={piece.color as Color}
                      />
                    </span>
                  )}
                </button>
              );
            }),
          )}
        </div>
        <div className="board-footer-tape">
          <span>⚾ Hitters · Pitchers · Catchers · Fielders · Manager · GM ⚾</span>
        </div>
      </div>
    </div>
  );
}

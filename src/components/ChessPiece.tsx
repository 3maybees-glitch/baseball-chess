import type { Color, PieceSymbol } from 'chess.js';

interface Props {
  type: PieceSymbol;
  color: Color;
  size?: number;
}

/** Decorative baseball-themed chess pieces rendered as SVG. */
export function ChessPiece({ type, color, size = 56 }: Props) {
  const isWhite = color === 'w';
  const body = isWhite ? '#f7f3e8' : '#1c1c1c';
  const stroke = isWhite ? '#2a2a2a' : '#e8e4d8';
  const accent = isWhite ? '#0b3d91' : '#c41e3a';
  const leather = '#8b4513';
  const stitch = '#c41e3a';

  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    className: 'chess-piece-svg',
    'aria-hidden': true as const,
  };

  switch (type) {
    case 'k': // GM — King with tie
      return (
        <svg {...common}>
          <circle cx="32" cy="18" r="9" fill={body} stroke={stroke} strokeWidth="1.5" />
          <path d="M18 30 Q32 26 46 30 L44 54 Q32 58 20 54 Z" fill={body} stroke={stroke} strokeWidth="1.5" />
          {/* Crown points */}
          <path d="M22 12 L26 4 L32 10 L38 4 L42 12" fill="none" stroke={accent} strokeWidth="2.2" strokeLinejoin="round" />
          {/* Tie */}
          <path d="M32 30 L28 36 L32 50 L36 36 Z" fill={accent} stroke={stroke} strokeWidth="0.8" />
          <rect x="29" y="28" width="6" height="4" rx="1" fill={accent} />
        </svg>
      );
    case 'q': // Manager — Queen with clipboard
      return (
        <svg {...common}>
          <circle cx="32" cy="16" r="8" fill={body} stroke={stroke} strokeWidth="1.5" />
          <path d="M20 28 Q32 24 44 28 L42 52 Q32 56 22 52 Z" fill={body} stroke={stroke} strokeWidth="1.5" />
          <path d="M24 10 L28 4 L32 8 L36 4 L40 10" fill={accent} stroke={stroke} strokeWidth="1" />
          {/* Clipboard */}
          <rect x="38" y="30" width="14" height="18" rx="1.5" fill="#d4c4a8" stroke={stroke} strokeWidth="1" />
          <rect x="41" y="28" width="8" height="4" rx="1" fill={accent} />
          <line x1="41" y1="36" x2="49" y2="36" stroke={stroke} strokeWidth="1" />
          <line x1="41" y1="40" x2="49" y2="40" stroke={stroke} strokeWidth="1" />
          <line x1="41" y1="44" x2="47" y2="44" stroke={stroke} strokeWidth="1" />
        </svg>
      );
    case 'b': // Fielder — Bishop with glove
      return (
        <svg {...common}>
          <ellipse cx="32" cy="14" rx="7" ry="9" fill={body} stroke={stroke} strokeWidth="1.5" />
          <path d="M24 24 Q32 20 40 24 L38 50 Q32 54 26 50 Z" fill={body} stroke={stroke} strokeWidth="1.5" />
          <circle cx="32" cy="8" r="2.5" fill={accent} />
          {/* Glove */}
          <ellipse cx="46" cy="40" rx="10" ry="8" fill={leather} stroke={stroke} strokeWidth="1" transform="rotate(-20 46 40)" />
          <path d="M40 38 Q46 34 52 38" fill="none" stroke="#5c2e0a" strokeWidth="1.2" />
          <path d="M41 42 Q46 39 51 42" fill="none" stroke="#5c2e0a" strokeWidth="1" />
          <circle cx="48" cy="40" r="2" fill="#f5f0e0" opacity="0.5" />
        </svg>
      );
    case 'r': // Catcher — Rook with mask
      return (
        <svg {...common}>
          <path d="M18 20 L18 14 L24 14 L24 18 L30 18 L30 14 L34 14 L34 18 L40 18 L40 14 L46 14 L46 20 L44 50 L20 50 Z" fill={body} stroke={stroke} strokeWidth="1.5" />
          {/* Mask bars */}
          <rect x="24" y="24" width="16" height="14" rx="2" fill="none" stroke={accent} strokeWidth="2" />
          <line x1="28" y1="24" x2="28" y2="38" stroke={accent} strokeWidth="1.5" />
          <line x1="32" y1="24" x2="32" y2="38" stroke={accent} strokeWidth="1.5" />
          <line x1="36" y1="24" x2="36" y2="38" stroke={accent} strokeWidth="1.5" />
          <line x1="24" y1="29" x2="40" y2="29" stroke={accent} strokeWidth="1.2" />
          <line x1="24" y1="33" x2="40" y2="33" stroke={accent} strokeWidth="1.2" />
        </svg>
      );
    case 'n': // Pitcher — Knight with baseball
      return (
        <svg {...common}>
          <path
            d="M40 48 L22 48 L24 36 Q20 30 22 22 Q28 10 38 12 Q44 14 42 24 L46 28 L42 30 Q44 36 40 48 Z"
            fill={body}
            stroke={stroke}
            strokeWidth="1.5"
          />
          <circle cx="36" cy="18" r="1.5" fill={stroke} />
          {/* Baseball in hand */}
          <circle cx="48" cy="34" r="7" fill="#f5f5f0" stroke={stroke} strokeWidth="1" />
          <path d="M44 30 Q48 34 44 38" fill="none" stroke={stitch} strokeWidth="1.2" />
          <path d="M52 30 Q48 34 52 38" fill="none" stroke={stitch} strokeWidth="1.2" />
        </svg>
      );
    case 'p': // Hitter — Pawn with bat
      return (
        <svg {...common}>
          <circle cx="30" cy="16" r="8" fill={body} stroke={stroke} strokeWidth="1.5" />
          <path d="M20 28 Q30 24 40 28 L38 42 Q30 46 22 42 Z" fill={body} stroke={stroke} strokeWidth="1.5" />
          <ellipse cx="30" cy="50" rx="12" ry="6" fill={body} stroke={stroke} strokeWidth="1.5" />
          {/* Bat */}
          <rect x="42" y="18" width="4" height="28" rx="1.5" fill="#c4a574" stroke={stroke} strokeWidth="0.8" transform="rotate(25 44 32)" />
          <rect x="40" y="14" width="6" height="8" rx="1" fill="#8b6914" transform="rotate(25 43 18)" />
        </svg>
      );
    default:
      return null;
  }
}

export function pieceLabel(type: PieceSymbol, color: Color): string {
  const roles: Record<PieceSymbol, string> = {
    k: 'GM',
    q: 'Manager',
    b: 'Fielder',
    r: 'Catcher',
    n: 'Pitcher',
    p: 'Hitter',
  };
  return `${color === 'w' ? 'Home' : 'Away'} ${roles[type]}`;
}

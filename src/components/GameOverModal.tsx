import type { GameResult, GameStats } from '../game/types';

interface Props {
  result: GameResult;
  stats: GameStats;
  onNewGame: () => void;
}

export function GameOverModal({ result, stats, onNewGame }: Props) {
  if (!result) return null;

  const titles: Record<NonNullable<GameResult>, string> = {
    'checkmate-win': 'Checkmate! You win the series.',
    'checkmate-loss': 'Checkmate. AI takes the pennant.',
    draw: 'Draw — extra innings forever.',
    stalemate: 'Stalemate — rain delay made permanent.',
  };

  const accuracy =
    stats.decisionsAttempted === 0
      ? 0
      : Math.round((stats.decisionsCorrect / stats.decisionsAttempted) * 100);

  return (
    <div className="modal-overlay">
      <div className="modal-card game-over">
        <div className="go-emoji">
          {result === 'checkmate-win' ? '🏆' : result === 'checkmate-loss' ? '📉' : '🤝'}
        </div>
        <h2>{titles[result]}</h2>
        <div className="go-stats">
          <div>
            <strong>{stats.chessMovesHuman}</strong>
            <span>Your moves</span>
          </div>
          <div>
            <strong>
              {stats.decisionsCorrect}/{stats.decisionsAttempted}
            </strong>
            <span>Baseball calls</span>
          </div>
          <div>
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>
          <div>
            <strong>{stats.turnsSkipped}</strong>
            <span>Skipped turns</span>
          </div>
        </div>
        <button type="button" className="continue-btn" onClick={onNewGame}>
          Play again
        </button>
      </div>
    </div>
  );
}

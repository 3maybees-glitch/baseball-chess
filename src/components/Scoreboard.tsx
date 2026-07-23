import type { GameStats, MoveLogEntry } from '../game/types';

interface Props {
  stats: GameStats;
  inCheck: boolean;
  turn: 'w' | 'b';
  phaseLabel: string;
  moveLog: MoveLogEntry[];
  onNewGame: () => void;
}

export function Scoreboard({ stats, inCheck, turn, phaseLabel, moveLog, onNewGame }: Props) {
  const accuracy =
    stats.decisionsAttempted === 0
      ? '—'
      : `${Math.round((stats.decisionsCorrect / stats.decisionsAttempted) * 100)}%`;

  return (
    <aside className="scoreboard">
      <div className="scoreboard-brand">
        <div className="brand-mark">⚾</div>
        <div>
          <h1>Baseball Chess</h1>
          <p className="tagline">Chess rules. Baseball brains. Monte Carlo truth.</p>
        </div>
      </div>

      <div className="status-strip">
        <div className={`turn-pill ${turn === 'w' ? 'home' : 'away'}`}>
          {turn === 'w' ? 'Your turn (Home)' : 'AI turn (Away)'}
        </div>
        {inCheck && <div className="check-pill">CHECK</div>}
        <div className="phase-pill">{phaseLabel}</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="sc-label">Your chess moves</div>
          <div className="sc-value">{stats.chessMovesHuman}</div>
        </div>
        <div className="stat-card">
          <div className="sc-label">AI chess moves</div>
          <div className="sc-value">{stats.chessMovesAI}</div>
        </div>
        <div className="stat-card highlight">
          <div className="sc-label">Baseball calls correct</div>
          <div className="sc-value">
            {stats.decisionsCorrect}
            <span className="sc-of">/{stats.decisionsAttempted}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="sc-label">Decision accuracy</div>
          <div className="sc-value">{accuracy}</div>
        </div>
        <div className="stat-card">
          <div className="sc-label">Turns skipped</div>
          <div className="sc-value">{stats.turnsSkipped}</div>
        </div>
        <div className="stat-card">
          <div className="sc-label">Wrong calls</div>
          <div className="sc-value">{stats.decisionsWrong}</div>
        </div>
      </div>

      <div className="legend">
        <h3>Piece roles</h3>
        <ul>
          <li><strong>GM (King)</strong> — roster & money</li>
          <li><strong>Manager (Queen)</strong> — dugout strategy</li>
          <li><strong>Fielder (Bishop)</strong> — throws & routes</li>
          <li><strong>Catcher (Rook)</strong> — pitch calling</li>
          <li><strong>Pitcher (Knight)</strong> — pitch approach</li>
          <li><strong>Hitter (Pawn)</strong> — plate decisions</li>
        </ul>
      </div>

      <div className="move-log">
        <h3>Play-by-play</h3>
        <ol>
          {moveLog.length === 0 && <li className="empty">No moves yet — pick a piece.</li>}
          {[...moveLog].reverse().slice(0, 12).map((m, i) => (
            <li key={`${m.ply}-${i}`} className={m.side}>
              <span className="log-side">{m.side === 'human' ? 'YOU' : 'AI'}</span>
              <span className="log-san">{m.san}</span>
              {m.decisionCorrect === true && <span className="log-ok">✓ call</span>}
              {m.decisionCorrect === false && <span className="log-bad">✗ skip</span>}
            </li>
          ))}
        </ol>
      </div>

      <button type="button" className="new-game-btn" onClick={onNewGame}>
        New Game
      </button>

      <p className="how-to">
        Select a legal square, answer the baseball decision for that piece, and beat the Monte
        Carlo sim to unlock the move. Miss and you forfeit the turn — the AI moves freely.
      </p>
    </aside>
  );
}

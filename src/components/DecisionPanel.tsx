import type { DecisionScenario, MonteCarloResult } from '../game/types';
import { metaForPiece } from '../game/pieceRoles';
import type { PieceSymbol } from 'chess.js';

interface Props {
  scenario: DecisionScenario;
  piece: PieceSymbol;
  phase: 'deciding' | 'simulating' | 'result';
  chosen: 'A' | 'B' | null;
  sim: MonteCarloResult | null;
  correct: boolean | null;
  pendingSan: string;
  onChoose: (choice: 'A' | 'B') => void;
  onContinue: () => void;
  simProgress: number;
}

export function DecisionPanel({
  scenario,
  piece,
  phase,
  chosen,
  sim,
  correct,
  pendingSan,
  onChoose,
  onContinue,
  simProgress,
}: Props) {
  const meta = metaForPiece(piece);

  return (
    <div className="decision-panel" role="dialog" aria-labelledby="decision-title">
      <div className="decision-badge">
        <span className="badge-role">{scenario.roleTitle}</span>
        <span className="badge-chess">
          {meta.chessName} → move {pendingSan}
        </span>
      </div>

      <h2 id="decision-title">{scenario.title}</h2>
      <p className="situation">{scenario.situation}</p>
      <p className="question">{scenario.question}</p>

      {phase === 'deciding' && (
        <div className="options">
          <button type="button" className="option-btn option-a" onClick={() => onChoose('A')}>
            <span className="opt-key">A</span>
            <span className="opt-label">{scenario.optionA.label}</span>
          </button>
          <button type="button" className="option-btn option-b" onClick={() => onChoose('B')}>
            <span className="opt-key">B</span>
            <span className="opt-label">{scenario.optionB.label}</span>
          </button>
        </div>
      )}

      {phase === 'simulating' && (
        <div className="sim-block">
          <div className="sim-title">Running Monte Carlo simulation…</div>
          <div className="sim-bar-track">
            <div className="sim-bar-fill" style={{ width: `${simProgress}%` }} />
          </div>
          <p className="sim-caption">Sampling thousands of baseball outcomes…</p>
        </div>
      )}

      {phase === 'result' && sim && chosen && (
        <div className={`result-block ${correct ? 'correct' : 'wrong'}`}>
          <div className="result-headline">
            {correct ? '✓ Correct call — you earn the move!' : '✗ Wrong call — you skip this turn.'}
          </div>
          <p className="result-narrative">{sim.narrative}</p>
          <div className="sim-stats">
            <div className={`stat ${sim.correctOption === 'A' ? 'winner' : ''}`}>
              <div className="stat-label">Option A EV</div>
              <div className="stat-value">{sim.meanA.toFixed(3)}</div>
              <div className="stat-sub">{scenario.optionA.label}</div>
            </div>
            <div className={`stat ${sim.correctOption === 'B' ? 'winner' : ''}`}>
              <div className="stat-label">Option B EV</div>
              <div className="stat-value">{sim.meanB.toFixed(3)}</div>
              <div className="stat-sub">{scenario.optionB.label}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Trials</div>
              <div className="stat-value">{sim.trials.toLocaleString()}</div>
              <div className="stat-sub">{scenario.metricLabel}</div>
            </div>
          </div>
          <p className="your-pick">
            You chose <strong>{chosen}</strong>
            {correct ? ' — matches the sim.' : ` — sim favored ${sim.correctOption}.`}
          </p>
          <button type="button" className="continue-btn" onClick={onContinue}>
            {correct ? 'Play the move' : 'Skip turn — AI bats'}
          </button>
        </div>
      )}
    </div>
  );
}

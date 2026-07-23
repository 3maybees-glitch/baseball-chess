import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess, type PieceSymbol, type Square } from 'chess.js';
import { Board } from './components/Board';
import { DecisionPanel } from './components/DecisionPanel';
import { GameOverModal } from './components/GameOverModal';
import { Scoreboard } from './components/Scoreboard';
import { chooseAIMove } from './game/chessAI';
import { runMonteCarlo } from './game/monteCarlo';
import { generateScenarioForPiece } from './game/scenarios';
import type {
  DecisionScenario,
  GamePhase,
  GameResult,
  GameStats,
  MonteCarloResult,
  MoveLogEntry,
  PendingMove,
} from './game/types';

const emptyStats = (): GameStats => ({
  chessMovesHuman: 0,
  chessMovesAI: 0,
  decisionsAttempted: 0,
  decisionsCorrect: 0,
  decisionsWrong: 0,
  turnsSkipped: 0,
});

function deriveResult(chess: Chess): GameResult {
  if (chess.isCheckmate()) {
    return chess.turn() === 'b' ? 'checkmate-win' : 'checkmate-loss';
  }
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw() || chess.isThreefoldRepetition() || chess.isInsufficientMaterial()) {
    return 'draw';
  }
  return null;
}

function phaseLabel(phase: GamePhase): string {
  switch (phase) {
    case 'selecting':
      return 'Select a move';
    case 'deciding':
      return 'Baseball decision';
    case 'simulating':
      return 'Simulating…';
    case 'result':
      return 'Decision result';
    case 'ai-thinking':
      return 'AI scouting…';
    case 'game-over':
      return 'Final';
    default:
      return '';
  }
}

export default function App() {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [phase, setPhase] = useState<GamePhase>('selecting');
  const [stats, setStats] = useState<GameStats>(emptyStats);
  const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
  const [pending, setPending] = useState<PendingMove | null>(null);
  const [scenario, setScenario] = useState<DecisionScenario | null>(null);
  const [chosen, setChosen] = useState<'A' | 'B' | null>(null);
  const [sim, setSim] = useState<MonteCarloResult | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [simProgress, setSimProgress] = useState(0);
  const [result, setResult] = useState<GameResult>(null);
  const aiTimer = useRef<number | null>(null);
  const simTimer = useRef<number | null>(null);

  const syncBoard = useCallback(() => {
    setFen(chess.fen());
    const r = deriveResult(chess);
    if (r) {
      setResult(r);
      setPhase('game-over');
    }
  }, [chess]);

  const clearSelection = useCallback(() => {
    setSelected(null);
    setLegalTargets([]);
  }, []);

  const runAIMove = useCallback(() => {
    if (chess.isGameOver() || chess.turn() !== 'b') {
      setPhase('selecting');
      return;
    }
    setPhase('ai-thinking');
    if (aiTimer.current) window.clearTimeout(aiTimer.current);
    aiTimer.current = window.setTimeout(() => {
      const move = chooseAIMove(chess.fen(), 2);
      if (move) {
        const played = chess.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });
        if (played) {
          setLastMove({ from: played.from, to: played.to });
          setMoveLog((log) => [
            ...log,
            { ply: log.length + 1, side: 'ai', san: played.san },
          ]);
          setStats((s) => ({ ...s, chessMovesAI: s.chessMovesAI + 1 }));
        }
      }
      syncBoard();
      if (!chess.isGameOver()) {
        setPhase('selecting');
      }
    }, 650);
  }, [chess, syncBoard]);

  const applyHumanMove = useCallback(
    (move: PendingMove) => {
      const played = chess.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion ?? 'q',
      });
      if (!played) return;
      setLastMove({ from: played.from, to: played.to });
      setMoveLog((log) => [
        ...log,
        {
          ply: log.length + 1,
          side: 'human',
          san: played.san,
          decisionCorrect: true,
          scenarioTitle: scenario?.title,
        },
      ]);
      setStats((s) => ({
        ...s,
        chessMovesHuman: s.chessMovesHuman + 1,
      }));
      clearSelection();
      setPending(null);
      setScenario(null);
      setChosen(null);
      setSim(null);
      setCorrect(null);
      syncBoard();
      if (!chess.isGameOver()) {
        runAIMove();
      }
    },
    [chess, clearSelection, runAIMove, scenario?.title, syncBoard],
  );

  const skipHumanTurn = useCallback(() => {
    setMoveLog((log) => [
      ...log,
      {
        ply: log.length + 1,
        side: 'human',
        san: `(missed ${pending?.san ?? 'move'})`,
        decisionCorrect: false,
        scenarioTitle: scenario?.title,
      },
    ]);
    setStats((s) => ({
      ...s,
      turnsSkipped: s.turnsSkipped + 1,
    }));
    clearSelection();
    setPending(null);
    setScenario(null);
    setChosen(null);
    setSim(null);
    setCorrect(null);
    // Force black to move by not changing the board; AI plays while still white to move
    // Actually: on skip, white forgoes move so black should move. Chess.js turn is still white.
    // We need to flip turn without a move — chess.js doesn't support that natively.
    // Workaround: apply a null-move equivalent by having AI play as if it's their turn
    // after we temporarily... we can't flip turn easily.
    // Better approach: load fen with side to move flipped.
    const parts = chess.fen().split(' ');
    parts[1] = 'b';
    // halfmove clock bump
    const half = parseInt(parts[4] ?? '0', 10) + 1;
    parts[4] = String(half);
    chess.load(parts.join(' '));
    syncBoard();
    if (!chess.isGameOver()) {
      runAIMove();
    } else {
      setPhase('selecting');
    }
  }, [chess, clearSelection, pending?.san, runAIMove, scenario?.title, syncBoard]);

  const onSquareClick = (square: Square) => {
    if (phase !== 'selecting' || chess.turn() !== 'w' || chess.isGameOver()) return;

    const piece = chess.get(square);

    if (selected) {
      const targets = legalTargets;
      if (targets.includes(square)) {
        // Build pending move and open decision
        const verbose = chess.moves({ square: selected, verbose: true });
        const found = verbose.find((m) => m.to === square);
        if (!found) return;

        const promotion =
          found.piece === 'p' && (square[1] === '8' || square[1] === '1')
            ? ('q' as PieceSymbol)
            : undefined;

        const pendingMove: PendingMove = {
          from: selected,
          to: square,
          promotion,
          piece: found.piece,
          color: found.color,
          san: found.san,
          captured: found.captured,
        };

        const scen = generateScenarioForPiece(found.piece);
        setPending(pendingMove);
        setScenario(scen);
        setChosen(null);
        setSim(null);
        setCorrect(null);
        setSimProgress(0);
        setPhase('deciding');
        return;
      }

      // Click another own piece
      if (piece && piece.color === 'w') {
        setSelected(square);
        const moves = chess.moves({ square, verbose: true });
        setLegalTargets(moves.map((m) => m.to));
        return;
      }

      clearSelection();
      return;
    }

    if (piece && piece.color === 'w') {
      setSelected(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalTargets(moves.map((m) => m.to));
    }
  };

  const onChoose = (choice: 'A' | 'B') => {
    if (!scenario || phase !== 'deciding') return;
    setChosen(choice);
    setPhase('simulating');
    setSimProgress(0);

    // Animate progress then run sim
    let progress = 0;
    if (simTimer.current) window.clearInterval(simTimer.current);
    simTimer.current = window.setInterval(() => {
      progress += 8 + Math.random() * 12;
      if (progress >= 100) {
        progress = 100;
        if (simTimer.current) window.clearInterval(simTimer.current);
        const resultSim = runMonteCarlo(scenario, 2500);
        const isCorrect = choice === resultSim.correctOption;
        setSim(resultSim);
        setCorrect(isCorrect);
        setStats((s) => ({
          ...s,
          decisionsAttempted: s.decisionsAttempted + 1,
          decisionsCorrect: s.decisionsCorrect + (isCorrect ? 1 : 0),
          decisionsWrong: s.decisionsWrong + (isCorrect ? 0 : 1),
        }));
        setPhase('result');
      }
      setSimProgress(Math.min(100, progress));
    }, 80);
  };

  const onContinue = () => {
    if (correct && pending) {
      applyHumanMove(pending);
    } else {
      skipHumanTurn();
    }
  };

  const newGame = () => {
    if (aiTimer.current) window.clearTimeout(aiTimer.current);
    if (simTimer.current) window.clearInterval(simTimer.current);
    chess.reset();
    setFen(chess.fen());
    setSelected(null);
    setLegalTargets([]);
    setLastMove(null);
    setPhase('selecting');
    setStats(emptyStats());
    setMoveLog([]);
    setPending(null);
    setScenario(null);
    setChosen(null);
    setSim(null);
    setCorrect(null);
    setSimProgress(0);
    setResult(null);
  };

  useEffect(() => {
    return () => {
      if (aiTimer.current) window.clearTimeout(aiTimer.current);
      if (simTimer.current) window.clearInterval(simTimer.current);
    };
  }, []);

  // Force re-render dependency on fen
  const boardKey = fen;

  const interactive = phase === 'selecting' && chess.turn() === 'w' && !chess.isGameOver();

  const showDecision =
    (phase === 'deciding' || phase === 'simulating' || phase === 'result') &&
    scenario &&
    pending;

  const inCheck = useMemo(() => {
    void fen;
    return chess.inCheck();
  }, [chess, fen]);

  return (
    <div className="app-shell">
      <Scoreboard
        stats={stats}
        inCheck={inCheck}
        turn={chess.turn()}
        phaseLabel={phaseLabel(phase)}
        moveLog={moveLog}
        onNewGame={newGame}
      />

      <main className="main-stage">
        <Board
          key={boardKey}
          chess={chess}
          selected={selected}
          legalTargets={legalTargets}
          lastMove={lastMove}
          interactive={interactive}
          onSquareClick={onSquareClick}
        />

        {showDecision && (
          <div className="decision-overlay">
            <DecisionPanel
              scenario={scenario}
              piece={pending.piece}
              phase={phase as 'deciding' | 'simulating' | 'result'}
              chosen={chosen}
              sim={sim}
              correct={correct}
              pendingSan={pending.san}
              onChoose={onChoose}
              onContinue={onContinue}
              simProgress={simProgress}
            />
          </div>
        )}

        {phase === 'ai-thinking' && (
          <div className="ai-banner">Away team is thinking…</div>
        )}
      </main>

      <GameOverModal result={result} stats={stats} onNewGame={newGame} />
    </div>
  );
}

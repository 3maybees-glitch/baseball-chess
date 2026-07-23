# Baseball Chess

A hybrid strategy game: **standard chess rules** on a **baseball-themed diamond board**. Before you complete a move, you must correctly predict the better outcome of a situational baseball decision. An AI-authored scenario bank (by piece role) plus a **Monte Carlo simulation** decides the truth.

## How to play

1. You are **Home** (White). The computer is **Away** (Black) and moves freely.
2. Click one of your pieces, then a legal destination.
3. Answer the **baseball decision** for that piece type (A or B).
4. A Monte Carlo sim runs. If you match the higher expected-value option, your chess move plays. If not, **you skip the turn** and the AI moves.
5. Win by checkmate (or draw by standard chess rules).

### Piece roles

| Chess piece | Baseball role | Decision type |
|-------------|---------------|---------------|
| King | General Manager | Call-ups, trades, drafts, contracts |
| Queen | Dugout Manager | Lineups, bullpen, in-game tactics |
| Bishop | Fielder | Throws, routes, wall plays |
| Rook | Catcher | Pitch calling, framing, pitchouts |
| Knight | Pitcher | Pitch selection & approach |
| Pawn | Hitter | Plate approach, bunts, steals |

## Stats tracked

- Your chess moves / AI chess moves  
- Baseball decisions correct vs attempted  
- Accuracy % and turns skipped  

## Play online

**Primary (Vercel):** https://baseball-chess.vercel.app  

**Mirror (GitHub Pages):** https://3maybees-glitch.github.io/baseball-chess/

- **Vercel** rebuilds on every push to `main` (GitHub integration connected).
- **GitHub Pages** also rebuilds via Actions on push to `main`.

## Run locally

```bash
cd Projects/baseball-chess
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Stack

- React + TypeScript + Vite  
- [chess.js](https://github.com/jhlywa/chess.js) for rules  
- Custom minimax AI opponent  
- Client-side scenario generator + Monte Carlo EV model  

## Future ideas

- Optional SpaceXAI (xAI) live scenario generation with `XAI_API_KEY`  
- Stronger chess engine (Stockfish WASM)  
- Two-player hot-seat mode  
- Difficulty that gates the AI with baseball decisions too  

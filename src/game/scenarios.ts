import type { PieceSymbol } from 'chess.js';
import { metaForPiece } from './pieceRoles';
import type { DecisionScenario, PieceRole, ScenarioOption } from './types';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function uid(role: PieceRole): string {
  return `${role}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function opt(
  id: 'A' | 'B',
  label: string,
  successRate: number,
  successValue: number,
  failValue: number,
): ScenarioOption {
  return { id, label, successRate, successValue, failValue };
}

/** Build a scenario where expected values are intentionally distinct enough to decide. */
function buildScenario(
  role: PieceRole,
  roleTitle: string,
  title: string,
  situation: string,
  question: string,
  a: ScenarioOption,
  b: ScenarioOption,
  metricLabel: string,
): DecisionScenario {
  return {
    id: uid(role),
    role,
    roleTitle,
    title,
    situation,
    question,
    optionA: a,
    optionB: b,
    metricLabel,
  };
}

// ─── GM (King) ───────────────────────────────────────────────
function genGM(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Call-up dilemma',
        'Your AAA shortstop is tearing the cover off the ball at age 20. Your major-league shortstop is a popular veteran hitting .198 with dwindling range.',
        'Do you call up the prospect and option the veteran, or stick with experience for another week?',
        opt('A', 'Call up the prospect; option the veteran', 0.62, 0.85, 0.2),
        opt('B', 'Keep the veteran; let the kid cook one more week', 0.55, 0.55, 0.45),
        'roster EV',
      ),
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Deadline trade bait',
        'A contender offers two mid-tier prospects for your pending free-agent closer. You are 8 games out with 40 to play. Payroll is tight next year.',
        'Do you sell the closer now, or hold and chase a long-shot wild card?',
        opt('A', 'Trade the closer for the prospects', 0.7, 0.8, 0.35),
        opt('B', 'Hold and push for October', 0.28, 1.0, 0.15),
        'org value',
      ),
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Draft board fork',
        'You hold the 8th pick. Best available tools: a polished college arm with a clean medical, or a high-upside high-school shortstop many boards have top-5.',
        'Safe college arm or boom-or-bust prep shortstop?',
        opt('A', 'Take the college pitcher (higher floor)', 0.72, 0.7, 0.4),
        opt('B', 'Take the prep shortstop (higher ceiling)', 0.42, 1.05, 0.18),
        'draft EV',
      ),
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Extension window',
        'Your 26-year-old All-Star CF is one year from free agency. Agent wants 8 years / $220M. Analytics say 6 / $150M is fair; market is heating up.',
        'Meet the ask now, or play hardball and risk losing him?',
        opt('A', 'Close near the agent’s ask to lock him in', 0.58, 0.75, 0.3),
        opt('B', 'Hold firm at fair value; risk walk year', 0.45, 0.9, 0.25),
        'franchise EV',
      ),
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Injured star return',
        'Your $30M ace is 8 months post-Tommy John. Medicals are clean, but velocity is 2–3 mph short in rehab starts. Fans want him back for a big series.',
        'Activate him for this series, or give him two more minor-league outings?',
        opt('A', 'Activate now for the series', 0.4, 0.95, 0.1),
        opt('B', 'Two more rehab starts first', 0.75, 0.72, 0.45),
        'pitching health EV',
      ),
    () =>
      buildScenario(
        'gm',
        'General Manager',
        'Rule 5 / 40-man crunch',
        'You must protect one of two 40-man bubble players: a power-hitting OF with a 30% K rate, or a lefty reliever who misses bats but walks 5/9.',
        'Who gets the 40-man spot before the Rule 5 draft?',
        opt('A', 'Protect the power bat', 0.55, 0.78, 0.32),
        opt('B', 'Protect the lefty reliever', 0.6, 0.7, 0.38),
        'depth EV',
      ),
  ])();
}

// ─── Manager (Queen) ─────────────────────────────────────────
function genManager(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Cold glove, hot glove',
        'Your shortstop is elite with the leather but has gone 3-for-40. Backup SS hits for contact and is average with the glove. Two games left in a playoff push series.',
        'Bench him a couple games to reset the swing, or ride the defense?',
        opt('A', 'Bench him 1–2 games; play the backup', 0.58, 0.72, 0.35),
        opt('B', 'Keep him in — defense wins late innings', 0.62, 0.68, 0.4),
        'win probability',
      ),
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Bullpen chess',
        'Top of the 8th, up 1, bases empty. Your closer is a true 9th-inning guy (rarely used earlier). Setup man has thrown 28 pitches last night. Lefties due up.',
        'Bring the LOOGY for this inning, or stretch the setup man?',
        opt('A', 'Deploy the lefty specialist', 0.66, 0.74, 0.36),
        opt('B', 'Stick with the setup man', 0.5, 0.7, 0.3),
        'inning win%',
      ),
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Hit-and-run or take',
        'Runner on first, 1 out, 2–1 count. Your batter is a free swinger; the runner has average speed. Opposing pitcher is slow to the plate.',
        'Call hit-and-run, or take and let the hitter work?',
        opt('A', 'Hit-and-run', 0.48, 0.88, 0.22),
        opt('B', 'Take / work the count', 0.64, 0.65, 0.42),
        'run expectancy',
      ),
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Pull the starter',
        'Your starter is through 6.2 with 98 pitches, up 3–1. He’s starting the 7th facing the heart of the order a third time. Times-through-order penalty is real.',
        'Leave him for one more batter, or go to the bullpen now?',
        opt('A', 'Pull him now', 0.7, 0.76, 0.4),
        opt('B', 'One more batter — he’s dealing', 0.42, 0.9, 0.18),
        'win probability',
      ),
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Intentional walk math',
        'Bottom 9, tie game, runner on 2nd, 1 out. Cleanup hitter due; empty base at first. On-deck is a weaker contact hitter vs your righty.',
        'Intentional walk the cleanup man, or pitch to him?',
        opt('A', 'Intentional walk; load first', 0.55, 0.7, 0.38),
        opt('B', 'Pitch to the cleanup hitter', 0.48, 0.82, 0.25),
        'win probability',
      ),
    () =>
      buildScenario(
        'manager',
        'Dugout Manager',
        'Platoon flip',
        'Tonight’s starter is a tough lefty. Your usual RF is a lefty bat with reverse splits; your righty platoon bat is 3-for-8 vs this arm but a liability in the OF.',
        'Start the defensive lefty or the platoon righty bat?',
        opt('A', 'Start the platoon righty bat', 0.6, 0.74, 0.34),
        opt('B', 'Start the usual defensive lefty', 0.52, 0.62, 0.45),
        'matchup EV',
      ),
  ])();
}

// ─── Fielder (Bishop) ────────────────────────────────────────
function genFielder(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'First-to-third laser',
        'You’re in right field. Single skips in front of you; runner from first is flying for third. You have a strong arm but the angle is awkward. Second base is the “safe” play.',
        'Gun for third (low percentage) or hit the cutoff / second base?',
        opt('A', 'Throw through to third', 0.32, 1.15, 0.05),
        opt('B', 'Throw to second / cutoff — keep runner at first', 0.88, 0.55, 0.4),
        'out probability EV',
      ),
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'Shallow pop, collision zone',
        'Short pop behind second. Shortstop and you (CF) both call it. Wind is swirling; shortstop is backpedaling hard.',
        'Take charge and catch it, or defer to the shortstop?',
        opt('A', 'You take it — CF priority', 0.68, 0.8, 0.15),
        opt('B', 'Let the shortstop handle it', 0.5, 0.7, 0.25),
        'catch EV',
      ),
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'Cut-off decision',
        'Runner tagging from third on a medium fly to left. You field it cleanly. The throw home is long; the runner is average speed. Cutoff man is set.',
        'Throw home full, or hit the cutoff and freeze the trail runner?',
        opt('A', 'Throw home for the out at plate', 0.38, 1.1, 0.1),
        opt('B', 'Hit cutoff; prevent extra bases', 0.82, 0.58, 0.42),
        'run prevention EV',
      ),
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'Dive or play hop',
        'Line drive one-hopper toward the gap. A full dive might snare it for an out; missing means extra bases. Score is tied in the 8th.',
        'Lay out for the highlight catch, or stay up and keep it to a single?',
        opt('A', 'Dive for the out', 0.35, 1.2, 0.0),
        opt('B', 'Play it safe — hold to a single', 0.9, 0.52, 0.4),
        'expected outs',
      ),
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'Infield in?',
        'You’re the third baseman. Runner on third, less than 2 outs, tie game late. Hard grounder is coming — charge for the plate or play back for the sure out?',
        'This is pre-pitch positioning: play in for the plate, or normal depth?',
        opt('A', 'Play in — cut the run at home', 0.45, 0.95, 0.2),
        opt('B', 'Normal depth — take the sure out', 0.72, 0.6, 0.4),
        'win expectancy',
      ),
    () =>
      buildScenario(
        'fielder',
        'Fielder',
        'Wall ball judgment',
        'Deep drive to the warning track. You can crash the wall for a potential robbery or ease up and play the carom cleanly. One-run game, 9th inning.',
        'Crash the wall for the catch, or play the bounce?',
        opt('A', 'Crash the wall — rob it if you can', 0.4, 1.15, 0.05),
        opt('B', 'Play the carom cleanly', 0.85, 0.55, 0.4),
        'defensive EV',
      ),
  ])();
}

// ─── Catcher (Rook) ──────────────────────────────────────────
function genCatcher(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Curve or heat',
        'Your pitcher has a wipeout curve but has been wild with it. 2 strikes, runner on third, 1 out. A spiked curve could be a passed ball and a free run.',
        'Call the curveball or go to the fastball?',
        opt('A', 'Call the curveball', 0.48, 1.0, 0.1),
        opt('B', 'Call the fastball', 0.7, 0.62, 0.4),
        'pitch outcome EV',
      ),
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Pitchout timing',
        'Runner on first is a known thief; pitcher is slow to home. Count is 1–1. Scouting says they run often on 1–1 vs this battery.',
        'Call a pitchout, or throw a pitch and hope the throw is clean?',
        opt('A', 'Pitchout', 0.55, 0.85, 0.3),
        opt('B', 'Pitch normally; be ready to throw', 0.5, 0.72, 0.35),
        'SB prevention EV',
      ),
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Framing vs blocking',
        '2–2 count, runner on third. Pitcher is throwing a sinker in the dirt more often. You can set up soft for a frame on the edge or prioritize blocking.',
        'Frame for the strike, or prioritize the block?',
        opt('A', 'Set to frame the edge', 0.5, 0.9, 0.2),
        opt('B', 'Block-first setup', 0.72, 0.65, 0.42),
        'inning EV',
      ),
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Mound visit clock',
        'Pitcher just walked two; velocity is fine but command is gone. You have one mound visit left this inning. Cleanup hitter due.',
        'Visit now to reset him, or stay put and use signs only?',
        opt('A', 'Mound visit to settle him', 0.65, 0.72, 0.38),
        opt('B', 'No visit — trust the signs', 0.45, 0.8, 0.28),
        'out probability',
      ),
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Back-pick chance',
        'Runner on first is daydreaming off the bag after a foul. Your pitcher has a quick spin move. The runner is 3.9 home-to-first speed — not elite.',
        'Call the pickoff / back-pick attempt, or stay focused on the hitter?',
        opt('A', 'Attempt the pickoff', 0.28, 1.2, 0.15),
        opt('B', 'Ignore him; attack the hitter', 0.8, 0.58, 0.48),
        'play EV',
      ),
    () =>
      buildScenario(
        'catcher',
        'Catcher',
        'Intentional sequence',
        'Manager wants a semi-intentional walk: throw four wide. Hitter is dangerous; first base is open. Crowd is loud; pitcher is rattled.',
        'Full intentional (four wide), or pitch carefully and risk a mistake?',
        opt('A', 'Full intentional walk', 0.9, 0.6, 0.5),
        opt('B', 'Pitch to him carefully', 0.4, 0.95, 0.15),
        'situation EV',
      ),
  ])();
}

// ─── Pitcher (Knight) ────────────────────────────────────────
function genPitcher(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'Challenge after the bomb',
        'Same hitter just took you deep last at-bat on a middle-middle heater. He sits dead-red on high fastballs. Your curve is sharp tonight, low and away.',
        'Challenge high with the fastball, or bury curves low and away?',
        opt('A', 'Challenge high with the fastball', 0.35, 1.05, 0.1),
        opt('B', 'Curveballs low and away', 0.68, 0.72, 0.35),
        'at-bat EV',
      ),
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'Full count, bases loaded',
        'Full count, bases loaded, 1 out. Your best pitch is a changeup, but this hitter crushes changeups (.380 wOBA). Fastball command has been average.',
        'Go changeup (best pitch) or elevated heater?',
        opt('A', 'Throw the changeup', 0.45, 0.95, 0.15),
        opt('B', 'Elevated fastball', 0.55, 0.78, 0.3),
        'out EV',
      ),
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'First-pitch philosophy',
        'Leadoff man loves to swing first pitch (58% swing rate). Your first-pitch strike rate is elite with the sinker. Slider is your putaway.',
        'Attack first-pitch sinker for a strike, or start with a chase slider?',
        opt('A', 'First-pitch sinker for a strike', 0.72, 0.7, 0.4),
        opt('B', 'Start with a chase slider', 0.4, 0.95, 0.22),
        'PA leverage EV',
      ),
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'Pitch to contact?',
        'You’re at 28 pitches in the 1st already with two walks. Defense is strong. Next hitter is a free swinger. Need a quick out.',
        'Pitch to contact in the zone, or nibble and risk another walk?',
        opt('A', 'Attack the zone — pitch to contact', 0.7, 0.75, 0.3),
        opt('B', 'Nibble at the edges', 0.4, 0.9, 0.15),
        'inning damage EV',
      ),
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'Icing the runner',
        'Runner on first, lefty hitter, 0–2. You have a great pickoff move. Hitter chases breaking balls down. You’ve thrown over twice already.',
        'Throw over a third time, or snap off the chase breaker?',
        opt('A', 'Throw over again', 0.25, 1.1, 0.35),
        opt('B', 'Chase breaker for the K', 0.65, 0.78, 0.3),
        'out EV',
      ),
    () =>
      buildScenario(
        'pitcher',
        'Pitcher',
        'Protect the lead',
        'Up 1 in the 7th, man on second, 2 outs. Weak contact hitter due. You can waste a high heater or attack with a backdoor slider for a called strike.',
        'Waste high heater or backdoor slider for a strike?',
        opt('A', 'Waste the high heater', 0.55, 0.65, 0.4),
        opt('B', 'Backdoor slider for a strike', 0.58, 0.8, 0.28),
        'strikeout/weak contact EV',
      ),
  ])();
}

// ─── Hitter (Pawn) ───────────────────────────────────────────
function genHitter(): DecisionScenario {
  return pick([
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'Sitting heater',
        'You’re seeing high fastballs extremely well this series. Pitcher mixes in a sharp curve that you foul off when you’re looking soft. 2–1 count.',
        'Sit dead-red on the high fastball, or stay balanced for the curve?',
        opt('A', 'Sit high fastball and barrel it', 0.5, 1.0, 0.2),
        opt('B', 'Stay balanced — foul curves, attack mistakes', 0.68, 0.68, 0.4),
        'damage EV',
      ),
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'Two-strike approach',
        'Two strikes. Pitcher lives on the outside corner with a cutter. You’ve been late on it. Crowd wants a big swing.',
        'Shorten up and spray the other way, or keep your full A-swing?',
        opt('A', 'Shorten up; protect and go the other way', 0.7, 0.7, 0.35),
        opt('B', 'Keep the A-swing for extra bases', 0.35, 1.15, 0.1),
        'PA value',
      ),
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'Green light steal?',
        'You’re on first with average speed. Pitcher is slow; catcher has a cannon. 3–1 count to a power hitter. Manager left the green light to you.',
        'Steal second, or stay put and let the hitter work?',
        opt('A', 'Steal second', 0.42, 1.0, 0.05),
        opt('B', 'Stay put', 0.8, 0.55, 0.45),
        'run expectancy',
      ),
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'Bunt for a hit',
        'Third baseman is playing deep. You’re a slap hitter with bunt speed. 0–0 count, nobody on, tied game early.',
        'Drop a bunt for a hit, or swing away?',
        opt('A', 'Bunt for a hit', 0.4, 0.95, 0.2),
        opt('B', 'Swing away', 0.55, 0.75, 0.35),
        'on-base EV',
      ),
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'First-pitch heater',
        'Scouting report: this pitcher throws first-pitch fastball 70% of the time. You’re a notorious first-pitch swinger who has been rolling over.',
        'Hack first pitch, or take one to see velocity?',
        opt('A', 'Hack the first-pitch heater', 0.48, 0.95, 0.22),
        opt('B', 'Take the first pitch', 0.65, 0.65, 0.45),
        'PA EV',
      ),
    () =>
      buildScenario(
        'hitter',
        'Hitter',
        'Sacrifice situation',
        'Runner on first, 0 outs, late innings, down 1. You’re not a great bunter. Manager flashes the sacrifice sign but leaves final judgment to you if the pitch is bad.',
        'Lay down the sac bunt, or swing for a better chance to drive him in?',
        opt('A', 'Sacrifice bunt', 0.75, 0.58, 0.25),
        opt('B', 'Swing away for the bigger inning', 0.45, 0.95, 0.2),
        'run expectancy',
      ),
  ])();
}

const GENERATORS: Record<PieceRole, () => DecisionScenario> = {
  gm: genGM,
  manager: genManager,
  fielder: genFielder,
  catcher: genCatcher,
  pitcher: genPitcher,
  hitter: genHitter,
};

export function generateScenarioForPiece(piece: PieceSymbol): DecisionScenario {
  const meta = metaForPiece(piece);
  return GENERATORS[meta.role]();
}

/** Optional: slightly re-roll labels so consecutive games feel fresher */
export function generateScenario(role: PieceRole): DecisionScenario {
  return GENERATORS[role]();
}

import type { DecisionScenario, MonteCarloResult, ScenarioOption } from './types';

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleUtility(option: ScenarioOption, rand: () => number): number {
  const success = rand() < option.successRate;
  // Small noise so distributions feel alive
  const noise = (rand() - 0.5) * 0.08;
  return (success ? option.successValue : option.failValue) + noise;
}

export function runMonteCarlo(
  scenario: DecisionScenario,
  trials = 2500,
  seed = Date.now() % 1_000_000,
): MonteCarloResult {
  const rand = mulberry32(seed);
  let sumA = 0;
  let sumB = 0;
  let winsA = 0;
  let winsB = 0;
  let ties = 0;

  for (let i = 0; i < trials; i++) {
    const a = sampleUtility(scenario.optionA, rand);
    const b = sampleUtility(scenario.optionB, rand);
    sumA += a;
    sumB += b;
    if (a > b + 0.001) winsA += 1;
    else if (b > a + 0.001) winsB += 1;
    else ties += 1;
  }

  const meanA = sumA / trials;
  const meanB = sumB / trials;
  const winRateA = winsA / trials;
  const winRateB = winsB / trials;

  // Correct answer = higher expected utility from the model
  const correctOption: 'A' | 'B' = meanA >= meanB ? 'A' : 'B';
  const margin = Math.abs(meanA - meanB);

  const better = correctOption === 'A' ? scenario.optionA.label : scenario.optionB.label;
  const worse = correctOption === 'A' ? scenario.optionB.label : scenario.optionA.label;
  const betterMean = correctOption === 'A' ? meanA : meanB;
  const worseMean = correctOption === 'A' ? meanB : meanA;

  let narrative: string;
  if (margin < 0.04) {
    narrative = `Sim was razor-close. Edge to “${better}” (${betterMean.toFixed(3)} vs ${worseMean.toFixed(3)} ${scenario.metricLabel}).`;
  } else if (margin < 0.12) {
    narrative = `Monte Carlo favors “${better}” over “${worse}” (${betterMean.toFixed(3)} vs ${worseMean.toFixed(3)} ${scenario.metricLabel}).`;
  } else {
    narrative = `Clear edge: “${better}” (${betterMean.toFixed(3)} ${scenario.metricLabel}) beats “${worse}” (${worseMean.toFixed(3)}).`;
  }

  return {
    trials,
    meanA,
    meanB,
    winRateA,
    winRateB,
    correctOption,
    margin,
    narrative,
  };
}

import { Criterion, Alternative } from '../types';

export function calculateSMART(
  alternatives: Alternative[],
  criteria: Criterion[],
): { name: string; finalScore: number }[] {
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);

  return alternatives
    .map((alt) => {
      const finalScore = criteria.reduce((sum, c) => {
        const weight = c.weight / totalWeight;
        const score = alt.scores[c.name] || 0;
        return sum + weight * score;
      }, 0);

      return {
        name: alt.name,
        finalScore,
      };
    })
    .sort((a, b) => b.finalScore - a.finalScore);
}

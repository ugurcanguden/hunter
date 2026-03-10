import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { HitQuality } from '@centerhit-game/types/gameTypes';

export function calculateHitScore(hitQuality: HitQuality) {
  switch (hitQuality) {
    case 'perfect':
      return gameDefaults.perfectHitScore;
    case 'good':
      return gameDefaults.goodHitScore;
    default:
      return 0;
  }
}

export function deriveStarsFromPerformance(
  level: LevelDefinition,
  score: number,
): 0 | 1 | 2 | 3 {
  if (score >= level.stars.threeStarScore) {
    return 3;
  }

  if (score >= level.stars.twoStarScore) {
    return 2;
  }

  if (score >= level.stars.oneStarScore) {
    return 1;
  }

  return 0;
}

export function getNextStarProgress(level: LevelDefinition, score: number) {
  const thresholds = [
    { stars: 1 as const, score: level.stars.oneStarScore },
    { stars: 2 as const, score: level.stars.twoStarScore },
    { stars: 3 as const, score: level.stars.threeStarScore },
  ];

  const nextTarget = thresholds.find(threshold => score < threshold.score);

  if (!nextTarget) {
    return {
      targetStars: null,
      remainingScore: 0,
      progressRatio: 1,
      previousThresholdScore: level.stars.threeStarScore,
      targetScore: level.stars.threeStarScore,
    };
  }

  const previousThreshold =
    thresholds
      .filter(threshold => threshold.score < nextTarget.score)
      .slice(-1)[0]?.score ?? 0;
  const progressSpan = Math.max(nextTarget.score - previousThreshold, 1);
  const progressRatio = Math.min(
    Math.max((score - previousThreshold) / progressSpan, 0),
    1,
  );

  return {
    targetStars: nextTarget.stars,
    remainingScore: nextTarget.score - score,
    progressRatio,
    previousThresholdScore: previousThreshold,
    targetScore: nextTarget.score,
  };
}

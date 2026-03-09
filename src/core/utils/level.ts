import {
  LevelDefinition,
  LevelDifficulty,
} from '@centerhit-features/levels/types/levelTypes';

const difficultyMap: Record<LevelDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export function getDifficultyLabel(difficulty: LevelDifficulty) {
  return difficultyMap[difficulty];
}

export function formatObjectiveSummary(level: LevelDefinition) {
  return `${level.objective.requiredHits} hits • ${level.objective.requiredPerfectHits} perfect • ${level.objective.maxMissAllowed} misses`;
}

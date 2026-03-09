import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import {
  LevelProgressRecord,
  ProgressState,
} from '@centerhit-features/progress/types/progressTypes';

export function calculateTotalStars(levelRecords: Record<string, LevelProgressRecord>) {
  return Object.values(levelRecords).reduce(
    (total, record) => total + record.stars,
    0,
  );
}

export function isLevelUnlocked(progress: ProgressState, levelId: string) {
  return progress.unlockedLevelIds.includes(levelId);
}

export function resolvePlayableLevelId(
  progress: ProgressState,
  levels: readonly LevelDefinition[],
) {
  if (
    progress.lastPlayedLevelId &&
    progress.unlockedLevelIds.includes(progress.lastPlayedLevelId)
  ) {
    return progress.lastPlayedLevelId;
  }

  return levels.find(level => progress.unlockedLevelIds.includes(level.id))?.id ?? null;
}

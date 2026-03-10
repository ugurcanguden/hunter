import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import {
  LevelProgressRecord,
  ProgressState,
} from '@centerhit-features/progress/types/progressTypes';
import { CampaignPackDefinition } from '@centerhit-features/campaign/types/campaignTypes';

export function calculateTotalStars(levelRecords: Record<string, LevelProgressRecord>) {
  return Object.values(levelRecords).reduce(
    (total, record) => total + record.stars,
    0,
  );
}

export function isLevelUnlocked(progress: ProgressState, levelId: string) {
  return progress.unlockedLevelIds.includes(levelId);
}

export function isPackUnlocked(progress: ProgressState, packId: string) {
  return progress.unlockedPackIds.includes(packId);
}

export function isPackCompleted(
  progress: ProgressState,
  pack: CampaignPackDefinition,
  levels: readonly LevelDefinition[],
) {
  if (levels.length === 0) {
    return false;
  }

  return levels.every(level => Boolean(progress.levelRecords[level.id]));
}

export function resolveNextUnlockablePack(
  progress: ProgressState,
  packs: readonly CampaignPackDefinition[],
) {
  return packs.find(pack => !progress.unlockedPackIds.includes(pack.packId)) ?? null;
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

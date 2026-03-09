import { DEFAULT_LEVEL_ID } from '@centerhit-core/constants/app';
import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import { calculateTotalStars } from '@centerhit-core/utils/progress';
import { levelService } from '@centerhit-features/levels/services/levelService';
import {
  LevelProgressRecord,
  ProgressState,
  SaveLevelResultInput,
} from '@centerhit-features/progress/types/progressTypes';

export const defaultProgress: ProgressState = {
  unlockedLevelIds: [DEFAULT_LEVEL_ID],
  levelRecords: {},
  bestScore: 0,
  lastPlayedLevelId: DEFAULT_LEVEL_ID,
  totalStars: 0,
};

function mergeLevelRecord(
  existing: LevelProgressRecord | undefined,
  input: SaveLevelResultInput,
): LevelProgressRecord {
  return {
    levelId: input.levelId,
    stars: Math.max(existing?.stars ?? 0, input.stars) as LevelProgressRecord['stars'],
    bestScore: Math.max(existing?.bestScore ?? 0, input.score),
    bestPerfectCount: Math.max(existing?.bestPerfectCount ?? 0, input.perfectCount),
    lastCompletedAt: input.completedAt ?? existing?.lastCompletedAt ?? new Date().toISOString(),
  };
}

export const progressService = {
  async getProgress(): Promise<ProgressState> {
    const stored = await storageClient.getItem<ProgressState>(STORAGE_KEYS.progress);

    return stored ?? defaultProgress;
  },

  async saveProgress(progress: ProgressState) {
    await storageClient.setItem(STORAGE_KEYS.progress, progress);
  },

  async saveLevelResult(input: SaveLevelResultInput): Promise<ProgressState> {
    const progress = await this.getProgress();
    const currentRecord = progress.levelRecords[input.levelId];
    const mergedRecord = mergeLevelRecord(currentRecord, input);
    const nextLevel = levelService.getNextLevel(input.levelId);
    const unlockedLevelIds = nextLevel
      ? Array.from(new Set([...progress.unlockedLevelIds, nextLevel.id]))
      : progress.unlockedLevelIds;

    const nextProgress: ProgressState = {
      unlockedLevelIds,
      levelRecords: {
        ...progress.levelRecords,
        [input.levelId]: mergedRecord,
      },
      bestScore: Math.max(progress.bestScore, input.score),
      lastPlayedLevelId: input.levelId,
      totalStars: 0,
    };

    nextProgress.totalStars = calculateTotalStars(nextProgress.levelRecords);
    await this.saveProgress(nextProgress);

    return nextProgress;
  },

  async unlockNextLevel(currentLevelId: string): Promise<ProgressState> {
    const progress = await this.getProgress();
    const nextLevel = levelService.getNextLevel(currentLevelId);

    if (!nextLevel || progress.unlockedLevelIds.includes(nextLevel.id)) {
      return progress;
    }

    const nextProgress = {
      ...progress,
      unlockedLevelIds: [...progress.unlockedLevelIds, nextLevel.id],
    };
    await this.saveProgress(nextProgress);

    return nextProgress;
  },

  async setLastPlayedLevel(levelId: string): Promise<ProgressState> {
    const progress = await this.getProgress();
    const nextProgress = {
      ...progress,
      lastPlayedLevelId: levelId,
    };
    await this.saveProgress(nextProgress);

    return nextProgress;
  },

  async resetProgress(): Promise<ProgressState> {
    await this.saveProgress(defaultProgress);

    return defaultProgress;
  },

  async getLastPlayedLevel() {
    const progress = await this.getProgress();

    return progress.lastPlayedLevelId;
  },
};

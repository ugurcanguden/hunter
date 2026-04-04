import { DEFAULT_LEVEL_ID } from '@centerhit-core/constants/app';
import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import {
  calculateTotalStars,
  isPackCompleted,
} from '@centerhit-core/utils/progress';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { levelService } from '@centerhit-features/levels/services/levelService';
import {
  LevelProgressRecord,
  ProgressState,
  SaveLevelResultInput,
} from '@centerhit-features/progress/types/progressTypes';

export const defaultProgress: ProgressState = {
  unlockedPackIds: ['pack-01'],
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
    if (!stored) {
      return defaultProgress;
    }

    return {
      ...defaultProgress,
      ...stored,
      unlockedPackIds: stored.unlockedPackIds ?? defaultProgress.unlockedPackIds,
      unlockedLevelIds: stored.unlockedLevelIds ?? defaultProgress.unlockedLevelIds,
    };
  },

  async saveProgress(progress: ProgressState) {
    await storageClient.setItem(STORAGE_KEYS.progress, progress);
  },

  async saveLevelResult(input: SaveLevelResultInput): Promise<ProgressState> {
    const progress = await this.getProgress();
    const currentRecord = progress.levelRecords[input.levelId];
    const mergedRecord = mergeLevelRecord(currentRecord, input);
    const campaignState = useCampaignStore.getState();
    const currentPack = campaignState.getPackByLevelId(input.levelId);
    let unlockedLevelIds = [...progress.unlockedLevelIds];
    let unlockedPackIds = [...progress.unlockedPackIds];

    if (currentPack) {
      const currentPackLevels = (campaignState.levelsByPackId[currentPack.packId] ?? [])
        .slice()
        .sort((left, right) => left.order - right.order);
      const currentIndex = currentPackLevels.findIndex(level => level.id === input.levelId);
      const nextLevelInPack = currentIndex >= 0 ? currentPackLevels[currentIndex + 1] : null;

      if (nextLevelInPack) {
        unlockedLevelIds = Array.from(new Set([...unlockedLevelIds, nextLevelInPack.id]));
      }
    }

    const nextProgress: ProgressState = {
      unlockedPackIds,
      unlockedLevelIds,
      levelRecords: {
        ...progress.levelRecords,
        [input.levelId]: mergedRecord,
      },
      bestScore: Math.max(progress.bestScore, input.score),
      lastPlayedLevelId: input.levelId,
      totalStars: 0,
    };

    if (currentPack) {
      const currentPackLevels = campaignState.levelsByPackId[currentPack.packId] ?? [];
      const packCompleted = isPackCompleted(
        nextProgress,
        currentPack,
        currentPackLevels,
      );

      if (packCompleted) {
        const nextPack = campaignState.packs.find(
          pack => pack.unlockAfterPackId === currentPack.packId,
        );

        if (nextPack && !nextProgress.unlockedPackIds.includes(nextPack.packId)) {
          nextProgress.unlockedPackIds = [...nextProgress.unlockedPackIds, nextPack.packId];

          const nextPackLevels = (campaignState.levelsByPackId[nextPack.packId] ?? [])
            .slice()
            .sort((left, right) => left.order - right.order);
          const firstLevel = nextPackLevels[0];
          if (firstLevel) {
            nextProgress.unlockedLevelIds = Array.from(
              new Set([
                ...nextProgress.unlockedLevelIds,
                firstLevel.id,
              ]),
            );
          }
        }
      }
    }

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

  async unlockAllDev(): Promise<ProgressState> {
    const progress = await this.getProgress();
    const campaignState = useCampaignStore.getState();
    const allPackIds = campaignState.packs.map(pack => pack.packId);
    const allLevelIds = campaignState
      .getAllLoadedLevels()
      .map(level => level.id);
    const fallbackLastPlayedLevelId = allLevelIds[0] ?? DEFAULT_LEVEL_ID;

    const nextProgress: ProgressState = {
      ...progress,
      unlockedPackIds: Array.from(new Set([...progress.unlockedPackIds, ...allPackIds])),
      unlockedLevelIds: Array.from(new Set([...progress.unlockedLevelIds, ...allLevelIds])),
      lastPlayedLevelId: progress.lastPlayedLevelId ?? fallbackLastPlayedLevelId,
    };

    await this.saveProgress(nextProgress);
    return nextProgress;
  },

  async syncUnlockedPacks(packIds: string[]): Promise<ProgressState> {
    const progress = await this.getProgress();
    const nextPackIds = Array.from(new Set([...progress.unlockedPackIds, ...packIds]));

    if (nextPackIds.length === progress.unlockedPackIds.length) {
      return progress;
    }

    const nextProgress: ProgressState = {
      ...progress,
      unlockedPackIds: nextPackIds,
    };

    await this.saveProgress(nextProgress);
    return nextProgress;
  },

  async syncUnlockedLevelsForPack(packId: string, levelIds: string[]): Promise<ProgressState> {
    const progress = await this.getProgress();

    if (!progress.unlockedPackIds.includes(packId)) {
      return progress;
    }

    const sortedLevelIds = [...levelIds];
    const alreadyUnlocked = sortedLevelIds.filter(levelId =>
      progress.unlockedLevelIds.includes(levelId),
    );

    if (alreadyUnlocked.length > 0) {
      return progress;
    }

    const firstLevelId = sortedLevelIds[0];
    if (!firstLevelId) {
      return progress;
    }

    const nextProgress = {
      ...progress,
      unlockedLevelIds: Array.from(new Set([...progress.unlockedLevelIds, firstLevelId])),
    };

    await this.saveProgress(nextProgress);
    return nextProgress;
  },

  async getLastPlayedLevel() {
    const progress = await this.getProgress();

    return progress.lastPlayedLevelId;
  },
};

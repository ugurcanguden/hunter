import { create } from 'zustand';

import { isLevelUnlocked } from '@centerhit-core/utils/progress';
import {
  defaultProgress,
  progressService,
} from '@centerhit-features/progress/services/progressService';
import {
  LevelProgressRecord,
  ProgressState,
  SaveLevelResultInput,
} from '@centerhit-features/progress/types/progressTypes';

type ProgressStore = {
  progress: ProgressState;
  isLoaded: boolean;
  isLoading: boolean;
  loadProgress: () => Promise<void>;
  saveLevelResult: (input: SaveLevelResultInput) => Promise<void>;
  setLastPlayedLevel: (levelId: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  syncUnlockedLevelsForPack: (packId: string, levelIds: string[]) => Promise<void>;
  getLevelRecord: (levelId: string) => LevelProgressRecord | undefined;
  getLevelStars: (levelId: string) => number;
  isLevelUnlocked: (levelId: string) => boolean;
  isPackUnlocked: (packId: string) => boolean;
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: defaultProgress,
  isLoaded: false,
  isLoading: false,

  async loadProgress() {
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true });
    const progress = await progressService.getProgress();
    set({ progress, isLoaded: true, isLoading: false });
  },

  async saveLevelResult(input) {
    const progress = await progressService.saveLevelResult(input);
    set({ progress });
  },

  async setLastPlayedLevel(levelId) {
    const progress = await progressService.setLastPlayedLevel(levelId);
    set({ progress });
  },

  async resetProgress() {
    const progress = await progressService.resetProgress();
    set({ progress });
  },

  async syncUnlockedLevelsForPack(packId, levelIds) {
    const progress = await progressService.syncUnlockedLevelsForPack(packId, levelIds);
    set({ progress });
  },

  getLevelRecord(levelId) {
    return get().progress.levelRecords[levelId];
  },

  getLevelStars(levelId) {
    return get().progress.levelRecords[levelId]?.stars ?? 0;
  },

  isLevelUnlocked(levelId) {
    return isLevelUnlocked(get().progress, levelId);
  },

  isPackUnlocked(packId) {
    return get().progress.unlockedPackIds.includes(packId);
  },
}));

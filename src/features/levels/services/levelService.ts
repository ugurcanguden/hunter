import { levels } from '@centerhit-features/levels/data/levels';
import { validateLevels } from '@centerhit-features/levels/services/levelValidator';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { ProgressState } from '@centerhit-features/progress/types/progressTypes';

if (__DEV__) {
  validateLevels(levels);
}

const sortedLevels = [...levels].sort((left, right) => left.order - right.order);

export const levelService = {
  getAllLevels(): readonly LevelDefinition[] {
    return sortedLevels;
  },

  getLevelById(levelId: string) {
    return sortedLevels.find(level => level.id === levelId) ?? null;
  },

  getNextLevel(currentLevelId: string) {
    const currentIndex = sortedLevels.findIndex(level => level.id === currentLevelId);

    if (currentIndex < 0) {
      return null;
    }

    return sortedLevels[currentIndex + 1] ?? null;
  },

  getInitialPlayableLevel(progress: ProgressState) {
    return (
      sortedLevels.find(level => progress.unlockedLevelIds.includes(level.id)) ?? null
    );
  },
};

import { levels } from '@centerhit-features/levels/data/levels';
import { validateLevels } from '@centerhit-features/levels/services/levelValidator';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { ProgressState } from '@centerhit-features/progress/types/progressTypes';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';

if (__DEV__) {
  validateLevels(levels);
}

function getSortedLevels() {
  const campaignLevels = useCampaignStore.getState().getAllLoadedLevels();

  return (campaignLevels.length > 0 ? campaignLevels : [...levels]).sort(
    (left, right) => left.order - right.order,
  );
}

export const levelService = {
  getAllLevels(): readonly LevelDefinition[] {
    return getSortedLevels();
  },

  getLevelById(levelId: string) {
    return getSortedLevels().find(level => level.id === levelId) ?? null;
  },

  getNextLevel(currentLevelId: string) {
    const sortedLevels = getSortedLevels();
    const currentIndex = sortedLevels.findIndex(level => level.id === currentLevelId);

    if (currentIndex < 0) {
      return null;
    }

    return sortedLevels[currentIndex + 1] ?? null;
  },

  getInitialPlayableLevel(progress: ProgressState) {
    const sortedLevels = getSortedLevels();
    return (
      sortedLevels.find(level => progress.unlockedLevelIds.includes(level.id)) ?? null
    );
  },
};

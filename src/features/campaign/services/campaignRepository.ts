import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import { localCampaignPack } from '@centerhit-features/levels/data/localCampaignPack';
import { levels } from '@centerhit-features/levels/data/levels';
import { remotePackLevelService } from '@centerhit-features/campaign/services/remotePackLevelService';
import { remotePackService } from '@centerhit-features/campaign/services/remotePackService';
import {
  CampaignPackDefinition,
  CampaignPackLevelsCache,
  CampaignPacksCache,
} from '@centerhit-features/campaign/types/campaignTypes';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';

function mergePacks(remotePacks: readonly CampaignPackDefinition[]) {
  const seen = new Set<string>([localCampaignPack.packId]);
  const merged = [localCampaignPack];

  remotePacks
    .filter(pack => pack.order >= 2)
    .sort((left, right) => left.order - right.order)
    .forEach(pack => {
      if (seen.has(pack.packId)) {
        return;
      }

      merged.push(pack);
      seen.add(pack.packId);
    });

  return merged;
}

export const campaignRepository = {
  async loadCampaignPacks(): Promise<CampaignPackDefinition[]> {
    try {
      const cached = await storageClient.getItem<CampaignPacksCache>(STORAGE_KEYS.campaignPacks);
      const remote = await remotePackService.fetchPublishedPacks();

      if (remote.length > 0) {
        const merged = mergePacks(remote);
        await storageClient.setItem<CampaignPacksCache>(STORAGE_KEYS.campaignPacks, {
          syncedAt: new Date().toISOString(),
          packs: merged.filter(pack => pack.packId !== localCampaignPack.packId),
        });
        return merged;
      }

      return mergePacks(cached?.packs ?? []);
    } catch (error) {
      console.warn('[campaign] loadCampaignPacks fallback', error);
      return [localCampaignPack];
    }
  },

  async getCachedPackLevels(packId: string): Promise<LevelDefinition[] | null> {
    if (packId === localCampaignPack.packId) {
      return [...levels];
    }

    try {
      const cached = await storageClient.getItem<CampaignPackLevelsCache>(
        STORAGE_KEYS.campaignPackLevels,
      );

      return cached?.byPackId[packId] ?? null;
    } catch (error) {
      console.warn(`[campaign] getCachedPackLevels failed for ${packId}`, error);
      return null;
    }
  },

  async refreshPackLevels(pack: CampaignPackDefinition): Promise<LevelDefinition[]> {
    if (pack.packId === localCampaignPack.packId) {
      return [...levels];
    }

    try {
      const levelsForPack = await remotePackLevelService.fetchPublishedLevelsByPack(pack);

      if (levelsForPack.length === 0) {
        return [];
      }

      const cached = await storageClient.getItem<CampaignPackLevelsCache>(
        STORAGE_KEYS.campaignPackLevels,
      );
      const byPackId = {
        ...(cached?.byPackId ?? {}),
        [pack.packId]: levelsForPack,
      };

      await storageClient.setItem(STORAGE_KEYS.campaignPackLevels, {
        syncedAt: new Date().toISOString(),
        byPackId,
      });

      return levelsForPack;
    } catch (error) {
      console.warn(`[campaign] refreshPackLevels fallback for ${pack.packId}`, error);
      return [];
    }
  },

  async loadPackLevels(pack: CampaignPackDefinition): Promise<LevelDefinition[]> {
    const cached = await this.getCachedPackLevels(pack.packId);

    if (cached && cached.length > 0) {
      return cached;
    }

    return this.refreshPackLevels(pack);
  },
};

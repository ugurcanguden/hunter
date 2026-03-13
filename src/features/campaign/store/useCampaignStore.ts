import { create } from 'zustand';

import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import {
  localCampaignPack,
  localCampaignPacks,
} from '@centerhit-features/levels/data/localCampaignPack';
import { levels as localLevels } from '@centerhit-features/levels/data/levels';
import { campaignRepository } from '@centerhit-features/campaign/services/campaignRepository';
import {
  CampaignPackDefinition,
  CampaignPackId,
} from '@centerhit-features/campaign/types/campaignTypes';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';

type CampaignStore = {
  packs: CampaignPackDefinition[];
  levelsByPackId: Record<string, LevelDefinition[]>;
  expandedPackId: CampaignPackId | null;
  loadedPackLevelIds: string[];
  isLoaded: boolean;
  isRefreshing: boolean;
  loadCampaign: () => Promise<void>;
  refreshCampaign: () => Promise<void>;
  expandPack: (packId: CampaignPackId) => Promise<void>;
  loadPackLevels: (packId: CampaignPackId) => Promise<void>;
  refreshPackLevels: (packId: CampaignPackId) => Promise<void>;
  clearCampaignCache: () => Promise<void>;
  getPackById: (packId: CampaignPackId) => CampaignPackDefinition | null;
  getPackByLevelId: (levelId: string) => CampaignPackDefinition | null;
  getAllLoadedLevels: () => LevelDefinition[];
};

const initialLevelsByPackId = {
  'pack-01': localLevels.filter(level => level.order >= 1 && level.order <= 10),
  'pack-02': localLevels.filter(level => level.order >= 11 && level.order <= 20),
  'pack-03': localLevels.filter(level => level.order >= 21 && level.order <= 30),
};

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  packs: localCampaignPacks,
  levelsByPackId: initialLevelsByPackId,
  expandedPackId: null,
  loadedPackLevelIds: [localCampaignPack.packId],
  isLoaded: false,
  isRefreshing: false,

  async loadCampaign() {
    if (get().isRefreshing) {
      return;
    }

    set({ isRefreshing: true });
    try {
      const packs = await campaignRepository.loadCampaignPacks();
      set({ packs, isLoaded: true, isRefreshing: false });
    } catch (error) {
      if (__DEV__) {
        console.warn('[campaign] loadCampaign failed', error);
      }
      set({ packs: localCampaignPacks, isLoaded: true, isRefreshing: false });
    }
  },

  async refreshCampaign() {
    try {
      const packs = await campaignRepository.loadCampaignPacks();
      set({ packs });

      const loadedRemotePackIds = get().loadedPackLevelIds.filter(
        packId => packId !== localCampaignPack.packId,
      );

      for (const packId of loadedRemotePackIds) {
        await get().refreshPackLevels(packId);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[campaign] refreshCampaign failed', error);
      }
    }
  },

  async expandPack(packId) {
    set(state => ({
      expandedPackId: state.expandedPackId === packId ? null : packId,
    }));

    const shouldLoad =
      packId !== localCampaignPack.packId && !get().loadedPackLevelIds.includes(packId);

    if (shouldLoad) {
      await get().loadPackLevels(packId);
    }
  },

  async loadPackLevels(packId) {
    const pack = get().getPackById(packId);
    if (!pack) {
      return;
    }

    try {
      const levels = await campaignRepository.loadPackLevels(pack);
      if (levels.length === 0) {
        return;
      }

      set(state => ({
        levelsByPackId: {
          ...state.levelsByPackId,
          [packId]: levels,
        },
        loadedPackLevelIds: Array.from(new Set([...state.loadedPackLevelIds, packId])),
      }));

      if (useProgressStore.getState().isPackUnlocked(packId)) {
        await useProgressStore
          .getState()
          .syncUnlockedLevelsForPack(
            packId,
            levels
              .slice()
              .sort((left, right) => left.order - right.order)
              .map(level => level.id),
          );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(`[campaign] loadPackLevels failed for ${packId}`, error);
      }
    }
  },

  async refreshPackLevels(packId) {
    const pack = get().getPackById(packId);
    if (!pack) {
      return;
    }

    try {
      const levels = await campaignRepository.refreshPackLevels(pack);
      if (levels.length === 0) {
        return;
      }

      set(state => ({
        levelsByPackId: {
          ...state.levelsByPackId,
          [packId]: levels,
        },
        loadedPackLevelIds: Array.from(new Set([...state.loadedPackLevelIds, packId])),
      }));

      if (useProgressStore.getState().isPackUnlocked(packId)) {
        await useProgressStore
          .getState()
          .syncUnlockedLevelsForPack(
            packId,
            levels
              .slice()
              .sort((left, right) => left.order - right.order)
              .map(level => level.id),
          );
      }
    } catch (error) {
      if (__DEV__) {
        console.warn(`[campaign] refreshPackLevels failed for ${packId}`, error);
      }
    }
  },

  async clearCampaignCache() {
    await Promise.all([
      storageClient.removeItem(STORAGE_KEYS.campaignPacks),
      storageClient.removeItem(STORAGE_KEYS.campaignPackLevels),
    ]);

    set({
      packs: localCampaignPacks,
      levelsByPackId: initialLevelsByPackId,
      expandedPackId: null,
      loadedPackLevelIds: [localCampaignPack.packId],
      isLoaded: false,
      isRefreshing: false,
    });

    await get().loadCampaign();
  },

  getPackById(packId) {
    return get().packs.find(pack => pack.packId === packId) ?? null;
  },

  getPackByLevelId(levelId) {
    const entry = Object.entries(get().levelsByPackId).find(([, levels]) =>
      levels.some(level => level.id === levelId),
    );

    if (!entry) {
      return null;
    }

    return get().packs.find(pack => pack.packId === entry[0]) ?? null;
  },

  getAllLoadedLevels() {
    return Object.values(get().levelsByPackId)
      .flat()
      .sort((left, right) => left.order - right.order);
  },
}));

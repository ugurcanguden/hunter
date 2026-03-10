import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';

export type CampaignPackId = string;
export type CampaignCoverTone = 'cyan' | 'amber' | 'red' | 'mixed';

export type CampaignPackDefinition = {
  packId: CampaignPackId;
  order: number;
  title: string;
  subtitle?: string;
  coverTone?: CampaignCoverTone;
  levelCount: number;
  startOrder: number;
  endOrder: number;
  unlockAfterPackId?: CampaignPackId | null;
  isPublished: boolean;
  metadata?: Record<string, string | number | boolean>;
};

export type CampaignPackWithLevels = CampaignPackDefinition & {
  levels: LevelDefinition[];
};

export type RemotePackRecord = CampaignPackDefinition & {
  contentVersion: number;
};

export type CampaignPacksCache = {
  syncedAt: string;
  packs: CampaignPackDefinition[];
};

export type CampaignPackLevelsCache = {
  syncedAt: string;
  byPackId: Record<string, LevelDefinition[]>;
};


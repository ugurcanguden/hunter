import { CampaignPackDefinition } from '@centerhit-features/campaign/types/campaignTypes';

export const localCampaignPacks: CampaignPackDefinition[] = [
  {
    packId: 'pack-01',
    order: 1,
    title: 'Starter Circuit',
    subtitle: 'Learn the rhythm',
    coverTone: 'cyan',
    levelCount: 10,
    startOrder: 1,
    endOrder: 10,
    unlockAfterPackId: null,
    isPublished: true,
  },
  {
    packId: 'pack-02',
    order: 2,
    title: 'Neon Trials',
    subtitle: 'New chapters unlock here',
    coverTone: 'amber',
    levelCount: 10,
    startOrder: 11,
    endOrder: 20,
    unlockAfterPackId: 'pack-01',
    isPublished: true,
  },
  {
    packId: 'pack-03',
    order: 3,
    title: 'Pulse Frontier',
    subtitle: 'Remote content will expand this pack',
    coverTone: 'red',
    levelCount: 10,
    startOrder: 21,
    endOrder: 30,
    unlockAfterPackId: 'pack-02',
    isPublished: true,
  },
];

export const localCampaignPack = localCampaignPacks[0]!;

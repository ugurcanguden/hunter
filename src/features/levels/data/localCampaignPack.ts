import { CampaignPackDefinition } from '@centerhit-features/campaign/types/campaignTypes';

export const localCampaignPacks: CampaignPackDefinition[] = [
  {
    packId: 'pack-01',
    order: 1,
    title: 'Easy Parkur',
    subtitle: 'Foundations and timing basics',
    coverTone: 'cyan',
    levelCount: 50,
    startOrder: 1,
    endOrder: 50,
    unlockAfterPackId: null,
    isPublished: true,
  },
  {
    packId: 'pack-02',
    order: 2,
    title: 'Medium Parkur',
    subtitle: 'Faster rhythm and tighter windows',
    coverTone: 'amber',
    levelCount: 10,
    startOrder: 51,
    endOrder: 60,
    unlockAfterPackId: 'pack-01',
    isPublished: true,
  },
  {
    packId: 'pack-03',
    order: 3,
    title: 'Hard Parkur',
    subtitle: 'High precision and obstacle pressure',
    coverTone: 'red',
    levelCount: 10,
    startOrder: 61,
    endOrder: 70,
    unlockAfterPackId: 'pack-02',
    isPublished: true,
  },
];

export const localCampaignPack = localCampaignPacks[0]!;

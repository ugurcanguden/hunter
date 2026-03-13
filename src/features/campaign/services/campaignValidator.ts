import {
  CampaignPackDefinition,
  RemotePackRecord,
} from '@centerhit-features/campaign/types/campaignTypes';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { validateLevels } from '@centerhit-features/levels/services/levelValidator';

export function validatePacks(packs: readonly CampaignPackDefinition[]) {
  const packIds = new Set<string>();
  const orders = new Set<number>();

  packs.forEach(pack => {
    if (packIds.has(pack.packId)) {
      throw new Error(`Duplicate pack id: ${pack.packId}`);
    }

    if (orders.has(pack.order)) {
      throw new Error(`Duplicate pack order: ${pack.order}`);
    }

    if (pack.levelCount <= 0) {
      throw new Error(`Pack ${pack.packId} must contain at least one level.`);
    }

    if (pack.startOrder > pack.endOrder) {
      throw new Error(`Pack ${pack.packId} has invalid start/end order.`);
    }

    packIds.add(pack.packId);
    orders.add(pack.order);
  });
}

export function validateLevelsForPack(
  pack: CampaignPackDefinition,
  levels: readonly LevelDefinition[],
) {
  validateLevels(levels);

  if (levels.length !== pack.levelCount) {
    throw new Error(
      `Pack ${pack.packId} expects ${pack.levelCount} levels but received ${levels.length}.`,
    );
  }

  levels.forEach(level => {
    if (level.order < pack.startOrder || level.order > pack.endOrder) {
      throw new Error(`Level ${level.id} falls outside pack ${pack.packId} order range.`);
    }
  });
}

export function filterValidPacks(records: readonly RemotePackRecord[]) {
  const packs = records.filter(record => record.isPublished);

  try {
    validatePacks(packs);
    return packs;
  } catch (error) {
    if (__DEV__) {
      console.warn('[campaign] invalid remote pack set ignored', error);
    }
    return [] as CampaignPackDefinition[];
  }
}


import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';
import {
  CampaignPackDefinition,
  RemotePackRecord,
} from '@centerhit-features/campaign/types/campaignTypes';
import { filterValidPacks } from '@centerhit-features/campaign/services/campaignValidator';

function buildUrl(collection: string, query: string) {
  return `${POCKETBASE_URL}/api/collections/${collection}/records${query}`;
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function asObject(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, string | number | boolean>)
    : undefined;
}

function mapPackRecord(input: Record<string, unknown>): RemotePackRecord {
  const rawUnlockAfterPackId = asString(input.unlockAfterPackId);
  const unlockAfterPackId =
    rawUnlockAfterPackId && rawUnlockAfterPackId !== 'null' ? rawUnlockAfterPackId : null;

  return {
    packId: asString(input.packId) || asString(input.id),
    order: asNumber(input.order),
    title: asString(input.title),
    subtitle: asString(input.subtitle) || undefined,
    coverTone: (asString(input.coverTone) || undefined) as CampaignPackDefinition['coverTone'],
    levelCount: asNumber(input.levelCount),
    startOrder: asNumber(input.startOrder),
    endOrder: asNumber(input.endOrder),
    unlockAfterPackId,
    isPublished: asBoolean(input.isPublished),
    contentVersion: asNumber(input.contentVersion, 1),
    metadata: asObject(input.metadata),
  };
}

export const remotePackService = {
  async fetchPublishedPacks(): Promise<CampaignPackDefinition[]> {
    if (!POCKETBASE_URL) {
      return [];
    }

    try {
      const response = await fetch(
        buildUrl(
          POCKETBASE_COLLECTIONS.packs,
          '?filter=isPublished%3Dtrue&sort=order&perPage=200',
        ),
      );

      if (!response.ok) {
        throw new Error(`Remote packs request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { items?: Record<string, unknown>[] };
      const items = payload.items ?? [];
      return filterValidPacks(items.map(mapPackRecord));
    } catch (error) {
      if (__DEV__) {
        console.warn('[campaign] remote packs fetch failed', error);
      }
      return [];
    }
  },
};

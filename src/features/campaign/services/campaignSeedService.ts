import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';

type PocketBaseListResponse = {
  items?: Array<Record<string, unknown>>;
};

const seedPack = {
  packId: 'pack-04',
  order: 4,
  title: 'Neon Trials',
  subtitle: '3 new precision levels',
  coverTone: 'cyan',
  levelCount: 3,
  startOrder: 71,
  endOrder: 73,
  unlockAfterPackId: 'pack-03',
  isPublished: true,
  contentVersion: 1,
  metadata: {},
};

const seedLevels = [
  {
    levelId: 'level-71',
    order: 71,
    title: 'Neon Lock',
    difficulty: 'hard',
    launcher: { speed: 2.24, moveRangePercent: 0.4 },
    target: {
      size: 0.46,
      speed: 1.84,
      movementAxis: 'horizontal',
      movementBehavior: 'loop',
      moveRangePercent: 0.42,
    },
    ball: { speed: 1.34 },
    objective: {
      requiredHits: 12,
      requiredPerfectHits: 5,
      maxMissAllowed: 1,
      maxShots: 14,
    },
    stars: {
      oneStarScore: 860,
      twoStarScore: 1120,
      threeStarScore: 1320,
    },
    obstacles: [
      {
        id: 'obs-71-a',
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.52,
        widthPercent: 0.11,
        heightPercent: 0.04,
      },
    ],
    isPublished: true,
    contentVersion: 1,
    metadata: {},
  },
  {
    levelId: 'level-72',
    order: 72,
    title: 'Twin Drift',
    difficulty: 'hard',
    launcher: { speed: 2.32, moveRangePercent: 0.42 },
    target: {
      size: 0.44,
      speed: 1.92,
      movementAxis: 'horizontal',
      movementBehavior: 'bounce',
      moveRangePercent: 0.44,
    },
    ball: { speed: 1.36 },
    objective: {
      requiredHits: 12,
      requiredPerfectHits: 6,
      maxMissAllowed: 1,
      maxShots: 14,
    },
    stars: {
      oneStarScore: 900,
      twoStarScore: 1180,
      threeStarScore: 1380,
    },
    obstacles: [
      {
        id: 'obs-72-a',
        type: 'blocker',
        xPercent: 0.34,
        yPercent: 0.5,
        widthPercent: 0.11,
        heightPercent: 0.038,
      },
      {
        id: 'obs-72-b',
        type: 'blocker',
        xPercent: 0.66,
        yPercent: 0.5,
        widthPercent: 0.11,
        heightPercent: 0.038,
      },
    ],
    isPublished: true,
    contentVersion: 1,
    metadata: {},
  },
  {
    levelId: 'level-73',
    order: 73,
    title: 'Gate Pulse',
    difficulty: 'hard',
    launcher: { speed: 2.4, moveRangePercent: 0.44 },
    target: {
      size: 0.42,
      speed: 2.02,
      movementAxis: 'horizontal',
      movementBehavior: 'loop',
      moveRangePercent: 0.46,
    },
    ball: { speed: 1.38 },
    objective: {
      requiredHits: 13,
      requiredPerfectHits: 6,
      maxMissAllowed: 1,
      maxShots: 15,
    },
    stars: {
      oneStarScore: 950,
      twoStarScore: 1240,
      threeStarScore: 1450,
    },
    obstacles: [
      {
        id: 'obs-73-a',
        type: 'blocker',
        xPercent: 0.5,
        yPercent: 0.54,
        widthPercent: 0.09,
        heightPercent: 0.036,
      },
      {
        id: 'obs-73-b',
        type: 'blocker',
        xPercent: 0.28,
        yPercent: 0.44,
        widthPercent: 0.08,
        heightPercent: 0.034,
      },
      {
        id: 'obs-73-c',
        type: 'blocker',
        xPercent: 0.72,
        yPercent: 0.44,
        widthPercent: 0.08,
        heightPercent: 0.034,
      },
    ],
    isPublished: true,
    contentVersion: 1,
    metadata: {},
  },
] as const;

function buildCollectionUrl(collection: string, query = '') {
  return `${POCKETBASE_URL}/api/collections/${collection}/records${query}`;
}

async function fetchExistingRecordId(
  collection: string,
  field: string,
  value: string | number,
): Promise<string | null> {
  const normalizedValue =
    typeof value === 'number' ? `${value}` : `"${value}"`;
  const filter = encodeURIComponent(`${field}=${normalizedValue}`);
  const response = await fetch(buildCollectionUrl(collection, `?filter=${filter}&perPage=1`));

  if (!response.ok) {
    throw new Error(`PocketBase lookup failed: ${collection} ${response.status}`);
  }

  const payload = (await response.json()) as PocketBaseListResponse;
  return typeof payload.items?.[0]?.id === 'string' ? (payload.items[0]?.id as string) : null;
}

async function upsertRecord(
  collection: string,
  identityField: string,
  identityValue: string | number,
  payload: Record<string, unknown>,
) {
  const existingId = await fetchExistingRecordId(collection, identityField, identityValue);
  const url = existingId
    ? buildCollectionUrl(collection, `/${existingId}`)
    : buildCollectionUrl(collection);
  const method = existingId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`${collection} ${method} failed: ${response.status} ${errorBody}`);
  }
}

function normalizePocketBaseJsonPayload(payload: Record<string, unknown>) {
  const normalized = { ...payload };

  for (const [key, value] of Object.entries(normalized)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      normalized[key] = JSON.stringify(value);
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = JSON.stringify(value);
    }
  }

  return normalized;
}

export const campaignSeedService = {
  async seedRemoteCampaign() {
    if (!POCKETBASE_URL) {
      throw new Error('PocketBase URL is not configured.');
    }

    const starterPackId =
      (await fetchExistingRecordId(POCKETBASE_COLLECTIONS.packs, 'order', 1)) ?? 'pack-01';

    const remotePackPayload = normalizePocketBaseJsonPayload({
      ...seedPack,
      unlockAfterPackId: seedPack.unlockAfterPackId ?? starterPackId,
    });

    await upsertRecord(
      POCKETBASE_COLLECTIONS.packs,
      'packId',
      seedPack.packId,
      remotePackPayload,
    );

    const remotePackId = await fetchExistingRecordId(
      POCKETBASE_COLLECTIONS.packs,
      'packId',
      seedPack.packId,
    );

    if (!remotePackId) {
      throw new Error('Seeded pack could not be resolved.');
    }

    for (const level of seedLevels) {
      const levelPayload = normalizePocketBaseJsonPayload({
        ...level,
        packId: remotePackId,
      });

      await upsertRecord(
        POCKETBASE_COLLECTIONS.levels,
        'levelId',
        level.levelId,
        levelPayload,
      );
    }
  },
};

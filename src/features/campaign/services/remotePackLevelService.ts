import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';
import { CampaignPackDefinition } from '@centerhit-features/campaign/types/campaignTypes';
import { validateLevelsForPack } from '@centerhit-features/campaign/services/campaignValidator';
import { LevelDefinition, ObstacleDefinition } from '@centerhit-features/levels/types/levelTypes';

function buildUrl(packId: string) {
  const filter = encodeURIComponent(`isPublished=true && packId="${packId}"`);
  return `${POCKETBASE_URL}/api/collections/${POCKETBASE_COLLECTIONS.levels}/records?filter=${filter}&sort=order&perPage=200`;
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback;
}

function asObstacles(value: unknown): ObstacleDefinition[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value.map(item => {
    const obstacle = asRecord(item);
    return {
      id: asString(obstacle.id),
      type: (asString(obstacle.type) || 'blocker') as ObstacleDefinition['type'],
      xPercent: typeof obstacle.xPercent === 'number' ? obstacle.xPercent : undefined,
      yPercent: typeof obstacle.yPercent === 'number' ? obstacle.yPercent : undefined,
      speed: typeof obstacle.speed === 'number' ? obstacle.speed : undefined,
      widthPercent:
        typeof obstacle.widthPercent === 'number' ? obstacle.widthPercent : undefined,
      heightPercent:
        typeof obstacle.heightPercent === 'number' ? obstacle.heightPercent : undefined,
    };
  });
}

function mapLevelRecord(input: Record<string, unknown>): LevelDefinition {
  const launcher = asRecord(input.launcher);
  const target = asRecord(input.target);
  const ball = asRecord(input.ball);
  const objective = asRecord(input.objective);
  const stars = asRecord(input.stars);
  const metadata = input.metadata && typeof input.metadata === 'object'
    ? (input.metadata as Record<string, string | number | boolean>)
    : undefined;

  return {
    id: asString(input.levelId),
    order: asNumber(input.order),
    title: asString(input.title),
    difficulty: (asString(input.difficulty) || 'easy') as LevelDefinition['difficulty'],
    launcher: {
      speed: asNumber(launcher.speed),
      moveRangePercent: asNumber(launcher.moveRangePercent),
      widthScale:
        typeof launcher.widthScale === 'number' ? launcher.widthScale : undefined,
      heightScale:
        typeof launcher.heightScale === 'number' ? launcher.heightScale : undefined,
    },
    target: {
      size: asNumber(target.size),
      speed: asNumber(target.speed),
      movementAxis:
        (asString(target.movementAxis) || 'static') as LevelDefinition['target']['movementAxis'],
      movementBehavior:
        (asString(target.movementBehavior) || 'bounce') as LevelDefinition['target']['movementBehavior'],
      moveRangePercent: asNumber(target.moveRangePercent),
      heightScale:
        typeof target.heightScale === 'number' ? target.heightScale : undefined,
    },
    ball: {
      speed: asNumber(ball.speed),
      radiusScale:
        typeof ball.radiusScale === 'number' ? ball.radiusScale : undefined,
      visualSize:
        typeof ball.visualSize === 'number' ? ball.visualSize : undefined,
    },
    objective: {
      requiredHits: asNumber(objective.requiredHits),
      requiredPerfectHits: asNumber(objective.requiredPerfectHits),
      maxMissAllowed: asNumber(objective.maxMissAllowed),
      maxShots: asNumber(objective.maxShots),
    },
    stars: {
      oneStarScore: asNumber(stars.oneStarScore),
      twoStarScore: asNumber(stars.twoStarScore),
      threeStarScore: asNumber(stars.threeStarScore),
    },
    obstacles: asObstacles(input.obstacles),
    metadata,
  };
}

export const remotePackLevelService = {
  async fetchPublishedLevelsByPack(pack: CampaignPackDefinition): Promise<LevelDefinition[]> {
    if (!POCKETBASE_URL) {
      return [];
    }

    try {
      const response = await fetch(buildUrl(pack.packId));

      if (!response.ok) {
        throw new Error(`Remote pack levels request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { items?: Record<string, unknown>[] };
      const levels = (payload.items ?? []).map(mapLevelRecord);
      validateLevelsForPack(pack, levels);
      return levels;
    } catch (error) {
      console.warn(`[campaign] remote levels fetch failed for ${pack.packId}`, error);
      return [];
    }
  },
};


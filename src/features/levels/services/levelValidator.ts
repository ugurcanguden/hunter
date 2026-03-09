import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';

function assertRange(value: number, field: string, min: number, max: number) {
  if (value < min || value > max) {
    throw new Error(`Invalid ${field}: ${value}. Expected ${min}-${max}.`);
  }
}

export function assertUniqueLevelIds(levels: readonly LevelDefinition[]) {
  const seen = new Set<string>();

  levels.forEach(level => {
    if (seen.has(level.id)) {
      throw new Error(`Duplicate level id: ${level.id}`);
    }

    seen.add(level.id);
  });
}

export function assertUniqueLevelOrder(levels: readonly LevelDefinition[]) {
  const seen = new Set<number>();

  levels.forEach(level => {
    if (seen.has(level.order)) {
      throw new Error(`Duplicate level order: ${level.order}`);
    }

    seen.add(level.order);
  });
}

export function assertObjectiveRules(level: LevelDefinition) {
  const { objective } = level;

  if (objective.requiredHits <= 0) {
    throw new Error(`Level ${level.id} must require at least one hit.`);
  }

  if (objective.requiredPerfectHits < 0) {
    throw new Error(`Level ${level.id} has a negative perfect hit target.`);
  }

  if (objective.requiredPerfectHits > objective.requiredHits) {
    throw new Error(`Level ${level.id} perfect hit target exceeds total hits.`);
  }

  if (objective.maxMissAllowed < 0) {
    throw new Error(`Level ${level.id} has a negative miss limit.`);
  }

  if (objective.maxShots <= 0) {
    throw new Error(`Level ${level.id} must allow at least one shot.`);
  }

  if (objective.maxShots < objective.requiredHits) {
    throw new Error(`Level ${level.id} max shots cannot be lower than required hits.`);
  }
}

export function assertStarsConfig(level: LevelDefinition) {
  const { oneStarScore, twoStarScore, threeStarScore } = level.stars;

  if (!(oneStarScore <= twoStarScore && twoStarScore <= threeStarScore)) {
    throw new Error(`Level ${level.id} has invalid star score thresholds.`);
  }
}

export function assertObstacleRules(level: LevelDefinition) {
  level.obstacles?.forEach(obstacle => {
    if (obstacle.type !== 'blocker') {
      return;
    }

    if (
      obstacle.xPercent === undefined ||
      obstacle.yPercent === undefined ||
      obstacle.widthPercent === undefined ||
      obstacle.heightPercent === undefined
    ) {
      throw new Error(`Level ${level.id} blocker obstacle ${obstacle.id} is missing layout fields.`);
    }

    assertRange(obstacle.xPercent, `${level.id}.${obstacle.id}.xPercent`, 0, 1);
    assertRange(obstacle.yPercent, `${level.id}.${obstacle.id}.yPercent`, 0, 1);
    assertRange(obstacle.widthPercent, `${level.id}.${obstacle.id}.widthPercent`, 0.05, 0.8);
    assertRange(obstacle.heightPercent, `${level.id}.${obstacle.id}.heightPercent`, 0.02, 0.4);
  });
}

export function validateLevels(levels: readonly LevelDefinition[]) {
  assertUniqueLevelIds(levels);
  assertUniqueLevelOrder(levels);

  levels.forEach(level => {
    assertObjectiveRules(level);
    assertStarsConfig(level);
    assertRange(level.launcher.moveRangePercent, `${level.id}.launcher.moveRangePercent`, 0, 1);
    assertRange(level.target.moveRangePercent, `${level.id}.target.moveRangePercent`, 0, 1);
    assertRange(level.target.size, `${level.id}.target.size`, 0.1, 1.2);
    assertRange(level.launcher.speed, `${level.id}.launcher.speed`, 0.1, 5);
    assertRange(level.target.speed, `${level.id}.target.speed`, 0, 5);
    assertRange(level.ball.speed, `${level.id}.ball.speed`, 0.1, 5);
    assertObstacleRules(level);
  });
}

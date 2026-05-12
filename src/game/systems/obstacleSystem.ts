import { ObstacleDefinition } from '@centerhit-features/levels/types/levelTypes';
import {
  ObstacleMovementAxis,
  ObstacleMovementBehavior,
  ObstacleState,
  ProjectileState,
} from '@centerhit-game/types/gameTypes';
import { updateBouncePosition, updateLoopPosition } from '@centerhit-game/systems/movementSystem';

const defaultObstacleHeight = 0.045;
const defaultObstacleWidth = 0.16;
const defaultObstacleX = 0.5;
const defaultObstacleY = 0.5;

export function createObstacleStates(
  obstacles: readonly ObstacleDefinition[] | undefined,
): ObstacleState[] {
  return (
    obstacles?.map(obstacle => {
      const isMoving = obstacle.type === 'movingBlocker';
      const x = obstacle.xPercent ?? defaultObstacleX;
      const y = obstacle.yPercent ?? defaultObstacleY;
      return {
        id: obstacle.id,
        type: obstacle.type,
        x,
        y,
        initialX: x,
        initialY: y,
        width: obstacle.widthPercent ?? defaultObstacleWidth,
        height: obstacle.heightPercent ?? defaultObstacleHeight,
        speed: isMoving ? (obstacle.speed ?? 0.12) : 0,
        direction: 1 as const,
        movementAxis: (isMoving ? (obstacle.movementAxis ?? 'horizontal') : 'none') as ObstacleMovementAxis,
        movementBehavior: (obstacle.movementBehavior ?? 'bounce') as ObstacleMovementBehavior,
        moveRangePercent: obstacle.moveRangePercent ?? 0.15,
      };
    }) ?? []
  );
}

export function updateObstacles(
  obstacles: readonly ObstacleState[],
  deltaSeconds: number,
): ObstacleState[] {
  if (obstacles.length === 0) {
    return obstacles as ObstacleState[];
  }

  let anyMoving = false;
  for (const o of obstacles) {
    if (o.movementAxis !== 'none') {
      anyMoving = true;
      break;
    }
  }
  if (!anyMoving) {
    return obstacles as ObstacleState[];
  }

  return obstacles.map(obstacle => {
    if (obstacle.movementAxis === 'none' || obstacle.speed === 0) {
      return obstacle;
    }

    if (obstacle.movementAxis === 'horizontal') {
      const min = obstacle.initialX - obstacle.moveRangePercent;
      const max = obstacle.initialX + obstacle.moveRangePercent;
      const halfW = obstacle.width / 2;

      if (obstacle.movementBehavior === 'loop') {
        return {
          ...obstacle,
          x: updateLoopPosition(obstacle.x, obstacle.speed, deltaSeconds, min, max, halfW),
        };
      }

      const next = updateBouncePosition(obstacle.x, obstacle.direction, obstacle.speed, deltaSeconds, min, max, halfW);
      return { ...obstacle, x: next.position, direction: next.direction };
    }

    if (obstacle.movementAxis === 'vertical') {
      const min = obstacle.initialY - obstacle.moveRangePercent;
      const max = obstacle.initialY + obstacle.moveRangePercent;
      const halfH = obstacle.height / 2;

      if (obstacle.movementBehavior === 'loop') {
        return {
          ...obstacle,
          y: updateLoopPosition(obstacle.y, obstacle.speed, deltaSeconds, min, max, halfH),
        };
      }

      const next = updateBouncePosition(obstacle.y, obstacle.direction, obstacle.speed, deltaSeconds, min, max, halfH);
      return { ...obstacle, y: next.position, direction: next.direction };
    }

    return obstacle;
  });
}

export function detectProjectileObstacleHit(
  projectile: ProjectileState,
  obstacles: readonly ObstacleState[],
): ObstacleState | null {
  if (!projectile.isActive) {
    return null;
  }

  return (
    obstacles.find(obstacle => {
      const horizontalDistance = Math.abs(projectile.x - obstacle.x);
      const verticalDistance = Math.abs(projectile.y - obstacle.y);

      return (
        horizontalDistance <= obstacle.width / 2 + projectile.radius &&
        verticalDistance <= obstacle.height / 2 + projectile.radius
      );
    }) ?? null
  );
}

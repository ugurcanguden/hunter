import { ObstacleDefinition } from '@centerhit-features/levels/types/levelTypes';
import {
  ObstacleState,
  ProjectileState,
} from '@centerhit-game/types/gameTypes';

const defaultObstacleHeight = 0.045;
const defaultObstacleWidth = 0.16;
const defaultObstacleX = 0.5;
const defaultObstacleY = 0.5;

export function createObstacleStates(
  obstacles: readonly ObstacleDefinition[] | undefined,
): ObstacleState[] {
  return (
    obstacles
      ?.filter((obstacle): obstacle is ObstacleDefinition & { type: 'blocker' } => obstacle.type === 'blocker')
      .map(obstacle => ({
        id: obstacle.id,
        type: 'blocker' as const,
        x: obstacle.xPercent ?? defaultObstacleX,
        y: obstacle.yPercent ?? defaultObstacleY,
        width: obstacle.widthPercent ?? defaultObstacleWidth,
        height: obstacle.heightPercent ?? defaultObstacleHeight,
      })) ?? []
  );
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

import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import {
  HitResult,
  ProjectileState,
  TargetState,
} from '@centerhit-game/types/gameTypes';

export function detectProjectileHit(
  projectile: ProjectileState,
  target: TargetState,
): HitResult | null {
  if (!projectile.isActive) {
    return null;
  }

  const horizontalDistance = Math.abs(projectile.x - target.x);
  const verticalDistance = Math.abs(projectile.y - target.y);
  const collides =
    horizontalDistance <= target.width / 2 + projectile.radius &&
    verticalDistance <= target.height / 2 + projectile.radius;

  if (!collides) {
    return null;
  }

  const normalizedCenterOffset = horizontalDistance / Math.max(target.width / 2, 0.0001);
  const isPerfect = normalizedCenterOffset <= gameDefaults.perfectHitThresholdRatio;

  return {
    quality: isPerfect ? 'perfect' : 'good',
    message: isPerfect ? 'Perfect' : 'Good',
  };
}

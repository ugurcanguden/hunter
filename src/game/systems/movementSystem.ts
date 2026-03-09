import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { GameSessionState, ProjectileState, TargetState } from '@centerhit-game/types/gameTypes';

function clampCenter(position: number, halfSize: number, min: number, max: number) {
  return Math.min(Math.max(position, min + halfSize), max - halfSize);
}

function updateBouncePosition(
  position: number,
  direction: -1 | 1,
  speed: number,
  deltaSeconds: number,
  min: number,
  max: number,
  halfSize: number,
) {
  let nextPosition = position + direction * speed * deltaSeconds;
  let nextDirection = direction;

  if (nextPosition >= max - halfSize) {
    nextPosition = max - halfSize;
    nextDirection = -1;
  } else if (nextPosition <= min + halfSize) {
    nextPosition = min + halfSize;
    nextDirection = 1;
  }

  return {
    position: nextPosition,
    direction: nextDirection,
  };
}

function updateLoopPosition(
  position: number,
  speed: number,
  deltaSeconds: number,
  min: number,
  max: number,
  halfSize: number,
) {
  let nextPosition = position + speed * deltaSeconds;

  if (nextPosition > max - halfSize) {
    nextPosition = min + halfSize;
  }

  return nextPosition;
}

export function updateHorizontalTarget(
  target: TargetState,
  deltaSeconds: number,
): TargetState {
  if (target.movementAxis === 'static') {
    return target;
  }

  const halfWidth = target.width / 2;
  const min = 0.5 - target.moveRangePercent;
  const max = 0.5 + target.moveRangePercent;

  if (target.movementBehavior === 'loop') {
    return {
      ...target,
      x: updateLoopPosition(target.x, target.speed, deltaSeconds, min, max, halfWidth),
      direction: 1,
    };
  }

  const next = updateBouncePosition(
    target.x,
    target.direction,
    target.speed,
    deltaSeconds,
    min,
    max,
    halfWidth,
  );

  return {
    ...target,
    x: next.position,
    direction: next.direction,
  };
}

export function updateHorizontalLauncher(
  state: GameSessionState,
  deltaSeconds: number,
) {
  const halfWidth = state.launcher.width / 2;
  const boostedRange =
    state.launcher.moveRangePercent + gameDefaults.launcherRangeBoostPercent;
  const min = gameDefaults.horizontalEdgePaddingPercent;
  const max = 1 - gameDefaults.horizontalEdgePaddingPercent;
  const desiredMin = 0.5 - boostedRange;
  const desiredMax = 0.5 + boostedRange;
  const next = updateBouncePosition(
    state.launcher.x,
    state.launcher.direction,
    state.launcher.speed,
    deltaSeconds,
    Math.max(min, desiredMin),
    Math.min(max, desiredMax),
    halfWidth,
  );

  return {
    ...state.launcher,
    x: next.position,
    direction: next.direction,
  };
}

export function updateProjectile(
  projectile: ProjectileState,
  deltaSeconds: number,
) {
  if (!projectile.isActive) {
    return {
      projectile,
      canShoot: true,
      missed: false,
    };
  }

  const nextY = projectile.y - projectile.speed * deltaSeconds;

  if (nextY < -projectile.radius) {
    return {
      projectile: {
        ...projectile,
        isActive: false,
        y: projectile.y,
      },
      canShoot: true,
      missed: true,
    };
  }

  return {
    projectile: {
      ...projectile,
      y: nextY,
    },
    canShoot: false,
    missed: false,
  };
}

export function createProjectileFromLauncher(state: GameSessionState) {
  return {
    ...state.projectile,
    isActive: true,
    x: clampCenter(
      state.launcher.x,
      state.projectile.radius,
      0,
      1,
    ),
    y: state.launcher.y - state.launcher.height,
  };
}

import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { GameSessionState, ProjectileState, TargetState } from '@centerhit-game/types/gameTypes';

function clampCenter(position: number, halfSize: number, min: number, max: number) {
  return Math.min(Math.max(position, min + halfSize), max - halfSize);
}

export function updateBouncePosition(
  position: number,
  direction: -1 | 1,
  speed: number,
  deltaSeconds: number,
  min: number,
  max: number,
  halfSize: number,
): { position: number; direction: -1 | 1 } {
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
    direction: nextDirection as -1 | 1,
  };
}

export function updateLoopPosition(
  position: number,
  speed: number,
  deltaSeconds: number,
  min: number,
  max: number,
  halfSize: number,
): number {
  let nextPosition = position + speed * deltaSeconds;

  if (nextPosition > max - halfSize) {
    nextPosition = min + halfSize;
  }

  return nextPosition;
}

const TARGET_VERTICAL_MIN = 0.10;
const TARGET_VERTICAL_MAX = 0.36;

function updateBlinkState(target: TargetState, deltaMs: number): TargetState {
  if (target.blinkVisibleMs === 0) {
    return target;
  }

  const nextTimer = target.blinkTimerMs - deltaMs;
  if (nextTimer > 0) {
    return { ...target, blinkTimerMs: nextTimer };
  }

  const nextVisible = !target.isVisible;
  return {
    ...target,
    isVisible: nextVisible,
    blinkTimerMs: nextVisible ? target.blinkVisibleMs : target.blinkHiddenMs,
  };
}

export function updateTarget(target: TargetState, deltaSeconds: number): TargetState {
  const deltaMs = deltaSeconds * 1000;

  switch (target.movementAxis) {
    case 'static':
      return updateBlinkState(target, deltaMs);

    case 'horizontal': {
      const halfWidth = target.width / 2;
      const min = 0.5 - target.moveRangePercent;
      const max = 0.5 + target.moveRangePercent;

      let updated: TargetState;
      if (target.movementBehavior === 'loop') {
        updated = {
          ...target,
          x: updateLoopPosition(target.x, target.speed, deltaSeconds, min, max, halfWidth),
          direction: 1,
        };
      } else {
        const next = updateBouncePosition(target.x, target.direction, target.speed, deltaSeconds, min, max, halfWidth);
        updated = { ...target, x: next.position, direction: next.direction };
      }
      return updateBlinkState(updated, deltaMs);
    }

    case 'vertical': {
      const halfHeight = target.height / 2;
      const next = updateBouncePosition(
        target.y,
        target.yDirection,
        target.verticalSpeed,
        deltaSeconds,
        TARGET_VERTICAL_MIN,
        TARGET_VERTICAL_MAX,
        halfHeight,
      );
      return updateBlinkState(
        { ...target, y: next.position, yDirection: next.direction },
        deltaMs,
      );
    }

    case 'diagonal': {
      const halfWidth = target.width / 2;
      const halfHeight = target.height / 2;
      const hMin = 0.5 - target.moveRangePercent;
      const hMax = 0.5 + target.moveRangePercent;

      const hNext = updateBouncePosition(target.x, target.direction, target.speed, deltaSeconds, hMin, hMax, halfWidth);
      const vNext = updateBouncePosition(
        target.y,
        target.yDirection,
        target.verticalSpeed,
        deltaSeconds,
        TARGET_VERTICAL_MIN,
        TARGET_VERTICAL_MAX,
        halfHeight,
      );

      return updateBlinkState(
        { ...target, x: hNext.position, direction: hNext.direction, y: vNext.position, yDirection: vNext.direction },
        deltaMs,
      );
    }

    default:
      return updateBlinkState(target, deltaMs);
  }
}

// Keep old export for any direct imports elsewhere
export function updateHorizontalTarget(target: TargetState, deltaSeconds: number): TargetState {
  return updateTarget(target, deltaSeconds);
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

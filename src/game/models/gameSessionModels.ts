import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { createObstacleStates } from '@centerhit-game/systems/obstacleSystem';
import {
  BallState,
  GameSessionState,
  LauncherState,
  ObstacleState,
  ProjectileState,
  TargetState,
} from '@centerhit-game/types/gameTypes';

function createObjectiveProgress(level: LevelDefinition) {
  return {
    hits: 0,
    requiredHits: level.objective.requiredHits,
    perfectHits: 0,
    requiredPerfectHits: level.objective.requiredPerfectHits,
    misses: 0,
    maxMissAllowed: level.objective.maxMissAllowed,
    remainingMisses: level.objective.maxMissAllowed,
    shotsFired: 0,
    maxShots: level.objective.maxShots,
    remainingShots: level.objective.maxShots,
  } as const;
}

function createLauncherState(level: LevelDefinition): LauncherState {
  return {
    x: 0.5,
    y: gameDefaults.launcherYPercent,
    direction: 1,
    speed: gameDefaults.launcherSpeedUnitPerSecond * level.launcher.speed,
    moveRangePercent: level.launcher.moveRangePercent,
    width: gameDefaults.launcherWidthPercent * (level.launcher.widthScale ?? 1),
    height: gameDefaults.launcherHeightPercent * (level.launcher.heightScale ?? 1),
  };
}

function createTargetState(level: LevelDefinition): TargetState {
  return {
    x: 0.5,
    y: gameDefaults.targetYPercent,
    direction: 1,
    width: gameDefaults.targetBaseWidthPercent * level.target.size,
    height: gameDefaults.targetHeightPercent * (level.target.heightScale ?? 1),
    size: level.target.size,
    speed: gameDefaults.targetSpeedUnitPerSecond * level.target.speed,
    movementAxis: level.target.movementAxis,
    movementBehavior: level.target.movementBehavior,
    moveRangePercent: level.target.moveRangePercent,
  };
}

function createBallState(level: LevelDefinition): BallState {
  return {
    speed: gameDefaults.projectileSpeedUnitPerSecond * level.ball.speed,
    visualSize: level.ball.visualSize ?? gameDefaults.ballVisualSize,
  };
}

function createProjectileState(
  level: LevelDefinition,
  launcher: LauncherState,
): ProjectileState {
  return {
    x: 0.5,
    y: launcher.y,
    radius: gameDefaults.projectileRadiusPercent * (level.ball.radiusScale ?? 1),
    speed: gameDefaults.projectileSpeedUnitPerSecond * level.ball.speed,
    isActive: false,
  };
}

function createObstacleRuntime(level: LevelDefinition): ObstacleState[] {
  return createObstacleStates(level.obstacles);
}

export function createInitialSessionState(
  level: LevelDefinition,
): GameSessionState {
  const launcher = createLauncherState(level);
  const target = createTargetState(level);
  const ball = createBallState(level);
  const obstacles = createObstacleRuntime(level);

  return {
    status: 'idle',
    score: 0,
    hits: 0,
    perfectHits: 0,
    misses: 0,
    shotsFired: 0,
    awardedStars: 0,
    canShoot: true,
    failReason: null,
    feedback: {
      message: null,
      type: null,
      until: null,
    },
    visualFeedback: {
      targetFlashMs: 0,
      targetFlashTone: null,
      obstacleFlashMs: 0,
      obstacleFlashId: null,
      stageEffectMs: 0,
      stageEffectTone: null,
    },
    objective: {
      requiredHits: level.objective.requiredHits,
      requiredPerfectHits: level.objective.requiredPerfectHits,
      maxMissAllowed: level.objective.maxMissAllowed,
      maxShots: level.objective.maxShots,
    },
    objectiveProgress: createObjectiveProgress(level),
    launcher,
    target,
    ball,
    projectile: createProjectileState(level, launcher),
    obstacles,
  };
}

import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { createGameSession } from '@centerhit-game/engine/createGameSession';
import { detectProjectileHit } from '@centerhit-game/systems/hitDetectionSystem';
import { detectProjectileObstacleHit } from '@centerhit-game/systems/obstacleSystem';
import {
  createProjectileFromLauncher,
  updateHorizontalLauncher,
  updateHorizontalTarget,
  updateProjectile,
} from '@centerhit-game/systems/movementSystem';
import {
  evaluateObjectiveProgress,
  getObjectiveFailReason,
} from '@centerhit-game/systems/objectiveSystem';
import { calculateHitScore } from '@centerhit-game/systems/scoringSystem';
import { FailReason, GameSessionState } from '@centerhit-game/types/gameTypes';

type GameEvent =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE'; stars: 0 | 1 | 2 | 3 }
  | { type: 'FAIL'; reason?: FailReason }
  | { type: 'RESET'; level: LevelDefinition }
  | { type: 'TICK'; deltaMs: number; nowMs: number }
  | { type: 'SHOOT' }
  | { type: 'CLEAR_FEEDBACK' };

function withObjectiveProgress(state: GameSessionState): GameSessionState {
  return {
    ...state,
    objectiveProgress: evaluateObjectiveProgress(state),
  };
}

function decrementEffect(value: number, deltaMs: number) {
  return Math.max(value - deltaMs, 0);
}

function decayVisualFeedback(state: GameSessionState, deltaMs: number) {
  const nextTargetFlashMs = decrementEffect(state.visualFeedback.targetFlashMs, deltaMs);
  const nextObstacleFlashMs = decrementEffect(
    state.visualFeedback.obstacleFlashMs,
    deltaMs,
  );
  const nextStageEffectMs = decrementEffect(state.visualFeedback.stageEffectMs, deltaMs);

  return {
    targetFlashMs: nextTargetFlashMs,
    targetFlashTone: nextTargetFlashMs > 0 ? state.visualFeedback.targetFlashTone : null,
    obstacleFlashMs: nextObstacleFlashMs,
    obstacleFlashId: nextObstacleFlashMs > 0 ? state.visualFeedback.obstacleFlashId : null,
    stageEffectMs: nextStageEffectMs,
    stageEffectTone: nextStageEffectMs > 0 ? state.visualFeedback.stageEffectTone : null,
  } as const;
}

export function gameSessionReducer(
  state: ReturnType<typeof createGameSession>,
  event: GameEvent,
): GameSessionState {
  switch (event.type) {
    case 'START':
      return { ...state, status: 'playing' as const };
    case 'PAUSE':
      return { ...state, status: 'paused' as const };
    case 'RESUME':
      return { ...state, status: 'playing' as const };
    case 'COMPLETE':
      return withObjectiveProgress({
        ...state,
        status: 'completed' as const,
        awardedStars: event.stars,
        visualFeedback: {
          ...state.visualFeedback,
          stageEffectMs: gameDefaults.completeStageEffectMs,
          stageEffectTone: 'success',
        },
      });
    case 'FAIL':
      return withObjectiveProgress({
        ...state,
        status: 'failed' as const,
        canShoot: false,
        failReason: event.reason ?? getObjectiveFailReason(state),
        visualFeedback: {
          ...state.visualFeedback,
          stageEffectMs: gameDefaults.failStageEffectMs,
          stageEffectTone: 'danger',
        },
      });
    case 'RESET':
      return createGameSession(event.level);
    case 'SHOOT':
      if (
        !state.canShoot ||
        state.projectile.isActive ||
        state.shotsFired >= state.objective.maxShots
      ) {
        return state;
      }

      return {
        ...state,
        canShoot: false,
        shotsFired: state.shotsFired + 1,
        projectile: createProjectileFromLauncher(state),
      };
    case 'TICK': {
      if (state.status !== 'playing') {
        return state;
      }

      const deltaSeconds = event.deltaMs / 1000;
      const visualFeedback = decayVisualFeedback(state, event.deltaMs);
      const nextLauncher = updateHorizontalLauncher(state, deltaSeconds);
      const nextTarget = updateHorizontalTarget(state.target, deltaSeconds);
      const nextProjectile = updateProjectile(state.projectile, deltaSeconds);
      const expiredFeedback =
        state.feedback.until !== null && event.nowMs >= state.feedback.until;
      const obstacleHit = detectProjectileObstacleHit(
        nextProjectile.projectile,
        state.obstacles,
      );

      if (obstacleHit) {
        return withObjectiveProgress({
          ...state,
          misses: state.misses + 1,
          failReason: null,
          launcher: nextLauncher,
          target: nextTarget,
          projectile: {
            ...nextProjectile.projectile,
            isActive: false,
          },
          canShoot: true,
          visualFeedback: {
            ...visualFeedback,
            obstacleFlashMs: gameDefaults.obstacleFlashMs,
            obstacleFlashId: obstacleHit.id,
          },
          feedback: {
            message: 'Blocked',
            type: 'blocked',
            until: event.nowMs + gameDefaults.feedbackDurationMs,
          },
        });
      }

      const hitResult = detectProjectileHit(nextProjectile.projectile, nextTarget);

      if (hitResult) {
        const score = calculateHitScore(hitResult.quality);

        return withObjectiveProgress({
          ...state,
          score: state.score + score,
          hits: state.hits + 1,
          perfectHits: state.perfectHits + (hitResult.quality === 'perfect' ? 1 : 0),
          failReason: null,
          launcher: nextLauncher,
          target: nextTarget,
          projectile: {
            ...state.projectile,
            isActive: false,
            y: state.projectile.y,
          },
          canShoot: true,
          visualFeedback: {
            ...visualFeedback,
            targetFlashMs:
              hitResult.quality === 'perfect'
                ? gameDefaults.targetFlashPerfectMs
                : gameDefaults.targetFlashGoodMs,
            targetFlashTone: hitResult.quality === 'perfect' ? 'perfect' : 'good',
            stageEffectMs:
              hitResult.quality === 'perfect'
                ? gameDefaults.perfectStageEffectMs
                : visualFeedback.stageEffectMs,
            stageEffectTone:
              hitResult.quality === 'perfect'
                ? 'perfect'
                : visualFeedback.stageEffectTone,
          },
          feedback: {
            message: hitResult.message,
            type: hitResult.quality,
            until: event.nowMs + gameDefaults.feedbackDurationMs,
          },
        });
      }

      if (nextProjectile.missed) {
        return withObjectiveProgress({
          ...state,
          misses: state.misses + 1,
          failReason: null,
          launcher: nextLauncher,
          target: nextTarget,
          projectile: nextProjectile.projectile,
          canShoot: true,
          visualFeedback,
          feedback: {
            message: 'Miss',
            type: 'miss',
            until: event.nowMs + gameDefaults.feedbackDurationMs,
          },
        });
      }

      return withObjectiveProgress({
        ...state,
        launcher: nextLauncher,
        target: nextTarget,
        obstacles: state.obstacles,
        projectile: nextProjectile.projectile,
        canShoot: nextProjectile.canShoot,
        visualFeedback,
        feedback: expiredFeedback
          ? {
              message: null,
              type: null,
              until: null,
            }
          : state.feedback,
      });
    }
    case 'CLEAR_FEEDBACK':
      return withObjectiveProgress({
        ...state,
        feedback: {
          message: null,
          type: null,
          until: null,
        },
      });
    default:
      return state;
  }
}

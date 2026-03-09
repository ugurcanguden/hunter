import {
  FailReason,
  GameSessionState,
  ObjectiveProgressState,
} from '@centerhit-game/types/gameTypes';

export function evaluateObjectiveProgress(
  session: GameSessionState,
): ObjectiveProgressState {
  return {
    hits: session.hits,
    requiredHits: session.objective.requiredHits,
    perfectHits: session.perfectHits,
    requiredPerfectHits: session.objective.requiredPerfectHits,
    misses: session.misses,
    maxMissAllowed: session.objective.maxMissAllowed,
    remainingMisses: Math.max(session.objective.maxMissAllowed - session.misses, 0),
    shotsFired: session.shotsFired,
    maxShots: session.objective.maxShots,
    remainingShots: Math.max(session.objective.maxShots - session.shotsFired, 0),
  };
}

export function isObjectiveCompleted(session: GameSessionState) {
  return (
    session.hits >= session.objective.requiredHits &&
    session.perfectHits >= session.objective.requiredPerfectHits
  );
}

export function isObjectiveFailed(session: GameSessionState) {
  if (session.misses >= session.objective.maxMissAllowed) {
    return true;
  }

  return (
    session.shotsFired >= session.objective.maxShots &&
    !isObjectiveCompleted(session)
  );
}

export function getObjectiveFailReason(session: GameSessionState): FailReason {
  if (session.misses >= session.objective.maxMissAllowed) {
    return 'miss-limit';
  }

  if (
    session.shotsFired >= session.objective.maxShots &&
    !isObjectiveCompleted(session)
  ) {
    return 'shot-limit';
  }

  return null;
}

export function buildObjectiveSummary(session: GameSessionState) {
  const progress = evaluateObjectiveProgress(session);

  return {
    hits: `${progress.hits} / ${progress.requiredHits}`,
    perfectHits: `${progress.perfectHits} / ${progress.requiredPerfectHits}`,
    mistakes: `${progress.remainingMisses} / ${progress.maxMissAllowed}`,
    shots: `${progress.remainingShots} / ${progress.maxShots}`,
  };
}

import { useEffect, useMemo, useReducer, useRef } from 'react';

import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { createGameSession } from '@centerhit-game/engine/createGameSession';
import { gameSessionReducer } from '@centerhit-game/engine/gameSessionReducer';
import {
  getObjectiveFailReason,
  isObjectiveCompleted,
  isObjectiveFailed,
} from '@centerhit-game/systems/objectiveSystem';
import { deriveStarsFromPerformance } from '@centerhit-game/systems/scoringSystem';

export function useGameSession(level: LevelDefinition) {
  const initialState = useMemo(() => createGameSession(level), [level]);
  const [session, dispatch] = useReducer(gameSessionReducer, initialState);
  const frameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    dispatch({ type: 'RESET', level });
    dispatch({ type: 'START' });
  }, [level]);

  useEffect(() => {
    if (session.status !== 'playing') {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTickRef.current = null;
      return;
    }

    const loop = (time: number) => {
      const lastTick = lastTickRef.current ?? time;
      const deltaMs = Math.min(time - lastTick, 32);
      lastTickRef.current = time;
      dispatch({ type: 'TICK', deltaMs, nowMs: time });
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTickRef.current = null;
    };
  }, [session.status]);

  useEffect(() => {
    if (session.status !== 'playing') {
      return;
    }

    if (isObjectiveCompleted(session)) {
      dispatch({
        type: 'COMPLETE',
        stars: deriveStarsFromPerformance(level, session.score),
      });
      return;
    }

    if (isObjectiveFailed(session)) {
      dispatch({ type: 'FAIL', reason: getObjectiveFailReason(session) });
    }
  }, [level, session]);

  return {
    session,
    status: session.status,
    start: () => dispatch({ type: 'START' }),
    pause: () => dispatch({ type: 'PAUSE' }),
    resume: () => dispatch({ type: 'RESUME' }),
    retry: () => {
      dispatch({ type: 'RESET', level });
      dispatch({ type: 'START' });
    },
    shoot: () => dispatch({ type: 'SHOOT' }),
    complete: () =>
      dispatch({
        type: 'COMPLETE',
        stars: deriveStarsFromPerformance(level, session.score),
      }),
    fail: () => dispatch({ type: 'FAIL', reason: getObjectiveFailReason(session) }),
  };
}

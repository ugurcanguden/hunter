import { useEffect, useRef } from 'react';

import { gameFeedbackService } from '@centerhit-game/services/gameFeedbackService';
import { GameSessionState } from '@centerhit-game/types/gameTypes';

export function useGameFeedbackEffects(session: GameSessionState) {
  const previousShotsRef = useRef(session.shotsFired);
  const previousStatusRef = useRef(session.status);
  const previousFeedbackUntilRef = useRef(session.feedback.until);

  useEffect(() => {
    if (session.shotsFired > previousShotsRef.current) {
      gameFeedbackService.playShoot();
    }

    previousShotsRef.current = session.shotsFired;
  }, [session.shotsFired]);

  useEffect(() => {
    if (
      session.feedback.until !== null &&
      session.feedback.until !== previousFeedbackUntilRef.current
    ) {
      switch (session.feedback.type) {
        case 'good':
          gameFeedbackService.playGoodHit();
          break;
        case 'perfect':
          gameFeedbackService.playPerfectHit();
          break;
        case 'miss':
          gameFeedbackService.playMiss();
          break;
        case 'blocked':
          gameFeedbackService.playBlocked();
          break;
        default:
          break;
      }
    }

    previousFeedbackUntilRef.current = session.feedback.until;
  }, [session.feedback.type, session.feedback.until]);

  useEffect(() => {
    if (session.status !== previousStatusRef.current) {
      if (session.status === 'completed') {
        gameFeedbackService.playLevelComplete();
      }

      if (session.status === 'failed') {
        gameFeedbackService.playLevelFail();
      }
    }

    previousStatusRef.current = session.status;
  }, [session.status]);
}

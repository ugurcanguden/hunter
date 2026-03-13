import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { gameFeedbackService } from '@centerhit-game/services/gameFeedbackService';

export function useMenuBackgroundMusic() {
  useFocusEffect(
    useCallback(() => {
      gameFeedbackService.setBackgroundMusicAllowed(true);
      gameFeedbackService.syncMusicPreference();
    }, []),
  );
}

import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

import { gameFeedbackService } from '@centerhit-game/services/gameFeedbackService';

export function useGameplayBackgroundMusicBlock() {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    gameFeedbackService.setBackgroundMusicAllowed(false);
    gameFeedbackService.stopBackgroundMusic();
  }, [isFocused]);
}

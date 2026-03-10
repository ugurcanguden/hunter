import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';
import { gameFeedbackService } from '@centerhit-game/services/gameFeedbackService';

export function useBackgroundMusicEffects() {
  useEffect(() => {
    const applyMusicPreference = (musicEnabled: boolean) => {
      if (musicEnabled) {
        gameFeedbackService.resumeBackgroundMusic();
        return;
      }

      gameFeedbackService.stopBackgroundMusic();
    };

    applyMusicPreference(useSettingsStore.getState().settings.musicEnabled);

    const unsubscribe = useSettingsStore.subscribe(state => {
      applyMusicPreference(state.settings.musicEnabled);
    });

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        gameFeedbackService.syncMusicPreference();
        return;
      }

      gameFeedbackService.pauseBackgroundMusic();
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribe();
      appStateSubscription.remove();
      gameFeedbackService.pauseBackgroundMusic();
    };
  }, []);
}

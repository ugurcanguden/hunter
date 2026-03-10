import { useCallback } from 'react';

import { getInterstitialDecision } from '@centerhit-features/ads/config/adPolicy';
import { interstitialService } from '@centerhit-features/ads/services/interstitialService';
import { useAdsStore } from '@centerhit-features/ads/store/useAdsStore';

export function useLevelCompleteInterstitial() {
  const completedLevelsSinceLastInterstitial = useAdsStore(
    state => state.completedLevelsSinceLastInterstitial,
  );
  const interstitialLoaded = useAdsStore(state => state.interstitialLoaded);

  return useCallback(
    async (onContinue: () => void) => {
      const decision = getInterstitialDecision(
        completedLevelsSinceLastInterstitial,
        interstitialLoaded,
      );

      if (!decision.shouldShow) {
        onContinue();
        if (decision.reason === 'due_but_not_loaded') {
          interstitialService.loadInterstitial();
        }
        return;
      }

      await interstitialService.showInterstitial(onContinue);
    },
    [completedLevelsSinceLastInterstitial, interstitialLoaded],
  );
}


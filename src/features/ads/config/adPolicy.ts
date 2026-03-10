import { InterstitialDecision } from '@centerhit-features/ads/types/adTypes';

export const INTERSTITIAL_COMPLETE_INTERVAL = 3;
export const BANNER_ENABLED_ROUTES = ['Home', 'Levels', 'Pack'] as const;

export function getInterstitialDecision(
  completedLevelsSinceLastInterstitial: number,
  interstitialLoaded: boolean,
): InterstitialDecision {
  const due =
    completedLevelsSinceLastInterstitial > 0 &&
    completedLevelsSinceLastInterstitial % INTERSTITIAL_COMPLETE_INTERVAL === 0;

  if (!due) {
    return {
      shouldShow: false,
      reason: 'not_due',
    };
  }

  if (!interstitialLoaded) {
    return {
      shouldShow: false,
      reason: 'due_but_not_loaded',
    };
  }

  return {
    shouldShow: true,
    reason: 'due_and_loaded',
  };
}


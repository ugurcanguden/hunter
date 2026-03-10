import { create } from 'zustand';

type AdsStore = {
  isInitialized: boolean;
  interstitialLoaded: boolean;
  completedLevelsSinceLastInterstitial: number;
  initializeAds: () => void;
  markLevelCompleted: () => void;
  markInterstitialShown: () => void;
  setInterstitialLoaded: (loaded: boolean) => void;
  resetInterstitialCounter: () => void;
};

export const useAdsStore = create<AdsStore>(set => ({
  isInitialized: false,
  interstitialLoaded: false,
  completedLevelsSinceLastInterstitial: 0,

  initializeAds() {
    set({ isInitialized: true });
  },

  markLevelCompleted() {
    set(state => ({
      completedLevelsSinceLastInterstitial:
        state.completedLevelsSinceLastInterstitial + 1,
    }));
  },

  markInterstitialShown() {
    set({
      completedLevelsSinceLastInterstitial: 0,
      interstitialLoaded: false,
    });
  },

  setInterstitialLoaded(loaded) {
    set({ interstitialLoaded: loaded });
  },

  resetInterstitialCounter() {
    set({ completedLevelsSinceLastInterstitial: 0 });
  },
}));


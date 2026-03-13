import {
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';

import { getAdUnitId } from '@centerhit-features/ads/config/adUnits';
import { useAdsStore } from '@centerhit-features/ads/store/useAdsStore';

type Unsubscribe = () => void;

let interstitial: InterstitialAd | null = null;
let unsubscribeLoad: Unsubscribe | null = null;
let unsubscribeError: Unsubscribe | null = null;

function cleanupPersistentListeners() {
  unsubscribeLoad?.();
  unsubscribeError?.();
  unsubscribeLoad = null;
  unsubscribeError = null;
}

function attachPersistentListeners(instance: InterstitialAd) {
  cleanupPersistentListeners();
  unsubscribeLoad = instance.addAdEventListener(AdEventType.LOADED, () => {
    useAdsStore.getState().setInterstitialLoaded(true);
  });
  unsubscribeError = instance.addAdEventListener(AdEventType.ERROR, error => {
    if (__DEV__) {
      console.warn('[ads] interstitial load error', error);
    }
    useAdsStore.getState().setInterstitialLoaded(false);
  });
}

function ensureInterstitial(): InterstitialAd | null {
  if (interstitial) {
    return interstitial;
  }

  const unitId = getAdUnitId('level_complete_interstitial');
  if (!unitId) {
    if (__DEV__) {
      console.warn('[ads] missing interstitial unit id');
    }
    return null;
  }

  const instance = InterstitialAd.createForAdRequest(unitId);
  interstitial = instance;
  attachPersistentListeners(instance);
  return instance;
}

export const interstitialService = {
  initializeInterstitial() {
    ensureInterstitial();
  },

  loadInterstitial() {
    const instance = ensureInterstitial();
    if (!instance) {
      return;
    }

    useAdsStore.getState().setInterstitialLoaded(false);
    try {
      instance.load();
    } catch (error) {
      if (__DEV__) {
        console.warn('[ads] interstitial load failed', error);
      }
    }
  },

  isInterstitialLoaded() {
    return useAdsStore.getState().interstitialLoaded;
  },

  async showInterstitial(onFinished: () => void): Promise<void> {
    const instance = ensureInterstitial();
    if (!instance || !useAdsStore.getState().interstitialLoaded) {
      onFinished();
      this.loadInterstitial();
      return;
    }

    let settled = false;
    let unsubscribeClosed: Unsubscribe | null = null;
    let unsubscribeShowError: Unsubscribe | null = null;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      unsubscribeClosed?.();
      unsubscribeShowError?.();
      useAdsStore.getState().markInterstitialShown();
      onFinished();
      this.loadInterstitial();
    };

    unsubscribeClosed = instance.addAdEventListener(AdEventType.CLOSED, finish);
    unsubscribeShowError = instance.addAdEventListener(AdEventType.ERROR, error => {
      if (__DEV__) {
        console.warn('[ads] interstitial show failed', error);
      }
      finish();
    });

    try {
      await instance.show();
    } catch (error) {
      if (__DEV__) {
        console.warn('[ads] interstitial show threw', error);
      }
      finish();
    }
  },

  destroyInterstitial() {
    cleanupPersistentListeners();
    interstitial = null;
    useAdsStore.getState().setInterstitialLoaded(false);
  },
};


import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import { interstitialService } from '@centerhit-features/ads/services/interstitialService';
import { useAdsStore } from '@centerhit-features/ads/store/useAdsStore';

let initialized = false;

export const adsBootstrapService = {
  async initialize() {
    if (initialized) {
      return;
    }

    try {
      await mobileAds().setRequestConfiguration({
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      });
      await mobileAds().initialize();
      useAdsStore.getState().initializeAds();
      interstitialService.initializeInterstitial();
      interstitialService.loadInterstitial();
      initialized = true;
    } catch (error) {
      if (__DEV__) {
        console.warn('[ads] initialize failed', error);
      }
    }
  },
};


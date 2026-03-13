import { Platform } from 'react-native';
import { TestIds } from 'react-native-google-mobile-ads';

import { AdPlacement, AdUnitMap } from '@centerhit-features/ads/types/adTypes';

const IOS_APP_ID = 'ca-app-pub-9339461513261360~3410288316';
const ANDROID_APP_ID = 'ca-app-pub-9339461513261360~9653538122';

const PRODUCTION_UNITS: AdUnitMap = {
  home_banner: {
    ios: 'ca-app-pub-9339461513261360/1905634953',
    android: 'ca-app-pub-9339461513261360/7459663200',
  },
  campaign_banner: {
    ios: 'ca-app-pub-9339461513261360/8040778403',
    android: 'ca-app-pub-9339461513261360/3735073012',
  },
  level_complete_interstitial: {
    ios: 'ca-app-pub-9339461513261360/7633079718',
    android: 'ca-app-pub-9339461513261360/4402255026',
  },
};

const TEST_UNITS: AdUnitMap = {
  home_banner: {
    ios: TestIds.ADAPTIVE_BANNER,
    android: TestIds.ADAPTIVE_BANNER,
  },
  campaign_banner: {
    ios: TestIds.ADAPTIVE_BANNER,
    android: TestIds.ADAPTIVE_BANNER,
  },
  level_complete_interstitial: {
    ios: TestIds.INTERSTITIAL,
    android: TestIds.INTERSTITIAL,
  },
};

const RUNTIME_UNITS = __DEV__ ? TEST_UNITS : PRODUCTION_UNITS;

export const adRuntimeConfig = {
  appIds: {
    ios: IOS_APP_ID,
    android: ANDROID_APP_ID,
  },
  units: RUNTIME_UNITS,
} as const;

export function getAdUnitId(placement: AdPlacement): string | null {
  const unitConfig = adRuntimeConfig.units[placement];
  const unitId = Platform.select({
    ios: unitConfig.ios,
    android: unitConfig.android,
    default: '',
  });

  return unitId && unitId.length > 0 ? unitId : null;
}

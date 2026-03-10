import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

import { useBannerLifecycle } from '@centerhit-features/ads/hooks/useBannerLifecycle';
import { getAdUnitId } from '@centerhit-features/ads/config/adUnits';
import { AdPlacement } from '@centerhit-features/ads/types/adTypes';

type AppBannerAdProps = {
  placement: Extract<AdPlacement, 'home_banner' | 'campaign_banner'>;
};

export function AppBannerAd({ placement }: AppBannerAdProps) {
  const refreshKey = useBannerLifecycle();
  const unitId = getAdUnitId(placement);

  if (!unitId) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <BannerAd
        key={`${placement}-${refreshKey}`}
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={error => {
          console.warn(`[ads] banner failed (${placement})`, error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginTop: 18,
    minHeight: 60,
  },
});

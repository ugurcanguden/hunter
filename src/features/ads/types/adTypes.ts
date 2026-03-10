export type AdPlacement =
  | 'home_banner'
  | 'campaign_banner'
  | 'level_complete_interstitial';

export type PlatformAdUnitConfig = {
  ios: string;
  android: string;
};

export type AdUnitMap = Record<AdPlacement, PlatformAdUnitConfig>;

export type InterstitialDecision = {
  shouldShow: boolean;
  reason: 'not_due' | 'due_but_not_loaded' | 'due_and_loaded';
};


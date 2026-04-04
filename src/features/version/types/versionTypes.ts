export type AppLanguageCopy = {
  title?: string;
  description?: string;
  button?: string;
};

export type MobileConfigParameter = {
  key: string;
  type: string;
  valueText: string;
  valueNumber: number;
  valueBool: boolean;
  valueJson: unknown;
};

export type MobileVersionConfig = {
  androidMinVersion?: string;
  androidStoreUrl?: string;
  androidForceUpdateMessage?: unknown;
  iosMinVersion?: string;
  iosStoreUrl?: string;
  iosForceUpdateMessage?: unknown;
};

export type VersionCheckResult = {
  isUpdateRequired: boolean;
  currentVersionName: string;
  currentBuildNumber: number;
  latestVersionName?: string;
  storeUrl?: string;
  title: string;
  message: string;
  buttonLabel?: string;
};

export type AppVersionRule = {
  key: string;
  isPublished: boolean;
  iosMinBuildNumber: number;
  iosLatestVersionName?: string;
  iosStoreUrl?: string;
  androidMinVersionCode: number;
  androidLatestVersionName?: string;
  androidStoreUrl?: string;
  updateTitleEn?: string;
  updateMessageEn?: string;
  updateTitleTr?: string;
  updateMessageTr?: string;
};

export type VersionCheckResult = {
  isUpdateRequired: boolean;
  currentVersionName: string;
  currentBuildNumber: number;
  latestVersionName?: string;
  storeUrl?: string;
  title: string;
  message: string;
};

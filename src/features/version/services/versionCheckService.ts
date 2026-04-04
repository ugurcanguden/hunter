import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { translations } from '@centerhit-core/i18n/translations';
import { AppLanguage } from '@centerhit-features/settings/types/settingsTypes';
import { remoteVersionService } from '@centerhit-features/version/services/remoteVersionService';
import { VersionCheckResult } from '@centerhit-features/version/types/versionTypes';

function parseBuildNumber(value: string) {
  const normalized = Number.parseInt(value, 10);
  return Number.isFinite(normalized) ? normalized : 0;
}

function pickLocalizedCopy(
  language: AppLanguage,
  rule: Awaited<ReturnType<typeof remoteVersionService.fetchActiveVersionRule>>,
  fallbackTitle: string,
  fallbackMessage: string,
) {
  if (!rule) {
    return {
      title: fallbackTitle,
      message: fallbackMessage,
    };
  }

  if (language === 'tr') {
    return {
      title: rule.updateTitleTr || fallbackTitle,
      message: rule.updateMessageTr || fallbackMessage,
    };
  }

  return {
    title: rule.updateTitleEn || fallbackTitle,
    message: rule.updateMessageEn || fallbackMessage,
  };
}

export const versionCheckService = {
  async checkForRequiredUpdate(language: AppLanguage): Promise<VersionCheckResult | null> {
    const rule = await remoteVersionService.fetchActiveVersionRule();
    if (!rule) {
      return null;
    }

    const localeCopy = translations[language].update;
    const currentVersionName = DeviceInfo.getVersion();
    const currentBuildNumber = parseBuildNumber(DeviceInfo.getBuildNumber());
    const isAndroid = Platform.OS === 'android';
    const minimumBuild = isAndroid ? rule.androidMinVersionCode : rule.iosMinBuildNumber;
    const latestVersionName = isAndroid
      ? rule.androidLatestVersionName
      : rule.iosLatestVersionName;
    const storeUrl = isAndroid ? rule.androidStoreUrl : rule.iosStoreUrl;
    const isUpdateRequired = currentBuildNumber < minimumBuild;
    const copy = pickLocalizedCopy(
      language,
      rule,
      localeCopy.requiredTitle,
      localeCopy.requiredMessage,
    );

    return {
      isUpdateRequired,
      currentVersionName,
      currentBuildNumber,
      latestVersionName,
      storeUrl,
      title: copy.title,
      message: copy.message,
    };
  },
};

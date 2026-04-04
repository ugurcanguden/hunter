import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { translations } from '@centerhit-core/i18n/translations';
import { AppLanguage } from '@centerhit-features/settings/types/settingsTypes';
import { remoteVersionService } from '@centerhit-features/version/services/remoteVersionService';
import {
  AppLanguageCopy,
  MobileVersionConfig,
  VersionCheckResult,
} from '@centerhit-features/version/types/versionTypes';

function parseBuildNumber(value: string) {
  const normalized = Number.parseInt(value, 10);
  return Number.isFinite(normalized) ? normalized : 0;
}

function parseVersionParts(version: string) {
  return version
    .split('.')
    .map(part => Number.parseInt(part, 10))
    .map(part => (Number.isFinite(part) ? part : 0));
}

function compareVersions(left: string, right: string) {
  const leftParts = parseVersionParts(left);
  const rightParts = parseVersionParts(right);
  const maxLength = Math.max(leftParts.length, rightParts.length);

  for (let index = 0; index < maxLength; index += 1) {
    const leftPart = leftParts[index] ?? 0;
    const rightPart = rightParts[index] ?? 0;

    if (leftPart > rightPart) {
      return 1;
    }

    if (leftPart < rightPart) {
      return -1;
    }
  }

  return 0;
}

function asLocalizedCopy(value: unknown, language: AppLanguage): AppLanguageCopy | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const entry = (value as Record<string, unknown>)[language];

  if (typeof entry === 'string') {
    return {
      description: entry,
    };
  }

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null;
  }

  const objectEntry = entry as Record<string, unknown>;

  return {
    title: typeof objectEntry.title === 'string' ? objectEntry.title : undefined,
    description:
      typeof objectEntry.description === 'string' ? objectEntry.description : undefined,
    button: typeof objectEntry.button === 'string' ? objectEntry.button : undefined,
  };
}

function buildVersionResult(
  config: MobileVersionConfig,
  language: AppLanguage,
): VersionCheckResult | null {
  const localeCopy = translations[language].update;
  const currentVersionName = DeviceInfo.getVersion();
  const currentBuildNumber = parseBuildNumber(DeviceInfo.getBuildNumber());
  const isAndroid = Platform.OS === 'android';
  const minimumVersion = isAndroid ? config.androidMinVersion : config.iosMinVersion;
  const storeUrl = isAndroid ? config.androidStoreUrl : config.iosStoreUrl;
  const localizedContent = asLocalizedCopy(
    isAndroid ? config.androidForceUpdateMessage : config.iosForceUpdateMessage,
    language,
  );

  if (!minimumVersion) {
    return null;
  }

  return {
    isUpdateRequired: compareVersions(currentVersionName, minimumVersion) < 0,
    currentVersionName,
    currentBuildNumber,
    latestVersionName: minimumVersion,
    storeUrl,
    title: localizedContent?.title || localeCopy.requiredTitle,
    message: localizedContent?.description || localeCopy.requiredMessage,
    buttonLabel: localizedContent?.button || localeCopy.updateNow,
  };
}

export const versionCheckService = {
  async checkForRequiredUpdate(language: AppLanguage): Promise<VersionCheckResult | null> {
    const config = await remoteVersionService.fetchMobileVersionConfig();
    if (!config) {
      return null;
    }

    return buildVersionResult(config, language);
  },
};

import { POCKETBASE_COLLECTIONS, POCKETBASE_URL } from '@centerhit-core/constants/remote';
import { AppVersionRule } from '@centerhit-features/version/types/versionTypes';

function buildUrl(collection: string, query: string) {
  return `${POCKETBASE_URL}/api/collections/${collection}/records${query}`;
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function mapVersionRule(input: Record<string, unknown>): AppVersionRule {
  return {
    key: asString(input.key),
    isPublished: asBoolean(input.isPublished),
    iosMinBuildNumber: asNumber(input.iosMinBuildNumber),
    iosLatestVersionName: asString(input.iosLatestVersionName) || undefined,
    iosStoreUrl: asString(input.iosStoreUrl) || undefined,
    androidMinVersionCode: asNumber(input.androidMinVersionCode),
    androidLatestVersionName: asString(input.androidLatestVersionName) || undefined,
    androidStoreUrl: asString(input.androidStoreUrl) || undefined,
    updateTitleEn: asString(input.updateTitleEn) || undefined,
    updateMessageEn: asString(input.updateMessageEn) || undefined,
    updateTitleTr: asString(input.updateTitleTr) || undefined,
    updateMessageTr: asString(input.updateMessageTr) || undefined,
  };
}

export const remoteVersionService = {
  async fetchActiveVersionRule(): Promise<AppVersionRule | null> {
    if (!POCKETBASE_URL) {
      return null;
    }

    try {
      const response = await fetch(
        buildUrl(
          POCKETBASE_COLLECTIONS.versionRules,
          '?filter=isPublished%3Dtrue%20%26%26%20key%3D%22mobile%22&sort=-updated&perPage=1',
        ),
      );

      if (!response.ok) {
        throw new Error(`Version rule request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { items?: Record<string, unknown>[] };
      const record = payload.items?.[0];

      if (!record) {
        return null;
      }

      return mapVersionRule(record);
    } catch (error) {
      if (__DEV__) {
        console.warn('[version] fetchActiveVersionRule failed', error);
      }
      return null;
    }
  },
};

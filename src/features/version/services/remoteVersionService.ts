import { POCKETBASE_URL } from '@centerhit-core/constants/remote';
import {
  MobileConfigParameter,
  MobileVersionConfig,
} from '@centerhit-features/version/types/versionTypes';

const MOBILE_CONFIG_GROUP_CODE = 'Mobile Config';

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

function mapParameter(input: Record<string, unknown>): MobileConfigParameter {
  return {
    key: asString(input.key),
    type: asString(input.type),
    valueText: asString(input.valueText),
    valueNumber: asNumber(input.valueNumber),
    valueBool: asBoolean(input.valueBool),
    valueJson: input.valueJson,
  };
}

function mapVersionConfig(parameters: MobileConfigParameter[]): MobileVersionConfig {
  const entries = new Map(parameters.map(parameter => [parameter.key, parameter]));

  return {
    androidMinVersion: entries.get('android_min_version')?.valueText || undefined,
    androidStoreUrl: entries.get('android_store_url')?.valueText || undefined,
    androidForceUpdateMessage: entries.get('android_force_update_message')?.valueJson,
    iosMinVersion: entries.get('ios_min_version')?.valueText || undefined,
    iosStoreUrl: entries.get('ios_store_url')?.valueText || undefined,
    iosForceUpdateMessage: entries.get('ios_force_update_message')?.valueJson,
  };
}

async function fetchMobileConfigGroupId() {
  const filter = encodeURIComponent(`(code="${MOBILE_CONFIG_GROUP_CODE}" && isActive=true)`);
  const response = await fetch(
    buildUrl('parameter_groups', `?filter=${filter}&perPage=1`),
  );

  if (!response.ok) {
    throw new Error(`Mobile config group request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { items?: Array<{ id?: string }> };
  return payload.items?.[0]?.id || null;
}

export const remoteVersionService = {
  async fetchMobileVersionConfig(): Promise<MobileVersionConfig | null> {
    if (!POCKETBASE_URL) {
      return null;
    }

    try {
      const groupId = await fetchMobileConfigGroupId();
      if (!groupId) {
        return null;
      }

      const filter = encodeURIComponent(`(group.id='${groupId}' && isActive=true)`);

      const response = await fetch(
        buildUrl('parameters', `?filter=${filter}&perPage=100`),
      );

      if (!response.ok) {
        throw new Error(`Mobile config parameters request failed: ${response.status}`);
      }

      const payload = (await response.json()) as { items?: Record<string, unknown>[] };
      const items = payload.items ?? [];
      return mapVersionConfig(items.map(mapParameter));
    } catch (error) {
      if (__DEV__) {
        console.warn('[version] fetchMobileVersionConfig failed', error);
      }
      return null;
    }
  },
};

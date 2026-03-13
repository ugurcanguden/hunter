import { STORAGE_KEYS } from '@centerhit-core/constants/storageKeys';
import { storageClient } from '@centerhit-core/storage/storageClient';
import {
  SettingsState,
  UpdateSettingsInput,
} from '@centerhit-features/settings/types/settingsTypes';

export const defaultSettings: SettingsState = {
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  language: 'en',
  hasSeenDiscover: false,
  hasSeenGameplayDiscover: false,
};

export const settingsService = {
  async getSettings(): Promise<SettingsState> {
    const stored = await storageClient.getItem<SettingsState>(STORAGE_KEYS.settings);

    if (!stored) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...stored,
    };
  },

  async saveSettings(settings: SettingsState) {
    await storageClient.setItem(STORAGE_KEYS.settings, settings);
  },

  async updateSettings(patch: UpdateSettingsInput): Promise<SettingsState> {
    const current = await this.getSettings();
    const next = { ...current, ...patch };
    await this.saveSettings(next);

    return next;
  },

  async resetSettings(): Promise<SettingsState> {
    await this.saveSettings(defaultSettings);

    return defaultSettings;
  },
};

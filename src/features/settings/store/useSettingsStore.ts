import { create } from 'zustand';

import {
  defaultSettings,
  settingsService,
} from '@centerhit-features/settings/services/settingsService';
import {
  AppLanguage,
  SettingsState,
} from '@centerhit-features/settings/types/settingsTypes';

type SettingsStore = {
  settings: SettingsState;
  isLoaded: boolean;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  toggleSound: () => Promise<void>;
  toggleMusic: () => Promise<void>;
  toggleVibration: () => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setLastActiveAt: (timestamp: string) => Promise<void>;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setHasSeenDiscover: (seen: boolean) => Promise<void>;
  setHasSeenGameplayDiscover: (seen: boolean) => Promise<void>;
  setDiscoverFlags: (flags: {
    hasSeenDiscover: boolean;
    hasSeenGameplayDiscover: boolean;
  }) => Promise<void>;
  resetSettings: () => Promise<void>;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: defaultSettings,
  isLoaded: false,
  isLoading: false,

  async loadSettings() {
    if (get().isLoading) {
      return;
    }

    set({ isLoading: true });
    const settings = await settingsService.getSettings();
    set({ settings, isLoaded: true, isLoading: false });
  },

  async toggleSound() {
    const settings = await settingsService.updateSettings({
      soundEnabled: !get().settings.soundEnabled,
    });
    set({ settings });
  },

  async toggleMusic() {
    const settings = await settingsService.updateSettings({
      musicEnabled: !get().settings.musicEnabled,
    });
    set({ settings });
  },

  async toggleVibration() {
    const settings = await settingsService.updateSettings({
      vibrationEnabled: !get().settings.vibrationEnabled,
    });
    set({ settings });
  },

  async setNotificationsEnabled(enabled) {
    const settings = await settingsService.updateSettings({
      notificationsEnabled: enabled,
    });
    set({ settings });
  },

  async setLastActiveAt(timestamp) {
    const settings = await settingsService.updateSettings({
      lastActiveAt: timestamp,
    });
    set({ settings });
  },

  async setLanguage(language) {
    const settings = await settingsService.updateSettings({ language });
    set({ settings });
  },

  async setHasSeenDiscover(seen) {
    const settings = await settingsService.updateSettings({ hasSeenDiscover: seen });
    set({ settings });
  },

  async setHasSeenGameplayDiscover(seen) {
    const settings = await settingsService.updateSettings({ hasSeenGameplayDiscover: seen });
    set({ settings });
  },

  async setDiscoverFlags(flags) {
    const settings = await settingsService.updateSettings(flags);
    set({ settings });
  },

  async resetSettings() {
    const settings = await settingsService.resetSettings();
    set({ settings });
  },
}));

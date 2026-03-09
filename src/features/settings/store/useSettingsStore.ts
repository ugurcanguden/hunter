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
  setLanguage: (language: AppLanguage) => Promise<void>;
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

  async setLanguage(language) {
    const settings = await settingsService.updateSettings({ language });
    set({ settings });
  },

  async resetSettings() {
    const settings = await settingsService.resetSettings();
    set({ settings });
  },
}));

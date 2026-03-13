export type AppLanguage = 'en' | 'tr';

export type SettingsState = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  language: AppLanguage;
  hasSeenDiscover: boolean;
  hasSeenGameplayDiscover: boolean;
};

export type UpdateSettingsInput = Partial<SettingsState>;

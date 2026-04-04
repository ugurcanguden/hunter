export type AppLanguage = 'en' | 'tr';

export type SettingsState = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  lastActiveAt: string | null;
  language: AppLanguage;
  hasSeenDiscover: boolean;
  hasSeenGameplayDiscover: boolean;
};

export type UpdateSettingsInput = Partial<SettingsState>;

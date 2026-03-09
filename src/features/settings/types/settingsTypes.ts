export type AppLanguage = 'en' | 'tr';

export type SettingsState = {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  language: AppLanguage;
};

export type UpdateSettingsInput = Partial<SettingsState>;

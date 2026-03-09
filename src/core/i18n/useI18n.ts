import { translations } from '@centerhit-core/i18n/translations';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

export function useI18n() {
  const language = useSettingsStore(state => state.settings.language);
  const dictionary = translations[language];

  return {
    language,
    t: dictionary,
  };
}

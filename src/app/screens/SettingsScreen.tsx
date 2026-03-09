import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

function SettingsRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <CoreText variant="bodyStrong">{label}</CoreText>
      <CoreButton
        label={value ? t.common.on : t.common.off}
        onPress={onToggle}
        variant="control"
        compact
        style={[
          styles.toggleButton,
          value ? styles.toggleActive : styles.toggleIdle,
        ]}
      />
    </View>
  );
}

export function SettingsScreen({ navigation }: ScreenProps<'Settings'>) {
  const { t } = useI18n();
  const settings = useSettingsStore(state => state.settings);
  const toggleSound = useSettingsStore(state => state.toggleSound);
  const toggleMusic = useSettingsStore(state => state.toggleMusic);
  const toggleVibration = useSettingsStore(state => state.toggleVibration);
  const setLanguage = useSettingsStore(state => state.setLanguage);
  const resetProgress = useProgressStore(state => state.resetProgress);
  const handleToggleSound = () => {
    toggleSound().catch(() => undefined);
  };
  const handleToggleMusic = () => {
    toggleMusic().catch(() => undefined);
  };
  const handleToggleVibration = () => {
    toggleVibration().catch(() => undefined);
  };
  const handleResetProgress = () => {
    resetProgress().catch(() => undefined);
  };
  const handleToggleLanguage = () => {
    const nextLanguage = settings.language === 'en' ? 'tr' : 'en';
    setLanguage(nextLanguage).catch(() => undefined);
  };

  return (
    <CoreScreen scrollable contentStyle={styles.container}>
      <View style={styles.topBar}>
        <CoreIconButton
          icon="←"
          onPress={() => navigation.navigate(ROUTES.Home)}
          accessibilityLabel={t.common.homeAction}
        />
      </View>

      <CoreText variant="title">{t.settings.title}</CoreText>
      <CoreText variant="body" colorRole="textSecondary" style={styles.sub}>
        {t.settings.subtitle}
      </CoreText>

      <CoreCard variant="soft" style={styles.section}>
        <SettingsRow
          label={t.common.sound}
          value={settings.soundEnabled}
          onToggle={handleToggleSound}
        />
        <SettingsRow
          label={t.common.music}
          value={settings.musicEnabled}
          onToggle={handleToggleMusic}
        />
        <SettingsRow
          label={t.common.vibration}
          value={settings.vibrationEnabled}
          onToggle={handleToggleVibration}
        />
        <View style={styles.languageRow}>
          <View>
            <CoreText variant="bodyStrong">{t.common.language}</CoreText>
            <CoreText variant="caption" colorRole="textSecondary" style={styles.languageHint}>
              {t.settings.languages.en} / {t.settings.languages.tr}
            </CoreText>
          </View>
          <CoreButton
            label={t.settings.languages[settings.language]}
            onPress={handleToggleLanguage}
            variant="control"
            compact
            style={styles.toggleButton}
          />
        </View>
      </CoreCard>

      <CoreCard variant="default" style={styles.section}>
        <CoreText variant="subtitle">{t.settings.progress}</CoreText>
        <CoreText variant="body" colorRole="textSecondary" style={styles.sectionCopy}>
          {t.settings.progressCopy}
        </CoreText>
        <CoreButton
          label={t.settings.resetProgress}
          onPress={() => {
            Alert.alert(t.settings.resetProgressTitle, t.settings.resetProgressMessage, [
              { text: t.settings.cancel, style: 'cancel' },
              {
                text: t.settings.reset,
                style: 'destructive',
                onPress: handleResetProgress,
              },
            ]);
          }}
          variant="danger"
          compact
        />
      </CoreCard>
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  topBar: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sub: {
    marginBottom: 18,
    marginTop: 10,
    maxWidth: 320,
  },
  section: {
    marginBottom: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    minHeight: 50,
  },
  toggleButton: {
    minWidth: 92,
  },
  toggleActive: {
    borderWidth: 1,
  },
  toggleIdle: {
    opacity: 0.92,
  },
  languageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    minHeight: 50,
  },
  languageHint: {
    marginTop: 4,
  },
  sectionCopy: {
    marginBottom: 14,
    marginTop: 8,
  },
});

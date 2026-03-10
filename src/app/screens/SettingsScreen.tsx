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
import { useTheme } from '@centerhit-core/theme/useTheme';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

function SettingsRow({
  icon,
  iconTint,
  iconBackground,
  label,
  hint,
  value,
  onToggle,
}: {
  icon: string;
  iconTint: string;
  iconBackground: string;
  label: string;
  hint?: string;
  value: boolean;
  onToggle: () => void;
}) {
  const { t } = useI18n();

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: iconBackground }]}>
          <CoreText variant="subtitle" style={{ color: iconTint }}>
            {icon}
          </CoreText>
        </View>
        <View style={styles.rowTextWrap}>
          <CoreText variant="bodyStrong">{label}</CoreText>
          {hint ? (
            <CoreText variant="caption" colorRole="textSecondary" style={styles.rowHint}>
              {hint}
            </CoreText>
          ) : null}
        </View>
      </View>
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
  const { theme } = useTheme();
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
      <View pointerEvents="none" style={styles.gridOverlay}>
        {Array.from({ length: 11 }, (_, index) => (
          <View
            key={`v-${index}`}
            style={[
              styles.gridLineVertical,
              { backgroundColor: theme.colors.accentPrimary, left: `${index * 10}%` },
            ]}
          />
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <View
            key={`h-${index}`}
            style={[
              styles.gridLineHorizontal,
              { backgroundColor: theme.colors.accentPrimary, top: index * 48 },
            ]}
          />
        ))}
      </View>

      <View style={styles.headerRow}>
        <CoreIconButton
          icon="←"
          onPress={() => navigation.navigate(ROUTES.Home)}
          accessibilityLabel={t.common.homeAction}
          style={styles.backButton}
        />
        <View style={styles.headerTextWrap}>
          <CoreText
            variant="display"
            style={[styles.title, { textShadowColor: theme.colors.accentPrimary }]}>
            {t.settings.title}
          </CoreText>
        </View>
        <View
          style={[
            styles.headerInfoButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}>
          <CoreText variant="subtitle" colorRole="accentPrimary">
            ⚙
          </CoreText>
        </View>
      </View>

      <CoreCard variant="soft" style={styles.infoCard}>
        <CoreText variant="body" colorRole="textSecondary" style={styles.infoCopy}>
          {t.settings.subtitle}
        </CoreText>
      </CoreCard>

      <CoreCard variant="soft" style={styles.sectionCard}>
        <SettingsRow
          icon="🔊"
          iconTint={theme.colors.accentPrimary}
          iconBackground={theme.colors.stageGlow}
          label={t.common.sound}
          hint={settings.soundEnabled ? undefined : undefined}
          value={settings.soundEnabled}
          onToggle={handleToggleSound}
        />
        <SettingsRow
          icon="♪"
          iconTint={theme.colors.textSecondary}
          iconBackground={theme.colors.surface}
          label={t.common.music}
          value={settings.musicEnabled}
          onToggle={handleToggleMusic}
        />
        <SettingsRow
          icon="📳"
          iconTint={theme.colors.warning}
          iconBackground={'rgba(255, 182, 72, 0.12)'}
          label={t.common.vibration}
          value={settings.vibrationEnabled}
          onToggle={handleToggleVibration}
        />
        <View style={[styles.divider, { backgroundColor: theme.colors.borderSoft }]} />
        <View style={styles.languageRow}>
          <View style={styles.rowLeft}>
            <View style={[styles.rowIcon, { backgroundColor: theme.colors.surface }]}>
              <CoreText variant="subtitle" style={{ color: theme.colors.textSecondary }}>
                ◎
              </CoreText>
            </View>
            <View style={styles.rowTextWrap}>
            <CoreText variant="bodyStrong">{t.common.language}</CoreText>
            <CoreText variant="caption" colorRole="textSecondary" style={styles.languageHint}>
              {t.settings.languages.en} / {t.settings.languages.tr}
            </CoreText>
            </View>
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

      <CoreCard variant="default" style={[styles.sectionCard, styles.dangerCard, styles.dangerCardBorder]}>
        <View style={styles.progressHeader}>
          <View style={[styles.progressIconWrap, styles.progressIconDanger]}>
            <CoreText variant="subtitle" style={{ color: theme.colors.danger }}>
              ⚠
            </CoreText>
          </View>
          <CoreText variant="title">{t.settings.progress}</CoreText>
        </View>
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
          style={styles.resetButton}
        />
      </CoreCard>

      <CoreText variant="caption" colorRole="accentPrimary" style={styles.footerMark}>
        CENTER HIT SYSTEM V1.0.4
      </CoreText>
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 28,
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  gridLineVertical: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  gridLineHorizontal: {
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
    marginTop: 10,
  },
  backButton: {
    height: 52,
    width: 52,
  },
  headerTextWrap: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerInfoButton: {
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 1,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  infoCard: {
    borderRadius: 22,
    marginBottom: 18,
    paddingVertical: 14,
  },
  infoCopy: {
    maxWidth: 360,
  },
  sectionCard: {
    borderRadius: 34,
    marginBottom: 22,
    padding: 20,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 72,
  },
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 16,
    paddingRight: 10,
  },
  rowIcon: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowHint: {
    marginTop: 4,
  },
  toggleButton: {
    minWidth: 122,
  },
  toggleActive: {
    borderWidth: 1,
  },
  toggleIdle: {
    opacity: 0.92,
  },
  divider: {
    borderRadius: 999,
    height: 1,
    marginVertical: 10,
    opacity: 0.6,
  },
  languageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 76,
  },
  languageHint: {
    marginTop: 4,
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  progressIconWrap: {
    alignItems: 'center',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  sectionCopy: {
    lineHeight: 36,
    marginBottom: 18,
    marginTop: 16,
  },
  dangerCard: {
    marginTop: 8,
  },
  dangerCardBorder: {
    borderColor: 'rgba(244, 106, 130, 0.34)',
  },
  progressIconDanger: {
    backgroundColor: 'rgba(244, 106, 130, 0.12)',
  },
  resetButton: {
    minHeight: 58,
  },
  footerMark: {
    alignSelf: 'center',
    letterSpacing: 5.2,
    marginTop: 20,
    opacity: 0.82,
  },
});

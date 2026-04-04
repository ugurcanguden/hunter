import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreIcon, CoreIconName } from '@centerhit-components/common/CoreIcon';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { notificationService } from '@centerhit-features/notifications/services/notificationService';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

type DiscoverStep = {
  kind: 'language' | 'info' | 'notifications';
  icon: CoreIconName;
  title: string;
  copy: string;
};

function UnitedStatesFlag() {
  return (
    <Svg width={28} height={20} viewBox="0 0 28 20" fill="none">
      <Rect width={28} height={20} rx={4} fill="#fff" />
      {Array.from({ length: 7 }, (_, index) => (
        <Rect
          key={`us-stripe-${index}`}
          x={0}
          y={index * 3}
          width={28}
          height={1.5}
          fill="#C93A3A"
        />
      ))}
      <Rect x={0} y={0} width={12} height={10.5} rx={4} fill="#23408E" />
      {Array.from({ length: 3 }, (_, row) =>
        Array.from({ length: 4 }, (_, column) => (
          <Circle
            key={`us-star-${row}-${column}`}
            cx={2.2 + column * 2.4}
            cy={2.2 + row * 2.8}
            r={0.45}
            fill="#fff"
          />
        )),
      )}
    </Svg>
  );
}

function TurkeyFlag() {
  return (
    <Svg width={28} height={20} viewBox="0 0 28 20" fill="none">
      <Rect width={28} height={20} rx={4} fill="#D62828" />
      <Circle cx={11} cy={10} r={4.2} fill="#fff" />
      <Circle cx={12.2} cy={10} r={3.35} fill="#D62828" />
      <Path
        d="M17.9 7.1L18.52 8.93H20.45L18.89 10.07L19.48 11.9L17.9 10.78L16.33 11.9L16.93 10.07L15.36 8.93H17.29L17.9 7.1Z"
        fill="#fff"
      />
    </Svg>
  );
}

function LanguageOptionButton({
  label,
  selected,
  onPress,
  flag,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  flag: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.languageButton,
        {
          backgroundColor: selected ? theme.colors.accentPrimary : theme.colors.surfaceSoft,
          borderColor: selected ? theme.colors.accentPrimary : theme.colors.borderSoft,
          opacity: pressed ? 0.84 : 1,
        },
        selected ? theme.shadows.glow : undefined,
      ]}>
      <View style={styles.languageButtonContent}>
        <View style={styles.flagWrap}>{flag}</View>
        <CoreText
          variant="bodyStrong"
          style={{
            color: selected ? theme.colors.backgroundPrimary : theme.colors.textPrimary,
          }}>
          {label}
        </CoreText>
      </View>
    </Pressable>
  );
}

export function DiscoverGate() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const hasSeenDiscover = useSettingsStore(state => state.settings.hasSeenDiscover);
  const language = useSettingsStore(state => state.settings.language);
  const setHasSeenDiscover = useSettingsStore(state => state.setHasSeenDiscover);
  const setNotificationsEnabled = useSettingsStore(state => state.setNotificationsEnabled);
  const setLanguage = useSettingsStore(state => state.setLanguage);
  const [stepIndex, setStepIndex] = useState(0);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const steps = useMemo<DiscoverStep[]>(
    () => [
      {
        kind: 'language',
        icon: 'globe-outline',
        title: t.discover.steps.languageTitle,
        copy: t.discover.steps.languageCopy,
      },
      {
        kind: 'info',
        icon: 'play',
        title: t.discover.steps.homeTitle,
        copy: t.discover.steps.homeCopy,
      },
      {
        kind: 'info',
        icon: 'lock-open',
        title: t.discover.steps.packsTitle,
        copy: t.discover.steps.packsCopy,
      },
      {
        kind: 'info',
        icon: 'star',
        title: t.discover.steps.gameTitle,
        copy: t.discover.steps.gameCopy,
      },
      {
        kind: 'notifications',
        icon: 'notifications-outline',
        title: t.discover.steps.notificationsTitle,
        copy: t.discover.steps.notificationsCopy,
      },
    ],
    [
      t.discover.steps.gameCopy,
      t.discover.steps.gameTitle,
      t.discover.steps.homeCopy,
      t.discover.steps.homeTitle,
      t.discover.steps.languageCopy,
      t.discover.steps.languageTitle,
      t.discover.steps.notificationsCopy,
      t.discover.steps.notificationsTitle,
      t.discover.steps.packsCopy,
      t.discover.steps.packsTitle,
    ],
  );

  const isVisible = !hasSeenDiscover;
  const isLastStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex]!;
  const isLanguageStep = currentStep.kind === 'language';
  const isNotificationStep = currentStep.kind === 'notifications';

  const handleFinish = () => {
    setHasSeenDiscover(true).catch(() => undefined);
    setStepIndex(0);
  };

  const handleEnableNotifications = async () => {
    if (isRequestingPermission) {
      return;
    }

    setIsRequestingPermission(true);

    try {
      const granted = await notificationService.requestPermission();

      if (!granted) {
        await setNotificationsEnabled(false);
        Alert.alert(
          t.settings.notificationsDeniedTitle,
          t.settings.notificationsDeniedMessage,
        );
        handleFinish();
        return;
      }

      await setNotificationsEnabled(true);
      await notificationService.scheduleInactiveReminder({
        language,
        fromDate: new Date(),
      });
      handleFinish();
    } catch {
      await setNotificationsEnabled(false);
      Alert.alert(
        t.settings.notificationsDeniedTitle,
        t.settings.notificationsPermissionError,
      );
      handleFinish();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleSelectLanguage = async (nextLanguage: 'en' | 'tr') => {
    await setLanguage(nextLanguage);
    setStepIndex(prev => prev + 1);
  };

  return (
    <CoreModal visible={isVisible} onDismiss={handleFinish} dismissOnBackdropPress={false}>
      <CoreText variant="title" align="center">
        {t.discover.title}
      </CoreText>
      <CoreText variant="caption" colorRole="textSecondary" align="center" style={styles.counter}>
        {t.discover.stepCounter} {stepIndex + 1}/{steps.length}
      </CoreText>

      <View style={styles.body}>
        <View
          style={[
            styles.iconBadge,
            {
              backgroundColor: theme.colors.stageGlow,
              borderColor: theme.colors.accentPrimary,
            },
          ]}>
          <CoreIcon name={currentStep.icon} size={20} color={theme.colors.accentPrimary} />
        </View>
        <CoreText variant="subtitle" align="center">
          {currentStep.title}
        </CoreText>
        <CoreText variant="body" colorRole="textSecondary" align="center" style={styles.copy}>
          {currentStep.copy}
        </CoreText>
      </View>

      <View style={styles.actions}>
        {isLanguageStep ? (
          <>
            <LanguageOptionButton
              label={t.discover.chooseEnglish}
              selected={language === 'en'}
              flag={<UnitedStatesFlag />}
              onPress={() => {
                handleSelectLanguage('en').catch(() => undefined);
              }}
            />
            <LanguageOptionButton
              label={t.discover.chooseTurkish}
              selected={language === 'tr'}
              flag={<TurkeyFlag />}
              onPress={() => {
                handleSelectLanguage('tr').catch(() => undefined);
              }}
            />
          </>
        ) : null}

        {!isLanguageStep ? (
          <CoreButton
            label={isNotificationStep ? t.discover.notNow : t.discover.skip}
            onPress={handleFinish}
            variant="ghost"
          />
        ) : null}

        {isNotificationStep ? (
          <CoreButton
            label={t.discover.enableNotifications}
            onPress={() => {
              handleEnableNotifications().catch(() => undefined);
            }}
            disabled={isRequestingPermission}
          />
        ) : null}

        {!isLanguageStep && !isNotificationStep ? (
          <CoreButton
            label={isLastStep ? t.discover.done : t.discover.next}
            onPress={() => {
              if (isLastStep) {
                handleFinish();
                return;
              }
              setStepIndex(prev => prev + 1);
            }}
          />
        ) : null}
      </View>
    </CoreModal>
  );
}

const styles = StyleSheet.create({
  counter: {
    marginTop: 8,
  },
  body: {
    alignItems: 'center',
    marginTop: 18,
  },
  iconBadge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    marginBottom: 10,
    width: 42,
  },
  copy: {
    marginTop: 10,
  },
  actions: {
    gap: 10,
    marginTop: 18,
  },
  languageButton: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 56,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  languageButtonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  flagWrap: {
    borderRadius: 6,
    overflow: 'hidden',
  },
});

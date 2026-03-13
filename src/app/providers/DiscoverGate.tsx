import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreIcon, CoreIconName } from '@centerhit-components/common/CoreIcon';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';

type DiscoverStep = {
  icon: CoreIconName;
  title: string;
  copy: string;
};

export function DiscoverGate() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const hasSeenDiscover = useSettingsStore(state => state.settings.hasSeenDiscover);
  const setHasSeenDiscover = useSettingsStore(state => state.setHasSeenDiscover);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo<DiscoverStep[]>(
    () => [
      {
        icon: 'play',
        title: t.discover.steps.homeTitle,
        copy: t.discover.steps.homeCopy,
      },
      {
        icon: 'lock-open',
        title: t.discover.steps.packsTitle,
        copy: t.discover.steps.packsCopy,
      },
      {
        icon: 'star',
        title: t.discover.steps.gameTitle,
        copy: t.discover.steps.gameCopy,
      },
    ],
    [t.discover.steps.gameCopy, t.discover.steps.gameTitle, t.discover.steps.homeCopy, t.discover.steps.homeTitle, t.discover.steps.packsCopy, t.discover.steps.packsTitle],
  );

  const isVisible = !hasSeenDiscover;
  const isLastStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex]!;

  const handleFinish = () => {
    setHasSeenDiscover(true).catch(() => undefined);
    setStepIndex(0);
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
        <CoreButton label={t.discover.skip} onPress={handleFinish} variant="ghost" />
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
});

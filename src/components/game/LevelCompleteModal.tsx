import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';

type LevelCompleteModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
  onHome: () => void;
  stars: number;
  score: number;
  perfectCount: number;
  hitCount: number;
};

export function LevelCompleteModal({
  visible,
  onDismiss,
  onNextLevel,
  onRetry,
  onHome,
  stars,
  score,
  perfectCount,
  hitCount,
}: LevelCompleteModalProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const starString = stars > 0 ? '★'.repeat(stars) : '0';

  return (
    <CoreModal visible={visible} onDismiss={onDismiss} tone="success">
      <CoreText variant="title" align="center">
        {t.game.completeTitle}
      </CoreText>
      <CoreText
        variant="title"
        colorRole="perfectHit"
        align="center"
        style={styles.stars}>
        {starString}
      </CoreText>
      <CoreText
        variant="body"
        colorRole="textSecondary"
        align="center"
        style={styles.sub}>
        {t.game.completeStars}
      </CoreText>
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.score}
          </CoreText>
          <CoreText variant="subtitle" colorRole="perfectHit" align="center">
            {score}
          </CoreText>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.hits}
          </CoreText>
          <CoreText variant="subtitle" colorRole="textPrimary" align="center">
            {hitCount}
          </CoreText>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.perfect}
          </CoreText>
          <CoreText variant="subtitle" colorRole="perfectHit" align="center">
            {perfectCount}
          </CoreText>
        </View>
      </View>
      <View style={styles.actions}>
        <CoreButton label={t.common.nextLevel} onPress={onNextLevel} />
        <CoreButton label={t.common.retry} onPress={onRetry} variant="secondary" />
        <CoreButton label={t.common.homeAction} onPress={onHome} variant="ghost" />
      </View>
    </CoreModal>
  );
}

const styles = StyleSheet.create({
  stars: {
    marginTop: 12,
  },
  sub: {
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  summaryItem: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});

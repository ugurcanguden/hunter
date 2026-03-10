import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreText } from '@centerhit-components/common/CoreText';
import { getDifficultyLabel } from '@centerhit-core/utils/level';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';

type LevelCardProps = {
  level: LevelDefinition;
  stars: number;
  unlocked: boolean;
  highlighted?: boolean;
  onPress: () => void;
};

export function LevelCard({
  level,
  stars,
  unlocked,
  highlighted = false,
  onPress,
}: LevelCardProps) {
  const { theme } = useTheme();
  const { t } = useI18n();
  const isCompleted = stars > 0;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!unlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pressable,
        { opacity: !unlocked ? 0.48 : pressed ? 0.86 : 1 },
      ]}>
      <CoreCard
        style={[
          styles.card,
          highlighted && {
            backgroundColor: theme.colors.stageGlow,
            borderColor: theme.colors.accentPrimary,
          },
          unlocked && {
            borderColor: highlighted ? theme.colors.accentPrimary : theme.colors.borderSoft,
          },
        ]}>
        <View style={styles.row}>
          <CoreText variant="caption" colorRole="textSecondary">
            {t.common.level.toUpperCase()} {level.order}
          </CoreText>
          <View style={styles.statusRow}>
            {!unlocked ? (
              <CoreIcon name="lock-closed" size={14} color={theme.colors.warning} />
            ) : null}
            <CoreText
              variant="caption"
              colorRole={!unlocked ? 'warning' : highlighted ? 'accentPrimary' : isCompleted ? 'success' : 'textSecondary'}>
              {!unlocked
                ? t.common.locked
                : highlighted
                  ? t.common.next
                  : isCompleted
                    ? t.common.open
                    : t.common.unlocked}
            </CoreText>
          </View>
        </View>
        <CoreText variant="subtitle" style={styles.title} numberOfLines={2}>
          {level.title}
        </CoreText>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.meta}>
          {getDifficultyLabel(level.difficulty)}
        </CoreText>
        <CoreText
          variant="caption"
          colorRole="textSecondary"
          numberOfLines={1}
          style={styles.stars}>
          {stars > 0 ? `${stars}/3` : t.common.noStarsYet}
        </CoreText>
      </CoreCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
    minHeight: 152,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    marginBottom: 6,
    marginTop: 10,
    minHeight: 48,
  },
  meta: {
    marginBottom: 12,
  },
  stars: {
    minHeight: 18,
  },
});

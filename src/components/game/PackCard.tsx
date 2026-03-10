import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useTheme } from '@centerhit-core/theme/useTheme';

type PackCardProps = {
  order: number;
  title: string;
  subtitle?: string;
  levelCount: number;
  locked: boolean;
  completed: boolean;
  expanded: boolean;
  highlighted?: boolean;
  onPress: () => void;
};

export function PackCard({
  order,
  title,
  subtitle,
  levelCount,
  locked,
  completed,
  expanded,
  highlighted = false,
  onPress,
}: PackCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: locked ? 0.52 : pressed ? 0.88 : 1 }]}>
      <CoreCard
        style={[
          styles.card,
          highlighted && {
            borderColor: theme.colors.accentPrimary,
            backgroundColor: theme.colors.stageGlow,
          },
          completed && !highlighted && {
            borderColor: theme.colors.success,
          },
        ]}>
        <View
          style={[
            styles.accentLine,
            {
              backgroundColor: locked
                ? theme.colors.border
                : highlighted
                  ? theme.colors.accentPrimary
                  : completed
                    ? theme.colors.success
                    : theme.colors.borderSoft,
            },
          ]}
        />

        <View style={styles.row}>
          <View style={styles.kickerRow}>
            <CoreText variant="caption" colorRole="textSecondary" style={styles.kicker}>
              PACK {order.toString().padStart(2, '0')}
            </CoreText>
            <CoreText variant="caption" colorRole="accentPrimary" style={styles.levelCount}>
              {levelCount} LVL
            </CoreText>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                borderColor: locked
                  ? theme.colors.border
                  : highlighted
                    ? theme.colors.accentPrimary
                    : completed
                      ? theme.colors.success
                      : theme.colors.border,
                backgroundColor: locked
                  ? theme.colors.backgroundSecondary
                  : highlighted
                    ? theme.colors.stageGlow
                    : theme.colors.surface,
              },
            ]}>
            {locked ? (
              <CoreIcon name="lock-closed" size={14} color={theme.colors.warning} />
            ) : null}
            <CoreText
              variant="caption"
              colorRole={
                locked
                  ? 'warning'
                  : highlighted
                    ? 'accentPrimary'
                    : completed
                      ? 'success'
                      : 'textSecondary'
              }
              style={styles.statusText}>
              {locked ? 'LOCKED' : highlighted ? 'NEXT' : expanded ? 'OPEN' : 'READY'}
            </CoreText>
          </View>
        </View>

        <CoreText variant="display" style={styles.title}>
          {title}
        </CoreText>

        <CoreText
          variant="body"
          colorRole={locked ? 'textSecondary' : 'accentPrimary'}
          numberOfLines={1}
          style={styles.subtitle}>
          {subtitle ?? `${levelCount} levels ready`}
        </CoreText>

        <View style={styles.footerRow}>
          <View style={styles.footerMetric}>
            <CoreText variant="caption" colorRole="textSecondary">
              STATUS
            </CoreText>
            <CoreText variant="bodyStrong">
              {locked ? 'Locked' : completed ? 'Completed' : highlighted ? 'Next Up' : 'Open'}
            </CoreText>
          </View>
          <CoreIcon
            name={locked ? 'lock-closed' : highlighted ? 'play' : completed ? 'checkmark' : 'ellipse'}
            size={17}
            color={
              locked
                ? theme.colors.textSecondary
                : highlighted
                  ? theme.colors.accentPrimary
                  : completed
                    ? theme.colors.success
                    : theme.colors.textPrimary
            }
          />
        </View>
      </CoreCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 18,
    position: 'relative',
  },
  accentLine: {
    borderBottomLeftRadius: 28,
    borderTopLeftRadius: 28,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  kickerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  kicker: {
    letterSpacing: 1.2,
  },
  levelCount: {
    letterSpacing: 0.8,
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 34,
    paddingHorizontal: 12,
  },
  statusText: {
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 6,
    marginTop: 16,
  },
  subtitle: {
    marginBottom: 18,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerMetric: {
    gap: 4,
  },
});

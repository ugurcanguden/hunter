import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useTheme } from '@centerhit-core/theme/useTheme';

type CoverTone = 'cyan' | 'amber' | 'red' | 'mixed';

type PackCardProps = {
  order: number;
  title: string;
  subtitle?: string;
  levelCount: number;
  locked: boolean;
  completed: boolean;
  expanded: boolean;
  highlighted?: boolean;
  coverTone?: CoverTone;
  completedCount?: number;
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
  coverTone,
  completedCount = 0,
  onPress,
}: PackCardProps) {
  const { theme } = useTheme();

  function toneColor(tone: CoverTone | undefined) {
    if (locked) return theme.colors.border;
    switch (tone) {
      case 'amber': return theme.colors.accentSecondary;
      case 'red': return theme.colors.danger;
      case 'mixed': return theme.colors.accentSecondary;
      default: return theme.colors.accentPrimary;
    }
  }

  const accent = toneColor(coverTone);
  const completionRatio = levelCount > 0 ? completedCount / levelCount : 0;
  const showProgressBar = !locked && !completed;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [{ opacity: locked ? 0.52 : pressed ? 0.88 : 1 }]}>
      <CoreCard
        style={[
          styles.card,
          !locked && {
            borderColor: accent,
            borderWidth: 1.5,
          },
          highlighted && {
            backgroundColor: theme.colors.stageGlow,
          },
        ]}>
        {/* Accent bar */}
        <View
          style={[
            styles.accentLine,
            { backgroundColor: accent },
          ]}
        />

        <View style={styles.row}>
          <View style={styles.kickerRow}>
            <CoreText variant="caption" colorRole="textSecondary" style={styles.kicker}>
              PACK {order.toString().padStart(2, '0')}
            </CoreText>
            <CoreText variant="caption" style={[styles.levelCount, { color: accent }]}>
              {levelCount} LVL
            </CoreText>
          </View>
          <View
            style={[
              styles.statusPill,
              {
                borderColor: locked
                  ? theme.colors.border
                  : accent,
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
              style={[
                styles.statusText,
                {
                  color: locked
                    ? theme.colors.warning
                    : completed
                      ? theme.colors.success
                      : accent,
                },
              ]}>
              {locked ? 'LOCKED' : highlighted ? 'NEXT' : expanded ? 'OPEN' : 'READY'}
            </CoreText>
          </View>
        </View>

        <CoreText variant="display" style={styles.title}>
          {title}
        </CoreText>

        <CoreText
          variant="body"
          style={[styles.subtitle, { color: locked ? theme.colors.textSecondary : accent }]}
          numberOfLines={1}>
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
          <View style={styles.footerRight}>
            {!locked && (
              <CoreText variant="caption" style={[styles.starCount, { color: theme.colors.warning }]}>
                ★ {completedCount}/{levelCount}
              </CoreText>
            )}
            <CoreIcon
              name={locked ? 'lock-closed' : highlighted ? 'play' : completed ? 'checkmark' : 'ellipse'}
              size={17}
              color={
                locked
                  ? theme.colors.textSecondary
                  : highlighted
                    ? accent
                    : completed
                      ? theme.colors.success
                      : theme.colors.textPrimary
              }
            />
          </View>
        </View>

        {/* Progress bar */}
        {showProgressBar && (
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.overlay }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: accent,
                  width: `${completionRatio * 100}%`,
                },
              ]}
            />
          </View>
        )}
        {completed && (
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.overlay }]}>
            <View
              style={[styles.progressFill, { backgroundColor: theme.colors.success, width: '100%' }]}
            />
          </View>
        )}
      </CoreCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    position: 'relative',
  },
  accentLine: {
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 8,
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
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 13,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerMetric: {
    gap: 4,
  },
  footerRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  starCount: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  progressTrack: {
    borderRadius: 999,
    height: 3,
    overflow: 'hidden',
    opacity: 0.7,
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
});

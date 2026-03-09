import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useTheme } from '@centerhit-core/theme/useTheme';

type HudStatCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
};

export function HudStatCard({ label, value, subtitle }: HudStatCardProps) {
  const { theme } = useTheme();

  return (
    <CoreCard
      variant="soft"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceSoft,
          borderColor: theme.colors.borderSoft,
        },
      ]}>
      <CoreText variant="caption" colorRole="textSecondary">
        {label}
      </CoreText>
      <View style={styles.valueWrap}>
        <CoreText variant="subtitle" colorRole="perfectHit">
          {value}
        </CoreText>
      </View>
      {subtitle ? (
        <CoreText variant="caption" colorRole="textSecondary" style={styles.subtitle}>
          {subtitle}
        </CoreText>
      ) : null}
    </CoreCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 68,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  valueWrap: {
    marginTop: 6,
  },
  subtitle: {
    marginTop: 4,
  },
});

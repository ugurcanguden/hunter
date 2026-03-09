import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@centerhit-core/theme/useTheme';

type CoreCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'soft' | 'stage' | 'panel';
}>;

export function CoreCard({
  children,
  style,
  variant = 'default',
}: CoreCardProps) {
  const { theme } = useTheme();
  const variantStyles = {
    default: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.borderSoft,
      shadowStyle: theme.shadows.card,
    },
    soft: {
      backgroundColor: theme.colors.surfaceSoft,
      borderColor: theme.colors.borderSoft,
      shadowStyle: theme.shadows.card,
    },
    panel: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      shadowStyle: theme.shadows.card,
    },
    stage: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderColor: theme.colors.stageRing,
      shadowStyle: theme.shadows.stage,
    },
  }[variant];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
        },
        variantStyles.shadowStyle,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
});

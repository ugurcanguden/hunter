import React, { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { useTheme } from '@centerhit-core/theme/useTheme';
import { ThemeColorRole } from '@centerhit-core/types/common';

type CoreTextProps = PropsWithChildren<{
  variant?: 'display' | 'title' | 'subtitle' | 'body' | 'bodyStrong' | 'caption' | 'button';
  colorRole?: ThemeColorRole;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: () => void;
}>;

export function CoreText({
  children,
  variant = 'body',
  colorRole = 'textPrimary',
  align,
  style,
  numberOfLines,
  onPress,
}: CoreTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      onPress={onPress}
      style={[
        styles.base,
        theme.typography[variant],
        { color: theme.colors[colorRole], textAlign: align },
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});

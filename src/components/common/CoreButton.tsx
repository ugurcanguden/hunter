import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { CoreText } from '@centerhit-components/common/CoreText';
import { LAYOUT } from '@centerhit-core/constants/layout';
import { useTheme } from '@centerhit-core/theme/useTheme';

type CoreButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'control';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
};

export function CoreButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  compact = false,
}: CoreButtonProps) {
  const { theme } = useTheme();
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.accentPrimary,
      borderColor: theme.colors.accentPrimary,
      textColor: theme.colors.backgroundPrimary,
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      textColor: theme.colors.textPrimary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border,
      textColor: theme.colors.textSecondary,
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
      textColor: theme.colors.textPrimary,
    },
    control: {
      backgroundColor: theme.colors.surfaceSoft,
      borderColor: theme.colors.borderSoft,
      textColor: theme.colors.textPrimary,
    },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compactButton,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.84 : 1,
        },
        variant === 'primary' ? theme.shadows.glow : undefined,
        style,
      ]}>
      <CoreText
        variant={compact ? 'bodyStrong' : 'button'}
        style={{ color: variantStyles.textColor }}>
        {label}
      </CoreText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: LAYOUT.buttonHeight,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  compactButton: {
    height: 38,
    paddingHorizontal: 14,
  },
});

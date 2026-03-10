import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { CoreIcon, CoreIconName } from '@centerhit-components/common/CoreIcon';
import { useTheme } from '@centerhit-core/theme/useTheme';

type CoreIconButtonProps = {
  icon: CoreIconName;
  onPress: () => void;
  accessibilityLabel: string;
  style?: ViewStyle;
};

export function CoreIconButton({
  icon,
  onPress,
  accessibilityLabel,
  style,
}: CoreIconButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.8 : 1,
        },
        theme.shadows.card,
        style,
      ]}>
      <CoreIcon name={icon} size={22} color={theme.colors.accentPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
});

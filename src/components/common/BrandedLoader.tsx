import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { CoreText } from '@centerhit-components/common/CoreText';
import { APP_NAME } from '@centerhit-core/constants/app';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';

export function BrandedLoader() {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <View
        style={[
          styles.core,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          theme.shadows.glow,
        ]}>
        <CoreText variant="display" align="center">
          {APP_NAME}
        </CoreText>
        <CoreText variant="body" colorRole="textSecondary" align="center">
          {t.loader.preparing}
        </CoreText>
        <ActivityIndicator color={theme.colors.accentPrimary} size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  core: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
});

import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, View } from 'react-native';

import { CoreText } from '@centerhit-components/common/CoreText';
import { APP_NAME } from '@centerhit-core/constants/app';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';

export function BrandedLoader() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const progressAnim = useRef(new Animated.Value(0.08)).current;

  useEffect(() => {
    const animation = Animated.timing(progressAnim, {
      toValue: 0.94,
      duration: 1300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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

        <View
          style={[
            styles.progressTrack,
            {
              backgroundColor: theme.colors.overlay,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.accentPrimary,
                width: progressWidth,
              },
            ]}
          />
        </View>

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
  progressTrack: {
    borderRadius: 999,
    borderWidth: 1,
    height: 10,
    marginTop: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
});

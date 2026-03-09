import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreText } from '@centerhit-components/common/CoreText';
import { useTheme } from '@centerhit-core/theme/useTheme';

type GameOverlayMessageProps = {
  title: string;
  subtitle?: string;
  tone?: 'perfect' | 'good' | 'miss' | 'blocked';
};

export function GameOverlayMessage({
  title,
  subtitle,
  tone = 'good',
}: GameOverlayMessageProps) {
  const { theme } = useTheme();
  const toneColor = {
    perfect: theme.colors.perfectHit,
    good: theme.colors.goodHit,
    miss: theme.colors.missHit,
    blocked: theme.colors.accentSecondary,
  }[tone];
  const toneBackground = {
    perfect: theme.colors.stageGlow,
    good: theme.colors.overlay,
    miss: theme.colors.overlay,
    blocked: theme.colors.overlay,
  }[tone];
  const toneShadow = tone === 'perfect' ? theme.shadows.glow : theme.shadows.stage;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: toneBackground,
          borderColor: toneColor,
        },
        tone === 'perfect' ? styles.perfectContainer : styles.defaultContainer,
        toneShadow,
      ]}>
      <CoreText variant="subtitle" align="center" style={{ color: toneColor }}>
        {title}
      </CoreText>
      {subtitle ? (
        <CoreText
          variant="body"
          colorRole="textSecondary"
          align="center"
          style={styles.subtitle}>
          {subtitle}
        </CoreText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 22,
    left: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    right: 24,
    top: 22,
  },
  defaultContainer: {
    borderWidth: 1,
  },
  perfectContainer: {
    borderWidth: 2,
  },
  subtitle: {
    marginTop: 6,
  },
});

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

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

  const translateY = useRef(new Animated.Value(-28)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    translateY.setValue(-28);
    opacity.setValue(0);
    scale.setValue(0.9);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 6,
      }),
    ]).start();
  }, [opacity, scale, title, translateY]);

  const toneColor = {
    perfect: theme.colors.perfectHit,
    good: theme.colors.goodHit,
    miss: theme.colors.missHit,
    blocked: theme.colors.accentSecondary,
  }[tone];

  const toneShadow = tone === 'perfect' ? theme.shadows.glow : theme.shadows.stage;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: toneColor,
          opacity,
          transform: [{ translateY }, { scale }],
        },
        tone === 'perfect' ? styles.perfectContainer : styles.defaultContainer,
        toneShadow,
      ]}>
      {tone === 'perfect' ? (
        <>
          <View
            style={[styles.perfectBgOuter, { backgroundColor: theme.colors.stageGlow }]}
          />
          <View
            style={[
              styles.perfectBgInner,
              { backgroundColor: 'rgba(233,255,255,0.07)' },
            ]}
          />
        </>
      ) : (
        <View
          style={[styles.defaultBg, { backgroundColor: theme.colors.overlay }]}
        />
      )}
      <CoreText
        variant={tone === 'perfect' ? 'title' : 'subtitle'}
        align="center"
        style={{ color: toneColor, letterSpacing: tone === 'perfect' ? 1 : 0 }}>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 22,
    left: 24,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 14,
    position: 'absolute',
    right: 24,
    top: 22,
  },
  defaultBg: {
    ...StyleSheet.absoluteFillObject,
  },
  defaultContainer: {
    borderWidth: 1,
  },
  perfectBgInner: {
    ...StyleSheet.absoluteFillObject,
  },
  perfectBgOuter: {
    ...StyleSheet.absoluteFillObject,
  },
  perfectContainer: {
    borderWidth: 2,
  },
  subtitle: {
    marginTop: 6,
  },
});

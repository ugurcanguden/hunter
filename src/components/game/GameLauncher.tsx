import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { useTheme } from '@centerhit-core/theme/useTheme';

type GameLauncherProps = {
  width: number;
  height: number;
  left: number;
  bottom: number;
  spawnPointLeft: number;
  spawnPointBottom: number;
  spawnPointSize: number;
  showReadyProjectile: boolean;
};

export const GameLauncher = memo(function GameLauncher({
  width,
  height,
  left,
  bottom,
  spawnPointLeft,
  spawnPointBottom,
  spawnPointSize,
  showReadyProjectile,
}: GameLauncherProps) {
  const { theme } = useTheme();

  const auraOpacity = useRef(new Animated.Value(0.05)).current;
  const spawnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const auraLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(auraOpacity, {
          toValue: 0.12,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auraOpacity, {
          toValue: 0.04,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    auraLoop.start();
    return () => auraLoop.stop();
  }, [auraOpacity]);

  useEffect(() => {
    if (!showReadyProjectile) {
      return;
    }
    const spawnLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(spawnScale, {
          toValue: 1.35,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(spawnScale, {
          toValue: 1.0,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    spawnLoop.start();
    return () => spawnLoop.stop();
  }, [showReadyProjectile, spawnScale]);

  return (
    <>
      {/* Glow aura behind launcher */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.aura,
          {
            bottom: bottom - height * 0.3,
            height: height * 2.6,
            left: left - width * 0.2,
            opacity: auraOpacity,
            width: width * 1.4,
          },
        ]}
      />

      {/* Launcher body */}
      <View
        style={[
          styles.launcher,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.accentPrimary,
            bottom,
            height,
            left,
            width,
          },
        ]}>
        {/* Top barrel line */}
        <View
          style={[styles.barrelLine, { backgroundColor: theme.colors.accentPrimary }]}
        />
        <View
          style={[styles.launcherCore, { backgroundColor: theme.colors.accentPrimary }]}
        />
        <View
          style={[styles.launcherCap, { backgroundColor: theme.colors.perfectHit }]}
        />
      </View>

      {/* Ready projectile spawn point */}
      {showReadyProjectile ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.spawnPoint,
            {
              backgroundColor: theme.colors.perfectHit,
              borderColor: theme.colors.accentPrimary,
              bottom: spawnPointBottom,
              height: spawnPointSize,
              left: spawnPointLeft,
              transform: [{ scale: spawnScale }],
              width: spawnPointSize,
            },
          ]}
        />
      ) : null}
    </>
  );
});

const styles = StyleSheet.create({
  aura: {
    backgroundColor: '#3CE6FF',
    borderRadius: 999,
    position: 'absolute',
  },
  barrelLine: {
    borderRadius: 999,
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  launcher: {
    borderRadius: 999,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'absolute',
  },
  launcherCap: {
    borderRadius: 999,
    bottom: 2,
    height: 7,
    left: '50%',
    marginLeft: -3.5,
    position: 'absolute',
    width: 7,
  },
  launcherCore: {
    borderRadius: 999,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    opacity: 0.28,
  },
  spawnPoint: {
    borderRadius: 999,
    borderWidth: 1.5,
    position: 'absolute',
  },
});

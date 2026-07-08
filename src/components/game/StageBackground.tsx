import React, { memo, useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function ScanLine({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(-2)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 5000,
        easing: Easing.linear,
        delay,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.scanLine, { transform: [{ translateY }] }]}
    />
  );
}

export const StageBackground = memo(
  function StageBackground() {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {/* Corner glow auras */}
        <View style={[styles.cornerGlow, styles.cornerTopLeft]} />
        <View style={[styles.cornerGlow, styles.cornerTopRight]} />
        <View style={[styles.cornerGlow, styles.cornerBottomLeft]} />
        <View style={[styles.cornerGlow, styles.cornerBottomRight]} />

        {/* Center ambient radial */}
        <View style={styles.centerAmbient} />

        {/* Scan lines */}
        <ScanLine delay={0} />
        <ScanLine delay={1600} />
        <ScanLine delay={3200} />
      </View>
    );
  },
  () => true,
);

const styles = StyleSheet.create({
  centerAmbient: {
    alignSelf: 'center',
    backgroundColor: 'rgba(60,230,255,0.025)',
    borderRadius: 999,
    height: '55%',
    position: 'absolute',
    top: '22%',
    width: '65%',
  },
  cornerBottomLeft: {
    bottom: -30,
    left: -30,
  },
  cornerBottomRight: {
    bottom: -30,
    right: -30,
  },
  cornerGlow: {
    backgroundColor: 'rgba(60,230,255,0.05)',
    borderRadius: 999,
    height: 130,
    position: 'absolute',
    shadowColor: '#3CE6FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    width: 130,
  },
  cornerTopLeft: {
    left: -30,
    top: -30,
  },
  cornerTopRight: {
    right: -30,
    top: -30,
  },
  scanLine: {
    backgroundColor: 'rgba(60,230,255,0.04)',
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

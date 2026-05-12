import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';

import { useTheme } from '@centerhit-core/theme/useTheme';

type GameTargetProps = {
  width: number;
  height: number;
  left: number;
  top: number;
  perfectZoneSize: number;
  isFlashing: boolean;
  flashTone: 'perfect' | 'good' | null;
  isVisible?: boolean;
};

export const GameTarget = memo(function GameTarget({
  width,
  height,
  left,
  top,
  perfectZoneSize,
  isFlashing,
  flashTone,
  isVisible = true,
}: GameTargetProps) {
  const { theme } = useTheme();

  const breathScale = useRef(new Animated.Value(1)).current;
  const outerRotate = useRef(new Animated.Value(0)).current;
  const visibilityOpacity = useRef(new Animated.Value(1)).current;
  const breathLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const isFlashingRef = useRef(false);
  const prevVisibleRef = useRef(true);

  const startBreathing = useCallback(() => {
    breathLoopRef.current?.stop();
    breathLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(breathScale, {
          toValue: 1.055,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathScale, {
          toValue: 1.0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    breathLoopRef.current.start();
  }, [breathScale]);

  useEffect(() => {
    startBreathing();
    const rotLoop = Animated.loop(
      Animated.timing(outerRotate, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    rotLoop.start();
    return () => {
      breathLoopRef.current?.stop();
      rotLoop.stop();
    };
  }, [outerRotate, startBreathing]);

  useEffect(() => {
    if (isVisible === prevVisibleRef.current) {
      return;
    }
    prevVisibleRef.current = isVisible;
    Animated.timing(visibilityOpacity, {
      toValue: isVisible ? 1 : 0,
      duration: 80,
      useNativeDriver: true,
    }).start();
  }, [isVisible, visibilityOpacity]);

  useEffect(() => {
    if (isFlashing === isFlashingRef.current) {
      return;
    }
    isFlashingRef.current = isFlashing;

    if (isFlashing) {
      breathLoopRef.current?.stop();
      breathScale.setValue(flashTone === 'perfect' ? 1.12 : 1.05);
    } else {
      startBreathing();
    }
  }, [isFlashing, flashTone, breathScale, startBreathing]);

  const rotateInterpolated = outerRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const cx = width / 2;
  const cy = height / 2;
  const rx = width / 2;
  const ry = height / 2;
  const perfectR = perfectZoneSize / 2;

  const accentColor = isFlashing
    ? flashTone === 'perfect'
      ? theme.colors.perfectHit
      : theme.colors.goodHit
    : theme.colors.accentPrimary;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        height,
        left,
        opacity: visibilityOpacity,
        position: 'absolute',
        top,
        transform: [{ scale: breathScale }],
        width,
      }}>
      {/* Main static rings */}
      <Svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Ring 2 - outer fill */}
        <Ellipse
          cx={cx}
          cy={cy}
          rx={rx * 0.85}
          ry={ry * 0.85}
          fill={theme.colors.surface}
          fillOpacity={0.92}
          stroke={accentColor}
          strokeWidth={1}
          strokeOpacity={isFlashing ? 0.65 : 0.28}
        />
        {/* Ring 3 - mid ring */}
        <Ellipse
          cx={cx}
          cy={cy}
          rx={rx * 0.68}
          ry={ry * 0.68}
          fill={theme.colors.backgroundPrimary}
          fillOpacity={0.96}
          stroke={theme.colors.goodHit}
          strokeWidth={1}
          strokeOpacity={isFlashing ? 0.85 : 0.42}
        />
        {/* Ring 4 - perfect zone ellipse */}
        <Ellipse
          cx={cx}
          cy={cy}
          rx={rx * 0.46}
          ry={ry * 0.46}
          fill={accentColor}
          fillOpacity={isFlashing ? 0.22 : 0.1}
          stroke={accentColor}
          strokeWidth={1.5}
          strokeOpacity={isFlashing ? 0.95 : 0.58}
        />
        {/* Perfect zone circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={perfectR}
          fill={theme.colors.perfectHit}
          fillOpacity={isFlashing ? 0.48 : 0.16}
          stroke={theme.colors.perfectHit}
          strokeWidth={1.5}
          strokeOpacity={isFlashing ? 0.95 : 0.68}
        />
        {/* Center dot */}
        <Circle
          cx={cx}
          cy={cy}
          r={perfectR * 0.36}
          fill={theme.colors.perfectHit}
          fillOpacity={isFlashing ? 1 : 0.78}
        />
        {/* Gloss highlight */}
        <Ellipse
          cx={cx * 0.7}
          cy={cy * 0.45}
          rx={rx * 0.18}
          ry={ry * 0.22}
          fill="white"
          fillOpacity={0.1}
        />
      </Svg>

      {/* Rotating outer dashed ring */}
      <Animated.View
        style={{
          height,
          left: 0,
          position: 'absolute',
          top: 0,
          transform: [{ rotate: rotateInterpolated }],
          width,
        }}>
        <Svg width={width} height={height}>
          <Ellipse
            cx={cx}
            cy={cy}
            rx={rx - 1.5}
            ry={ry - 1.5}
            fill="none"
            stroke={accentColor}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            strokeOpacity={isFlashing ? 0.95 : 0.5}
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
});

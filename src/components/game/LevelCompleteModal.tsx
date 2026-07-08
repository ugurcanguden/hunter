import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';

type LevelCompleteModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
  onHome: () => void;
  stars: number;
  score: number;
  perfectCount: number;
  hitCount: number;
};

export function LevelCompleteModal({
  visible,
  onDismiss,
  onNextLevel,
  onRetry,
  onHome,
  stars,
  score,
  perfectCount,
  hitCount,
}: LevelCompleteModalProps) {
  const { t } = useI18n();
  const { theme } = useTheme();

  const starScales = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const titleTranslateY = useRef(new Animated.Value(18)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  const scoreAnim = useRef(new Animated.Value(0)).current;
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!visible) {
      starScales.forEach(s => s.setValue(0));
      titleTranslateY.setValue(18);
      titleOpacity.setValue(0);
      scoreAnim.setValue(0);
      setDisplayScore(0);
      return;
    }

    // Title slide in
    Animated.parallel([
      Animated.timing(titleTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Stars sequential pop
    const delays = [100, 280, 460];
    starScales.forEach((scale, i) => {
      if (i >= stars) {
        return;
      }
      setTimeout(() => {
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.45,
            useNativeDriver: true,
            speed: 60,
            bounciness: 8,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 25,
            bounciness: 3,
          }),
        ]).start();
      }, delays[i] ?? 0);
    });

    // Score count up
    Animated.timing(scoreAnim, {
      toValue: score,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const listener = scoreAnim.addListener(({ value }) => {
      setDisplayScore(Math.round(value));
    });

    return () => {
      scoreAnim.removeListener(listener);
    };
  }, [visible, score, scoreAnim, starScales, titleOpacity, titleTranslateY]);

  return (
    <CoreModal visible={visible} onDismiss={onDismiss} tone="success">
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateY: titleTranslateY }],
        }}>
        <CoreText variant="title" align="center">
          {t.game.completeTitle}
        </CoreText>
      </Animated.View>
      <View style={styles.starsRow}>
        {Array.from({ length: 3 }, (_, index) => (
          <Animated.View
            key={`result-star-${index}`}
            style={{ transform: [{ scale: starScales[index] ?? new Animated.Value(index < stars ? 1 : 0.6) }] }}>
            <CoreIcon
              name="star"
              size={28}
              color={index < stars ? theme.colors.perfectHit : theme.colors.borderSoft}
            />
          </Animated.View>
        ))}
      </View>
      <CoreText
        variant="body"
        colorRole="textSecondary"
        align="center"
        style={styles.sub}>
        {t.game.completeStars}
      </CoreText>
      <View style={styles.summaryRow}>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.score}
          </CoreText>
          <CoreText variant="subtitle" colorRole="perfectHit" align="center">
            {displayScore}
          </CoreText>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.hits}
          </CoreText>
          <CoreText variant="subtitle" colorRole="textPrimary" align="center">
            {hitCount}
          </CoreText>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: theme.colors.surfaceSoft,
              borderColor: theme.colors.borderSoft,
            },
          ]}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.common.perfect}
          </CoreText>
          <CoreText variant="subtitle" colorRole="perfectHit" align="center">
            {perfectCount}
          </CoreText>
        </View>
      </View>
      <View style={styles.actions}>
        <CoreButton label={t.common.nextLevel} onPress={onNextLevel} />
        <CoreButton label={t.common.retry} onPress={onRetry} variant="secondary" />
        <CoreButton label={t.common.homeAction} onPress={onHome} variant="ghost" />
      </View>
    </CoreModal>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 20,
  },
  starsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 14,
  },
  sub: {
    marginTop: 4,
  },
  summaryItem: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
});

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { AppBannerAd } from '@centerhit-features/ads/components/AppBannerAd';
import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { APP_NAME } from '@centerhit-core/constants/app';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { formatScore } from '@centerhit-core/utils/number';
import {
  resolveNextUnlockablePack,
  resolvePlayableLevelId,
} from '@centerhit-core/utils/progress';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { levelService } from '@centerhit-features/levels/services/levelService';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useMenuBackgroundMusic } from '@centerhit-game/hooks/useMenuBackgroundMusic';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCAN_LINE_DURATION = 5200;

function useScanLineAnim(delay: number) {
  const anim = useRef(new Animated.Value(-2)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: SCREEN_HEIGHT + 2,
        duration: SCAN_LINE_DURATION,
        easing: Easing.linear,
        delay,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [anim, delay]);
  return anim;
}

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  useMenuBackgroundMusic();

  const { t } = useI18n();
  const { theme } = useTheme();
  const progress = useProgressStore(state => state.progress);
  const packs = useCampaignStore(state => state.packs);
  const levels = levelService.getAllLevels();
  const playableLevelId = resolvePlayableLevelId(progress, levels);
  const unlockedCount = progress.unlockedLevelIds.length;
  const unlockedPackCount = progress.unlockedPackIds.length;
  const lastLevel = progress.lastPlayedLevelId
    ? levelService.getLevelById(progress.lastPlayedLevelId)
    : null;
  const continueLevel = playableLevelId
    ? levelService.getLevelById(playableLevelId)
    : null;
  const currentPack =
    continueLevel
      ? useCampaignStore.getState().getPackByLevelId(continueLevel.id)
      : packs[0] ?? null;
  const nextPack = resolveNextUnlockablePack(progress, packs);

  // Title mount animation
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.94)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 3,
      }),
    ]).start();
  }, [titleOpacity, titleScale]);

  // Featured card accent pulse
  const accentOpacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(accentOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(accentOpacity, {
          toValue: 0.6,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [accentOpacity]);

  // Primary button shimmer
  const shimmerX = useRef(new Animated.Value(-200)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 400,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerX]);

  // Scan lines
  const scan1 = useScanLineAnim(0);
  const scan2 = useScanLineAnim(1700);
  const scan3 = useScanLineAnim(3400);

  const handlePlay = () => {
    if (!playableLevelId) {
      return;
    }
    navigation.navigate(ROUTES.Game, { levelId: playableLevelId });
  };

  return (
    <CoreScreen scrollable contentStyle={styles.container}>
      {/* Static grid */}
      <View pointerEvents="none" style={styles.gridOverlay}>
        {Array.from({ length: 11 }, (_, index) => (
          <View
            key={`v-${index}`}
            style={[
              styles.gridLineVertical,
              { backgroundColor: theme.colors.accentPrimary, left: `${index * 10}%` },
            ]}
          />
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <View
            key={`h-${index}`}
            style={[
              styles.gridLineHorizontal,
              { backgroundColor: theme.colors.accentPrimary, top: index * 48 },
            ]}
          />
        ))}
      </View>

      {/* Scan lines */}
      <Animated.View
        pointerEvents="none"
        style={[styles.scanLine, { transform: [{ translateY: scan1 }] }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.scanLine, { transform: [{ translateY: scan2 }] }]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.scanLine, { transform: [{ translateY: scan3 }] }]}
      />

      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Animated.View
          style={[
            styles.headerCopy,
            { opacity: titleOpacity, transform: [{ scale: titleScale }] },
          ]}>
          <CoreText
            variant="display"
            style={[
              styles.headerTitle,
              { textShadowColor: theme.colors.accentPrimary },
            ]}>
            {APP_NAME}
          </CoreText>
          <CoreText variant="subtitle" colorRole="accentPrimary" style={styles.headerSubtitle}>
            {t.home.campaignProgress.toUpperCase()}
          </CoreText>
        </Animated.View>
        <View
          style={[
            styles.headerInfoButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}>
          <CoreIcon name="play" size={20} color={theme.colors.accentPrimary} />
        </View>
      </View>

      <View style={styles.hero}>
        <CoreText
          variant="body"
          colorRole="textSecondary"
          style={styles.subtitle}>
          {t.home.readyToContinue}
        </CoreText>
        <CoreCard variant="soft" style={styles.featuredCard}>
          <Animated.View
            style={[
              styles.featuredAccent,
              { backgroundColor: theme.colors.accentPrimary, opacity: accentOpacity },
            ]}
          />
          <View style={styles.featuredTop}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.lastOpenedLevel.toUpperCase()}
            </CoreText>
            <CoreButton
              label={t.common.continueAction}
              onPress={handlePlay}
              variant="ghost"
              compact
              style={styles.featuredContinueButton}
            />
          </View>
          <CoreText variant="title" style={styles.featuredTitle}>
            {continueLevel?.title ?? lastLevel?.title ?? 'Level 1'}
          </CoreText>
          <CoreText variant="body" colorRole="textSecondary" style={styles.featuredCopy}>
            {t.home.subtitle}
          </CoreText>
          <CoreText variant="caption" colorRole="textSecondary" style={styles.featuredHint}>
            {t.home.remoteContentHint}
          </CoreText>
        </CoreCard>
      </View>

      <View style={styles.actions}>
        {/* Primary button with shimmer */}
        <View style={[styles.primaryButtonWrap, { overflow: 'hidden', borderRadius: 999 }]}>
          <CoreButton
            label={t.common.continueAction.toUpperCase()}
            onPress={handlePlay}
            style={styles.primaryButton}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmer,
              { transform: [{ translateX: shimmerX }] },
            ]}
          />
        </View>
        <CoreButton
          label={t.common.levels.toUpperCase()}
          onPress={() => navigation.navigate(ROUTES.Levels)}
          variant="secondary"
          style={styles.secondaryButton}
        />
        <CoreButton
          label={t.common.settings.toUpperCase()}
          onPress={() => navigation.navigate(ROUTES.Settings)}
          variant="secondary"
          style={styles.secondaryButton}
        />
      </View>

      <View style={styles.summary}>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.summaryTitle}>
          {t.home.campaignProgress}
        </CoreText>
        <View style={styles.summaryGrid}>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.totalStars}
            </CoreText>
            <View style={styles.summaryValueRow}>
              <CoreText variant="title">{progress.totalStars}</CoreText>
              <CoreIcon name="star" size={16} color={theme.colors.warning} />
            </View>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.unlockedLevels}
            </CoreText>
            <View style={styles.summaryValueRow}>
              <CoreText variant="title">
                {unlockedCount}/{levels.length}
              </CoreText>
              <CoreIcon name="lock-open" size={16} color={theme.colors.accentPrimary} />
            </View>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.currentPack}
            </CoreText>
            <CoreText variant="subtitle" numberOfLines={1}>
              {currentPack?.title ?? 'Starter Circuit'}
            </CoreText>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.lastOpenedLevel}
            </CoreText>
            <CoreText variant="subtitle" numberOfLines={1}>
              {lastLevel?.title ?? 'Level 1'}
            </CoreText>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.bestScore}
            </CoreText>
            <CoreText variant="subtitle">{formatScore(progress.bestScore)}</CoreText>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.nextPack}
            </CoreText>
            <CoreText variant="subtitle" numberOfLines={1}>
              {nextPack?.title ?? `${unlockedPackCount} ${t.levels.packsUnlocked}`}
            </CoreText>
          </CoreCard>
        </View>
      </View>

      <AppBannerAd placement="home_banner" />
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 18,
  },
  container: {
    paddingBottom: 28,
    position: 'relative',
  },
  featuredAccent: {
    borderBottomLeftRadius: 32,
    borderTopLeftRadius: 32,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 5,
  },
  featuredCard: {
    borderRadius: 28,
    marginTop: 6,
    overflow: 'hidden',
    paddingLeft: 20,
    position: 'relative',
  },
  featuredContinueButton: {
    minWidth: 112,
  },
  featuredCopy: {
    maxWidth: 430,
  },
  featuredHint: {
    marginTop: 8,
  },
  featuredTitle: {
    marginBottom: 6,
    marginTop: 8,
  },
  featuredTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLineHorizontal: {
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  gridLineVertical: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  headerInfoButton: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    marginTop: 10,
  },
  headerSpacer: {
    height: 50,
    width: 50,
  },
  headerSubtitle: {
    letterSpacing: 1.4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 28,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  hero: {
    gap: 10,
    marginTop: 6,
  },
  primaryButton: {
    minHeight: 62,
  },
  primaryButtonWrap: {
    position: 'relative',
  },
  scanLine: {
    backgroundColor: 'rgba(60,230,255,0.055)',
    height: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  secondaryButton: {
    minHeight: 56,
  },
  shimmer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 80,
  },
  subtitle: {
    maxWidth: 300,
  },
  summary: {
    marginTop: 28,
  },
  summaryCard: {
    flexBasis: '47%',
    minHeight: 102,
    paddingVertical: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryTitle: {
    marginBottom: 10,
    paddingHorizontal: 6,
    textTransform: 'uppercase',
  },
  summaryValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { AppBannerAd } from '@centerhit-features/ads/components/AppBannerAd';
import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreCard } from '@centerhit-components/common/CoreCard';
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

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
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

  const handlePlay = () => {
    if (!playableLevelId) {
      return;
    }

    navigation.navigate(ROUTES.Game, { levelId: playableLevelId });
  };

  return (
    <CoreScreen scrollable contentStyle={styles.container}>
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

      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <View style={styles.headerCopy}>
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
        </View>
        <View
          style={[
            styles.headerInfoButton,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}>
          <CoreText variant="subtitle" colorRole="accentPrimary">
            ▶
          </CoreText>
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
          <View style={[styles.featuredAccent, { backgroundColor: theme.colors.accentPrimary }]} />
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
        <CoreButton
          label={t.common.continueAction.toUpperCase()}
          onPress={handlePlay}
          style={styles.primaryButton}
        />
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
              <CoreText variant="bodyStrong" colorRole="warning">
                ✪
              </CoreText>
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
              <CoreText variant="bodyStrong" colorRole="accentPrimary">
                🔓
              </CoreText>
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
  container: {
    paddingBottom: 28,
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.18,
  },
  gridLineVertical: {
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  gridLineHorizontal: {
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  hero: {
    gap: 10,
    marginTop: 6,
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
  headerCopy: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    lineHeight: 28,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSubtitle: {
    letterSpacing: 1.4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  headerInfoButton: {
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  subtitle: {
    maxWidth: 300,
  },
  featuredCard: {
    borderRadius: 28,
    marginTop: 6,
    overflow: 'hidden',
    paddingLeft: 20,
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
  featuredTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredContinueButton: {
    minWidth: 112,
  },
  featuredTitle: {
    marginBottom: 6,
    marginTop: 8,
  },
  featuredCopy: {
    maxWidth: 430,
  },
  featuredHint: {
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginTop: 18,
  },
  primaryButton: {
    minHeight: 62,
  },
  secondaryButton: {
    minHeight: 56,
  },
  summary: {
    marginTop: 28,
  },
  summaryTitle: {
    marginBottom: 10,
    paddingHorizontal: 6,
    textTransform: 'uppercase',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flexBasis: '47%',
    minHeight: 102,
    paddingVertical: 16,
  },
  summaryValueRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
});

import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { AppBannerAd } from '@centerhit-features/ads/components/AppBannerAd';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIcon } from '@centerhit-components/common/CoreIcon';
import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { resolvePlayableLevelId } from '@centerhit-core/utils/progress';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { LevelDefinition } from '@centerhit-features/levels/types/levelTypes';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { useMenuBackgroundMusic } from '@centerhit-game/hooks/useMenuBackgroundMusic';

function PackLevelTile({
  isCurrent,
  level,
  onPress,
  stars,
  unlocked,
}: {
  isCurrent: boolean;
  level: LevelDefinition;
  onPress: () => void;
  stars: number;
  unlocked: boolean;
}) {
  const { theme } = useTheme();
  const isCompleted = stars > 0;
  const tileStyle = {
    backgroundColor: isCurrent
      ? 'rgba(12, 67, 78, 0.72)'
      : theme.colors.backgroundSecondary,
    borderColor: isCurrent
      ? theme.colors.accentPrimary
      : !unlocked
        ? theme.colors.borderSoft
        : isCompleted
          ? theme.colors.stageRing
          : theme.colors.borderSoft,
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={!unlocked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tilePressable,
        { opacity: !unlocked ? 0.34 : pressed ? 0.88 : 1 },
      ]}>
      <View
        style={[
          styles.tile,
          tileStyle,
          isCurrent ? theme.shadows.glow : theme.shadows.card,
        ]}>
        {isCurrent ? (
          <View style={styles.tileCurrentBadge}>
            <CoreText variant="caption" colorRole="accentPrimary" style={styles.tileCurrentText}>
              PLAYING
            </CoreText>
          </View>
        ) : (
          <View style={styles.tileBadgeSpacer} />
        )}

        <CoreText variant="bodyStrong" colorRole="textSecondary" style={styles.tileLabel}>
          LVL {String(level.order).padStart(2, '0')}
        </CoreText>

        <View style={styles.tileBody}>
          {unlocked ? (
            <>
              <View style={styles.tileStarsRow}>
                {Array.from({ length: 3 }, (_, index) => (
                  <CoreIcon
                    key={`${level.id}-star-${index}`}
                    name="star"
                    size={15}
                    color={index < stars ? theme.colors.accentSecondary : theme.colors.border}
                  />
                ))}
              </View>

              <View
                style={[
                  styles.tileIconCircle,
                  {
                    backgroundColor: isCurrent
                      ? theme.colors.accentPrimary
                      : theme.colors.success,
                  },
                ]}>
                <CoreIcon
                  name={isCurrent ? 'play' : isCompleted ? 'checkmark' : 'ellipse'}
                  size={14}
                  color={theme.colors.backgroundPrimary}
                />
              </View>
            </>
          ) : (
            <View style={styles.tileLockedWrap}>
              <CoreIcon name="lock-closed" size={20} color={theme.colors.textSecondary} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function PackScreen({ navigation, route }: ScreenProps<'Pack'>) {
  useMenuBackgroundMusic();

  const { t } = useI18n();
  const { theme } = useTheme();
  const pack = useCampaignStore(state => state.getPackById(route.params.packId));
  const levelsByPackId = useCampaignStore(state => state.levelsByPackId);
  const loadedPackLevelIds = useCampaignStore(state => state.loadedPackLevelIds);
  const loadPackLevels = useCampaignStore(state => state.loadPackLevels);
  const isRefreshing = useCampaignStore(state => state.isRefreshing);
  const progress = useProgressStore(state => state.progress);
  const getStars = useProgressStore(state => state.getLevelStars);
  const isLevelUnlocked = useProgressStore(state => state.isLevelUnlocked);
  const isPackUnlocked = useProgressStore(state => state.isPackUnlocked);

  useEffect(() => {
    if (!pack) {
      navigation.replace(ROUTES.Levels);
      return;
    }

    if (!isPackUnlocked(pack.packId)) {
      navigation.replace(ROUTES.Levels);
      return;
    }

    if (!loadedPackLevelIds.includes(pack.packId)) {
      loadPackLevels(pack.packId).catch(() => undefined);
    }
  }, [isPackUnlocked, loadPackLevels, loadedPackLevelIds, navigation, pack]);

  if (!pack) {
    return null;
  }

  const levels = (levelsByPackId[pack.packId] ?? [])
    .slice()
    .sort((left, right) => left.order - right.order);
  const nextPlayableLevelId = resolvePlayableLevelId(progress, levels);
  const loading =
    pack.packId !== 'pack-01' &&
    !loadedPackLevelIds.includes(pack.packId) &&
    isRefreshing;
  const completedCount = levels.filter(level => getStars(level.id) > 0).length;
  const completionRatio = levels.length > 0 ? completedCount / levels.length : 0;
  const completionPercent = Math.round(completionRatio * 100);
  const chapterSubtitle =
    pack.subtitle?.toUpperCase() ??
    `${pack.levelCount} ${t.common.levelsCount}`.toUpperCase();

  return (
    <CoreScreen scrollable contentStyle={styles.container}>
      <View pointerEvents="none" style={styles.gridOverlay}>
        {Array.from({ length: 11 }, (_, index) => (
          <View
            key={`v-${index}`}
            style={[
              styles.gridLineVertical,
              {
                backgroundColor: theme.colors.accentPrimary,
                left: `${index * 10}%`,
              },
            ]}
          />
        ))}
        {Array.from({ length: 18 }, (_, index) => (
          <View
            key={`h-${index}`}
            style={[
              styles.gridLineHorizontal,
              {
                backgroundColor: theme.colors.accentPrimary,
                top: index * 48,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.headerRow}>
        <CoreIconButton
          icon="chevron-back"
          onPress={() => navigation.goBack()}
          accessibilityLabel={t.common.levels}
          style={styles.headerButton}
        />

        <View style={styles.headerCopy}>
          <CoreText
            variant="display"
            style={[styles.headerTitle, { textShadowColor: theme.colors.accentPrimary }]}>
            {pack.title.toUpperCase()}
          </CoreText>
          <CoreText
            variant="subtitle"
            colorRole="accentPrimary"
            style={styles.headerSubtitle}>
            {chapterSubtitle}
          </CoreText>
        </View>

        <View
          style={[
            styles.headerInfoButton,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
          ]}>
          <CoreIcon name="information-circle" size={20} color={theme.colors.accentPrimary} />
        </View>
      </View>

      {loading ? (
        <CoreCard variant="soft" style={styles.loadingCard}>
          <ActivityIndicator />
          <CoreText variant="caption" colorRole="textSecondary">
            {t.levels.loadingPack}
          </CoreText>
        </CoreCard>
      ) : null}

      <CoreCard variant="soft" style={styles.progressCard}>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.progressKicker}>
          {t.home.campaignProgress.toUpperCase()}
        </CoreText>
        <View style={styles.progressHeader}>
          <CoreText variant="title" style={styles.progressTitle}>
            {completedCount}/{levels.length} {t.common.levels} {t.common.completed}
          </CoreText>
          <CoreText variant="title" colorRole="warning">
            {completionPercent}%
          </CoreText>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.overlay }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.warning,
                width: `${completionRatio * 100}%`,
              },
            ]}
          />
        </View>
      </CoreCard>

      <View style={styles.grid}>
        {levels.map(level => (
          <PackLevelTile
            key={level.id}
            isCurrent={level.id === nextPlayableLevelId}
            level={level}
            onPress={() => navigation.navigate(ROUTES.Game, { levelId: level.id })}
            stars={getStars(level.id)}
            unlocked={isLevelUnlocked(level.id)}
          />
        ))}
      </View>

      <AppBannerAd placement="campaign_banner" />
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
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    marginTop: 10,
  },
  headerButton: {
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
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  headerSubtitle: {
    letterSpacing: 1.6,
    marginTop: 4,
    textAlign: 'center',
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
  loadingCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 30,
    marginBottom: 24,
  },
  progressKicker: {
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 12,
  },
  progressTitle: {
    fontSize: 20,
    lineHeight: 26,
  },
  progressTrack: {
    borderRadius: 999,
    height: 14,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  tilePressable: {
    width: '48.5%',
  },
  tile: {
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: 1,
    minHeight: 188,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  tileCurrentBadge: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  tileCurrentText: {
    letterSpacing: 2.6,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  tileBadgeSpacer: {
    height: 24,
    marginBottom: 12,
  },
  tileLabel: {
    opacity: 0.84,
    textTransform: 'uppercase',
  },
  tileBody: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  tileStarsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 24,
  },
  tileIconCircle: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  tileLockedWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

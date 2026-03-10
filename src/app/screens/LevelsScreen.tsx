import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { AppBannerAd } from '@centerhit-features/ads/components/AppBannerAd';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { PackCard } from '@centerhit-components/game/PackCard';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import {
  isPackCompleted,
  resolveNextUnlockablePack,
  resolvePlayableLevelId,
} from '@centerhit-core/utils/progress';
import { useCampaignStore } from '@centerhit-features/campaign/store/useCampaignStore';
import { levelService } from '@centerhit-features/levels/services/levelService';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';

export function LevelsScreen({ navigation }: ScreenProps<'Levels'>) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const packs = useCampaignStore(state => state.packs);
  const levelsByPackId = useCampaignStore(state => state.levelsByPackId);
  const levels = levelService.getAllLevels();
  const progress = useProgressStore(state => state.progress);
  const isPackUnlocked = useProgressStore(state => state.isPackUnlocked);
  const nextPlayableLevelId = resolvePlayableLevelId(progress, levels);
  const nextPack = resolveNextUnlockablePack(progress, packs);
  const unlockedPackCount = progress.unlockedPackIds.length;
  const completionRatio = packs.length > 0 ? unlockedPackCount / packs.length : 0;
  const completionPercent = Math.round(completionRatio * 100);
  const nextPlayableLevelTitle = levelService.getLevelById(nextPlayableLevelId ?? '')?.title ?? 'Level 1';

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
          icon="←"
          onPress={() => navigation.navigate(ROUTES.Home)}
          accessibilityLabel={t.common.homeAction}
          style={styles.headerButton}
        />

        <View style={styles.headerCopy}>
          <CoreText
            variant="display"
            style={[styles.headerTitle, { textShadowColor: theme.colors.accentPrimary }]}>
            {t.levels.title.toUpperCase()}
          </CoreText>
          <CoreText
            variant="subtitle"
            colorRole="accentPrimary"
            style={styles.headerSubtitle}>
            {t.home.campaignProgress.toUpperCase()}
          </CoreText>
        </View>

        <View
          style={[
            styles.headerInfoButton,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}>
          <CoreText variant="subtitle" colorRole="accentPrimary">
            i
          </CoreText>
        </View>
      </View>

      <CoreCard variant="soft" style={styles.progressCard}>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.progressKicker}>
          {t.levels.campaignStatus.toUpperCase()}
        </CoreText>
        <View style={styles.progressHeader}>
          <CoreText variant="title" style={styles.progressTitle}>
            {unlockedPackCount}/{packs.length} {t.levels.packsUnlocked}
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
        <View style={styles.progressMetaRow}>
          <View style={styles.progressMetaItem}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.levels.nextPlayable.toUpperCase()}
            </CoreText>
            <CoreText variant="bodyStrong">{nextPlayableLevelTitle}</CoreText>
          </View>
          <View style={styles.progressMetaItem}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.common.next.toUpperCase()} {t.common.pack.toUpperCase()}
            </CoreText>
            <CoreText variant="bodyStrong">{nextPack?.title ?? 'Starter Circuit'}</CoreText>
          </View>
        </View>
      </CoreCard>

      <CoreText variant="caption" colorRole="textSecondary" style={styles.helperText}>
        {t.levels.tapToOpen}
      </CoreText>

      <View style={styles.packList}>
        {packs.map(pack => {
          const packLevels = levelsByPackId[pack.packId] ?? [];
          const packUnlocked = isPackUnlocked(pack.packId);
          const completed = isPackCompleted(progress, pack, packLevels);

          return (
            <View key={pack.packId} style={styles.packSection}>
              <PackCard
                order={pack.order}
                title={pack.title}
                subtitle={pack.subtitle}
                levelCount={pack.levelCount}
                locked={!packUnlocked}
                completed={completed}
                expanded={false}
                highlighted={nextPack?.packId === pack.packId}
                onPress={() => {
                  if (!packUnlocked) {
                    return;
                  }

                  navigation.navigate(ROUTES.Pack, { packId: pack.packId });
                }}
              />
            </View>
          );
        })}
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
  progressCard: {
    borderRadius: 28,
    marginBottom: 16,
    paddingVertical: 18,
  },
  progressKicker: {
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  progressHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 10,
  },
  progressTitle: {
    maxWidth: '78%',
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
  progressMetaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  progressMetaItem: {
    flex: 1,
    gap: 6,
  },
  helperText: {
    marginBottom: 12,
    paddingHorizontal: 6,
    textTransform: 'uppercase',
  },
  packList: {
    gap: 14,
    paddingBottom: 24,
  },
  packSection: {
    marginBottom: 6,
  },
});

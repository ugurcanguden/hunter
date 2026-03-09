import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { APP_NAME } from '@centerhit-core/constants/app';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { formatScore } from '@centerhit-core/utils/number';
import { resolvePlayableLevelId } from '@centerhit-core/utils/progress';
import { levelService } from '@centerhit-features/levels/services/levelService';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';

export function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { t } = useI18n();
  const progress = useProgressStore(state => state.progress);
  const levels = levelService.getAllLevels();
  const playableLevelId = resolvePlayableLevelId(progress, levels);
  const unlockedCount = progress.unlockedLevelIds.length;
  const lastLevel = progress.lastPlayedLevelId
    ? levelService.getLevelById(progress.lastPlayedLevelId)
    : null;
  const continueLevel = playableLevelId
    ? levelService.getLevelById(playableLevelId)
    : null;

  const handlePlay = () => {
    if (!playableLevelId) {
      return;
    }

    navigation.navigate(ROUTES.Game, { levelId: playableLevelId });
  };

  return (
    <CoreScreen contentStyle={styles.container}>
      <View style={styles.hero}>
        <CoreText variant="caption" colorRole="accentPrimary" style={styles.kicker}>
          {t.common.campaign}
        </CoreText>
        <CoreText variant="display">{APP_NAME}</CoreText>
        <CoreText variant="body" colorRole="textSecondary" style={styles.subtitle}>
          {t.home.readyToContinue}
        </CoreText>
        <CoreCard variant="soft" style={styles.featuredCard}>
          <View style={styles.featuredTop}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.lastOpenedLevel}
            </CoreText>
            <CoreText variant="caption" colorRole="accentPrimary">
              {t.common.continueAction}
            </CoreText>
          </View>
          <CoreText variant="title" style={styles.featuredTitle}>
            {continueLevel?.title ?? lastLevel?.title ?? 'Level 1'}
          </CoreText>
          <CoreText variant="body" colorRole="textSecondary">
            {t.home.subtitle}
          </CoreText>
        </CoreCard>
      </View>

      <View style={styles.actions}>
        <CoreButton label={t.common.continueAction} onPress={handlePlay} />
        <CoreButton
          label={t.common.levels}
          onPress={() => navigation.navigate(ROUTES.Levels)}
          variant="secondary"
        />
        <CoreButton
          label={t.common.settings}
          onPress={() => navigation.navigate(ROUTES.Settings)}
          variant="ghost"
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
            <CoreText variant="subtitle">{progress.totalStars}</CoreText>
          </CoreCard>
          <CoreCard variant="soft" style={styles.summaryCard}>
            <CoreText variant="caption" colorRole="textSecondary">
              {t.home.unlockedLevels}
            </CoreText>
            <CoreText variant="subtitle">
              {unlockedCount}/{levels.length}
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
        </View>
      </View>
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  hero: {
    gap: 12,
  },
  kicker: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  subtitle: {
    maxWidth: 320,
  },
  featuredCard: {
    marginTop: 8,
  },
  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredTitle: {
    marginBottom: 8,
    marginTop: 10,
  },
  actions: {
    gap: 12,
  },
  summary: {
    marginTop: 24,
  },
  summaryTitle: {
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flexBasis: '47%',
    minHeight: 88,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
});

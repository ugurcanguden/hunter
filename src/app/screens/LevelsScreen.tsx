import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { LevelCard } from '@centerhit-components/game/LevelCard';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { resolvePlayableLevelId } from '@centerhit-core/utils/progress';
import { levelService } from '@centerhit-features/levels/services/levelService';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';

export function LevelsScreen({ navigation }: ScreenProps<'Levels'>) {
  const { t } = useI18n();
  const levels = levelService.getAllLevels();
  const progress = useProgressStore(state => state.progress);
  const isUnlocked = useProgressStore(state => state.isLevelUnlocked);
  const getStars = useProgressStore(state => state.getLevelStars);
  const nextPlayableLevelId = resolvePlayableLevelId(progress, levels);

  return (
    <CoreScreen contentStyle={styles.container}>
      <View style={styles.topBar}>
        <CoreIconButton
          icon="←"
          onPress={() => navigation.navigate(ROUTES.Home)}
          accessibilityLabel={t.common.homeAction}
        />
      </View>

      <View style={styles.header}>
        <CoreText variant="title">{t.levels.title}</CoreText>
        <CoreText variant="body" colorRole="textSecondary">
          {progress.unlockedLevelIds.length}/{levels.length} {t.common.unlocked.toLowerCase()} • {progress.totalStars}★
        </CoreText>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.headerMeta}>
          {t.levels.nextPlayable}: {levelService.getLevelById(nextPlayableLevelId ?? '')?.title ?? 'Level 1'}
        </CoreText>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={levels}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.cardCell}>
            <LevelCard
              level={item}
              stars={getStars(item.id)}
              highlighted={item.id === nextPlayableLevelId}
              unlocked={isUnlocked(item.id)}
              onPress={() => navigation.navigate(ROUTES.Game, { levelId: item.id })}
            />
          </View>
        )}
      />
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  header: {
    marginBottom: 20,
  },
  headerMeta: {
    marginTop: 8,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    justifyContent: 'space-between',
  },
  cardCell: {
    flex: 1,
  },
});

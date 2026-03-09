import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import { ScreenProps } from '@centerhit-app/navigation/navigationTypes';
import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreScreen } from '@centerhit-components/common/CoreScreen';
import { CoreText } from '@centerhit-components/common/CoreText';
import { GameOverModal } from '@centerhit-components/game/GameOverModal';
import { GameOverlayMessage } from '@centerhit-components/game/GameOverlayMessage';
import { GameTopBar } from '@centerhit-components/game/GameTopBar';
import { HudStatCard } from '@centerhit-components/game/HudStatCard';
import { LevelCompleteModal } from '@centerhit-components/game/LevelCompleteModal';
import { PauseModal } from '@centerhit-components/game/PauseModal';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { levelService } from '@centerhit-features/levels/services/levelService';
import { useProgressStore } from '@centerhit-features/progress/store/useProgressStore';
import { gameDefaults } from '@centerhit-game/config/gameDefaults';
import { useGameFeedbackEffects } from '@centerhit-game/hooks/useGameFeedbackEffects';
import { useGameSession } from '@centerhit-game/hooks/useGameSession';
import { buildObjectiveSummary } from '@centerhit-game/systems/objectiveSystem';
import { getNextStarProgress } from '@centerhit-game/systems/scoringSystem';

export function GameScreen({ navigation, route }: ScreenProps<'Game'>) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [pauseVisible, setPauseVisible] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const progress = useProgressStore(state => state.progress);
  const setLastPlayedLevel = useProgressStore(state => state.setLastPlayedLevel);
  const saveLevelResult = useProgressStore(state => state.saveLevelResult);
  const hasSavedCompletionRef = useRef(false);
  const level = useMemo(
    () => levelService.getLevelById(route.params.levelId),
    [route.params.levelId],
  );
  const fallbackLevel = useMemo(
    () => levelService.getInitialPlayableLevel(progress),
    [progress],
  );
  const safeLevel = level ?? fallbackLevel ?? levelService.getAllLevels()[0]!;
  const { session, pause, resume, retry, shoot } = useGameSession(safeLevel);
  useGameFeedbackEffects(session);
  const objectiveSummary = useMemo(
    () => buildObjectiveSummary(session),
    [session],
  );
  const scoreProgress = useMemo(
    () => getNextStarProgress(safeLevel, session.score),
    [safeLevel, session.score],
  );
  const scoreSubtitle = useMemo(() => {
    if (scoreProgress.targetStars === null) {
      return t.game.maxStars;
    }

    return `${scoreProgress.remainingScore} • ${scoreProgress.targetStars}★ ${t.game.nextStarIn}`;
  }, [scoreProgress.remainingScore, scoreProgress.targetStars, t.game.maxStars, t.game.nextStarIn]);
  const failReason = useMemo(
    () => {
      if (session.failReason === 'shot-limit') {
        return `${t.game.failShotsCopy} ${t.common.shots}: ${objectiveSummary.shots}`;
      }

      return `${t.game.failMissCopy} ${t.game.mistakesLeft}: ${objectiveSummary.mistakes}`;
    },
    [
      objectiveSummary.mistakes,
      objectiveSummary.shots,
      session.failReason,
      t.game.failMissCopy,
      t.game.failShotsCopy,
      t.game.mistakesLeft,
      t.common.shots,
    ],
  );

  useEffect(() => {
    hasSavedCompletionRef.current = false;
  }, [safeLevel.id]);

  useEffect(() => {
    if (!level) {
      if (fallbackLevel) {
        navigation.replace(ROUTES.Game, { levelId: fallbackLevel.id });
        return;
      }

      navigation.replace(ROUTES.Home);
      return;
    }

    setLastPlayedLevel(level.id).catch(() => undefined);
  }, [fallbackLevel, level, navigation, setLastPlayedLevel]);

  useEffect(() => {
    if (session.status === 'playing') {
      hasSavedCompletionRef.current = false;
    }
  }, [session.status]);

  useEffect(() => {
    if (session.status !== 'completed' || hasSavedCompletionRef.current) {
      return;
    }

    hasSavedCompletionRef.current = true;
    saveLevelResult({
      levelId: safeLevel.id,
      stars: session.awardedStars,
      score: session.score,
      perfectCount: session.perfectHits,
      completedAt: new Date().toISOString(),
    }).catch(() => {
      hasSavedCompletionRef.current = false;
    });
  }, [
    saveLevelResult,
    safeLevel.id,
    session.awardedStars,
    session.perfectHits,
    session.score,
    session.status,
  ]);

  if (!level || !safeLevel) {
    return null;
  }
  const nextLevel = levelService.getNextLevel(safeLevel.id);
  const handleExitToHome = () => {
    setPauseVisible(false);
    navigation.replace(ROUTES.Home);
  };
  const handleExitToLevels = () => {
    setPauseVisible(false);
    navigation.replace(ROUTES.Levels);
  };
  const handleStageLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setStageSize({ width, height });
  };
  const targetWidth = stageSize.width * session.target.width;
  const targetHeight = stageSize.height * session.target.height;
  const launcherWidth = stageSize.width * session.launcher.width;
  const launcherHeight = Math.max(10, stageSize.height * session.launcher.height);
  const projectileSize = Math.max(10, stageSize.width * session.projectile.radius * 2);
  const projectileTrailHeight = projectileSize * gameDefaults.projectileTrailStretch;
  const projectileTrailWidth = projectileSize * gameDefaults.projectileTrailWidthFactor;
  const feedbackTitle =
    session.feedback.type === 'perfect'
      ? t.game.perfect
      : session.feedback.type === 'good'
        ? t.game.good
        : session.feedback.type === 'blocked'
          ? t.game.blocked
        : session.feedback.type === 'miss'
          ? t.game.miss
          : null;
  const feedbackSubtitle =
    session.feedback.type === 'blocked' ? t.game.blockedHint : undefined;
  const targetFlashActive = session.visualFeedback.targetFlashMs > 0;
  const targetFlashColor =
    session.visualFeedback.targetFlashTone === 'perfect'
      ? theme.colors.perfectHit
      : theme.colors.goodHit;
  const targetFlashScale =
    session.visualFeedback.targetFlashTone === 'perfect' ? 1.08 : 1.03;
  const stageEffectStyle = session.visualFeedback.stageEffectTone
    ? {
        backgroundColor:
          session.visualFeedback.stageEffectTone === 'success'
            ? theme.colors.success
            : session.visualFeedback.stageEffectTone === 'danger'
              ? theme.colors.danger
              : theme.colors.perfectHit,
        opacity:
          session.visualFeedback.stageEffectTone === 'success'
            ? 0.1
            : session.visualFeedback.stageEffectTone === 'danger'
              ? 0.08
              : 0.12,
      }
    : null;

  return (
    <CoreScreen contentStyle={styles.container}>
      <GameTopBar
        title={safeLevel.title}
        onBack={() => navigation.goBack()}
        onPause={() => {
          pause();
          setPauseVisible(true);
        }}
      />

      <View style={styles.hudRow}>
        <HudStatCard
          label={t.common.score}
          value={session.score}
          subtitle={scoreSubtitle}
        />
        <HudStatCard
          label={t.common.hits}
          value={`${session.hits}/${safeLevel.objective.requiredHits}`}
        />
        <HudStatCard label={t.common.perfect} value={session.perfectHits} />
      </View>

      <View style={styles.gameArea}>
        <Pressable
          disabled={session.status !== 'playing'}
          onLayout={handleStageLayout}
          onPress={() => shoot()}
          style={[
            styles.stageShell,
            {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.stageRing,
            },
            theme.shadows.stage,
          ]}>
          <View style={styles.targetZone} />

          {stageEffectStyle ? <View pointerEvents="none" style={[styles.stageEffect, stageEffectStyle]} /> : null}

          {stageSize.width > 0 ? (
            <>
              {session.obstacles.map(obstacle => {
                const obstacleFlashActive =
                  session.visualFeedback.obstacleFlashId === obstacle.id &&
                  session.visualFeedback.obstacleFlashMs > 0;

                return (
                  <View
                    key={obstacle.id}
                    style={[
                      styles.obstaclePiece,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: obstacleFlashActive
                          ? theme.colors.warning
                          : theme.colors.accentSecondary,
                        height: stageSize.height * obstacle.height,
                        left:
                          obstacle.x * stageSize.width -
                          (stageSize.width * obstacle.width) / 2,
                        top:
                          obstacle.y * stageSize.height -
                          (stageSize.height * obstacle.height) / 2,
                        transform: [{ scale: obstacleFlashActive ? 1.04 : 1 }],
                        width: stageSize.width * obstacle.width,
                      },
                      obstacleFlashActive ? theme.shadows.glow : theme.shadows.card,
                    ]}>
                    <View
                      style={[
                        styles.obstacleEdge,
                        {
                          backgroundColor: obstacleFlashActive
                            ? theme.colors.perfectHit
                            : theme.colors.warning,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.obstacleCore,
                        {
                          backgroundColor: theme.colors.surfaceSoft,
                          borderColor: theme.colors.border,
                        },
                      ]}>
                      <View style={styles.obstacleStripeRow}>
                        <View
                          style={[
                            styles.obstacleStripe,
                            { backgroundColor: theme.colors.accentSecondary },
                          ]}
                        />
                        <View
                          style={[
                            styles.obstacleStripe,
                            { backgroundColor: theme.colors.warning },
                          ]}
                        />
                        <View
                          style={[
                            styles.obstacleStripe,
                            { backgroundColor: theme.colors.accentSecondary },
                          ]}
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.obstacleEdge,
                        styles.obstacleEdgeBottom,
                        {
                          backgroundColor: obstacleFlashActive
                            ? theme.colors.warning
                            : theme.colors.accentSecondary,
                        },
                      ]}
                    />
                  </View>
                );
              })}

              <View
                style={[
                  styles.targetPiece,
                  {
                    backgroundColor: targetFlashActive ? targetFlashColor : theme.colors.accentPrimary,
                    borderColor: targetFlashActive ? theme.colors.perfectHit : theme.colors.accentPrimary,
                    height: targetHeight,
                    left: session.target.x * stageSize.width - targetWidth / 2,
                    top: session.target.y * stageSize.height - targetHeight / 2,
                    transform: [{ scale: targetFlashActive ? targetFlashScale : 1 }],
                    width: targetWidth,
                  },
                  targetFlashActive ? styles.targetPieceFlash : undefined,
                  targetFlashActive ? theme.shadows.glow : theme.shadows.glow,
                ]}>
                <View
                  style={[
                    styles.targetInner,
                    {
                      backgroundColor: theme.colors.perfectHit,
                      opacity: targetFlashActive ? 0.9 : 0.72,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.targetHighlight,
                    {
                      backgroundColor: theme.colors.backgroundPrimary,
                    },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.launcherPiece,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.accentPrimary,
                    bottom:
                      (1 - session.launcher.y) * stageSize.height - launcherHeight / 2,
                    height: launcherHeight,
                    left: session.launcher.x * stageSize.width - launcherWidth / 2,
                    width: launcherWidth,
                  },
                ]}>
                <View
                  style={[
                    styles.launcherCore,
                    {
                      backgroundColor: theme.colors.accentPrimary,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.launcherCap,
                    {
                      backgroundColor: theme.colors.perfectHit,
                    },
                  ]}
                />
              </View>

              <View
                style={[
                  styles.spawnPoint,
                  {
                    backgroundColor: theme.colors.perfectHit,
                    borderColor: theme.colors.accentPrimary,
                    bottom:
                      (1 - session.launcher.y) * stageSize.height +
                      launcherHeight / 2 +
                      10,
                    left: session.launcher.x * stageSize.width - projectileSize / 2,
                  },
                ]}
              />

              {session.projectile.isActive ? (
                <>
                  <View
                    style={[
                      styles.projectileTrail,
                      {
                        backgroundColor: theme.colors.goodHit,
                        height: projectileTrailHeight,
                        left:
                          session.projectile.x * stageSize.width - projectileTrailWidth / 2,
                        top:
                          session.projectile.y * stageSize.height - projectileSize / 2,
                        width: projectileTrailWidth,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.projectileTrailGlow,
                      {
                        backgroundColor: theme.colors.perfectHit,
                        height: projectileTrailHeight * 0.7,
                        left:
                          session.projectile.x * stageSize.width -
                          projectileTrailWidth * 0.32,
                        top:
                          session.projectile.y * stageSize.height -
                          projectileSize * 0.1,
                        width: projectileTrailWidth * 0.64,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.projectile,
                      {
                        backgroundColor: theme.colors.goodHit,
                        borderColor: theme.colors.perfectHit,
                        height: projectileSize,
                        left:
                          session.projectile.x * stageSize.width - projectileSize / 2,
                        top: session.projectile.y * stageSize.height - projectileSize / 2,
                        width: projectileSize,
                      },
                      theme.shadows.glow,
                    ]}
                  />
                </>
              ) : null}
            </>
          ) : null}

          <View style={styles.launcherZone} />
        </Pressable>

        {feedbackTitle ? (
          <GameOverlayMessage
            title={feedbackTitle}
            subtitle={feedbackSubtitle}
            tone={session.feedback.type ?? 'good'}
          />
        ) : null}
      </View>

      <View style={styles.objectiveInfo}>
        <CoreText variant="caption" colorRole="textSecondary" style={styles.objectiveLabel}>
          {t.game.objectiveLabel}
        </CoreText>
        <CoreCard variant="soft" style={styles.objectiveStrip}>
          <View style={styles.objectiveGrid}>
            <View style={styles.objectiveItem}>
              <View
                style={[
                  styles.objectiveIcon,
                  { backgroundColor: theme.colors.stageGlow, borderColor: theme.colors.accentPrimary },
                ]}>
                <CoreText variant="caption" style={{ color: theme.colors.accentPrimary }}>
                  H
                </CoreText>
              </View>
              <View style={styles.objectiveTextWrap}>
                <CoreText variant="caption" colorRole="textSecondary">
                  {t.common.hits}
                </CoreText>
                <CoreText variant="bodyStrong">{objectiveSummary.hits}</CoreText>
              </View>
            </View>

            <View style={styles.objectiveItem}>
              <View
                style={[
                  styles.objectiveIcon,
                  { backgroundColor: theme.colors.stageGlow, borderColor: theme.colors.perfectHit },
                ]}>
                <CoreText variant="caption" style={{ color: theme.colors.perfectHit }}>
                  P
                </CoreText>
              </View>
              <View style={styles.objectiveTextWrap}>
                <CoreText variant="caption" colorRole="textSecondary">
                  {t.common.perfect}
                </CoreText>
                <CoreText variant="bodyStrong">{objectiveSummary.perfectHits}</CoreText>
              </View>
            </View>

            <View style={styles.objectiveItem}>
              <View
                style={[
                  styles.objectiveIcon,
                  { backgroundColor: theme.colors.overlay, borderColor: theme.colors.missHit },
                ]}>
                <CoreText variant="caption" style={{ color: theme.colors.missHit }}>
                  M
                </CoreText>
              </View>
              <View style={styles.objectiveTextWrap}>
                <CoreText variant="caption" colorRole="textSecondary">
                  {t.game.mistakesLeft}
                </CoreText>
                <CoreText variant="bodyStrong">{objectiveSummary.mistakes}</CoreText>
              </View>
            </View>

            <View style={styles.objectiveItem}>
              <View
                style={[
                  styles.objectiveIcon,
                  { backgroundColor: theme.colors.overlay, borderColor: theme.colors.accentSecondary },
                ]}>
                <CoreText variant="caption" style={{ color: theme.colors.accentSecondary }}>
                  S
                </CoreText>
              </View>
              <View style={styles.objectiveTextWrap}>
                <CoreText variant="caption" colorRole="textSecondary">
                  {t.common.shots}
                </CoreText>
                <CoreText variant="bodyStrong">{objectiveSummary.shots}</CoreText>
              </View>
            </View>
          </View>
        </CoreCard>
      </View>

      <PauseModal
        visible={pauseVisible}
        onDismiss={() => setPauseVisible(false)}
        onResume={() => {
          resume();
          setPauseVisible(false);
        }}
        onRetry={() => {
          retry();
          setPauseVisible(false);
        }}
        onHome={handleExitToHome}
      />

      <LevelCompleteModal
        visible={session.status === 'completed'}
        onDismiss={() => undefined}
        stars={session.awardedStars}
        score={session.score}
        hitCount={session.hits}
        perfectCount={session.perfectHits}
        onNextLevel={() => {
          if (nextLevel) {
            navigation.replace(ROUTES.Game, { levelId: nextLevel.id });
            return;
          }

          navigation.navigate(ROUTES.Levels);
        }}
        onRetry={() => {
          retry();
          hasSavedCompletionRef.current = false;
        }}
        onHome={handleExitToHome}
      />

      <GameOverModal
        visible={session.status === 'failed'}
        onDismiss={() => undefined}
        reason={failReason}
        onRetry={() => {
          retry();
          hasSavedCompletionRef.current = false;
        }}
        onLevels={handleExitToLevels}
        onHome={handleExitToHome}
      />
    </CoreScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  hudRow: {
    flexDirection: 'row',
    gap: gameDefaults.hudGap,
    marginBottom: gameDefaults.hudMarginBottom,
  },
  gameArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginBottom: 16,
    minHeight: gameDefaults.gameAreaMinHeight,
    overflow: 'hidden',
    marginHorizontal: -16,
    paddingHorizontal: 0,
    paddingVertical: 10,
    position: 'relative',
  },
  stageShell: {
    alignItems: 'stretch',
    alignSelf: 'stretch',
    borderRadius: 0,
    borderWidth: 0,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: gameDefaults.stageMinHeight,
    paddingHorizontal: gameDefaults.stageHorizontalPadding,
    paddingVertical: 8,
  },
  targetZone: {
    alignItems: 'center',
    minHeight: 28,
  },
  stageEffect: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  targetPiece: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
  },
  targetPieceFlash: {
    borderWidth: 2,
  },
  targetInner: {
    borderRadius: 999,
    height: '52%',
    width: '58%',
  },
  targetHighlight: {
    borderRadius: 999,
    height: 4,
    opacity: 0.18,
    position: 'absolute',
    top: '22%',
    width: '62%',
  },
  spawnPoint: {
    borderRadius: 999,
    borderWidth: 2,
    height: 12,
    position: 'absolute',
    width: 12,
  },
  launcherZone: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 36,
  },
  launcherPiece: {
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
  },
  launcherCore: {
    alignSelf: 'center',
    borderRadius: 999,
    height: '44%',
    width: '78%',
  },
  launcherCap: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 3,
    opacity: 0.9,
    position: 'absolute',
    top: '22%',
    width: '42%',
  },
  projectile: {
    borderRadius: 999,
    borderWidth: 1,
    position: 'absolute',
  },
  projectileTrail: {
    borderRadius: 999,
    opacity: 0.18,
    position: 'absolute',
  },
  projectileTrailGlow: {
    borderRadius: 999,
    opacity: 0.2,
    position: 'absolute',
  },
  obstaclePiece: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
  },
  obstacleEdge: {
    height: 3,
    left: 0,
    opacity: 0.95,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  obstacleEdgeBottom: {
    bottom: 0,
    top: 'auto',
  },
  obstacleCore: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: '72%',
    justifyContent: 'center',
    width: '88%',
  },
  obstacleStripeRow: {
    flexDirection: 'row',
    gap: 6,
    width: '72%',
  },
  obstacleStripe: {
    borderRadius: 999,
    flex: 1,
    height: 5,
    opacity: 0.92,
  },
  objectiveInfo: {
    gap: 8,
    paddingBottom: gameDefaults.objectiveFooterPaddingBottom,
    paddingHorizontal: 2,
  },
  objectiveLabel: {
    paddingHorizontal: 6,
  },
  objectiveStrip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  objectiveGrid: {
    columnGap: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
  },
  objectiveItem: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: '47%',
  },
  objectiveIcon: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    marginRight: 10,
    width: 32,
  },
  objectiveTextWrap: {
    flex: 1,
  },
});

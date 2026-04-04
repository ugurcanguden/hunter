import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreCard } from '@centerhit-components/common/CoreCard';
import { CoreText } from '@centerhit-components/common/CoreText';
import { APP_NAME } from '@centerhit-core/constants/app';
import { useI18n } from '@centerhit-core/i18n/useI18n';
import { useTheme } from '@centerhit-core/theme/useTheme';
import { VersionCheckResult } from '@centerhit-features/version/types/versionTypes';

type ForceUpdateScreenProps = {
  result: VersionCheckResult;
};

export function ForceUpdateScreen({ result }: ForceUpdateScreenProps) {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]}>
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

      <CoreCard
        variant="panel"
        style={[styles.card, { borderColor: theme.colors.danger }, theme.shadows.glow]}>
        <CoreText variant="display" align="center">
          {APP_NAME}
        </CoreText>
        <CoreText variant="title" align="center" style={styles.title}>
          {result.title}
        </CoreText>
        <CoreText variant="body" colorRole="textSecondary" align="center" style={styles.message}>
          {result.message}
        </CoreText>

        <View style={styles.versionBlock}>
          <CoreText variant="caption" colorRole="textSecondary" align="center">
            {t.update.currentVersion}
          </CoreText>
          <CoreText variant="bodyStrong" align="center">
            {`${result.currentVersionName} (${result.currentBuildNumber})`}
          </CoreText>
        </View>

        {result.latestVersionName ? (
          <View style={styles.versionBlock}>
            <CoreText variant="caption" colorRole="textSecondary" align="center">
              {t.update.latestVersion}
            </CoreText>
            <CoreText variant="bodyStrong" align="center">
              {result.latestVersionName}
            </CoreText>
          </View>
        ) : null}

        <CoreButton
          label={t.update.updateNow}
          onPress={() => {
            if (!result.storeUrl) {
              return;
            }

            Linking.openURL(result.storeUrl).catch(() => undefined);
          }}
          disabled={!result.storeUrl}
          style={styles.button}
        />
      </CoreCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
  card: {
    gap: 14,
    maxWidth: 420,
    width: '100%',
  },
  title: {
    marginTop: 6,
  },
  message: {
    marginBottom: 6,
  },
  versionBlock: {
    gap: 4,
  },
  button: {
    marginTop: 8,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';

type GameOverModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onRetry: () => void;
  onLevels: () => void;
  onHome: () => void;
  reason?: string;
};

export function GameOverModal({
  visible,
  onDismiss,
  onRetry,
  onLevels,
  onHome,
  reason,
}: GameOverModalProps) {
  const { t } = useI18n();

  return (
    <CoreModal visible={visible} onDismiss={onDismiss} tone="danger">
      <CoreText variant="title" align="center">
        {t.game.failTitle}
      </CoreText>
      <CoreText variant="body" colorRole="textSecondary" align="center" style={styles.sub}>
        {reason ?? t.game.failCopy}
      </CoreText>
      <View style={styles.actions}>
        <CoreButton label={t.common.retry} onPress={onRetry} />
        <CoreButton label={t.common.levels} onPress={onLevels} variant="secondary" />
        <CoreButton label={t.common.homeAction} onPress={onHome} variant="ghost" />
      </View>
    </CoreModal>
  );
}

const styles = StyleSheet.create({
  sub: {
    marginTop: 10,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreButton } from '@centerhit-components/common/CoreButton';
import { CoreModal } from '@centerhit-components/common/CoreModal';
import { CoreText } from '@centerhit-components/common/CoreText';
import { useI18n } from '@centerhit-core/i18n/useI18n';

type PauseModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onResume: () => void;
  onRetry: () => void;
  onHome: () => void;
};

export function PauseModal({
  visible,
  onDismiss,
  onResume,
  onRetry,
  onHome,
}: PauseModalProps) {
  const { t } = useI18n();

  return (
    <CoreModal visible={visible} onDismiss={onDismiss}>
      <CoreText variant="title" align="center">
        {t.game.pauseTitle}
      </CoreText>
      <CoreText variant="body" colorRole="textSecondary" align="center" style={styles.sub}>
        {t.game.pauseCopy}
      </CoreText>
      <View style={styles.actions}>
        <CoreButton label={t.common.resume} onPress={onResume} />
        <CoreButton label={t.common.retry} onPress={onRetry} variant="secondary" />
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

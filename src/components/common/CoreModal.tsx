import React, { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { CoreCard } from '@centerhit-components/common/CoreCard';
import { LAYOUT } from '@centerhit-core/constants/layout';
import { useTheme } from '@centerhit-core/theme/useTheme';

type CoreModalProps = PropsWithChildren<{
  visible: boolean;
  onDismiss: () => void;
  tone?: 'default' | 'success' | 'danger';
}>;

export function CoreModal({
  visible,
  onDismiss,
  tone = 'default',
  children,
}: CoreModalProps) {
  const { theme } = useTheme();
  const toneStyles = {
    default: {
      borderColor: theme.colors.borderSoft,
    },
    success: {
      borderColor: theme.colors.accentPrimary,
    },
    danger: {
      borderColor: theme.colors.danger,
    },
  }[tone];

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onDismiss}>
      <View style={[styles.overlay, { backgroundColor: theme.colors.overlay }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
        <CoreCard
          variant="panel"
          style={[styles.card, { maxWidth: LAYOUT.modalMaxWidth }, toneStyles]}>
          {children}
        </CoreCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
  },
});

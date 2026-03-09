import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreText } from '@centerhit-components/common/CoreText';

type GameTopBarProps = {
  title: string;
  onBack: () => void;
  onPause: () => void;
};

export function GameTopBar({ title, onBack, onPause }: GameTopBarProps) {
  return (
    <View style={styles.container}>
      <CoreIconButton icon="←" onPress={onBack} accessibilityLabel="Back" />
      <CoreText variant="subtitle" align="center" style={styles.title}>
        {title}
      </CoreText>
      <CoreIconButton icon="Ⅱ" onPress={onPause} accessibilityLabel="Pause" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },
  title: {
    flex: 1,
    marginHorizontal: 12,
  },
});

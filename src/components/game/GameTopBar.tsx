import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CoreIconButton } from '@centerhit-components/common/CoreIconButton';
import { CoreText } from '@centerhit-components/common/CoreText';

type GameTopBarProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onPause: () => void;
};

export function GameTopBar({ title, subtitle, onBack, onPause }: GameTopBarProps) {
  return (
    <View style={styles.container}>
      <CoreIconButton icon="←" onPress={onBack} accessibilityLabel="Back" style={styles.button} />
      <View style={styles.titleWrap}>
        <CoreText variant="display" align="center" style={styles.title}>
          {title.toUpperCase()}
        </CoreText>
        {subtitle ? (
          <CoreText variant="subtitle" align="center" colorRole="accentPrimary" style={styles.subtitle}>
            {subtitle}
          </CoreText>
        ) : null}
      </View>
      <CoreIconButton icon="Ⅱ" onPress={onPause} accessibilityLabel="Pause" style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
    marginTop: 10,
  },
  button: {
    height: 50,
    width: 50,
  },
  titleWrap: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
  },
  subtitle: {
    letterSpacing: 1.4,
    marginTop: 8,
    textTransform: 'uppercase',
  },
});

import React, { PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LAYOUT } from '@centerhit-core/constants/layout';
import { useTheme } from '@centerhit-core/theme/useTheme';

type CoreScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function CoreScreen({
  children,
  scrollable = false,
  contentStyle,
}: CoreScreenProps) {
  const { theme } = useTheme();
  const containerStyle = [
    styles.content,
    {
      backgroundColor: theme.colors.backgroundPrimary,
      paddingHorizontal: LAYOUT.screenHorizontalPadding,
      paddingTop: LAYOUT.screenTopPadding,
    },
    contentStyle,
  ];

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.backgroundPrimary }]}>
        <ScrollView contentContainerStyle={containerStyle}>{children}</ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.backgroundPrimary }]}>
      <View style={containerStyle}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

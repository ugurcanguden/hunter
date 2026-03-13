import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@centerhit-app/navigation/AppNavigator';
import { BootstrapGate } from '@centerhit-app/providers/BootstrapGate';
import { DiscoverGate } from '@centerhit-app/providers/DiscoverGate';
import { ThemeProvider } from '@centerhit-core/theme/ThemeProvider';
import { adsBootstrapService } from '@centerhit-features/ads/services/adsBootstrapService';
import { useBackgroundMusicEffects } from '@centerhit-game/hooks/useBackgroundMusicEffects';

function BackgroundMusicController() {
  useBackgroundMusicEffects();

  return null;
}

function AdsController() {
  React.useEffect(() => {
    adsBootstrapService.initialize().catch(() => undefined);
  }, []);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <BootstrapGate>
            <BackgroundMusicController />
            <AdsController />
            <AppNavigator />
            <DiscoverGate />
            {children}
          </BootstrapGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

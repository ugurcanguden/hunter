import React, { PropsWithChildren } from 'react';
import { AppState, AppStateStatus, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from '@centerhit-app/navigation/AppNavigator';
import { BootstrapGate } from '@centerhit-app/providers/BootstrapGate';
import { DiscoverGate } from '@centerhit-app/providers/DiscoverGate';
import { ThemeProvider } from '@centerhit-core/theme/ThemeProvider';
import { adsBootstrapService } from '@centerhit-features/ads/services/adsBootstrapService';
import { notificationService } from '@centerhit-features/notifications/services/notificationService';
import { useSettingsStore } from '@centerhit-features/settings/store/useSettingsStore';
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

function NotificationReminderController() {
  const isSettingsLoaded = useSettingsStore(state => state.isLoaded);
  const setLastActiveAt = useSettingsStore(state => state.setLastActiveAt);

  React.useEffect(() => {
    if (!isSettingsLoaded) {
      return undefined;
    }

    const syncReminder = async () => {
      const nowIso = new Date().toISOString();
      const snapshot = useSettingsStore.getState().settings;

      await setLastActiveAt(nowIso);

      if (!snapshot.notificationsEnabled) {
        await notificationService.cancelInactiveReminder();
        return;
      }

      await notificationService.scheduleInactiveReminder({
        language: snapshot.language,
        fromDate: new Date(nowIso),
      });
    };

    syncReminder().catch(() => undefined);

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        syncReminder().catch(() => undefined);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isSettingsLoaded, setLastActiveAt]);

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
            <NotificationReminderController />
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

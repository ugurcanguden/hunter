import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';

export function useBannerLifecycle() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return undefined;
    }

    let appState = AppState.currentState;

    const subscription = AppState.addEventListener('change', nextState => {
      const wasInactive =
        appState === 'inactive' || appState === 'background';
      const isActive = nextState === 'active';

      if (wasInactive && isActive) {
        setRefreshKey(current => current + 1);
      }

      appState = nextState as AppStateStatus;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return refreshKey;
}


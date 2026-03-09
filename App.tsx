import React from 'react';
import { StatusBar } from 'react-native';

import { AppProviders } from '@centerhit-app/providers/AppProviders';
import { useTheme } from '@centerhit-core/theme/useTheme';

function AppStatusBar() {
  const { theme } = useTheme();

  return (
    <StatusBar
      backgroundColor={theme.colors.backgroundPrimary}
      barStyle="light-content"
    />
  );
}

function App() {
  return (
    <AppProviders>
      <AppStatusBar />
    </AppProviders>
  );
}

export default App;

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@centerhit-app/navigation/routeNames';
import { RootStackParamList } from '@centerhit-app/navigation/navigationTypes';
import { GameScreen } from '@centerhit-app/screens/GameScreen';
import { HomeScreen } from '@centerhit-app/screens/HomeScreen';
import { PackScreen } from '@centerhit-app/screens/PackScreen';
import { LevelsScreen } from '@centerhit-app/screens/LevelsScreen';
import { SettingsScreen } from '@centerhit-app/screens/SettingsScreen';
import { useTheme } from '@centerhit-core/theme/useTheme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: theme.colors.backgroundPrimary,
          card: theme.colors.backgroundPrimary,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          primary: theme.colors.accentPrimary,
        },
      }}>
      <Stack.Navigator
        initialRouteName={ROUTES.Home}
        screenOptions={{
          animation: 'fade',
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.backgroundPrimary },
        }}>
        <Stack.Screen name={ROUTES.Home} component={HomeScreen} />
        <Stack.Screen name={ROUTES.Levels} component={LevelsScreen} />
        <Stack.Screen name={ROUTES.Pack} component={PackScreen} />
        <Stack.Screen name={ROUTES.Settings} component={SettingsScreen} />
        <Stack.Screen name={ROUTES.Game} component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { createContext, PropsWithChildren, useContext } from 'react';

import { AppTheme, theme } from '@centerhit-core/theme/theme';

const ThemeContext = createContext<AppTheme>(theme);

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}

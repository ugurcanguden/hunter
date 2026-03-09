import { useThemeContext } from '@centerhit-core/theme/ThemeProvider';

export function useTheme() {
  const currentTheme = useThemeContext();

  return { theme: currentTheme };
}

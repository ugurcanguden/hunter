import { colors } from '@centerhit-core/theme/colors';
import { radius } from '@centerhit-core/theme/radius';
import { shadows } from '@centerhit-core/theme/shadows';
import { spacing } from '@centerhit-core/theme/spacing';
import { typography } from '@centerhit-core/theme/typography';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type AppTheme = typeof theme;

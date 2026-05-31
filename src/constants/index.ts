export const COLORS = {
  primary: '#1A56DB',
  primaryDark: '#1E429F',
  primaryLight: '#E8EFFE',
  secondary: '#0E9F6E',
  secondaryLight: '#DEF7EC',
  danger: '#E02424',
  dangerLight: '#FDE8E8',
  warning: '#C27803',
  warningLight: '#FDF6B2',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  borderDark: '#D1D5DB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.4)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  suspended: 'Suspendido',
  inactive: 'Inactivo',
};

export const STATUS_COLORS: Record<string, string> = {
  active: '#0E9F6E',
  suspended: '#C27803',
  inactive: '#E02424',
};

export const GATES = ['Entrada Principal', 'Entrada Vehicular', 'Entrada Lateral'];

export const MOCK_CREDENTIALS = {
  admin: { email: 'admin@campus.edu', password: 'admin123', name: 'Administrador', role: 'admin' as const },
  guard: { email: 'guardia@campus.edu', password: 'guardia123', name: 'Guardia Principal', role: 'guard' as const },
};
export type ColorScheme = {
    background: string;
    surface: string;
    surfaceAlt: string;
    border: string;

    text: string;
    textMuted: string;
    textSubtle: string;
    onBrand: string;

    brand: string;
    brandDark: string;
    brandSoft: string;

    accent: string;
    verified: string;
  success: string;
  danger: string;
  warning: string;

    skeleton: string;
    overlay: string;
};

export const lightColors: ColorScheme = {
  background: '#F6F8FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF1F5',
  border: '#E3E8EF',

  text: '#0F172A',
  textMuted: '#5B6878',
  textSubtle: '#94A3B8',
  onBrand: '#FFFFFF',

  brand: '#0E7C7B',
  brandDark: '#0A5E5D',
  brandSoft: '#D9EEED',

  accent: '#F5A524',
  verified: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#D97706',

  skeleton: '#E4E8EE',
  overlay: 'rgba(8, 15, 22, 0.45)',
};

export const darkColors: ColorScheme = {
  background: '#0B0F14',
  surface: '#141B22',
  surfaceAlt: '#1C242D',
  border: '#27313B',

  text: '#F1F5F9',
  textMuted: '#A1AEBE',
  textSubtle: '#6B7886',
  onBrand: '#04201F',

  brand: '#2DD4BF',
  brandDark: '#14B8A6',
  brandSoft: '#10302E',

  accent: '#FBBF24',
  verified: '#60A5FA',
  success: '#22C55E',
  danger: '#F87171',
  warning: '#FBBF24',

  skeleton: '#222C36',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

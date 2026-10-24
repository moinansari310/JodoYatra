import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#F5F5F0',
  fg: '#1C1C1E',
  accent: '#D85A30',
  accentLight: '#F0D5CA',
  card: '#FFFFFF',
  surface: '#EEEDE8',
  muted: '#E4E4DF',
  mutedFg: '#737373',
  border: 'rgba(28,28,30,0.10)',
  green: '#16A34A',
  red: '#DC2626',
};

export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 96 },
  header: {
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: colors.fg, fontSize: 21, fontWeight: '700' },
  sectionTitle: { color: colors.fg, fontSize: 14, fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  mutedText: { color: colors.mutedFg, fontSize: 12 },
  mono: { fontFamily: 'monospace' },
});

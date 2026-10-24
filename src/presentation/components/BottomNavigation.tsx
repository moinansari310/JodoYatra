import { Pressable, StyleSheet, Text, View } from 'react-native';
import { navigationTabs } from '@navigation/AppNavigator';
import { translate } from '@presentation/i18n';
import { colors } from '@presentation/theme';
import type { Language, Screen } from '@presentation/types/navigation';
import en from '@locales/en.json';

interface BottomNavigationProps {
  active: Screen;
  language: Language;
  onNavigate: (screen: Screen) => void;
}

export default function BottomNavigation({ active, language, onNavigate }: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {navigationTabs.map(({ id, labelKey, labelHi, Icon }) => {
        const selected = id === active;
        return (
          <Pressable key={id} style={styles.item} onPress={() => onNavigate(id)}>
            <Icon size={21} color={selected ? colors.accent : '#9CA3AF'} />
            <Text style={[styles.label, selected && styles.selected]}>
              {language === 'hi' ? labelHi : translate(labelKey, labelKey, language, en)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 68,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingBottom: 4,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  label: { color: '#9CA3AF', fontSize: 10, fontWeight: '600' },
  selected: { color: colors.accent },
});

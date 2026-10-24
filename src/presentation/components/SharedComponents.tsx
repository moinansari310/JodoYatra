import { Pressable, Switch, Text, View } from 'react-native';
import { ArrowLeft, Check } from 'lucide-react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';

export function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={common.header}>
      <Pressable style={styles.iconButton} onPress={onBack}>
        <ArrowLeft size={18} color={colors.fg} />
      </Pressable>
      <Text style={common.title}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}
export function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.section}>{title}</Text>;
}
export function SettingRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Text style={styles.cardTitle}>{label}</Text>
      {selected && <Check size={16} color={colors.accent} />}
    </Pressable>
  );
}
export function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.cardTitle}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.muted, true: colors.accentLight }}
        thumbColor={value ? colors.accent : '#FFF'}
      />
    </View>
  );
}

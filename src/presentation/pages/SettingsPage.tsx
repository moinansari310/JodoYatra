import { useState } from 'react';
import { LogOut } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { SectionTitle, SettingRow, ToggleRow } from '@components/SharedComponents';

export function SettingsView({
  language,
  phone,
  onLanguageChange,
  onLogout,
}: {
  language: Language;
  phone: string;
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
}) {
  const [events, setEvents] = useState(true);
  const [tasks, setTasks] = useState(true);
  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Settings', 'सेटिंग्स', language)}</Text>
      </View>
      <View style={styles.profileDark}>
        <View style={styles.largeAvatar}>
          <Text style={styles.avatarText}>PK</Text>
        </View>
        <Text style={styles.whiteName}>Priya Kumari</Text>
        <Text style={styles.darkSub}>+91 {phone} · Ward Coordinator</Text>
      </View>
      <SectionTitle title={t('Language', 'भाषा', language)} />
      <View style={styles.card}>
        <SettingRow
          label="English"
          selected={language === 'en'}
          onPress={() => onLanguageChange('en')}
        />
        <SettingRow
          label="हिंदी"
          selected={language === 'hi'}
          onPress={() => onLanguageChange('hi')}
        />
      </View>
      <SectionTitle title={t('Notifications', 'सूचनाएं', language)} />
      <View style={styles.card}>
        <ToggleRow
          label={t('Event Reminders', 'कार्यक्रम अनुस्मारक', language)}
          value={events}
          onChange={setEvents}
        />
        <ToggleRow
          label={t('New Task Assigned', 'नया कार्य सौंपा गया', language)}
          value={tasks}
          onChange={setTasks}
        />
      </View>
      <Pressable style={styles.logout} onPress={onLogout}>
        <LogOut size={16} color={colors.red} />
        <Text style={{ color: colors.red, fontWeight: '600' }}>
          {t('Log Out', 'लॉग आउट', language)}
        </Text>
      </Pressable>
    </>
  );
}

export default SettingsView;

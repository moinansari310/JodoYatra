import { Bell } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { colors } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { Header } from '@components/SharedComponents';

export function NotificationsView({
  language,
  onBack,
}: {
  language: Language;
  onBack: () => void;
}) {
  return (
    <>
      <Header title={t('Notifications', 'सूचनाएं', language)} onBack={onBack} />
      {[
        'New task assigned',
        'Event reminder',
        'Coverage milestone reached!',
        'Announcement from HQ',
        'New member pending approval',
      ].map((item, index) => (
        <View style={[styles.notification, index < 2 && styles.unread]} key={item}>
          <Bell size={18} color={index < 2 ? colors.accent : colors.mutedFg} />
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{item}</Text>
            <Text style={styles.muted}>
              {index === 0
                ? 'Door-to-door survey — Naya Tola is due today'
                : 'Chainpur campaign update'}
            </Text>
          </View>
        </View>
      ))}
    </>
  );
}

export default NotificationsView;

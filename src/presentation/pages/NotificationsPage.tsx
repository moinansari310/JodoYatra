import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  Megaphone,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';

type NotificationType = 'task' | 'event' | 'milestone' | 'broadcast' | 'member';
type Audience = 'all' | 'w4' | 'w1';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'task',
    title: 'New task assigned',
    titleHi: 'नया कार्य सौंपा गया',
    body: 'Door-to-door survey — Naya Tola is due today',
    bodyHi: 'घर-घर सर्वे — नया टोला आज देय है',
    time: '10:32 AM',
    read: false,
  },
  {
    id: 'n2',
    type: 'event',
    title: 'Event reminder',
    titleHi: 'कार्यक्रम अनुस्मारक',
    body: 'Chainpur Jana Sabha tomorrow at 4:00 PM',
    bodyHi: 'चैनपुर जन सभा कल शाम 4 बजे',
    time: '9:00 AM',
    read: false,
  },
  {
    id: 'n3',
    type: 'milestone',
    title: 'Coverage milestone reached!',
    titleHi: 'कवरेज लक्ष्य पूरा!',
    body: 'Chainpur ward hit 77% voter coverage 🎉',
    bodyHi: 'चैनपुर वार्ड ने 77% मतदाता कवरेज हासिल किया',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n4',
    type: 'broadcast',
    title: 'Announcement from HQ',
    titleHi: 'मुख्यालय से घोषणा',
    body: 'All coordinators: submit weekly booth report by Friday',
    bodyHi: 'सभी समन्वयक: शुक्रवार तक साप्ताहिक बूथ रिपोर्ट जमा करें',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n5',
    type: 'member',
    title: 'New member pending approval',
    titleHi: 'नया सदस्य अनुमोदन लंबित',
    body: 'Rekha Kumari — Booth: Community Hall, Naya Bazar',
    bodyHi: 'रेखा कुमारी — बूथ: सामुदायिक हॉल, नया बाजार',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n6',
    type: 'task',
    title: 'Task completed',
    titleHi: 'कार्य पूर्ण',
    body: 'Street corner meeting — Station Road marked done',
    bodyHi: 'नुक्कड़ सभा — स्टेशन रोड पूर्ण दर्ज',
    time: '2 days ago',
    read: true,
  },
];

const typeColors: Record<NotificationType, { icon: string; background: string }> = {
  task: { icon: colors.accent, background: '#FEF0EB' },
  event: { icon: '#2563EB', background: '#DBEAFE' },
  milestone: { icon: '#15803D', background: '#DCFCE7' },
  broadcast: { icon: '#B45309', background: '#FEF3C7' },
  member: { icon: colors.fg, background: '#F3F4F6' },
};

export function NotificationsView({
  language,
  onBack,
}: {
  language: Language;
  onBack: () => void;
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [error, setError] = useState('');
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  const sendBroadcast = () => {
    const text = message.trim();
    if (!text) {
      setError(t('Enter an announcement message', 'घोषणा संदेश लिखें', language));
      return;
    }
    setNotifications((previous) => [
      {
        id: `broadcast-${Date.now()}`,
        type: 'broadcast',
        title: 'New announcement',
        titleHi: 'नई घोषणा',
        body: `${audienceLabel(audience, 'en')}: ${text}`,
        bodyHi: `${audienceLabel(audience, 'hi')}: ${text}`,
        time: t('Just now', 'अभी', language),
        read: false,
      },
      ...previous,
    ]);
    setMessage('');
    setError('');
  };

  return (
    <ScrollView
      style={common.screen}
      contentContainerStyle={common.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={common.header}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.fg} />
        </Pressable>
        <Text style={common.title}>{t('Notifications', 'सूचनाएं', language)}</Text>
        {unreadCount > 0 && (
          <Text style={styles.countBadge}>
            {unreadCount} {t('new', 'नई', language)}
          </Text>
        )}
      </View>

      <View style={styles.broadcastCard}>
        <View style={styles.broadcastHeading}>
          <Megaphone size={16} color={colors.accent} />
          <Text style={styles.whiteBold}>{t('Send Broadcast', 'प्रसारण भेजें', language)}</Text>
        </View>
        <TextInput
          value={message}
          onChangeText={(value) => {
            setMessage(value);
            if (error) setError('');
          }}
          placeholder={t('Type announcement message...', 'घोषणा संदेश टाइप करें...', language)}
          placeholderTextColor="rgba(255,255,255,0.45)"
          style={styles.broadcastInput}
          multiline
        />
        <View style={styles.audienceOptions}>
          {(['all', 'w4', 'w1'] as const).map((value) => (
            <Pressable
              key={value}
              style={[styles.audienceOption, audience === value && styles.audienceOptionActive]}
              onPress={() => setAudience(value)}
            >
              <Text
                style={[
                  styles.audienceOptionText,
                  audience === value && styles.audienceOptionTextActive,
                ]}
              >
                {audienceLabel(value, language)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.addButton} onPress={sendBroadcast}>
          <Text style={common.buttonText}>{t('Send', 'भेजें', language)}</Text>
        </Pressable>
        {error ? <Text style={styles.broadcastError}>{error}</Text> : null}
      </View>

      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} language={language} />
      ))}
    </ScrollView>
  );
}

function NotificationCard({
  notification,
  language,
}: {
  notification: NotificationItem;
  language: Language;
}) {
  const color = typeColors[notification.type];
  let Icon = Bell;
  if (notification.type === 'task') Icon = CheckCircle;
  if (notification.type === 'event') Icon = Calendar;
  if (notification.type === 'milestone') Icon = TrendingUp;
  if (notification.type === 'broadcast') Icon = Megaphone;
  if (notification.type === 'member') Icon = Users;

  return (
    <View
      style={[
        styles.notification,
        !notification.read && styles.unread,
        { borderColor: notification.read ? colors.border : colors.accent },
      ]}
    >
      <View style={[styles.notificationIcon, { backgroundColor: color.background }]}>
        <Icon size={18} color={color.icon} />
      </View>
      <View style={styles.flex}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.cardTitle, styles.notificationTitle]}>
            {language === 'hi' ? notification.titleHi : notification.title}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
        <Text style={styles.muted}>
          {language === 'hi' ? notification.bodyHi : notification.body}
        </Text>
      </View>
      {!notification.read && <View style={styles.dot} />}
    </View>
  );
}

function audienceLabel(audience: Audience, language: Language): string {
  if (audience === 'w4') return t('Chainpur Ward', 'चैनपुर वार्ड', language);
  if (audience === 'w1') return t('Bishrampur North', 'बिश्रामपुर उत्तर', language);
  return t('All Members', 'सभी सदस्य', language);
}

export default NotificationsView;

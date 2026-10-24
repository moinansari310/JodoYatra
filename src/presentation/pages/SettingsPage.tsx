import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Download,
  IndianRupee,
  LogOut,
  Shield,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { currentUser, wards } from '@data/mockData';
import { appModel as model } from '@presentation/state/appModel';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { SectionTitle, SettingRow } from '@components/SharedComponents';

type SettingsSubview = 'main' | 'donations' | 'activity';

const roleLabels: Record<string, { en: string; hi: string }> = {
  super_admin: { en: 'Super Admin', hi: 'सुपर एडमिन' },
  constituency_coordinator: { en: 'Constituency Coordinator', hi: 'निर्वाचन समन्वयक' },
  ward_coordinator: { en: 'Ward Coordinator', hi: 'वार्ड समन्वयक' },
  booth_coordinator: { en: 'Booth Coordinator', hi: 'बूथ समन्वयक' },
  volunteer: { en: 'Volunteer', hi: 'स्वयंसेवक' },
};

const userNames: Record<string, string> = {
  super_admin: 'Ajay Kumar Verma',
  constituency_coordinator: 'Sunita Devi',
  ward_coordinator: 'Priya Kumari',
  booth_coordinator: 'Manoj Tiwari',
  volunteer: 'Rajesh Kumar',
};

const donations = [
  {
    id: 'd1',
    member: 'Ramesh Kumar Singh',
    amount: 5000,
    mode: 'Cash',
    date: '2024-09-15',
    receipt: 'JY-RCT-001',
  },
  {
    id: 'd2',
    member: 'Vikram Singh Yadav',
    amount: 2500,
    mode: 'UPI',
    date: '2024-09-14',
    receipt: 'JY-RCT-002',
  },
  {
    id: 'd3',
    member: 'Ajay Kumar Gupta',
    amount: 1000,
    mode: 'Cash',
    date: '2024-09-12',
    receipt: 'JY-RCT-003',
  },
];

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
  const [milestones, setMilestones] = useState(false);
  const [view, setView] = useState<SettingsSubview>('main');
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (view === 'donations') {
    return <DonationsView language={language} onBack={() => setView('main')} />;
  }
  if (view === 'activity') {
    return <ActivityView language={language} onBack={() => setView('main')} />;
  }

  const isAdmin = ['super_admin', 'constituency_coordinator'].includes(currentUser.role);
  const role = roleLabels[currentUser.role] ?? roleLabels.volunteer;
  const name = userNames[currentUser.role] ?? 'User';
  const ward = wards.find((item) => item.id === currentUser.wardId);

  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Settings', 'सेटिंग्स', language)}</Text>
      </View>

      <View style={styles.settingsProfile}>
        <View style={styles.settingsProfileHeader}>
          <View style={styles.largeAvatar}>
            <Text style={styles.avatarText}>
              {name
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.whiteName}>{name}</Text>
            <Text style={styles.darkSub}>+91 {phone || currentUser.phone}</Text>
            <View style={styles.roleBadge}>
              <Shield size={11} color={colors.accent} />
              <Text style={styles.roleBadgeText}>{language === 'hi' ? role.hi : role.en}</Text>
            </View>
          </View>
        </View>
        <View style={styles.profileStats}>
          <StatPill
            label={t('Ward', 'वार्ड', language)}
            value={language === 'hi' ? ward?.nameHi.split(' ')[0] : ward?.name.split(' ')[0]}
          />
          <StatPill label={t('Members', 'सदस्य', language)} value={String(model.members.length)} />
          <StatPill
            label={t('Tasks', 'कार्य', language)}
            value={String(model.tasks.filter((task) => task.status === 'done').length)}
          />
        </View>
      </View>

      <SectionTitle title={t('Language', 'भाषा', language)} />
      <View style={styles.settingsCard}>
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
      <View style={styles.settingsCard}>
        <ToggleSetting
          label={t('Event Reminders', 'कार्यक्रम अनुस्मारक', language)}
          value={events}
          onChange={setEvents}
        />
        <ToggleSetting
          label={t('New Task Assigned', 'नया कार्य सौंपा गया', language)}
          value={tasks}
          onChange={setTasks}
        />
        <ToggleSetting
          label={t('Coverage Milestones', 'कवरेज मील पत्थर', language)}
          value={milestones}
          onChange={setMilestones}
        />
      </View>

      <SectionTitle title={t('Data & Export', 'डेटा और निर्यात', language)} />
      <View style={styles.settingsCard}>
        <MenuRow
          icon={<Download size={16} color={colors.mutedFg} />}
          label={t('Export Members List', 'सदस्य सूची निर्यात करें', language)}
        />
        <MenuRow
          icon={<Download size={16} color={colors.mutedFg} />}
          label={t('Export Voter Status Report', 'मतदाता स्थिति रिपोर्ट', language)}
        />
        <MenuRow
          icon={<Activity size={16} color={colors.mutedFg} />}
          label={t('Activity Log', 'गतिविधि लॉग', language)}
          onPress={() => setView('activity')}
        />
      </View>

      {isAdmin && (
        <>
          <SectionTitle title={t('Donations Module', 'दान मॉड्यूल', language)} />
          <Pressable style={styles.menuCard} onPress={() => setView('donations')}>
            <View style={styles.donationIcon}>
              <IndianRupee size={17} color="#15803D" />
            </View>
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>
                {t('Manage Donations', 'दान प्रबंधित करें', language)}
              </Text>
              <Text style={styles.muted}>
                {t('Admin access only', 'केवल एडमिन एक्सेस', language)}
              </Text>
            </View>
            <ChevronRight size={16} color={colors.mutedFg} />
          </Pressable>
        </>
      )}

      <SectionTitle title={t('Sync Status', 'सिंक स्थिति', language)} />
      <View style={styles.menuCard}>
        <View style={styles.syncDot} />
        <View>
          <Text style={styles.cardTitle}>{t('All data synced', 'सब कुछ सिंक हुआ', language)}</Text>
          <Text style={styles.muted}>
            {t('Last sync: Today, 2:34 PM', 'आखिरी सिंक: आज, 2:34 PM', language)}
          </Text>
        </View>
      </View>

      {confirmLogout ? (
        <View style={styles.logoutConfirm}>
          <Text style={styles.logoutConfirmText}>
            {t('Are you sure you want to log out?', 'क्या आप लॉग आउट करना चाहते हैं?', language)}
          </Text>
          <View style={styles.logoutActions}>
            <Pressable style={styles.logoutConfirmButton} onPress={onLogout}>
              <Text style={common.buttonText}>{t('Log Out', 'लॉग आउट', language)}</Text>
            </Pressable>
            <Pressable style={styles.logoutCancelButton} onPress={() => setConfirmLogout(false)}>
              <Text style={styles.cardTitle}>{t('Cancel', 'रद्द करें', language)}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.logout} onPress={() => setConfirmLogout(true)}>
          <LogOut size={16} color={colors.red} />
          <Text style={styles.logoutText}>{t('Log Out', 'लॉग आउट', language)}</Text>
        </Pressable>
      )}

      <View style={styles.settingsFooter}>
        <Text style={styles.footerHeading}>Jodo Yatra v1.0</Text>
        <Text style={styles.muted}>Bishrampur Constituency · Palamu, Jharkhand</Text>
        <Text style={styles.muted}>© 2024 · Secure · India Region</Text>
      </View>
    </>
  );
}

function DonationsView({ language, onBack }: { language: Language; onBack: () => void }) {
  const total = donations.reduce((sum, donation) => sum + donation.amount, 0);
  return (
    <>
      <View style={common.header}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.fg} />
        </Pressable>
        <Text style={common.title}>{t('Donations', 'दान', language)}</Text>
        <Pressable style={styles.addButton}>
          <Text style={common.buttonText}>+ {t('Log', 'दर्ज', language)}</Text>
        </Pressable>
      </View>
      <View style={styles.donationSummary}>
        <View style={styles.donationSummaryHeading}>
          <AlertCircle size={14} color="#FACC15" />
          <Text style={styles.darkSub}>
            {t('Compliance review pending', 'अनुपालन समीक्षा लंबित', language)}
          </Text>
        </View>
        <Text style={styles.donationTotal}>₹{total.toLocaleString('en-IN')}</Text>
        <Text style={styles.darkSub}>
          {t('Total donations — Sep 2024', 'कुल दान — सितंबर 2024', language)}
        </Text>
      </View>
      {donations.map((donation) => (
        <View key={donation.id} style={styles.menuCard}>
          <View style={styles.donationIcon}>
            <IndianRupee size={16} color="#15803D" />
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{donation.member}</Text>
            <Text style={styles.muted}>
              {donation.mode} · {donation.date} · {donation.receipt}
            </Text>
          </View>
          <Text style={styles.donationAmount}>₹{donation.amount.toLocaleString('en-IN')}</Text>
        </View>
      ))}
    </>
  );
}

function ActivityView({ language, onBack }: { language: Language; onBack: () => void }) {
  const recentMembers = model.members.slice(0, 5);
  const logs = [
    {
      id: 'l1',
      action: t('Member added', 'सदस्य जोड़ा', language),
      detail: recentMembers[0]?.name ?? 'Ramesh Kumar Singh',
      time: 'Today 10:22 AM',
      user: 'Priya Kumari',
    },
    {
      id: 'l2',
      action: t('Voter status updated', 'मतदाता स्थिति अपडेट', language),
      detail: 'JHK1234572 → Supportive',
      time: 'Today 9:45 AM',
      user: 'Manoj Tiwari',
    },
    {
      id: 'l3',
      action: t('Task completed', 'कार्य पूर्ण', language),
      detail: t('Street corner meeting — Station Road', 'नुक्कड़ सभा — स्टेशन रोड', language),
      time: 'Yesterday 6:10 PM',
      user: 'Priya Kumari',
    },
    {
      id: 'l4',
      action: t('Member added', 'सदस्य जोड़ा', language),
      detail: 'Rani Devi',
      time: 'Yesterday 4:32 PM',
      user: 'Geeta Kumari',
    },
    {
      id: 'l5',
      action: t('Event created', 'कार्यक्रम बनाया', language),
      detail: t('Chainpur Jana Sabha', 'चैनपुर जन सभा', language),
      time: '16 Sep 11:00 AM',
      user: 'Priya Kumari',
    },
  ];

  return (
    <>
      <View style={common.header}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.fg} />
        </Pressable>
        <Text style={common.title}>{t('Activity Log', 'गतिविधि लॉग', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>
      {logs.map((log) => (
        <View key={log.id} style={styles.activityCard}>
          <View style={styles.activityDot} />
          <View style={styles.flex}>
            <View style={styles.activityHeader}>
              <Text style={styles.cardTitle}>{log.action}</Text>
              <Text style={styles.notificationTime}>{log.time}</Text>
            </View>
            <Text style={styles.muted}>{log.detail}</Text>
            <Text style={styles.notificationTime}>by {log.user}</Text>
          </View>
        </View>
      ))}
    </>
  );
}

function StatPill({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statValue}>{value ?? '—'}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ToggleSetting({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingToggleRow}>
      <Text style={[styles.cardTitle, styles.flex]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.muted, true: colors.accentLight }}
        thumbColor={value ? colors.accent : '#FFF'}
      />
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuRow} onPress={onPress}>
      {icon}
      <Text style={[styles.cardTitle, styles.flex]}>{label}</Text>
      <ChevronRight size={16} color={colors.mutedFg} />
    </Pressable>
  );
}

export default SettingsView;

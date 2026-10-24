import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Calendar,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { currentUser, wards } from '@data/mockData';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language, Screen } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';
import { SectionTitle } from '@components/SharedComponents';

const roleLabels: Record<string, { en: string; hi: string }> = {
  super_admin: { en: 'Super Admin', hi: 'सुपर एडमिन' },
  constituency_coordinator: { en: 'Constituency Coordinator', hi: 'निर्वाचन समन्वयक' },
  ward_coordinator: { en: 'Ward Coordinator', hi: 'वार्ड समन्वयक' },
  booth_coordinator: { en: 'Booth Coordinator', hi: 'बूथ समन्वयक' },
  volunteer: { en: 'Volunteer', hi: 'स्वयंसेवक' },
};

export function DashboardView({
  language,
  onNavigate,
  onNotifications,
}: {
  language: Language;
  onNavigate: (screen: Screen) => void;
  onNotifications: () => void;
}) {
  const totalVoters = wards.reduce((sum, ward) => sum + ward.totalVoters, 0);
  const totalContacted = wards.reduce((sum, ward) => sum + ward.contacted, 0);
  const coverage = Math.round((totalContacted / totalVoters) * 100);
  const pendingTasks = model.tasks.filter((task) => task.status !== 'done').length;
  const upcomingEvents = model.events.filter((event) => event.date >= '2024-09-17');
  const todayTasks = model.tasks.filter(
    (task) => task.dueDate === '2024-09-17' && task.status !== 'done',
  );
  const nextEvent = upcomingEvents[0];
  const role = roleLabels[currentUser.role] ?? roleLabels.volunteer;

  return (
    <>
      <View style={common.header}>
        <View style={styles.flex}>
          <Text style={styles.brand}>
            जोड़ो <Text style={styles.accent}>Yatra</Text>
          </Text>
          <Text style={styles.subtitle}>
            {t(
              'Bishrampur Constituency · Palamu, Jharkhand',
              'बिश्रामपुर विधानसभा · पलामू, झारखण्ड',
              language,
            )}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('Notifications', 'सूचनाएं', language)}
          style={styles.iconButton}
          onPress={onNotifications}
        >
          <Bell size={18} color={colors.fg} />
          <View style={styles.dot} />
        </Pressable>
      </View>

      <View style={styles.darkBanner}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser.name
              .split(' ')
              .slice(0, 2)
              .map((part) => part[0])
              .join('')}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.whiteBold}>{currentUser.name}</Text>
          <Text style={styles.darkSub}>
            {language === 'hi' ? role.hi : role.en} · {t('Chainpur', 'चैनपुर', language)}
          </Text>
        </View>
        <Text style={styles.bannerMetric}>
          {coverage}%
          <Text style={styles.darkSub}>
            {'\n'}
            {t('coverage', 'कवरेज', language)}
          </Text>
        </Text>
      </View>

      <View style={styles.grid}>
        <KpiCard
          icon={<Users size={18} color={colors.accent} />}
          value={model.members.length.toLocaleString('en-IN')}
          label={t('Total Members', 'कुल सदस्य', language)}
          sub={`+${model.members.filter((member) => member.joinDate >= '2024-09-10').length} ${t('this week', 'इस सप्ताह', language)}`}
          onPress={() => onNavigate('members')}
        />
        <KpiCard
          icon={<TrendingUp size={18} color={colors.accent} />}
          value={`${coverage}%`}
          label={t('Voter Coverage', 'मतदाता कवरेज', language)}
          sub={`${totalContacted.toLocaleString('en-IN')} / ${totalVoters.toLocaleString('en-IN')}`}
          onPress={() => onNavigate('voters')}
        />
        <KpiCard
          icon={<UserCheck size={18} color={colors.fg} />}
          value="38"
          label={t('Active Volunteers', 'सक्रिय कार्यकर्ता', language)}
          sub={`${pendingTasks} ${t('tasks pending', 'कार्य बाकी', language)}`}
          onPress={() => onNavigate('tasks')}
        />
        <KpiCard
          icon={<Calendar size={18} color={colors.fg} />}
          value={String(upcomingEvents.length)}
          label={t('Upcoming Events', 'आगामी कार्यक्रम', language)}
          sub={nextEvent ? `Sep ${nextEvent.date.slice(8)}` : t('None', 'कोई नहीं', language)}
          onPress={() => onNavigate('tasks')}
        />
      </View>

      {todayTasks.length > 0 && (
        <>
          <SectionHeader
            title={t("Today's Tasks", 'आज के कार्य', language)}
            count={todayTasks.length}
            action={t('See all', 'सभी देखें', language)}
            onAction={() => onNavigate('tasks')}
          />
          {todayTasks.slice(0, 3).map((task) => (
            <Pressable key={task.id} style={styles.taskCard} onPress={() => onNavigate('tasks')}>
              <View
                style={[styles.taskDot, task.status === 'in_progress' && styles.taskDotActive]}
              />
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>
                  {language === 'hi' ? task.titleHi : task.title}
                </Text>
                <Text style={styles.muted}>{task.type.replace(/_/g, ' ')}</Text>
              </View>
              <Text
                style={[
                  styles.status,
                  task.status === 'in_progress'
                    ? styles.activeTaskStatus
                    : styles.pendingTaskStatus,
                ]}
              >
                {task.status === 'in_progress'
                  ? t('Active', 'जारी', language)
                  : t('Pending', 'बाकी', language)}
              </Text>
            </Pressable>
          ))}
        </>
      )}

      {nextEvent && (
        <>
          <SectionHeader
            title={t('Next Event', 'अगला कार्यक्रम', language)}
            action={t('All events', 'सभी', language)}
            onAction={() => onNavigate('tasks')}
          />
          <Pressable style={styles.card} onPress={() => onNavigate('tasks')}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>SEP</Text>
              <Text style={styles.dateDay}>{nextEvent.date.slice(8)}</Text>
            </View>
            <View style={styles.flex}>
              <Text style={styles.cardTitle}>
                {language === 'hi' ? nextEvent.titleHi : nextEvent.title}
              </Text>
              <Text style={styles.muted}>{nextEvent.location}</Text>
              <View style={styles.rowBetween}>
                <Text style={styles.muted}>{nextEvent.time}</Text>
                <Text style={styles.accentText}>
                  {nextEvent.rsvp} {t('RSVP', 'प्रतिभागी', language)}
                </Text>
              </View>
            </View>
          </Pressable>
        </>
      )}

      <SectionTitle title={t('Ward Leaderboard', 'वार्ड रैंकिंग', language)} />
      {[...wards]
        .sort((a, b) => b.contacted / b.totalVoters - a.contacted / a.totalVoters)
        .map((ward, index) => {
          const pct = Math.round((ward.contacted / ward.totalVoters) * 100);
          const progressColor = pct >= 70 ? '#16A34A' : pct >= 50 ? colors.accent : colors.red;
          return (
            <View style={styles.wardCard} key={ward.id}>
              <Text style={styles.rank}>{index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}</Text>
              <View style={styles.flex}>
                <View style={styles.rowBetween}>
                  <View style={styles.wardName}>
                    <Text style={styles.cardTitle}>
                      {language === 'hi' ? ward.nameHi : ward.name}
                    </Text>
                    {pct < 50 && <AlertTriangle size={13} color="#D97706" />}
                  </View>
                  <Text style={[styles.accentText, { color: progressColor }]}>{pct}%</Text>
                </View>
                <View style={styles.progress}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${pct}%`, backgroundColor: progressColor },
                    ]}
                  />
                </View>
                <View style={styles.rowBetween}>
                  <Text style={styles.muted}>
                    {ward.contacted.toLocaleString('en-IN')} /{' '}
                    {ward.totalVoters.toLocaleString('en-IN')} {t('voters', 'मतदाता', language)}
                  </Text>
                  <Text style={styles.muted}>
                    {ward.members} {t('members', 'सदस्य', language)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

      <SectionTitle title={t('Quick Actions', 'त्वरित कार्य', language)} />
      <View style={styles.quickActions}>
        <QuickAction
          icon="👤"
          label={t('Add Member', 'सदस्य जोड़ें', language)}
          onPress={() => onNavigate('members')}
        />
        <QuickAction
          icon="🚶"
          label={t('Log Visit', 'दौरा दर्ज', language)}
          onPress={() => onNavigate('voters')}
        />
        <QuickAction
          icon="📅"
          label={t('New Event', 'नया कार्यक्रम', language)}
          onPress={() => onNavigate('tasks')}
        />
      </View>
    </>
  );
}

function KpiCard({
  icon,
  value,
  label,
  sub,
  onPress,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  sub: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.kpi} onPress={onPress}>
      <View style={styles.kpiHeader}>
        {icon}
        <ArrowUpRight size={13} color={colors.mutedFg} />
      </View>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.muted}>{sub}</Text>
    </Pressable>
  );
}

function SectionHeader({
  title,
  count,
  action,
  onAction,
}: {
  title: string;
  count?: number;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderTitle}>
        <Text style={styles.section}>{title}</Text>
        {count !== undefined && <Text style={styles.countBadge}>{count}</Text>}
      </View>
      {action && (
        <Pressable onPress={onAction}>
          <Text style={styles.accentText}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

export default DashboardView;

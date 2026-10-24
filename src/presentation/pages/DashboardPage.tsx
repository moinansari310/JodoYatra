import { Bell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language, Screen } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';
import { wards } from '@data/mockData';
import { SectionTitle } from '@components/SharedComponents';

export function DashboardView({
  language,
  onNavigate,
  onNotifications,
}: {
  language: Language;
  onNavigate: (screen: Screen) => void;
  onNotifications: () => void;
}) {
  const coverage = Math.round(
    (wards.reduce((sum, ward) => sum + ward.contacted, 0) /
      wards.reduce((sum, ward) => sum + ward.totalVoters, 0)) *
      100,
  );
  const nextEvent = model.events.find((event) => event.date >= '2024-09-17');
  return (
    <>
      <View style={common.header}>
        <View>
          <Text style={styles.brand}>
            जोड़ो <Text style={styles.accent}>Yatra</Text>
          </Text>
          <Text style={styles.subtitle}>Bishrampur Constituency · Palamu, Jharkhand</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={onNotifications}>
          <Bell size={18} color={colors.fg} />
          <View style={styles.dot} />
        </Pressable>
      </View>
      <View style={styles.darkBanner}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PK</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.whiteBold}>Priya Kumari</Text>
          <Text style={styles.darkSub}>
            {t('Ward Coordinator · Chainpur', 'वार्ड समन्वयक · चैनपुर', language)}
          </Text>
        </View>
        <Text style={styles.bannerMetric}>
          {coverage}%<Text style={styles.darkSub}>{'\n'}coverage</Text>
        </Text>
      </View>
      <View style={styles.grid}>
        {[
          ['👥', String(model.members.length), 'Total Members', 'members'],
          ['↗', `${coverage}%`, 'Voter Coverage', 'voters'],
          ['✓', '38', 'Active Volunteers', 'tasks'],
          ['▣', String(model.events.length), 'Upcoming Events', 'tasks'],
        ].map(([icon, value, label, target]) => (
          <Pressable key={label} style={styles.kpi} onPress={() => onNavigate(target as Screen)}>
            <Text style={styles.kpiIcon}>{icon}</Text>
            <Text style={styles.kpiValue}>{value}</Text>
            <Text style={styles.kpiLabel}>{t(label, label, language)}</Text>
            <Text style={styles.muted}>
              {target === 'members' ? '+2 this week' : 'View details'}
            </Text>
          </Pressable>
        ))}
      </View>
      <SectionTitle title={t('Next Event', 'अगला कार्यक्रम', language)} />
      <Pressable style={styles.card} onPress={() => onNavigate('tasks')}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>SEP</Text>
          <Text style={styles.dateDay}>{nextEvent?.date.slice(8) ?? '—'}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>
            {nextEvent ? (language === 'hi' ? nextEvent.titleHi : nextEvent.title) : 'No events'}
          </Text>
          <Text style={styles.muted}>{nextEvent?.location}</Text>
          <Text style={styles.accentText}>{nextEvent?.rsvp} RSVP</Text>
        </View>
      </Pressable>
      <SectionTitle title={t('Ward Leaderboard', 'वार्ड रैंकिंग', language)} />
      {[...wards]
        .sort((a, b) => b.contacted / b.totalVoters - a.contacted / a.totalVoters)
        .map((ward, index) => (
          <View style={styles.wardCard} key={ward.id}>
            <Text style={styles.rank}>{index + 1}</Text>
            <View style={styles.flex}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>{language === 'hi' ? ward.nameHi : ward.name}</Text>
                <Text style={styles.accentText}>
                  {Math.round((ward.contacted / ward.totalVoters) * 100)}%
                </Text>
              </View>
              <View style={styles.progress}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(ward.contacted / ward.totalVoters) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.muted}>
                {ward.contacted.toLocaleString('en-IN')} /{' '}
                {ward.totalVoters.toLocaleString('en-IN')} voters
              </Text>
            </View>
          </View>
        ))}
    </>
  );
}

export default DashboardView;

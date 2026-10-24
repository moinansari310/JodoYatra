import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';
import { statusLabels } from '@data/mockData';
import type { VoterStatus } from '@domain/models';

export function VotersView({ language }: { language: Language }) {
  const [status, setStatus] = useState<VoterStatus | 'all'>('all');
  const voters = model.voters.filter((voter) => status === 'all' || voter.status === status);
  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Voter Tracker', 'मतदाता ट्रैकर', language)}</Text>
      </View>
      <View style={styles.darkBanner}>
        <View style={styles.flex}>
          <Text style={styles.whiteBold}>Govt. Primary School No. 1</Text>
          <Text style={styles.darkSub}>{voters.length} total voters</Text>
        </View>
        <Text style={styles.bannerMetric}>
          70%<Text style={styles.darkSub}>{'\n'}coverage</Text>
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {(['all', 'not_contacted', 'contacted', 'supportive', 'undecided', 'opposed'] as const).map(
          (value) => (
            <Pressable
              key={value}
              style={[styles.chip, status === value && styles.chipActive]}
              onPress={() => setStatus(value)}
            >
              <Text style={[styles.chipText, status === value && styles.whiteBold]}>
                {value === 'all' ? 'All' : statusLabels[value].en}
              </Text>
            </Pressable>
          ),
        )}
      </ScrollView>
      {voters.map((voter) => (
        <View style={styles.voterCard} key={voter.epicNo}>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{voter.name}</Text>
            <Text style={styles.muted}>
              {voter.age}yr · {voter.address}
            </Text>
            <Text style={styles.mono}>{voter.epicNo}</Text>
          </View>
          <Text
            style={[
              styles.status,
              {
                color: statusLabels[voter.status].color,
                backgroundColor: statusLabels[voter.status].bg,
              },
            ]}
          >
            {language === 'hi' ? statusLabels[voter.status].hi : statusLabels[voter.status].en}
          </Text>
        </View>
      ))}
    </>
  );
}

export default VotersView;

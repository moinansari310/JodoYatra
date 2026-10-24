import { useState } from 'react';
import { Check, RefreshCw } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { booths, statusLabels, wards } from '@data/mockData';
import type { VoterStatus } from '@domain/models';
import { common, colors } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';

const statusOrder: VoterStatus[] = [
  'not_contacted',
  'contacted',
  'supportive',
  'undecided',
  'opposed',
];

export function VotersView({ language }: { language: Language }) {
  const [selectedBooth, setSelectedBooth] = useState('b1');
  const [filterStatus, setFilterStatus] = useState<VoterStatus | 'all'>('all');
  const [openVoter, setOpenVoter] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedVoters, setSelectedVoters] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<VoterStatus>('contacted');

  const booth = booths.find((item) => item.id === selectedBooth);
  const boothVoters = model.voters.filter((voter) => voter.boothId === selectedBooth);
  const filteredVoters =
    filterStatus === 'all'
      ? boothVoters
      : boothVoters.filter((voter) => voter.status === filterStatus);
  const statusCounts = statusOrder.reduce<Record<VoterStatus, number>>(
    (counts, status) => {
      counts[status] = boothVoters.filter((voter) => voter.status === status).length;
      return counts;
    },
    {
      not_contacted: 0,
      contacted: 0,
      supportive: 0,
      undecided: 0,
      opposed: 0,
    },
  );
  const contacted = boothVoters.filter((voter) => voter.status !== 'not_contacted').length;
  const coverage = boothVoters.length ? Math.round((contacted / boothVoters.length) * 100) : 0;

  const changeBooth = (boothId: string) => {
    setSelectedBooth(boothId);
    setFilterStatus('all');
    setBulkMode(false);
    setSelectedVoters(new Set());
    setOpenVoter(null);
  };

  const toggleSelection = (epicNo: string) => {
    setSelectedVoters((previous) => {
      const next = new Set(previous);
      if (next.has(epicNo)) next.delete(epicNo);
      else next.add(epicNo);
      return next;
    });
  };

  const updateSelectedVoters = () => {
    selectedVoters.forEach((epicNo) => model.updateVoterStatus(epicNo, bulkStatus));
    setSelectedVoters(new Set());
    setBulkMode(false);
  };

  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Voter Tracker', 'मतदाता ट्रैकर', language)}</Text>
        <Pressable
          style={[styles.smallTag, bulkMode && styles.bulkModeActive]}
          onPress={() => {
            setBulkMode((active) => !active);
            setSelectedVoters(new Set());
            setOpenVoter(null);
          }}
        >
          <Text style={[styles.accentText, bulkMode && styles.bulkModeText]}>
            {bulkMode
              ? t('Cancel', 'रद्द करें', language)
              : t('Bulk Update', 'बल्क अपडेट', language)}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.boothLabel}>{t('Booth', 'बूथ', language)}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {booths.map((item) => {
          const ward = wards.find((entry) => entry.id === item.wardId);
          const active = selectedBooth === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => changeBooth(item.id)}
            >
              <Text style={[styles.chipText, active && styles.whiteBold]}>
                {item.name.split(',')[0]} · {language === 'hi' ? ward?.nameHi : ward?.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.darkBanner}>
        <View style={styles.flex}>
          <Text style={styles.whiteBold}>{booth?.name.split(',')[0]}</Text>
          <Text style={styles.darkSub}>
            {boothVoters.length} {t('total voters', 'कुल मतदाता', language)}
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
      <View style={styles.progressDark}>
        <View style={[styles.progressDarkFill, { width: `${coverage}%` }]} />
      </View>
      <View style={styles.statusDistribution}>
        {statusOrder.map((status) =>
          statusCounts[status] > 0 ? (
            <View key={status} style={styles.distributionItem}>
              <View
                style={[styles.distributionDot, { backgroundColor: statusLabels[status].color }]}
              />
              <Text style={styles.muted}>{statusCounts[status]}</Text>
            </View>
          ) : null,
        )}
      </View>

      {bulkMode && selectedVoters.size > 0 && (
        <View style={styles.bulkToolbar}>
          <Text style={styles.accentText}>
            {selectedVoters.size} {t('selected', 'चयनित', language)}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statusOrder.map((status) => {
              const active = bulkStatus === status;
              return (
                <Pressable
                  key={status}
                  style={[
                    styles.statusChoice,
                    {
                      backgroundColor: active
                        ? statusLabels[status].color
                        : statusLabels[status].bg,
                      borderColor: statusLabels[status].color,
                    },
                  ]}
                  onPress={() => setBulkStatus(status)}
                >
                  <Text
                    style={{
                      color: active ? '#FFF' : statusLabels[status].color,
                      fontSize: 10,
                      fontWeight: '600',
                    }}
                  >
                    {language === 'hi' ? statusLabels[status].hi : statusLabels[status].en}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable style={styles.addButton} onPress={updateSelectedVoters}>
            <RefreshCw size={13} color="#FFF" />
            <Text style={common.buttonText}>{t('Update', 'अपडेट', language)}</Text>
          </Pressable>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        <StatusChip
          label={t('All', 'सभी', language)}
          count={boothVoters.length}
          active={filterStatus === 'all'}
          onPress={() => setFilterStatus('all')}
          color={colors.fg}
          background={colors.muted}
        />
        {statusOrder.map((status) => (
          <StatusChip
            key={status}
            label={language === 'hi' ? statusLabels[status].hi : statusLabels[status].en}
            count={statusCounts[status]}
            active={filterStatus === status}
            onPress={() => setFilterStatus(status)}
            color={statusLabels[status].color}
            background={statusLabels[status].bg}
          />
        ))}
      </ScrollView>

      {filteredVoters.length === 0 ? (
        <Text style={styles.emptyState}>
          {t('No voters in this category', 'इस श्रेणी में कोई मतदाता नहीं', language)}
        </Text>
      ) : (
        filteredVoters.map((voter) => {
          const status = statusLabels[voter.status];
          const isOpen = openVoter === voter.epicNo;
          const isSelected = selectedVoters.has(voter.epicNo);
          return (
            <View
              key={voter.epicNo}
              style={[styles.voterCard, isSelected && styles.voterCardSelected]}
            >
              <View style={styles.flex}>
                <View style={styles.voterCardHeader}>
                  {bulkMode && (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: isSelected }}
                      style={[styles.selectionBox, isSelected && styles.selectionBoxChecked]}
                      onPress={() => toggleSelection(voter.epicNo)}
                    >
                      {isSelected && <Check size={12} color="#FFF" />}
                    </Pressable>
                  )}
                  <View style={styles.flex}>
                    <View style={styles.voterNameRow}>
                      <Text style={styles.cardTitle}>{voter.name}</Text>
                      {voter.memberId && (
                        <Text style={styles.memberBadge}>{t('MEMBER', 'सदस्य', language)}</Text>
                      )}
                    </View>
                    <Text style={styles.muted}>
                      {voter.age} {t('yr', 'वर्ष', language)} · {voter.address}
                    </Text>
                    <Text style={styles.mono}>{voter.epicNo}</Text>
                  </View>
                  <Text
                    style={[styles.status, { color: status.color, backgroundColor: status.bg }]}
                    onPress={() => {
                      if (!bulkMode) setOpenVoter(isOpen ? null : voter.epicNo);
                    }}
                  >
                    {language === 'hi' ? status.hi : status.en}
                  </Text>
                </View>
                {isOpen && !bulkMode && (
                  <View style={styles.statusPanel}>
                    <Text style={styles.muted}>
                      {t('Update Status', 'स्थिति अपडेट करें', language)}
                    </Text>
                    <View style={styles.statusChoices}>
                      {statusOrder.map((nextStatus) => {
                        const active = voter.status === nextStatus;
                        return (
                          <Pressable
                            key={nextStatus}
                            style={[
                              styles.statusChoice,
                              {
                                backgroundColor: active
                                  ? statusLabels[nextStatus].color
                                  : statusLabels[nextStatus].bg,
                                borderColor: statusLabels[nextStatus].color,
                              },
                            ]}
                            onPress={() => {
                              model.updateVoterStatus(voter.epicNo, nextStatus);
                              setOpenVoter(null);
                            }}
                          >
                            {active && <Check size={10} color="#FFF" />}
                            <Text
                              style={{
                                color: active ? '#FFF' : statusLabels[nextStatus].color,
                                fontSize: 10,
                                fontWeight: '600',
                              }}
                            >
                              {language === 'hi'
                                ? statusLabels[nextStatus].hi
                                : statusLabels[nextStatus].en}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </>
  );
}

function StatusChip({
  label,
  count,
  active,
  onPress,
  color,
  background,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  color: string;
  background: string;
}) {
  return (
    <Pressable
      style={[styles.chip, { backgroundColor: active ? color : background }, styles.statusChip]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, { color: active ? '#FFF' : color }]}>
        {label} {count}
      </Text>
    </Pressable>
  );
}

export default VotersView;

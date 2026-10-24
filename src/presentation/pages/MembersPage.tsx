import { useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';
import type { Member } from '@domain/models';
import { Header } from '@components/SharedComponents';

export function MembersView({ language }: { language: Language }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Member | null>(null);
  const members = model.members.filter(
    (member) =>
      member.name.toLowerCase().includes(query.toLowerCase()) || member.phone.includes(query),
  );
  if (selected)
    return (
      <>
        <Header
          title={t('Member Detail', 'सदस्य विवरण', language)}
          onBack={() => setSelected(null)}
        />
        <View style={styles.profile}>
          <View style={styles.largeAvatar}>
            <Text style={styles.avatarText}>
              {selected.name
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </Text>
          </View>
          <Text style={styles.profileName}>{selected.name}</Text>
          <Text style={styles.accentText}>{selected.id}</Text>
          <Text style={styles.muted}>
            {selected.phone} · {selected.village}
          </Text>
        </View>
        <Pressable style={styles.darkButton}>
          <Text style={styles.whiteBold}>
            {t('Digital Membership Card', 'डिजिटल सदस्यता कार्ड', language)}
          </Text>
        </Pressable>
      </>
    );
  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Members', 'सदस्य', language)}</Text>
        <Pressable style={styles.addButton}>
          <Plus size={16} color="#fff" />
          <Text style={common.buttonText}>{t('Add', 'जोड़ें', language)}</Text>
        </Pressable>
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('Search name, phone, village...', 'नाम, फोन, गांव से खोजें...', language)}
        placeholderTextColor={colors.mutedFg}
        style={styles.input}
      />
      {members.map((member) => (
        <Pressable key={member.id} style={styles.memberCard} onPress={() => setSelected(member)}>
          <View style={styles.memberAvatar}>
            <Text style={styles.avatarText}>
              {member.name
                .split(' ')
                .slice(0, 2)
                .map((part) => part[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{member.name}</Text>
            <Text style={styles.accentText}>{member.id}</Text>
            <Text style={styles.muted}>{member.village}</Text>
          </View>
          <ChevronRight size={16} color={colors.mutedFg} />
        </Pressable>
      ))}
    </>
  );
}

export default MembersView;

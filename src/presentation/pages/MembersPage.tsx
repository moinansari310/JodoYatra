import { useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Plus } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';
import { booths, wards } from '@data/mockData';
import type { Member } from '@domain/models';
import { appModel as model } from '@presentation/state/appModel';
import { translate as t } from '@presentation/i18n';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import type { Language } from '@presentation/types/navigation';

type MemberView = 'list' | 'detail' | 'add';

export function MembersView({ language }: { language: Language }) {
  const [view, setView] = useState<MemberView>('list');
  const [selected, setSelected] = useState<Member | null>(null);
  const [query, setQuery] = useState('');

  if (view === 'detail' && selected) {
    return <MemberDetail member={selected} language={language} onBack={() => setView('list')} />;
  }
  if (view === 'add') {
    return <AddMember language={language} onBack={() => setView('list')} />;
  }

  const members = model.members.filter((member) =>
    `${member.name} ${member.phone} ${member.village} ${member.id}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <>
      <View style={common.header}>
        <View>
          <Text style={common.title}>{t('Members', 'सदस्य', language)}</Text>
          <Text style={styles.muted}>
            {members.length} {t('total enrolled', 'कुल नामांकित', language)}
          </Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => setView('add')}>
          <Plus size={16} color="#FFF" />
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
        <Pressable
          key={member.id}
          style={styles.memberCard}
          onPress={() => {
            setSelected(member);
            setView('detail');
          }}
        >
          <View style={styles.memberAvatar}>
            <Text style={styles.avatarText}>{initials(member.name)}</Text>
          </View>
          <View style={styles.flex}>
            <Text style={styles.cardTitle}>{member.name}</Text>
            <Text style={styles.accentText}>{member.id}</Text>
            <Text style={styles.muted}>
              {member.village} · {member.phone}
            </Text>
          </View>
          <ChevronRight size={16} color={colors.mutedFg} />
        </Pressable>
      ))}
    </>
  );
}

function MemberDetail({
  member,
  language,
  onBack,
}: {
  member: Member;
  language: Language;
  onBack: () => void;
}) {
  const ward = wards.find((item) => item.id === member.wardId);
  const booth = booths.find((item) => item.id === member.boothId);

  return (
    <>
      <View style={common.header}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.fg} />
        </Pressable>
        <Text style={common.title}>{t('Member Detail', 'सदस्य विवरण', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <View style={styles.profile}>
        <View style={styles.largeAvatar}>
          <Text style={styles.avatarText}>{initials(member.name)}</Text>
        </View>
        <Text style={styles.profileName}>{member.name}</Text>
        <Text style={styles.accentText}>{member.id}</Text>
        <Text style={styles.muted}>
          {member.phone} · {member.village}
        </Text>
        <Text style={styles.muted}>
          {ward?.name} · {booth?.name}
        </Text>
        <Text style={styles.muted}>
          {member.epicNo ?? t('EPIC not linked', 'ईपीआईसी लिंक नहीं है', language)} ·{' '}
          {member.joinDate}
        </Text>
      </View>
      <Pressable style={styles.darkButton}>
        <Text style={styles.whiteBold}>
          {t('Digital Membership Card', 'डिजिटल सदस्यता कार्ड', language)}
        </Text>
      </Pressable>
      <Text style={styles.section}>{t('Membership status', 'सदस्यता स्थिति', language)}</Text>
      <View style={styles.card}>
        <Check size={17} color={colors.green} />
        <Text style={styles.cardTitle}>
          {member.status === 'active'
            ? t('Active member', 'सक्रिय सदस्य', language)
            : t('Pending approval', 'अनुमोदन लंबित', language)}
        </Text>
      </View>
    </>
  );
}

function AddMember({ language, onBack }: { language: Language; onBack: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [epicNo, setEpicNo] = useState('');
  const [wardId, setWardId] = useState('w4');
  const [boothId, setBoothId] = useState('b1');
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim() || phone.length !== 10 || !village.trim()) {
      setError(
        t(
          'Name, valid phone, and village are required',
          'नाम, सही फोन और गांव आवश्यक हैं',
          language,
        ),
      );
      return;
    }
    model.addMember({
      id: `JY-${Date.now()}`,
      name: name.trim(),
      phone,
      village: village.trim(),
      epicNo: epicNo.trim() || undefined,
      wardId,
      boothId,
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'active',
    });
    onBack();
  };

  return (
    <>
      <View style={common.header}>
        <Pressable style={styles.iconButton} onPress={onBack}>
          <ArrowLeft size={18} color={colors.fg} />
        </Pressable>
        <Text style={common.title}>{t('Add Member', 'सदस्य जोड़ें', language)}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FormInput
        label={t('Name', 'नाम', language)}
        value={name}
        onChangeText={setName}
        placeholder="Full name"
      />
      <FormInput
        label={t('Phone', 'फोन', language)}
        value={phone}
        onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
        placeholder="10-digit phone"
        keyboardType="phone-pad"
      />
      <FormInput
        label={t('Village', 'गांव', language)}
        value={village}
        onChangeText={setVillage}
        placeholder="Village"
      />
      <FormInput label="EPIC No." value={epicNo} onChangeText={setEpicNo} placeholder="Optional" />
      <ChoiceRow
        label={t('Ward', 'वार्ड', language)}
        value={wards.find((ward) => ward.id === wardId)?.name ?? ''}
        onPress={() => setWardId(wardId === 'w4' ? 'w1' : 'w4')}
        language={language}
      />
      <ChoiceRow
        label={t('Booth', 'बूथ', language)}
        value={booths.find((booth) => booth.id === boothId)?.name ?? ''}
        onPress={() => setBoothId(boothId === 'b1' ? 'b2' : 'b1')}
        language={language}
      />
      <Pressable style={common.button} onPress={save}>
        <Text style={common.buttonText}>{t('Save Member', 'सदस्य सहेजें', language)}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'phone-pad' | 'default';
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedFg}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

function ChoiceRow({
  label,
  value,
  onPress,
  language,
}: {
  label: string;
  value: string;
  onPress: () => void;
  language: Language;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.flex}>
        <Text style={styles.muted}>{label}</Text>
        <Text style={styles.cardTitle}>{value}</Text>
      </View>
      <Text style={styles.accentText}>{t('Change', 'बदलें', language)}</Text>
    </Pressable>
  );
}

const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

export default MembersView;

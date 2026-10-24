import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';

export function LoginView({
  language,
  onLanguageChange,
  onLogin,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogin: (phone: string) => void;
}) {
  const [splash, setSplash] = useState(true);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 900);
    return () => clearTimeout(timer);
  }, []);
  if (splash)
    return (
      <View style={styles.splash}>
        <View style={styles.splashBar} />
        <Text style={styles.splashTitle}>
          जोड़ो <Text style={styles.accent}>Yatra</Text>
        </Text>
        <Text style={styles.splashSub}>
          {t('Stronger together', 'साथ जुड़ें, आगे बढ़ें', language)}
        </Text>
        <Text style={styles.splashFoot}>Bishrampur · Palamu</Text>
      </View>
    );
  return (
    <SafeAreaView style={common.screen}>
      <ScrollView contentContainerStyle={styles.login}>
        <Pressable
          style={styles.language}
          onPress={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
        >
          <Text style={styles.smallBold}>{language === 'en' ? 'EN' : 'HI'} → </Text>
          <Text style={[styles.smallBold, styles.accent]}>{language === 'en' ? 'हि' : 'EN'}</Text>
        </Pressable>
        <Text style={styles.loginTitle}>
          जोड़ो <Text style={styles.accent}>Yatra</Text>
        </Text>
        <Text style={styles.subtitle}>
          {t('Bishrampur Constituency Campaign App', 'बिश्रामपुर विधानसभा अभियान ऐप', language)}
        </Text>
        <Text style={styles.label}>{t('PHONE NUMBER', 'फोन नंबर', language)}</Text>
        <TextInput
          value={value}
          onChangeText={setValue}
          keyboardType="phone-pad"
          maxLength={10}
          placeholder="10-digit mobile number"
          placeholderTextColor={colors.mutedFg}
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={common.button}
          onPress={() =>
            value.length === 10
              ? onLogin(value)
              : setError(
                  t(
                    'Enter a valid 10-digit phone number',
                    'सही 10 अंकों का फोन नंबर दर्ज करें',
                    language,
                  ),
                )
          }
        >
          <Text style={common.buttonText}>{t('Continue', 'जारी रखें', language)}</Text>
        </Pressable>
        <Text style={styles.demo}>{t('Demo OTP: 1234', 'डेमो OTP: 1234', language)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginView;

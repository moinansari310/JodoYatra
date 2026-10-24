import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Phone, ShieldCheck } from 'lucide-react-native';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';

type AuthView = 'splash' | 'signup' | 'verify' | 'login' | 'forgot';
type RecoveryStep = 'identify' | 'otp' | 'password';
const DEMO_OTP = '1234';

export function LoginView({
  language,
  onLanguageChange,
  onLogin,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogin: (identifier: string) => void;
}) {
  const [view, setView] = useState<AuthView>('splash');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('identify');
  const [otp, setOtp] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setView('signup'), 900);
    return () => clearTimeout(timer);
  }, []);

  const changeView = (next: AuthView) => {
    setError('');
    setView(next);
  };
  const validIdentifier = (value: string) => /^\d{10}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const submitAsync = (action: () => void) => {
    setLoading(true);
    setTimeout(() => { setLoading(false); action(); }, 500);
  };
  const handleSignup = () => {
    if (phone.length !== 10) return setError(t('Enter a valid 10-digit phone number', 'सही 10 अंकों का फोन नंबर दर्ज करें', language));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(t('Enter a valid email address', 'सही ईमेल पता दर्ज करें', language));
    if (password.length < 8) return setError(t('Password must be at least 8 characters', 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए', language));
    submitAsync(() => changeView('verify'));
  };
  const handleVerify = () => {
    if (otp !== DEMO_OTP) return setError(t('Enter the demo code 1234', 'डेमो कोड 1234 दर्ज करें', language));
    submitAsync(() => onLogin(phone));
  };
  const handleLogin = () => {
    if (!validIdentifier(loginId)) return setError(t('Enter a valid phone number or email', 'सही फोन नंबर या ईमेल दर्ज करें', language));
    if (!loginPassword) return setError(t('Enter your password', 'अपना पासवर्ड दर्ज करें', language));
    submitAsync(() => onLogin(loginId));
  };
  const handleForgot = () => {
    if (!validIdentifier(recoveryId)) return setError(t('Enter a valid phone number or email', 'सही फोन नंबर या ईमेल दर्ज करें', language));
    submitAsync(() => setRecoveryStep('otp'));
  };
  const verifyRecoveryOtp = () => {
    if (recoveryOtp !== DEMO_OTP) return setError(t('Enter the demo code 1234', 'डेमो कोड 1234 दर्ज करें', language));
    setRecoveryStep('password');
    setError('');
  };
  const resetPassword = () => {
    if (newPassword.length < 8) return setError(t('Password must be at least 8 characters', 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए', language));
    if (newPassword !== confirmPassword) return setError(t('Passwords do not match', 'दोनों पासवर्ड मेल नहीं खाते', language));
    setLoginId(recoveryId);
    setLoginPassword('');
    changeView('login');
  };

  if (view === 'splash') return <View style={styles.splash}><View style={styles.splashBar} /><Text style={styles.splashTitle}>जोड़ो <Text style={styles.accent}>Yatra</Text></Text><Text style={styles.splashSub}>{t('Stronger together', 'साथ जुड़ें, आगे बढ़ें', language)}</Text><Text style={styles.splashFoot}>{t('Bishrampur · Palamu', 'बिश्रामपुर · पलामू', language)}</Text></View>;
  if (view === 'verify') return <AuthFrame language={language} onLanguageChange={onLanguageChange} onBack={() => changeView('signup')}><AuthHeader icon={<ShieldCheck size={24} color={colors.accent} />} title={t('Verify your number', 'अपना नंबर सत्यापित करें', language)} body={`${t('Enter the demo OTP sent to', 'भेजा गया डेमो OTP दर्ज करें', language)} ${phone}`} /><OtpInput value={otp} onChangeText={setOtp} /><ActionButton label={t('Verify & Continue', 'सत्यापित करें', language)} loading={loading} onPress={handleVerify} /><Text style={styles.link} onPress={() => setOtp('')}>{t('Resend code', 'कोड फिर भेजें', language)}</Text>{error ? <Text style={styles.error}>{error}</Text> : null}</AuthFrame>;
  if (view === 'forgot') return <AuthFrame language={language} onLanguageChange={onLanguageChange} onBack={() => recoveryStep === 'identify' ? changeView('login') : setRecoveryStep(recoveryStep === 'password' ? 'otp' : 'identify')}><AuthHeader icon={<LockKeyhole size={24} color={colors.accent} />} title={t('Reset password', 'पासवर्ड रीसेट करें', language)} body={t('Recover access to your account', 'अपने खाते की पहुंच वापस पाएं', language)} />{recoveryStep === 'identify' && <><Field icon={<Mail size={16} color={colors.mutedFg} />} value={recoveryId} onChangeText={setRecoveryId} placeholder={t('Phone or email', 'फोन या ईमेल', language)} /><ActionButton label={t('Send OTP', 'OTP भेजें', language)} loading={loading} onPress={handleForgot} /></>}{recoveryStep === 'otp' && <><Text style={styles.muted}>{t('Enter OTP 1234', 'OTP 1234 दर्ज करें', language)}</Text><OtpInput value={recoveryOtp} onChangeText={setRecoveryOtp} /><ActionButton label={t('Verify OTP', 'OTP सत्यापित करें', language)} loading={false} onPress={verifyRecoveryOtp} /></>}{recoveryStep === 'password' && <><PasswordField value={newPassword} onChangeText={setNewPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} placeholder={t('New password', 'नया पासवर्ड', language)} /><PasswordField value={confirmPassword} onChangeText={setConfirmPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} placeholder={t('Confirm password', 'पासवर्ड दोहराएं', language)} /><ActionButton label={t('Reset Password', 'पासवर्ड रीसेट करें', language)} loading={loading} onPress={resetPassword} /></>}{error ? <Text style={styles.error}>{error}</Text> : null}</AuthFrame>;
  if (view === 'login') return <AuthFrame language={language} onLanguageChange={onLanguageChange}><AuthHeader icon={<LockKeyhole size={24} color={colors.accent} />} title={t('Welcome back', 'वापसी पर स्वागत है', language)} body={t('Log in to continue to Jodo Yatra', 'जोड़ो यात्रा में आगे बढ़ें', language)} /><Field icon={<Mail size={16} color={colors.mutedFg} />} value={loginId} onChangeText={setLoginId} placeholder={t('Phone or email', 'फोन या ईमेल', language)} /><PasswordField value={loginPassword} onChangeText={setLoginPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} placeholder={t('Password', 'पासवर्ड', language)} /><Text style={styles.link} onPress={() => changeView('forgot')}>{t('Forgot password?', 'पासवर्ड भूल गए?', language)}</Text><ActionButton label={t('Log In', 'लॉग इन', language)} loading={loading} onPress={handleLogin} /><Text style={styles.switchText}>{t('New to Jodo Yatra?', 'जोड़ो यात्रा में नए हैं?', language)} <Text style={styles.link} onPress={() => changeView('signup')}>{t('Create account', 'खाता बनाएं', language)}</Text></Text>{error ? <Text style={styles.error}>{error}</Text> : null}</AuthFrame>;
  return <AuthFrame language={language} onLanguageChange={onLanguageChange}><AuthHeader icon={<Phone size={24} color={colors.accent} />} title={t('Create account', 'खाता बनाएं', language)} body={t('Join the Bishrampur campaign', 'बिश्रामपुर अभियान से जुड़ें', language)} /><Field icon={<Phone size={16} color={colors.mutedFg} />} value={phone} onChangeText={setPhone} placeholder={t('10-digit phone number', '10 अंकों का फोन नंबर', language)} keyboardType="phone-pad" /><Field icon={<Mail size={16} color={colors.mutedFg} />} value={email} onChangeText={setEmail} placeholder={t('Email address', 'ईमेल पता', language)} keyboardType="email-address" /><PasswordField value={password} onChangeText={setPassword} visible={showPassword} onToggle={() => setShowPassword(!showPassword)} placeholder={t('Create password', 'पासवर्ड बनाएं', language)} /><ActionButton label={t('Create Account', 'खाता बनाएं', language)} loading={loading} onPress={handleSignup} /><Text style={styles.switchText}>{t('Already have an account?', 'पहले से खाता है?', language)} <Text style={styles.link} onPress={() => changeView('login')}>{t('Log in', 'लॉग इन', language)}</Text></Text>{error ? <Text style={styles.error}>{error}</Text> : null}</AuthFrame>;
}

function AuthFrame({ children, language, onLanguageChange, onBack }: { children: ReactNode; language: Language; onLanguageChange: (language: Language) => void; onBack?: () => void }) { return <SafeAreaView style={common.screen}><ScrollView contentContainerStyle={styles.login}>{onBack && <Pressable style={styles.backButton} onPress={onBack}><ArrowLeft size={18} color={colors.fg} /></Pressable>}<Pressable style={styles.language} onPress={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}><Text style={styles.smallBold}>{language === 'en' ? 'EN' : 'HI'} → </Text><Text style={[styles.smallBold, styles.accent]}>{language === 'en' ? 'हि' : 'EN'}</Text></Pressable>{children}</ScrollView></SafeAreaView>; }
function AuthHeader({ icon, title, body }: { icon: ReactNode; title: string; body: string }) { return <View style={styles.authHeader}>{icon}<Text style={styles.authTitle}>{title}</Text><Text style={styles.subtitle}>{body}</Text></View>; }
function Field({ icon, value, onChangeText, placeholder, keyboardType }: { icon: ReactNode; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'phone-pad' | 'email-address' | 'default' }) { return <View style={styles.field}><View>{icon}</View><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedFg} keyboardType={keyboardType} autoCapitalize="none" style={styles.fieldInput} /></View>; }
function PasswordField({ value, onChangeText, visible, onToggle, placeholder }: { value: string; onChangeText: (value: string) => void; visible: boolean; onToggle: () => void; placeholder: string }) { return <View style={styles.field}><LockKeyhole size={16} color={colors.mutedFg} /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedFg} secureTextEntry={!visible} style={styles.fieldInput} /><Pressable onPress={onToggle}>{visible ? <EyeOff size={17} color={colors.mutedFg} /> : <Eye size={17} color={colors.mutedFg} />}</Pressable></View>; }
function OtpInput({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) { return <TextInput value={value} onChangeText={(next) => onChangeText(next.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} placeholder="1234" placeholderTextColor={colors.mutedFg} style={[styles.input, styles.otpInput]} />; }
function ActionButton({ label, onPress, loading }: { label: string; onPress: () => void; loading: boolean }) { return <Pressable style={common.button} onPress={onPress} disabled={loading}><Text style={common.buttonText}>{loading ? '...' : label}</Text></Pressable>; }

export default LoginView;

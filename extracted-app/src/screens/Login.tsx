import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  onLogin: (identifier: string, role: string) => void;
  lang: 'en' | 'hi';
  onLangChange: (l: 'en' | 'hi') => void;
}

type View = 'splash' | 'signup' | 'verify' | 'login' | 'forgot';
type RecoveryStep = 'identify' | 'otp' | 'password';

const DEMO_OTP = '1234';

export default function Login({ onLogin, lang, onLangChange }: Props) {
  const [view, setView] = useState<View>('splash');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('identify');
  const [recoveryOtp, setRecoveryOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetComplete, setResetComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const recoveryOtpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const t = (en: string, hi: string) => (lang === 'hi' ? hi : en);

  useEffect(() => {
    const timer = window.setTimeout(() => setView('signup'), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  const changeView = (next: View) => {
    setError('');
    setView(next);
  };

  const handleSignup = () => {
    if (phone.length !== 10) {
      setError(t('Enter a valid 10-digit phone number', 'सही 10 अंकों का फोन नंबर दर्ज करें'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('Enter a valid email address', 'सही ईमेल पता दर्ज करें'));
      return;
    }
    if (password.length < 8) {
      setError(t('Password must be at least 8 characters', 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      changeView('verify');
      window.setTimeout(() => otpRefs[0].current?.focus(), 100);
    }, 700);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError('');
    if (value && index < otp.length - 1) otpRefs[index + 1].current?.focus();
  };

  const handleVerify = () => {
    if (otp.join('') !== DEMO_OTP) {
      setError(t('Enter the demo code 1234', 'डेमो कोड 1234 दर्ज करें'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => onLogin(phone, 'volunteer'), 650);
  };

  const handleLogin = () => {
    const isPhone = /^\d{10}$/.test(loginId);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginId);
    if (!isPhone && !isEmail) {
      setError(t('Enter a valid phone number or email', 'सही फोन नंबर या ईमेल दर्ज करें'));
      return;
    }
    if (!loginPassword) {
      setError(t('Enter your password', 'अपना पासवर्ड दर्ज करें'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => onLogin(loginId, 'volunteer'), 650);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    window.setTimeout(() => onLogin('google.user@jodoyatra.in', 'volunteer'), 650);
  };

  const handleForgotPassword = () => {
    const isPhone = /^\d{10}$/.test(recoveryId);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryId);
    if (!isPhone && !isEmail) {
      setError(t('Enter a valid phone number or email', 'सही फोन नंबर या ईमेल दर्ज करें'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setRecoveryStep('otp');
      window.setTimeout(() => recoveryOtpRefs[0].current?.focus(), 100);
    }, 650);
  };

  const handleRecoveryOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...recoveryOtp];
    next[index] = value;
    setRecoveryOtp(next);
    setError('');
    if (value && index < recoveryOtp.length - 1) recoveryOtpRefs[index + 1].current?.focus();
  };

  const handleRecoveryOtpVerify = () => {
    if (recoveryOtp.join('') !== DEMO_OTP) {
      setError(t('Enter the demo code 1234', 'डेमो कोड 1234 दर्ज करें'));
      return;
    }
    setError('');
    setRecoveryStep('password');
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 8) {
      setError(t('Password must be at least 8 characters', 'पासवर्ड कम से कम 8 अक्षरों का होना चाहिए'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('Passwords do not match', 'दोनों पासवर्ड मेल नहीं खाते'));
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setLoginId(recoveryId);
      setLoginPassword('');
      setResetComplete(true);
      changeView('login');
    }, 650);
  };

  if (view === 'splash') {
    return (
      <div className="min-h-screen bg-fg flex flex-col items-center justify-center px-8">
        <div className="w-12 h-1 bg-accent rounded-full mb-7 splash-reveal" />
        <div className="text-center splash-reveal">
          <div className="font-display font-800 text-4xl text-white tracking-tight">
            जोड़ो <span className="text-accent">Yatra</span>
          </div>
          <div className="mt-3 text-white/55 text-sm tracking-wide">
            {t('Stronger together', 'साथ जुड़ें, आगे बढ़ें')}
          </div>
        </div>
        <div className="absolute bottom-10 text-center">
          <div className="text-white/35 text-[10px] uppercase tracking-[0.2em]">
            {t('Bishrampur · Palamu', 'बिश्रामपुर · पलामू')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen px-5 pt-10 pb-8 flex flex-col">
        <div className="flex justify-end mb-7">
          <button
            onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
            className="tap-highlight-none flex items-center gap-1.5 bg-card border border-border rounded-full px-3 py-1.5"
            aria-label={t('Change language', 'भाषा बदलें')}
          >
            <span className="text-xs font-700 text-fg">{lang === 'en' ? 'EN' : 'HI'}</span>
            <span className="text-muted-fg text-xs">→</span>
            <span className="text-xs font-700 text-accent">{lang === 'en' ? 'हि' : 'EN'}</span>
          </button>
        </div>

        <div className="text-center mb-7">
          <div className="font-display font-800 text-3xl text-fg">
            जोड़ो <span className="text-accent">Yatra</span>
          </div>
          <div className="text-muted-fg text-sm mt-1">
            {t('Bishrampur Constituency Campaign App', 'बिश्रामपुर विधानसभा अभियान ऐप')}
          </div>
          <div className="text-muted-fg text-xs mt-0.5">
            {t('Palamu District, Jharkhand', 'पलामू जिला, झारखण्ड')}
          </div>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {view === 'signup' && (
            <div className="auth-enter p-6">
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 bg-accent-light text-accent rounded-full px-3 py-1.5 mb-3">
                  <ShieldCheck size={14} strokeWidth={2.2} />
                  <span className="text-[11px] font-700">{t('Secure membership access', 'सुरक्षित सदस्यता एक्सेस')}</span>
                </div>
                <h1 className="font-display font-700 text-xl leading-tight text-fg">
                  {t('Create your account', 'अपना अकाउंट बनाएं')}
                </h1>
                <p className="text-xs text-muted-fg mt-1.5 leading-relaxed">
                  {t(
                    'Join your constituency team and manage campaign work in one place.',
                    'अपनी विधानसभा टीम से जुड़ें और अभियान का काम एक जगह संभालें।',
                  )}
                </p>
              </div>

              <div className="space-y-3.5">
                <Field
                  label={t('Primary phone number', 'प्राथमिक फोन नंबर')}
                  icon={<Phone size={17} />}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-600 text-fg pr-3 mr-3 border-r border-border">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(event) => {
                        setPhone(event.target.value.replace(/\D/g, ''));
                        setError('');
                      }}
                      placeholder="98765 43210"
                      className="w-full bg-transparent outline-none text-sm font-600 text-fg placeholder:text-muted-fg/60"
                    />
                  </div>
                </Field>

                <Field label={t('Email address', 'ईमेल पता')} icon={<Mail size={17} />}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError('');
                    }}
                    placeholder="you@example.com"
                    className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                  />
                </Field>

                <Field label={t('Create password', 'पासवर्ड बनाएं')} icon={<LockKeyhole size={17} />}>
                  <div className="flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError('');
                      }}
                      placeholder={t('Minimum 8 characters', 'कम से कम 8 अक्षर')}
                      className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                    />
                    <PasswordToggle visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                  </div>
                </Field>
              </div>

              {error && <div className="text-status-opposed text-xs mt-3">{error}</div>}

              <button
                onClick={handleSignup}
                disabled={loading}
                className="tap-highlight-none mt-5 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {loading ? <Spinner /> : <>{t('Verify phone & sign up', 'फोन सत्यापित करें और साइन अप करें')}<ArrowRight size={17} /></>}
              </button>

              <div className="pt-5 text-center text-xs text-muted-fg">
                {t('Already a member?', 'पहले से सदस्य हैं?')}{' '}
                <button onClick={() => changeView('login')} className="text-accent font-700 tap-highlight-none">
                  {t('Log in', 'लॉग इन करें')}
                </button>
              </div>
            </div>
          )}

          {view === 'verify' && (
          <div className="auth-enter p-6">
            <button
              onClick={() => changeView('signup')}
              className="tap-highlight-none flex items-center gap-1 text-muted-fg text-xs mb-5"
              aria-label={t('Back', 'वापस')}
            >
              <ArrowLeft size={13} /> {t('Change details', 'विवरण बदलें')}
            </button>
            <h1 className="font-display font-700 text-xl text-fg">
              {t('Verify your phone', 'अपना फोन सत्यापित करें')}
            </h1>
            <p className="text-xs text-muted-fg mt-1.5 leading-relaxed">
              {t('We sent a 4-digit code to', 'हमने 4 अंकों का कोड भेजा है')} {' '}
              <span className="font-700 text-fg">+91 {phone}</span>
            </p>

            <div className="flex gap-3 mt-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && !otp[index] && index > 0) {
                      otpRefs[index - 1].current?.focus();
                    }
                  }}
                  className="min-w-0 flex-1 aspect-square rounded-xl bg-bg border border-border-strong text-center text-xl font-mono font-700 text-fg outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
                />
              ))}
            </div>

            {error && <div className="text-status-opposed text-xs mt-4 text-center">{error}</div>}
            <div className="text-center text-[11px] text-muted-fg mt-4">
              {t('Demo verification code: 1234', 'डेमो सत्यापन कोड: 1234')}
            </div>

            <button
              onClick={handleVerify}
              disabled={loading}
              className="tap-highlight-none mt-6 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Spinner /> : <><Check size={18} />{t('Verify & create account', 'सत्यापित करें और अकाउंट बनाएं')}</>}
            </button>

            <button
              onClick={() => setOtp(['', '', '', ''])}
              className="tap-highlight-none mt-4 text-sm font-700 text-accent"
            >
              {t('Resend verification code', 'सत्यापन कोड दोबारा भेजें')}
            </button>
          </div>
          )}

          {view === 'login' && (
          <div className="auth-enter p-6">
            <div className="mb-5">
              <h1 className="font-display font-700 text-xl text-fg">
                {t('Welcome back', 'फिर से स्वागत है')}
              </h1>
              <p className="text-xs text-muted-fg mt-1.5">
                {t('Log in to continue your campaign work.', 'अभियान का काम जारी रखने के लिए लॉग इन करें।')}
              </p>
            </div>

            {resetComplete && (
              <div className="flex items-start gap-2.5 bg-accent-light text-fg rounded-xl px-3.5 py-3 mb-4">
                <Check size={16} className="text-accent shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {t(
                    'Password updated. Log in with your new password.',
                    'पासवर्ड अपडेट हो गया। अपने नए पासवर्ड से लॉग इन करें।',
                  )}
                </span>
              </div>
            )}

            <div className="space-y-3.5">
              <Field label={t('Phone or email', 'फोन या ईमेल')} icon={<Phone size={17} />}>
                <input
                  type="text"
                  value={loginId}
                  onChange={(event) => {
                    setLoginId(event.target.value);
                    setError('');
                  }}
                  placeholder={t('Phone number or email', 'फोन नंबर या ईमेल')}
                  className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                />
              </Field>
              <Field label={t('Password', 'पासवर्ड')} icon={<LockKeyhole size={17} />}>
                <div className="flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(event) => {
                      setLoginPassword(event.target.value);
                      setError('');
                    }}
                    placeholder="••••••••"
                    className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                  />
                  <PasswordToggle visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                </div>
              </Field>
            </div>

            <button
              onClick={() => {
                setRecoveryId(loginId);
                setRecoveryStep('identify');
                setRecoveryOtp(['', '', '', '']);
                setNewPassword('');
                setConfirmPassword('');
                setResetComplete(false);
                changeView('forgot');
              }}
              className="tap-highlight-none self-end mt-3 text-xs font-700 text-accent"
            >
              {t('Forgot password?', 'पासवर्ड भूल गए?')}
            </button>
            {error && <div className="text-status-opposed text-xs mt-3">{error}</div>}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="tap-highlight-none mt-5 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Spinner /> : <>{t('Log in', 'लॉग इन करें')}<ArrowRight size={17} /></>}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-border flex-1" />
              <span className="text-[11px] text-muted-fg uppercase tracking-wider">{t('or', 'या')}</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="tap-highlight-none w-full bg-bg border border-border-strong text-fg rounded-xl py-3.5 font-700 text-sm flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center font-display font-700 text-xs">G</span>
              {t('Continue with Google', 'Google से जारी रखें')}
            </button>

            <div className="pt-5 text-center text-xs text-muted-fg">
              {t('New to Jodo Yatra?', 'Jodo Yatra पर नए हैं?')}{' '}
              <button onClick={() => changeView('signup')} className="text-accent font-700 tap-highlight-none">
                {t('Create account', 'अकाउंट बनाएं')}
              </button>
            </div>
          </div>
          )}

          {view === 'forgot' && (
            <div className="auth-enter p-6">
              <button
                onClick={() => {
                  if (recoveryStep === 'password') {
                    setRecoveryStep('otp');
                  } else if (recoveryStep === 'otp') {
                    setRecoveryStep('identify');
                  } else {
                    changeView('login');
                  }
                  setError('');
                }}
                className="tap-highlight-none flex items-center gap-1 text-muted-fg text-xs mb-5"
              >
                <ArrowLeft size={13} /> {recoveryStep === 'identify'
                  ? t('Back to login', 'लॉग इन पर वापस जाएं')
                  : t('Go back', 'वापस जाएं')}
              </button>

              {recoveryStep === 'identify' && (
                <>
                  <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4">
                    <LockKeyhole size={20} />
                  </div>
                  <h1 className="font-display font-700 text-xl text-fg">
                    {t('Reset your password', 'अपना पासवर्ड रीसेट करें')}
                  </h1>
                  <p className="text-xs text-muted-fg mt-1.5 mb-5 leading-relaxed">
                    {t(
                      'Enter your registered phone number or email. We will send a verification OTP.',
                      'अपना पंजीकृत फोन नंबर या ईमेल दर्ज करें। हम सत्यापन OTP भेजेंगे।',
                    )}
                  </p>

                  <Field label={t('Phone or email', 'फोन या ईमेल')} icon={<Mail size={17} />}>
                    <input
                      type="text"
                      value={recoveryId}
                      onChange={(event) => {
                        setRecoveryId(event.target.value);
                        setError('');
                      }}
                      placeholder={t('Phone number or email', 'फोन नंबर या ईमेल')}
                      className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                    />
                  </Field>

                  {error && <div className="text-status-opposed text-xs mt-3">{error}</div>}

                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="tap-highlight-none mt-5 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Spinner /> : <>{t('Send verification OTP', 'सत्यापन OTP भेजें')}<ArrowRight size={17} /></>}
                  </button>
                </>
              )}

              {recoveryStep === 'otp' && (
                <>
                  <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4">
                    <ShieldCheck size={20} />
                  </div>
                  <h1 className="font-display font-700 text-xl text-fg">
                    {t('Verify your account', 'अपना अकाउंट सत्यापित करें')}
                  </h1>
                  <p className="text-xs text-muted-fg mt-1.5 leading-relaxed">
                    {t('Enter the OTP sent to', 'इस पर भेजा गया OTP दर्ज करें')} {' '}
                    <span className="font-700 text-fg">{recoveryId}</span>
                  </p>

                  <div className="flex gap-3 mt-6">
                    {recoveryOtp.map((digit, index) => (
                      <input
                        key={index}
                        ref={recoveryOtpRefs[index]}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleRecoveryOtpChange(index, event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === 'Backspace' && !recoveryOtp[index] && index > 0) {
                            recoveryOtpRefs[index - 1].current?.focus();
                          }
                        }}
                        className="min-w-0 flex-1 aspect-square rounded-xl bg-bg border border-border-strong text-center text-xl font-mono font-700 text-fg outline-none focus:border-accent focus:ring-2 focus:ring-accent-light"
                      />
                    ))}
                  </div>

                  {error && <div className="text-status-opposed text-xs mt-3 text-center">{error}</div>}
                  <div className="text-center text-[11px] text-muted-fg mt-3">
                    {t('Demo verification code: 1234', 'डेमो सत्यापन कोड: 1234')}
                  </div>

                  <button
                    onClick={handleRecoveryOtpVerify}
                    className="tap-highlight-none mt-5 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2"
                  >
                    <Check size={17} /> {t('Verify OTP', 'OTP सत्यापित करें')}
                  </button>
                  <button
                    onClick={() => setRecoveryOtp(['', '', '', ''])}
                    className="tap-highlight-none mt-4 w-full text-xs font-700 text-accent"
                  >
                    {t('Resend OTP', 'OTP दोबारा भेजें')}
                  </button>
                </>
              )}

              {recoveryStep === 'password' && (
                <>
                  <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center mb-4">
                    <LockKeyhole size={20} />
                  </div>
                  <h1 className="font-display font-700 text-xl text-fg">
                    {t('Create new password', 'नया पासवर्ड बनाएं')}
                  </h1>
                  <p className="text-xs text-muted-fg mt-1.5 mb-5 leading-relaxed">
                    {t(
                      'Choose a strong password with at least 8 characters.',
                      'कम से कम 8 अक्षरों वाला मजबूत पासवर्ड चुनें।',
                    )}
                  </p>

                  <div className="space-y-3.5">
                    <Field label={t('New password', 'नया पासवर्ड')} icon={<LockKeyhole size={17} />}>
                      <div className="flex items-center">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(event) => {
                            setNewPassword(event.target.value);
                            setError('');
                          }}
                          placeholder={t('Minimum 8 characters', 'कम से कम 8 अक्षर')}
                          className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                        />
                        <PasswordToggle visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
                      </div>
                    </Field>
                    <Field label={t('Confirm new password', 'नए पासवर्ड की पुष्टि करें')} icon={<LockKeyhole size={17} />}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(event.target.value);
                          setError('');
                        }}
                        placeholder={t('Enter password again', 'पासवर्ड दोबारा दर्ज करें')}
                        className="w-full bg-transparent outline-none text-sm text-fg placeholder:text-muted-fg/60"
                      />
                    </Field>
                  </div>

                  {error && <div className="text-status-opposed text-xs mt-3">{error}</div>}

                  <button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    className="tap-highlight-none mt-5 w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? <Spinner /> : <>{t('Reset password', 'पासवर्ड रीसेट करें')}<ArrowRight size={17} /></>}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 text-center text-[10px] text-muted-fg">
          {t(
            'By continuing, you agree to our Terms & Privacy Policy.',
            'जारी रखकर आप हमारी शर्तों और गोपनीयता नीति से सहमत हैं।',
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-700 text-fg mb-2">{label}</span>
      <span className="flex items-center gap-3 bg-bg border border-border-strong rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent-light transition-colors">
        <span className="text-muted-fg shrink-0">{icon}</span>
        <span className="min-w-0 flex-1">{children}</span>
      </span>
    </label>
  );
}

function PasswordToggle({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="tap-highlight-none text-muted-fg ml-3 shrink-0"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />;
}

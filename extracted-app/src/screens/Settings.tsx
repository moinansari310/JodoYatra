import { useState } from 'react';
import { User, Shield, Globe, Download, Bell, LogOut, ChevronRight, Check, Activity, IndianRupee, AlertCircle } from 'lucide-react';
import { wards } from '../data/mockData';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  onLangChange: (l: 'en' | 'hi') => void;
  onLogout: () => void;
  userPhone: string;
  userRole: string;
  appState: AppState;
}

const roleLabels: Record<string, { en: string; hi: string }> = {
  super_admin:              { en: 'Super Admin',              hi: 'सुपर एडमिन' },
  constituency_coordinator: { en: 'Constituency Coordinator', hi: 'निर्वाचन समन्वयक' },
  ward_coordinator:         { en: 'Ward Coordinator',         hi: 'वार्ड समन्वयक' },
  booth_coordinator:        { en: 'Booth Coordinator',        hi: 'बूथ समन्वयक' },
  volunteer:                { en: 'Volunteer',                hi: 'स्वयंसेवक' },
};

const userNames: Record<string, string> = {
  super_admin: 'Ajay Kumar Verma',
  constituency_coordinator: 'Sunita Devi',
  ward_coordinator: 'Priya Kumari',
  booth_coordinator: 'Manoj Tiwari',
  volunteer: 'Rajesh Kumar',
};

type SettingsView = 'main' | 'donations' | 'activity';

export default function Settings({ lang, onLangChange, onLogout, userPhone, userRole, appState }: Props) {
  const [notifEvents, setNotifEvents]           = useState(true);
  const [notifTasks, setNotifTasks]             = useState(true);
  const [notifMilestones, setNotifMilestones]   = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [view, setView]                         = useState<SettingsView>('main');

  const isAdmin = ['super_admin', 'constituency_coordinator'].includes(userRole);
  const role    = roleLabels[userRole] ?? roleLabels.volunteer;
  const name    = userNames[userRole] ?? 'User';
  const ward    = wards.find(w => w.id === 'w4');

  const t = (en: string, hi: string) => lang === 'hi' ? hi : en;

  if (view === 'donations') return <DonationsView lang={lang} onBack={() => setView('main')} />;
  if (view === 'activity')  return <ActivityView  lang={lang} onBack={() => setView('main')} appState={appState} />;

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display font-700 text-xl text-fg">{t('Settings', 'सेटिंग्स')}</h1>
      </div>

      {/* Profile card */}
      <div className="mx-5 mb-5">
        <div className="bg-fg rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center font-display font-700 text-white text-xl shrink-0">
              {name.split(' ').slice(0,2).map(n=>n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-700 text-white text-base truncate">{name}</div>
              <div className="text-[11px] mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>+91 {userPhone}</div>
              <div className="mt-1.5 inline-flex items-center gap-1.5 bg-accent/20 rounded-full px-2.5 py-0.5">
                <Shield size={10} className="text-accent" />
                <span className="text-accent text-[10px] font-700">{lang==='hi'?role.hi:role.en}</span>
              </div>
            </div>
          </div>
          <div className="border-t pt-3 grid grid-cols-3 gap-3" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <StatPill label={t('Ward', 'वार्ड')} value={lang==='hi'?ward?.nameHi.split(' ')[0]:ward?.name.split(' ')[0]} />
            <StatPill label={t('Members', 'सदस्य')} value={String(appState.members.length)} />
            <StatPill label={t('Tasks', 'कार्य')} value={String(appState.tasks.filter(t=>t.status==='done').length)} />
          </div>
        </div>
      </div>

      {/* Language */}
      <section className="px-5 mb-4">
        <SectionTitle>{t('Language', 'भाषा')}</SectionTitle>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <LangOption label="English" sublabel="Interface in English" selected={lang==='en'} onClick={()=>onLangChange('en')} />
          <div className="h-px bg-border mx-4" />
          <LangOption label="हिंदी" sublabel="हिंदी में इंटरफ़ेस" selected={lang==='hi'} onClick={()=>onLangChange('hi')} />
        </div>
      </section>

      {/* Notifications */}
      <section className="px-5 mb-4">
        <SectionTitle>{t('Notifications', 'सूचनाएं')}</SectionTitle>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <ToggleRow label={t('Event Reminders', 'कार्यक्रम अनुस्मारक')} on={notifEvents} onToggle={()=>setNotifEvents(v=>!v)} />
          <div className="h-px bg-border mx-4" />
          <ToggleRow label={t('New Task Assigned', 'नया कार्य सौंपा गया')} on={notifTasks} onToggle={()=>setNotifTasks(v=>!v)} />
          <div className="h-px bg-border mx-4" />
          <ToggleRow label={t('Coverage Milestones', 'कवरेज मील पत्थर')} on={notifMilestones} onToggle={()=>setNotifMilestones(v=>!v)} />
        </div>
      </section>

      {/* Data */}
      <section className="px-5 mb-4">
        <SectionTitle>{t('Data & Export', 'डेटा और निर्यात')}</SectionTitle>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <MenuRow icon={<Download size={16}/>} label={t('Export Members List', 'सदस्य सूची निर्यात करें')} />
          <div className="h-px bg-border mx-4" />
          <MenuRow icon={<Download size={16}/>} label={t('Export Voter Status Report', 'मतदाता स्थिति रिपोर्ट')} />
          <div className="h-px bg-border mx-4" />
          <MenuRow icon={<Activity size={16}/>} label={t('Activity Log', 'गतिविधि लॉग')} onClick={()=>setView('activity')} />
        </div>
      </section>

      {/* Donations — admin only */}
      {isAdmin && (
        <section className="px-5 mb-4">
          <SectionTitle>{t('Donations Module', 'दान मॉड्यूल')}</SectionTitle>
          <button
            onClick={() => setView('donations')}
            className="tap-highlight-none w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <IndianRupee size={16} className="text-green-700" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-600 text-sm text-fg">{t('Manage Donations', 'दान प्रबंधित करें')}</div>
              <div className="text-[11px] text-muted-fg">{t('Admin access only', 'केवल एडमिन एक्सेस')}</div>
            </div>
            <ChevronRight size={16} className="text-muted-fg shrink-0" />
          </button>
        </section>
      )}

      {/* Sync status */}
      <section className="px-5 mb-4">
        <SectionTitle>{t('Sync Status', 'सिंक स्थिति')}</SectionTitle>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div>
            <div className="text-sm font-600 text-fg">{t('All data synced', 'सब कुछ सिंक हुआ')}</div>
            <div className="text-[11px] text-muted-fg">{t('Last sync: Today, 2:34 PM', 'आखिरी सिंक: आज, 2:34 PM')}</div>
          </div>
        </div>
      </section>

      {/* Logout */}
      <div className="px-5 mb-2">
        {showLogoutConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-600 text-red-700 mb-3">{t('Are you sure you want to log out?', 'क्या आप लॉग आउट करना चाहते हैं?')}</p>
            <div className="flex gap-2">
              <button onClick={onLogout} className="tap-highlight-none flex-1 bg-red-600 text-white rounded-xl py-2.5 font-700 text-sm">{t('Log Out', 'लॉग आउट')}</button>
              <button onClick={()=>setShowLogoutConfirm(false)} className="tap-highlight-none flex-1 bg-card border border-border text-fg rounded-xl py-2.5 font-600 text-sm">{t('Cancel', 'रद्द करें')}</button>
            </div>
          </div>
        ) : (
          <button onClick={()=>setShowLogoutConfirm(true)} className="tap-highlight-none w-full bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-3">
            <LogOut size={16} className="text-red-500" />
            <span className="font-600 text-sm text-red-500">{t('Log Out', 'लॉग आउट')}</span>
          </button>
        )}
      </div>

      <div className="px-5 py-4 text-center">
        <div className="font-display font-700 text-xs text-muted-fg tracking-widest uppercase">Jodo Yatra v1.0</div>
        <div className="text-[10px] text-muted-fg mt-0.5">Bishrampur Constituency · Palamu, Jharkhand</div>
        <div className="text-[10px] text-muted-fg">© 2024 · Secure · India Region</div>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value?: string }) {
  return (
    <div className="text-center">
      <div className="font-display font-700 text-white text-base">{value}</div>
      <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-700 text-muted-fg uppercase tracking-widest mb-2 px-1">{children}</div>;
}

function LangOption({ label, sublabel, selected, onClick }: { label: string; sublabel: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap-highlight-none w-full flex items-center gap-3 px-4 py-3.5">
      <div className="flex-1 text-left">
        <div className="font-600 text-sm text-fg">{label}</div>
        <div className="text-[11px] text-muted-fg">{sublabel}</div>
      </div>
      {selected && <Check size={16} className="text-accent shrink-0" />}
    </button>
  );
}

function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex-1 text-sm font-500 text-fg">{label}</span>
      <button onClick={onToggle} className={`tap-highlight-none w-11 h-6 rounded-full transition-colors relative ${on?'bg-accent':'bg-muted'}`}>
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${on?'left-[calc(100%-22px)]':'left-0.5'}`} />
      </button>
    </div>
  );
}

function MenuRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="tap-highlight-none w-full flex items-center gap-3 px-4 py-3.5 active:bg-surface">
      <span className="text-fg opacity-60">{icon}</span>
      <span className="flex-1 text-sm font-500 text-fg text-left">{label}</span>
      <ChevronRight size={16} className="text-muted-fg" />
    </button>
  );
}

// Donations sub-screen
const mockDonations = [
  { id: 'd1', member: 'Ramesh Kumar Singh', amount: 5000, mode: 'Cash', date: '2024-09-15', receipt: 'JY-RCT-001' },
  { id: 'd2', member: 'Vikram Singh Yadav', amount: 2500, mode: 'UPI', date: '2024-09-14', receipt: 'JY-RCT-002' },
  { id: 'd3', member: 'Ajay Kumar Gupta',   amount: 1000, mode: 'Cash', date: '2024-09-12', receipt: 'JY-RCT-003' },
];

function DonationsView({ lang, onBack }: { lang: 'en'|'hi'; onBack: ()=>void }) {
  const t = (en: string, hi: string) => lang === 'hi' ? hi : en;
  const total = mockDonations.reduce((s,d)=>s+d.amount,0);
  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <Activity size={18} className="text-fg rotate-180" />
        </button>
        <h2 className="font-display font-700 text-lg text-fg flex-1">{t('Donations', 'दान')}</h2>
        <button className="tap-highlight-none flex items-center gap-1.5 bg-accent text-white px-3 py-2 rounded-xl font-600 text-sm">
          + {t('Log', 'दर्ज')}
        </button>
      </div>

      <div className="px-5 mb-4">
        <div className="bg-fg rounded-xl p-4 mb-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-yellow-400" />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('Compliance review pending', 'अनुपालन समीक्षा लंबित')}</span>
          </div>
          <div className="font-mono font-700 text-2xl text-white">₹{total.toLocaleString('en-IN')}</div>
          <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('Total donations — Sep 2024', 'कुल दान — सितंबर 2024')}</div>
        </div>
        <div className="space-y-2">
          {mockDonations.map(d=>(
            <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <IndianRupee size={16} className="text-green-700"/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-600 text-sm text-fg truncate">{d.member}</div>
                <div className="text-[11px] text-muted-fg">{d.mode} · {d.date} · <span className="font-mono">{d.receipt}</span></div>
              </div>
              <div className="font-mono font-700 text-sm text-green-700 shrink-0">₹{d.amount.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Activity log sub-screen
function ActivityView({ lang, onBack, appState }: { lang:'en'|'hi'; onBack:()=>void; appState: AppState }) {
  const t = (en: string, hi: string) => lang === 'hi' ? hi : en;
  const recentMembers = appState.members.slice(0, 5);
  const logs = [
    { id:'l1', action: t('Member added','सदस्य जोड़ा'), detail: recentMembers[0]?.name ?? 'Ramesh Kumar Singh', time: 'Today 10:22 AM', user: 'Priya Kumari' },
    { id:'l2', action: t('Voter status updated','मतदाता स्थिति अपडेट'), detail: 'JHK1234572 → Supportive', time: 'Today 9:45 AM', user: 'Manoj Tiwari' },
    { id:'l3', action: t('Task completed','कार्य पूर्ण'), detail: t('Street corner meeting — Station Road','नुक्कड़ सभा — स्टेशन रोड'), time: 'Yesterday 6:10 PM', user: 'Priya Kumari' },
    { id:'l4', action: t('Member added','सदस्य जोड़ा'), detail: 'Rani Devi', time: 'Yesterday 4:32 PM', user: 'Geeta Kumari' },
    { id:'l5', action: t('Event created','कार्यक्रम बनाया'), detail: t('Chainpur Jana Sabha','चैनपुर जन सभा'), time: '16 Sep 11:00 AM', user: 'Priya Kumari' },
  ];
  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <Activity size={18} className="text-fg" />
        </button>
        <h2 className="font-display font-700 text-lg text-fg">{t('Activity Log', 'गतिविधि लॉग')}</h2>
      </div>
      <div className="px-5 space-y-2">
        {logs.map(l=>(
          <div key={l.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-600 text-sm text-fg">{l.action}</span>
                <span className="text-[10px] text-muted-fg shrink-0">{l.time}</span>
              </div>
              <div className="text-[11px] text-muted-fg mt-0.5 truncate">{l.detail}</div>
              <div className="text-[10px] text-muted-fg mt-0.5">by {l.user}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { ArrowLeft, Bell, CheckCircle, Calendar, Users, TrendingUp, Megaphone } from 'lucide-react';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  onBack: () => void;
  appState: AppState;
}

const t = (en: string, hi: string, lang: 'en' | 'hi') => lang === 'hi' ? hi : en;

interface Notification {
  id: string;
  type: 'task' | 'event' | 'milestone' | 'broadcast' | 'member';
  title: string;
  titleHi: string;
  body: string;
  bodyHi: string;
  time: string;
  read: boolean;
}

const mockNotifs: Notification[] = [
  {
    id: 'n1', type: 'task',
    title: 'New task assigned',           titleHi: 'नया कार्य सौंपा गया',
    body: 'Door-to-door survey — Naya Tola is due today', bodyHi: 'घर-घर सर्वे — नया टोला आज देय है',
    time: '10:32 AM', read: false,
  },
  {
    id: 'n2', type: 'event',
    title: 'Event reminder',              titleHi: 'कार्यक्रम अनुस्मारक',
    body: 'Chainpur Jana Sabha tomorrow at 4:00 PM', bodyHi: 'चैनपुर जन सभा कल शाम 4 बजे',
    time: '9:00 AM', read: false,
  },
  {
    id: 'n3', type: 'milestone',
    title: 'Coverage milestone reached!', titleHi: 'कवरेज लक्ष्य पूरा!',
    body: 'Chainpur ward hit 77% voter coverage 🎉', bodyHi: 'चैनपुर वार्ड ने 77% मतदाता कवरेज हासिल किया',
    time: 'Yesterday', read: true,
  },
  {
    id: 'n4', type: 'broadcast',
    title: 'Announcement from HQ',        titleHi: 'मुख्यालय से घोषणा',
    body: 'All coordinators: submit weekly booth report by Friday', bodyHi: 'सभी समन्वयक: शुक्रवार तक साप्ताहिक बूथ रिपोर्ट जमा करें',
    time: 'Yesterday', read: true,
  },
  {
    id: 'n5', type: 'member',
    title: 'New member pending approval', titleHi: 'नया सदस्य अनुमोदन लंबित',
    body: 'Rekha Kumari — Booth: Community Hall, Naya Bazar', bodyHi: 'रेखा कुमारी — बूथ: सामुदायिक हॉल, नया बाजार',
    time: '2 days ago', read: true,
  },
  {
    id: 'n6', type: 'task',
    title: 'Task completed',              titleHi: 'कार्य पूर्ण',
    body: 'Street corner meeting — Station Road marked done', bodyHi: 'नुक्कड़ सभा — स्टेशन रोड पूर्ण दर्ज',
    time: '2 days ago', read: true,
  },
];

const typeIcon: Record<string, React.ReactNode> = {
  task:      <CheckCircle size={18} className="text-accent" />,
  event:     <Calendar size={18} style={{ color: '#2563EB' }} />,
  milestone: <TrendingUp size={18} style={{ color: '#15803D' }} />,
  broadcast: <Megaphone size={18} style={{ color: '#B45309' }} />,
  member:    <Users size={18} className="text-fg" />,
};

const typeBg: Record<string, string> = {
  task:      '#FEF0EB',
  event:     '#DBEAFE',
  milestone: '#DCFCE7',
  broadcast: '#FEF3C7',
  member:    '#F3F4F6',
};

export default function Notifications({ lang, onBack, appState }: Props) {
  const unread = mockNotifs.filter(n => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center"
          >
            <ArrowLeft size={18} className="text-fg" />
          </button>
          <div className="flex-1">
            <h2 className="font-display font-700 text-lg text-fg">{t('Notifications', 'सूचनाएं', lang)}</h2>
          </div>
          {unread > 0 && (
            <span className="bg-accent text-white text-xs font-700 px-2 py-0.5 rounded-full">
              {unread} {t('new', 'नई', lang)}
            </span>
          )}
        </div>
      </div>

      {/* Broadcast Tool (admin only) */}
      <div className="px-5 mb-4">
        <div className="bg-fg rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone size={15} className="text-accent" />
            <span className="font-600 text-sm text-white">{t('Send Broadcast', 'प्रसारण भेजें', lang)}</span>
          </div>
          <input
            type="text"
            placeholder={t('Type announcement message...', 'घोषणा संदेश टाइप करें...', lang)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none mb-3"
          />
          <div className="flex gap-2">
            <select className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white/70 outline-none appearance-none">
              <option value="all">{t('All Members', 'सभी सदस्य', lang)}</option>
              <option value="w4">{t('Chainpur Ward', 'चैनपुर वार्ड', lang)}</option>
              <option value="w1">{t('Bishrampur North', 'बिश्रामपुर उत्तर', lang)}</option>
            </select>
            <button className="tap-highlight-none bg-accent text-white px-4 py-2 rounded-lg text-xs font-700">
              {t('Send', 'भेजें', lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div className="px-5 space-y-2 pb-8">
        {mockNotifs.map(notif => (
          <div
            key={notif.id}
            className="bg-card border rounded-xl p-4 flex items-start gap-3 transition-all"
            style={{ borderColor: notif.read ? 'rgba(28,28,30,0.1)' : '#D85A30' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: typeBg[notif.type] }}
            >
              {typeIcon[notif.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className={`text-sm font-600 leading-snug ${notif.read ? 'text-fg' : 'text-fg'}`}>
                  {lang === 'hi' ? notif.titleHi : notif.title}
                </span>
                <span className="text-[10px] text-muted-fg shrink-0 mt-0.5">{notif.time}</span>
              </div>
              <p className="text-[12px] text-muted-fg mt-0.5 leading-snug">
                {lang === 'hi' ? notif.bodyHi : notif.body}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

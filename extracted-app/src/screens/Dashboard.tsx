import { Bell, TrendingUp, Users, UserCheck, Calendar, ChevronRight, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { wards, currentUser } from '../data/mockData';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  onNavigate: (s: string) => void;
  appState: AppState;
  userRole: string;
}

const t = (en: string, hi: string, lang: 'en' | 'hi') => lang === 'hi' ? hi : en;

const roleLabel: Record<string, { en: string; hi: string }> = {
  super_admin:              { en: 'Super Admin',              hi: 'सुपर एडमिन' },
  constituency_coordinator: { en: 'Constituency Coordinator', hi: 'निर्वाचन समन्वयक' },
  ward_coordinator:         { en: 'Ward Coordinator',         hi: 'वार्ड समन्वयक' },
  booth_coordinator:        { en: 'Booth Coordinator',        hi: 'बूथ समन्वयक' },
  volunteer:                { en: 'Volunteer',                hi: 'स्वयंसेवक' },
};

export default function Dashboard({ lang, onNavigate, appState, userRole }: Props) {
  const { members, tasks, events } = appState;

  const totalVoters    = wards.reduce((s, w) => s + w.totalVoters, 0);
  const totalContacted = wards.reduce((s, w) => s + w.contacted, 0);
  const coveragePct    = Math.round((totalContacted / totalVoters) * 100);
  const pendingTasks   = tasks.filter(t => t.status !== 'done').length;
  const upcomingEvents = events.filter(e => e.date >= '2024-09-17');
  const todayTasks     = tasks.filter(t => t.dueDate === '2024-09-17' && t.status !== 'done');
  const nextEvent      = upcomingEvents[0];
  const sortedWards    = [...wards].sort((a, b) => (b.contacted / b.totalVoters) - (a.contacted / a.totalVoters));
  const ward           = wards.find(w => w.id === currentUser.wardId);
  const rl             = roleLabel[userRole] ?? roleLabel.volunteer;

  return (
    <div className="flex flex-col pb-[88px]">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-800 text-2xl text-fg">जोड़ो</span>
            <span className="font-display font-800 text-2xl text-accent">Yatra</span>
          </div>
          <div className="text-muted-fg text-xs mt-0.5">
            {t('Bishrampur Constituency · Palamu, Jharkhand', 'बिश्रामपुर विधानसभा · पलामू, झारखण्ड', lang)}
          </div>
        </div>
        <button
          onClick={() => onNavigate('notifications')}
          className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center tap-highlight-none active:bg-muted"
        >
          <Bell size={18} strokeWidth={1.8} className="text-fg" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
        </button>
      </div>

      {/* User banner */}
      <div className="mx-5 mb-4 rounded-xl p-3.5 flex items-center gap-3" style={{ background: '#1C1C1E' }}>
        <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center font-display font-700 text-white text-sm shrink-0">
          {currentUser.name.split(' ').slice(0,2).map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-600 text-sm">{currentUser.name}</div>
          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {lang === 'hi' ? rl.hi : rl.en} · {t('Chainpur', 'चैनपुर', lang)}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-accent font-600 text-sm">{coveragePct}%</div>
          <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('coverage', 'कवरेज', lang)}</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            icon={<Users size={18} className="text-accent" />}
            value={members.length.toLocaleString('en-IN')}
            label={t('Total Members', 'कुल सदस्य', lang)}
            sub={`+${members.filter(m => m.joinDate >= '2024-09-10').length} ${t('this week', 'इस सप्ताह', lang)}`}
            onClick={() => onNavigate('members')}
          />
          <KpiCard
            icon={<TrendingUp size={18} className="text-accent" />}
            value={`${coveragePct}%`}
            label={t('Voter Coverage', 'मतदाता कवरेज', lang)}
            sub={`${totalContacted.toLocaleString('en-IN')} / ${totalVoters.toLocaleString('en-IN')}`}
            accent
            onClick={() => onNavigate('voters')}
          />
          <KpiCard
            icon={<UserCheck size={18} className="text-fg" />}
            value="38"
            label={t('Active Volunteers', 'सक्रिय कार्यकर्ता', lang)}
            sub={`${pendingTasks} ${t('tasks pending', 'कार्य बाकी', lang)}`}
            onClick={() => onNavigate('tasks')}
          />
          <KpiCard
            icon={<Calendar size={18} className="text-fg" />}
            value={String(upcomingEvents.length)}
            label={t('Upcoming Events', 'आगामी कार्यक्रम', lang)}
            sub={nextEvent ? `Sep ${nextEvent.date.slice(8)}` : t('None', 'कोई नहीं', lang)}
            onClick={() => onNavigate('tasks')}
          />
        </div>
      </div>

      {/* Today's tasks */}
      {todayTasks.length > 0 && (
        <section className="px-5 mb-5">
          <SectionHeader
            title={t("Today's Tasks", "आज के कार्य", lang)}
            count={todayTasks.length}
            action={t('See all', 'सभी देखें', lang)}
            onAction={() => onNavigate('tasks')}
          />
          <div className="space-y-2 mt-2">
            {todayTasks.slice(0, 3).map(task => (
              <button
                key={task.id}
                onClick={() => onNavigate('tasks')}
                className="tap-highlight-none w-full bg-card border border-border rounded-xl p-3.5 flex items-center gap-3 text-left active:bg-surface transition-colors"
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'in_progress' ? 'bg-accent' : 'bg-muted-fg'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-500 text-fg truncate">{lang === 'hi' ? task.titleHi : task.title}</div>
                  <div className="text-[11px] text-muted-fg mt-0.5">{task.type.replace(/_/g,' ')}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-600 shrink-0 ${task.status === 'in_progress' ? 'bg-accent-light text-accent' : 'bg-muted text-muted-fg'}`}>
                  {task.status === 'in_progress' ? t('Active','जारी',lang) : t('Pending','बाकी',lang)}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Next Event */}
      {nextEvent && (
        <section className="px-5 mb-5">
          <SectionHeader title={t('Next Event', 'अगला कार्यक्रम', lang)} action={t('All events', 'सभी', lang)} onAction={() => onNavigate('tasks')} />
          <button
            onClick={() => onNavigate('tasks')}
            className="tap-highlight-none w-full mt-2 rounded-xl overflow-hidden border border-border text-left active:bg-surface"
          >
            <div className="h-1 bg-accent" />
            <div className="bg-card p-4 flex gap-3 items-start">
              <div className="bg-fg rounded-xl px-3 py-2 text-center shrink-0">
                <div className="font-mono text-white text-[10px]">SEP</div>
                <div className="font-display font-800 text-white text-xl leading-none">{nextEvent.date.slice(8)}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-600 text-fg text-sm">{lang === 'hi' ? nextEvent.titleHi : nextEvent.title}</div>
                <div className="text-muted-fg text-[11px] mt-1 truncate">{nextEvent.location}</div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-muted-fg">{nextEvent.time}</span>
                  <span className="text-[11px] font-600 text-accent">{nextEvent.rsvp} {t('RSVP','प्रतिभागी',lang)}</span>
                </div>
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Ward Leaderboard */}
      <section className="px-5 mb-5">
        <SectionHeader title={t('Ward Leaderboard', 'वार्ड रैंकिंग', lang)} />
        <div className="space-y-2.5 mt-2">
          {sortedWards.map((w, idx) => {
            const pct = Math.round((w.contacted / w.totalVoters) * 100);
            const isLow = pct < 50;
            const barColor = pct >= 70 ? '#16A34A' : pct >= 50 ? '#D85A30' : '#DC2626';
            return (
              <div key={w.id} className="bg-card rounded-xl px-4 py-3.5 border border-border">
                <div className="flex items-center gap-3">
                  <RankBadge rank={idx + 1} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-500 text-sm text-fg truncate">{lang === 'hi' ? w.nameHi : w.name}</span>
                        {isLow && <AlertTriangle size={12} style={{ color: '#D97706' }} className="shrink-0" />}
                      </div>
                      <span className="font-mono font-600 text-sm shrink-0" style={{ color: barColor }}>{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-fg">{w.contacted.toLocaleString('en-IN')} / {w.totalVoters.toLocaleString('en-IN')} {t('voters','मतदाता',lang)}</span>
                      <span className="text-[10px] text-muted-fg">{w.members} {t('members','सदस्य',lang)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-5 mb-2">
        <SectionHeader title={t('Quick Actions', 'त्वरित कार्य', lang)} />
        <div className="grid grid-cols-3 gap-2.5 mt-2">
          <QuickAction label={t('Add Member','सदस्य जोड़ें',lang)} icon="👤" onClick={() => onNavigate('members')} />
          <QuickAction label={t('Log Visit','दौरा दर्ज',lang)} icon="🚶" onClick={() => onNavigate('voters')} />
          <QuickAction label={t('New Event','नया कार्यक्रम',lang)} icon="📅" onClick={() => onNavigate('tasks')} />
        </div>
      </section>
    </div>
  );
}

function KpiCard({ icon, value, label, sub, accent, onClick }: { icon: React.ReactNode; value: string; label: string; sub: string; accent?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`tap-highlight-none text-left rounded-xl p-4 border ${accent ? 'border-accent-light' : 'border-border'} bg-card active:bg-surface transition-colors`}>
      <div className="flex items-start justify-between mb-2">
        {icon}
        <ArrowUpRight size={13} className="text-muted-fg mt-0.5" />
      </div>
      <div className="font-display font-700 text-2xl text-fg leading-none">{value}</div>
      <div className="text-[11px] font-600 text-fg mt-1">{label}</div>
      <div className="text-[10px] text-muted-fg mt-0.5">{sub}</div>
    </button>
  );
}

function SectionHeader({ title, count, action, onAction }: { title: string; count?: number; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-display font-700 text-sm text-fg">{title}</span>
        {count !== undefined && (
          <span className="bg-accent text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full leading-none">{count}</span>
        )}
      </div>
      {action && <button onClick={onAction} className="tap-highlight-none text-[11px] text-accent font-600">{action}</button>}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = { 1: '#D85A30', 2: '#6B7280', 3: '#92400E' };
  return (
    <div className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-700 text-sm shrink-0"
      style={{ background: colors[rank] ?? '#E4E4DF', color: rank <= 3 ? '#fff' : '#1C1C1E' }}>
      {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
    </div>
  );
}

function QuickAction({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="tap-highlight-none bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1.5 active:bg-muted transition-colors">
      <span className="text-2xl">{icon}</span>
      <span className="text-[10px] font-600 text-fg text-center leading-tight">{label}</span>
    </button>
  );
}

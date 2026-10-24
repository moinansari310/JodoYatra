import { useState } from 'react';
import BottomNav, { type Screen } from './components/BottomNav';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Members from './screens/Members';
import Voters from './screens/Voters';
import Tasks from './screens/Tasks';
import Settings from './screens/Settings';
import Notifications from './screens/Notifications';
import {
  members as seedMembers,
  voters as seedVoters,
  tasks as seedTasks,
  events as seedEvents,
  type Member,
  type Voter,
  type Task,
  type CampaignEvent,
  type VoterStatus,
  type TaskStatus,
} from './data/mockData';

export interface AppState {
  members: Member[];
  voters: Voter[];
  tasks: Task[];
  events: CampaignEvent[];
  addMember: (m: Member) => void;
  updateVoterStatus: (epicNo: string, status: VoterStatus) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTask: (t: Task) => void;
  addEvent: (e: CampaignEvent) => void;
  rsvpEvent: (id: string) => void;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [userPhone, setUserPhone]     = useState('');
  const [userRole, setUserRole]       = useState('volunteer');
  const [screen, setScreen]           = useState<Screen>('dashboard');
  const [lang, setLang]               = useState<'en' | 'hi'>('en');
  const [showNotifs, setShowNotifs]   = useState(false);

  // Shared app state
  const [members, setMembers]   = useState<Member[]>(seedMembers);
  const [voters, setVoters]     = useState<Voter[]>(seedVoters);
  const [tasks, setTasks]       = useState<Task[]>(seedTasks);
  const [events, setEvents]     = useState<CampaignEvent[]>(seedEvents);

  const appState: AppState = {
    members,
    voters,
    tasks,
    events,
    addMember: (m) => setMembers(prev => [m, ...prev]),
    updateVoterStatus: (epicNo, status) =>
      setVoters(prev => prev.map(v => v.epicNo === epicNo ? { ...v, status } : v)),
    updateTaskStatus: (id, status) =>
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t)),
    addTask: (t) => setTasks(prev => [t, ...prev]),
    addEvent: (e) => setEvents(prev => [e, ...prev]),
    rsvpEvent: (id) =>
      setEvents(prev => prev.map(e => e.id === id ? { ...e, rsvp: e.rsvp + 1 } : e)),
  };

  const handleLogin = (phone: string, role: string) => {
    setUserPhone(phone);
    setUserRole(role);
    setIsLoggedIn(true);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setScreen('dashboard');
    setShowNotifs(false);
  };

  const handleNavigate = (target: string) => {
    if (target === 'notifications') { setShowNotifs(true); return; }
    setShowNotifs(false);
    setScreen(target as Screen);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} lang={lang} onLangChange={setLang} />;
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[390px] relative min-h-screen bg-bg overflow-x-hidden">
        <main className="overflow-y-auto h-screen">
          {showNotifs ? (
            <Notifications lang={lang} onBack={() => setShowNotifs(false)} appState={appState} />
          ) : (
            <>
              {screen === 'dashboard' && (
                <Dashboard
                  lang={lang}
                  onNavigate={handleNavigate}
                  appState={appState}
                  userRole={userRole}
                />
              )}
              {screen === 'members' && (
                <Members lang={lang} appState={appState} userRole={userRole} />
              )}
              {screen === 'voters' && (
                <Voters lang={lang} appState={appState} />
              )}
              {screen === 'tasks' && (
                <Tasks lang={lang} appState={appState} />
              )}
              {screen === 'settings' && (
                <Settings
                  lang={lang}
                  onLangChange={setLang}
                  onLogout={handleLogout}
                  userPhone={userPhone}
                  userRole={userRole}
                  appState={appState}
                />
              )}
            </>
          )}
        </main>
        {!showNotifs && (
          <BottomNav active={screen} onNavigate={setScreen} lang={lang} />
        )}
      </div>
    </div>
  );
}

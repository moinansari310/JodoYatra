import { useState, useSyncExternalStore } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import BottomNavigation from '@components/BottomNavigation';
import DashboardPage from '@screens/DashboardPage';
import LoginPage from '@screens/LoginPage';
import MembersPage from '@screens/MembersPage';
import NotificationsPage from '@screens/NotificationsPage';
import SettingsPage from '@screens/SettingsPage';
import TasksPage from '@screens/TasksPage';
import VotersPage from '@screens/VotersPage';
import { common } from '@presentation/theme';
import type { Language, Screen } from '@presentation/types/navigation';
import { appModel } from '@presentation/state/appModel';

export default function App() {
  useSyncExternalStore(
    appModel.subscribe.bind(appModel),
    () =>
      appModel.members.length +
      appModel.voters.length +
      appModel.tasks.length +
      appModel.events.length,
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [notifications, setNotifications] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [phone, setPhone] = useState('');

  if (!loggedIn) {
    return (
      <LoginPage
        language={language}
        onLanguageChange={setLanguage}
        onLogin={(value) => {
          setPhone(value);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={common.screen}>
      {notifications ? (
        <NotificationsPage language={language} onBack={() => setNotifications(false)} />
      ) : (
        <>
          <ScrollView contentContainerStyle={common.content} showsVerticalScrollIndicator={false}>
            {screen === 'dashboard' && (
              <DashboardPage
                language={language}
                onNavigate={setScreen}
                onNotifications={() => setNotifications(true)}
              />
            )}
            {screen === 'members' && <MembersPage language={language} />}
            {screen === 'voters' && <VotersPage language={language} />}
            {screen === 'tasks' && <TasksPage language={language} />}
            {screen === 'settings' && (
              <SettingsPage
                language={language}
                phone={phone}
                onLanguageChange={setLanguage}
                onLogout={() => setLoggedIn(false)}
              />
            )}
          </ScrollView>
          <BottomNavigation active={screen} language={language} onNavigate={setScreen} />
        </>
      )}
    </SafeAreaView>
  );
}

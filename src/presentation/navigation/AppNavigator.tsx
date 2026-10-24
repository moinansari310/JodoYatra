import type { ComponentType } from 'react';
import { CalendarDays, LayoutDashboard, Settings, Users, Vote } from 'lucide-react-native';
import type { Screen } from '@presentation/types/navigation';

export interface NavigationTab {
  id: Screen;
  labelKey: string;
  labelHi: string;
  Icon: ComponentType<{ size?: number; color?: string }>;
}

export const navigationTabs: NavigationTab[] = [
  { id: 'dashboard', labelKey: 'navigation.home', labelHi: 'होम', Icon: LayoutDashboard },
  { id: 'members', labelKey: 'navigation.members', labelHi: 'सदस्य', Icon: Users },
  { id: 'voters', labelKey: 'navigation.voters', labelHi: 'मतदाता', Icon: Vote },
  { id: 'tasks', labelKey: 'navigation.tasks', labelHi: 'कार्य', Icon: CalendarDays },
  { id: 'settings', labelKey: 'navigation.more', labelHi: 'अन्य', Icon: Settings },
];

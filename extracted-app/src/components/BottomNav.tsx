import { LayoutDashboard, Users, Vote, CalendarDays, Settings } from 'lucide-react';

export type Screen = 'dashboard' | 'members' | 'voters' | 'tasks' | 'settings';

const tabs: { id: Screen; label: string; labelHi: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'dashboard', label: 'Home',    labelHi: 'होम',     Icon: LayoutDashboard },
  { id: 'members',   label: 'Members', labelHi: 'सदस्य',   Icon: Users },
  { id: 'voters',    label: 'Voters',  labelHi: 'मतदाता',  Icon: Vote },
  { id: 'tasks',     label: 'Tasks',   labelHi: 'कार्य',   Icon: CalendarDays },
  { id: 'settings',  label: 'More',    labelHi: 'अन्य',    Icon: Settings },
];

interface Props {
  active: Screen;
  onNavigate: (s: Screen) => void;
  lang: 'en' | 'hi';
}

export default function BottomNav({ active, onNavigate, lang }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-card border-t border-border z-50">
      <div className="flex items-stretch h-[68px] pb-safe">
        {tabs.map(({ id, label, labelHi, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="tap-highlight-none flex-1 flex flex-col items-center justify-center gap-0.5 pt-2 pb-1 transition-colors"
              style={{ color: isActive ? '#D85A30' : '#9CA3AF' }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-semibold tracking-wide">
                {lang === 'hi' ? labelHi : label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

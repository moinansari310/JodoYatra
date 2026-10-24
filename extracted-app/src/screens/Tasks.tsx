import { useState } from 'react';
import { Plus, MapPin, CheckCircle2, Clock, Circle, ArrowLeft, Calendar, Users } from 'lucide-react';
import { booths, wards, type Task, type CampaignEvent, type TaskStatus } from '../data/mockData';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  appState: AppState;
}

const taskTypeIcon: Record<string, string> = {
  door_to_door: '🚶', phone_call: '📞', event: '🎤', data_entry: '📋',
};

const eventTypeStyle: Record<string, { bg: string; text: string; en: string; hi: string }> = {
  rally:        { bg: '#FEE2E2', text: '#DC2626', en: 'Rally',        hi: 'रैली' },
  meeting:      { bg: '#DBEAFE', text: '#2563EB', en: 'Meeting',      hi: 'बैठक' },
  door_to_door: { bg: '#DCFCE7', text: '#15803D', en: 'Door-to-Door', hi: 'घर-घर' },
};

type View = 'list' | 'create_task' | 'create_event';

export default function Tasks({ lang, appState }: Props) {
  const { tasks, events, updateTaskStatus, addTask, addEvent, rsvpEvent } = appState;
  const [tab,  setTab]  = useState<'tasks' | 'events'>('tasks');
  const [view, setView] = useState<View>('list');

  const today        = '2024-09-17';
  const todayTasks   = tasks.filter(t => t.dueDate === today && t.status !== 'done');
  const pendingTasks = tasks.filter(t => t.dueDate > today);
  const doneTasks    = tasks.filter(t => t.status === 'done');
  const upcoming     = events.filter(e => e.date >= today);
  const past         = events.filter(e => e.date < today);

  if (view === 'create_task') return <CreateTask lang={lang} onBack={()=>setView('list')} onSave={t=>{addTask(t);setView('list');}} />;
  if (view === 'create_event') return <CreateEvent lang={lang} onBack={()=>setView('list')} onSave={e=>{addEvent(e);setView('list');}} />;

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-700 text-xl text-fg">{lang==='hi'?'कार्य और कार्यक्रम':'Tasks & Events'}</h1>
          <button
            onClick={() => setView(tab === 'tasks' ? 'create_task' : 'create_event')}
            className="tap-highlight-none flex items-center gap-1.5 bg-accent text-white px-3 py-2 rounded-xl font-600 text-sm"
          >
            <Plus size={15} />
            {lang==='hi'?'नया':'New'}
          </button>
        </div>
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          <TabBtn label={lang==='hi'?'मेरे कार्य':'My Tasks'} active={tab==='tasks'} onClick={()=>setTab('tasks')} badge={todayTasks.length} />
          <TabBtn label={lang==='hi'?'कार्यक्रम':'Events'} active={tab==='events'} onClick={()=>setTab('events')} badge={upcoming.length} />
        </div>
      </div>

      {tab === 'tasks' && (
        <div className="px-5 space-y-5">
          {todayTasks.length > 0 && (
            <section>
              <SectionHeader label={lang==='hi'?'आज के कार्य':"Today's Tasks"} count={todayTasks.length} />
              <div className="space-y-2 mt-2">
                {todayTasks.map(t=><TaskCard key={t.id} task={t} lang={lang} onUpdate={updateTaskStatus}/>)}
              </div>
            </section>
          )}
          {pendingTasks.length > 0 && (
            <section>
              <SectionHeader label={lang==='hi'?'आगामी कार्य':'Upcoming'} />
              <div className="space-y-2 mt-2">
                {pendingTasks.map(t=><TaskCard key={t.id} task={t} lang={lang} onUpdate={updateTaskStatus}/>)}
              </div>
            </section>
          )}
          {doneTasks.length > 0 && (
            <section>
              <SectionHeader label={lang==='hi'?'पूर्ण कार्य':'Completed'} />
              <div className="space-y-2 mt-2 opacity-55">
                {doneTasks.map(t=><TaskCard key={t.id} task={t} lang={lang} onUpdate={updateTaskStatus}/>)}
              </div>
            </section>
          )}
          {tasks.length === 0 && (
            <div className="text-center py-16 text-muted-fg text-sm">{lang==='hi'?'कोई कार्य नहीं':'No tasks yet'}</div>
          )}
        </div>
      )}

      {tab === 'events' && (
        <div className="px-5 space-y-5">
          {upcoming.length > 0 && (
            <section>
              <SectionHeader label={lang==='hi'?'आगामी कार्यक्रम':'Upcoming Events'} count={upcoming.length}/>
              <div className="space-y-3 mt-2">
                {upcoming.map(e=><EventCard key={e.id} event={e} lang={lang} onRsvp={()=>rsvpEvent(e.id)}/>)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <SectionHeader label={lang==='hi'?'पिछले कार्यक्रम':'Past Events'} />
              <div className="space-y-3 mt-2 opacity-55">
                {past.map(e=><EventCard key={e.id} event={e} lang={lang} onRsvp={()=>{}}/>)}
              </div>
            </section>
          )}
          {events.length === 0 && (
            <div className="text-center py-16 text-muted-fg text-sm">{lang==='hi'?'कोई कार्यक्रम नहीं':'No events yet'}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, lang, onUpdate }: { task: Task; lang:'en'|'hi'; onUpdate:(id:string,s:TaskStatus)=>void }) {
  const booth   = booths.find(b => b.id === task.boothId);
  const isDone  = task.status === 'done';
  const isStart = task.status === 'in_progress';
  return (
    <div className={`bg-card border rounded-xl p-4 ${isStart?'border-accent':'border-border'}`}>
      <div className="flex items-start gap-3">
        <button onClick={()=>onUpdate(task.id, isDone?'pending':'done')} className="tap-highlight-none mt-0.5 shrink-0">
          {isDone ? <CheckCircle2 size={20} className="text-accent"/> : isStart ? <Clock size={20} className="text-accent"/> : <Circle size={20} className="text-muted-fg"/>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base">{taskTypeIcon[task.type]}</span>
            <span className={`font-600 text-sm ${isDone?'line-through text-muted-fg':'text-fg'}`}>
              {lang==='hi'?task.titleHi:task.title}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-fg">
            <span className="flex items-center gap-1"><MapPin size={10}/>{booth?.name.split(',')[0]}</span>
            <span>{task.dueDate.slice(8)} Sep</span>
          </div>
        </div>
        {!isDone && (
          <button
            onClick={()=>onUpdate(task.id, isStart?'pending':'in_progress')}
            className={`tap-highlight-none shrink-0 text-[10px] font-700 px-2.5 py-1 rounded-lg ${isStart?'bg-accent-light text-accent':'bg-muted text-muted-fg'}`}
          >
            {isStart?(lang==='hi'?'जारी':'Active'):(lang==='hi'?'शुरू करें':'Start')}
          </button>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, lang, onRsvp }: { event: CampaignEvent; lang:'en'|'hi'; onRsvp:()=>void }) {
  const et      = eventTypeStyle[event.type];
  const isPast  = event.date < '2024-09-17';
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-stretch">
        <div className="bg-fg flex flex-col items-center justify-center px-4 py-3 shrink-0 min-w-[56px]">
          <div className="font-mono text-[10px] text-accent uppercase">SEP</div>
          <div className="font-display font-800 text-white text-2xl leading-none">{event.date.slice(8)}</div>
        </div>
        <div className="flex-1 p-3.5 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-600 text-sm text-fg leading-snug">{lang==='hi'?event.titleHi:event.title}</span>
            <span className="text-[9px] font-700 px-2 py-0.5 rounded-full shrink-0" style={{ background: et.bg, color: et.text }}>
              {lang==='hi'?et.hi:et.en}
            </span>
          </div>
          <div className="text-[11px] text-muted-fg mb-2 truncate">{event.location} · {event.time}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] text-muted-fg">
              <Users size={11}/>
              {isPast
                ? <span>{event.attended}/{event.rsvp} {lang==='hi'?'उपस्थित':'attended'}</span>
                : <span className="text-accent font-600">{event.rsvp} {lang==='hi'?'प्रतिभागी':'RSVP'}</span>
              }
            </div>
            {!isPast && (
              <button onClick={onRsvp} className="tap-highlight-none text-[10px] font-700 px-2.5 py-1 bg-accent-light text-accent rounded-lg">
                + {lang==='hi'?'RSVP करें':'RSVP'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display font-700 text-sm text-fg">{label}</span>
      {count !== undefined && <span className="bg-accent text-white text-[10px] font-700 px-1.5 py-0.5 rounded-full">{count}</span>}
    </div>
  );
}

function TabBtn({ label, active, onClick, badge }: { label:string; active:boolean; onClick:()=>void; badge?:number }) {
  return (
    <button onClick={onClick} className={`tap-highlight-none flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-600 transition-all ${active?'bg-card text-fg shadow-sm':'text-muted-fg'}`}>
      {label}
      {badge !== undefined && badge > 0 && (
        <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full ${active?'bg-accent text-white':'bg-border text-muted-fg'}`}>{badge}</span>
      )}
    </button>
  );
}

function CreateTask({ lang, onBack, onSave }: { lang:'en'|'hi'; onBack:()=>void; onSave:(t:Task)=>void }) {
  const [title, setTitle]   = useState('');
  const [type, setType]     = useState('door_to_door');
  const [booth, setBooth]   = useState('');
  const [dueDate, setDue]   = useState('2024-09-17');
  const [error, setError]   = useState('');

  const handleSave = () => {
    if (!title.trim()) { setError(lang==='hi'?'शीर्षक आवश्यक है':'Title required'); return; }
    if (!booth) { setError(lang==='hi'?'बूथ चुनें':'Select booth'); return; }
    onSave({ id: `t${Date.now()}`, title: title.trim(), titleHi: title.trim(), type: type as Task['type'], boothId: booth, dueDate, status: 'pending' });
  };

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center"><ArrowLeft size={18} className="text-fg"/></button>
        <h2 className="font-display font-700 text-lg text-fg">{lang==='hi'?'नया कार्य':'New Task'}</h2>
      </div>
      <div className="px-5 space-y-4">
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'शीर्षक *':'Title *'}</label>
          <input value={title} onChange={e=>{setTitle(e.target.value);setError('');}}
            placeholder={lang==='hi'?'कार्य का विवरण':'Task description'}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent"/>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'प्रकार':'Type'}</label>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent">
            <option value="door_to_door">{lang==='hi'?'घर-घर सर्वे':'Door-to-door'}</option>
            <option value="phone_call">{lang==='hi'?'फोन कॉल':'Phone call'}</option>
            <option value="data_entry">{lang==='hi'?'डेटा प्रविष्टि':'Data entry'}</option>
            <option value="event">{lang==='hi'?'कार्यक्रम':'Event'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'बूथ *':'Booth *'}</label>
          <select value={booth} onChange={e=>setBooth(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent">
            <option value="">{lang==='hi'?'बूथ चुनें':'Select booth'}</option>
            {booths.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'देय तिथि':'Due Date'}</label>
          <input type="date" value={dueDate} onChange={e=>setDue(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent"/>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={handleSave} className="tap-highlight-none w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-base">
          {lang==='hi'?'कार्य सहेजें':'Save Task'}
        </button>
      </div>
    </div>
  );
}

function CreateEvent({ lang, onBack, onSave }: { lang:'en'|'hi'; onBack:()=>void; onSave:(e:CampaignEvent)=>void }) {
  const [title, setTitle]     = useState('');
  const [type, setType]       = useState('meeting');
  const [location, setLoc]    = useState('');
  const [date, setDate]       = useState('2024-09-18');
  const [time, setTime]       = useState('10:00 AM');
  const [ward, setWard]       = useState('w4');
  const [error, setError]     = useState('');

  const handleSave = () => {
    if (!title.trim()) { setError(lang==='hi'?'शीर्षक आवश्यक है':'Title required'); return; }
    if (!location.trim()) { setError(lang==='hi'?'स्थान आवश्यक है':'Location required'); return; }
    onSave({ id: `e${Date.now()}`, title: title.trim(), titleHi: title.trim(), date, time, location: location.trim(), type: type as CampaignEvent['type'], wardId: ward, rsvp: 0, attended: 0 });
  };

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center"><ArrowLeft size={18} className="text-fg"/></button>
        <h2 className="font-display font-700 text-lg text-fg">{lang==='hi'?'नया कार्यक्रम':'New Event'}</h2>
      </div>
      <div className="px-5 space-y-4">
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'शीर्षक *':'Title *'}</label>
          <input value={title} onChange={e=>{setTitle(e.target.value);setError('');}}
            placeholder={lang==='hi'?'कार्यक्रम का नाम':'Event name'}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent"/>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'प्रकार':'Type'}</label>
          <select value={type} onChange={e=>setType(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent">
            <option value="meeting">{lang==='hi'?'बैठक':'Meeting'}</option>
            <option value="rally">{lang==='hi'?'रैली':'Rally'}</option>
            <option value="door_to_door">{lang==='hi'?'घर-घर अभियान':'Door-to-Door Drive'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'स्थान *':'Location *'}</label>
          <input value={location} onChange={e=>setLoc(e.target.value)} placeholder={lang==='hi'?'कार्यक्रम का स्थान':'Venue / address'}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent"/>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'तिथि':'Date'}</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent"/>
          </div>
          <div>
            <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'समय':'Time'}</label>
            <input value={time} onChange={e=>setTime(e.target.value)} placeholder="4:00 PM" className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent"/>
          </div>
        </div>
        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'वार्ड':'Ward'}</label>
          <select value={ward} onChange={e=>setWard(e.target.value)} className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent">
            {wards.map(w=><option key={w.id} value={w.id}>{lang==='hi'?w.nameHi:w.name}</option>)}
          </select>
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button onClick={handleSave} className="tap-highlight-none w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-base">
          {lang==='hi'?'कार्यक्रम सहेजें':'Save Event'}
        </button>
      </div>
    </div>
  );
}

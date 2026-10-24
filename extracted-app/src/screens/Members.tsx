import { useState } from 'react';
import { Search, Plus, ArrowLeft, Phone, MapPin, Fingerprint, ChevronRight, Check, Camera } from 'lucide-react';
import { wards, booths, type Member } from '../data/mockData';
import MembershipCard from '../components/MembershipCard';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  appState: AppState;
  userRole: string;
}

type View = 'list' | 'detail' | 'add';

const statusColors = {
  active:  { bg: '#DCFCE7', text: '#15803D' },
  pending: { bg: '#FEF3C7', text: '#B45309' },
};

export default function Members({ lang, appState, userRole }: Props) {
  const { members, addMember } = appState;
  const [view, setView]         = useState<View>('list');
  const [selected, setSelected] = useState<Member | null>(null);
  const [query, setQuery]       = useState('');
  const [filterWard, setFilterWard] = useState('all');
  const [showCard, setShowCard] = useState(false);

  const filtered = members.filter(m => {
    const q = query.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.phone.includes(q) || m.id.toLowerCase().includes(q) || m.village.toLowerCase().includes(q);
    const matchWard   = filterWard === 'all' || m.wardId === filterWard;
    return matchSearch && matchWard;
  });

  const canEdit = ['super_admin','constituency_coordinator','ward_coordinator','booth_coordinator'].includes(userRole);

  if (view === 'detail' && selected) {
    return (
      <MemberDetail
        member={selected}
        lang={lang}
        onBack={() => { setView('list'); setShowCard(false); }}
        showCard={showCard}
        setShowCard={setShowCard}
        canEdit={canEdit}
      />
    );
  }

  if (view === 'add') {
    return <AddMember lang={lang} onBack={() => setView('list')} onAdd={addMember} />;
  }

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display font-700 text-xl text-fg">{lang === 'hi' ? 'सदस्य' : 'Members'}</h1>
            <div className="text-muted-fg text-xs">
              {members.length} {lang === 'hi' ? 'कुल नामांकित' : 'total enrolled'} ·{' '}
              <span className="text-orange-600 font-500">{members.filter(m=>m.status==='pending').length} {lang==='hi'?'लंबित':'pending'}</span>
            </div>
          </div>
          {canEdit && (
            <button onClick={() => setView('add')} className="tap-highlight-none flex items-center gap-1.5 bg-accent text-white px-3.5 py-2 rounded-xl font-600 text-sm">
              <Plus size={16} />
              {lang === 'hi' ? 'जोड़ें' : 'Add'}
            </button>
          )}
        </div>

        <div className="relative mb-3">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'नाम, फोन, गांव से खोजें...' : 'Search name, phone, village...'}
            className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip label={lang === 'hi' ? 'सभी' : 'All'} active={filterWard === 'all'} onClick={() => setFilterWard('all')} count={members.length} />
          {wards.map(w => (
            <FilterChip
              key={w.id}
              label={lang === 'hi' ? w.nameHi.split(' ')[0] : w.name.split(' ')[0]}
              active={filterWard === w.id}
              onClick={() => setFilterWard(w.id)}
              count={members.filter(m => m.wardId === w.id).length}
            />
          ))}
        </div>
      </div>

      <div className="px-5 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-fg text-sm">{lang === 'hi' ? 'कोई सदस्य नहीं मिला' : 'No members found'}</div>
        )}
        {filtered.map(m => {
          const ward = wards.find(w => w.id === m.wardId);
          const sc   = statusColors[m.status];
          return (
            <button
              key={m.id}
              onClick={() => { setSelected(m); setView('detail'); }}
              className="tap-highlight-none w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left active:bg-surface transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-fg flex items-center justify-center text-white font-display font-700 text-base shrink-0">
                {m.name.split(' ').slice(0,2).map(n=>n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-600 text-sm text-fg truncate">{m.name}</span>
                  <span className="text-[9px] font-700 px-1.5 py-0.5 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>
                    {m.status === 'active' ? (lang==='hi'?'सक्रिय':'ACTIVE') : (lang==='hi'?'लंबित':'PENDING')}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-accent">{m.id}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-muted-fg truncate">{lang==='hi'?ward?.nameHi:ward?.name}</span>
                  <span className="text-[10px] text-muted-fg">·</span>
                  <span className="text-[10px] text-muted-fg truncate">{m.village}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-fg shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MemberDetail({ member, lang, onBack, showCard, setShowCard, canEdit }: {
  member: Member; lang: 'en'|'hi'; onBack: ()=>void; showCard: boolean; setShowCard: (v:boolean)=>void; canEdit: boolean;
}) {
  const ward  = wards.find(w => w.id === member.wardId);
  const booth = booths.find(b => b.id === member.boothId);

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <ArrowLeft size={18} className="text-fg" />
        </button>
        <h2 className="font-display font-700 text-lg text-fg flex-1 truncate">{lang==='hi'?'सदस्य विवरण':'Member Detail'}</h2>
      </div>

      <div className="px-5">
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-fg flex items-center justify-center text-white font-display font-700 text-xl shrink-0">
              {member.name.split(' ').slice(0,2).map(n=>n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-700 text-lg text-fg leading-tight">{member.name}</div>
              <div className="font-mono text-sm text-accent font-600 mt-0.5">{member.id}</div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="text-[10px] font-700 px-2 py-0.5 rounded-full"
                  style={member.status==='active'?{background:'#DCFCE7',color:'#15803D'}:{background:'#FEF3C7',color:'#B45309'}}
                >
                  {member.status==='active'?(lang==='hi'?'सक्रिय सदस्य':'ACTIVE MEMBER'):(lang==='hi'?'अनुमोदन लंबित':'PENDING APPROVAL')}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <DetailField icon={<Phone size={13}/>}        label={lang==='hi'?'मोबाइल':'Mobile'}   value={member.phone} />
            <DetailField icon={<MapPin size={13}/>}       label={lang==='hi'?'गांव':'Village'}     value={member.village} />
            <DetailField icon={<MapPin size={13}/>}       label={lang==='hi'?'वार्ड':'Ward'}       value={lang==='hi'?(ward?.nameHi??'—'):(ward?.name??'—')} />
            <DetailField icon={<MapPin size={13}/>}       label={lang==='hi'?'बूथ':'Booth'}        value={booth?.name.split(',')[0]??'—'} />
            {member.epicNo && <DetailField icon={<Fingerprint size={13}/>} label="EPIC No." value={member.epicNo} mono />}
            <DetailField icon={<Check size={13}/>}        label={lang==='hi'?'नामांकन तिथि':'Enrolled'} value={member.joinDate} />
          </div>
        </div>

        {/* Digital Card */}
        <button
          onClick={() => setShowCard(!showCard)}
          className="tap-highlight-none w-full bg-fg text-white rounded-xl px-4 py-3 flex items-center justify-between mb-4"
        >
          <span className="font-600 text-sm">{lang==='hi'?'डिजिटल सदस्यता कार्ड':'Digital Membership Card'}</span>
          <span className="text-[11px] text-accent font-600">{showCard?(lang==='hi'?'छुपाएं':'Hide'):(lang==='hi'?'देखें / साझा करें':'View / Share')}</span>
        </button>

        {showCard && (
          <div className="mb-4">
            <MembershipCard member={member} />
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-accent text-white rounded-xl py-2.5 font-600 text-sm tap-highlight-none">{lang==='hi'?'शेयर करें':'Share'}</button>
              <button className="flex-1 bg-card border border-border text-fg rounded-xl py-2.5 font-600 text-sm tap-highlight-none">{lang==='hi'?'डाउनलोड':'Download'}</button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <a href={`tel:${member.phone}`} className="flex-1 bg-card border border-border text-fg rounded-xl py-3 font-600 text-sm tap-highlight-none flex items-center justify-center gap-2">
            <Phone size={15}/> {lang==='hi'?'कॉल करें':'Call'}
          </a>
          {canEdit && (
            <button className="flex-1 bg-card border border-border text-fg rounded-xl py-3 font-600 text-sm tap-highlight-none">
              {lang==='hi'?'संपादित करें':'Edit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-fg text-[10px] uppercase tracking-wider mb-0.5">{icon} {label}</div>
      <div className={`text-fg font-500 text-sm truncate ${mono?'font-mono':''}`}>{value}</div>
    </div>
  );
}

function AddMember({ lang, onBack, onAdd }: { lang: 'en'|'hi'; onBack: ()=>void; onAdd: (m: Member)=>void }) {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');
  const [ward, setWard]       = useState('');
  const [booth, setBooth]     = useState('');
  const [epic, setEpic]       = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [newMember, setNewMember] = useState<Member|null>(null);
  const [errors, setErrors]   = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim())    e.name    = lang==='hi'?'नाम आवश्यक है':'Name is required';
    if (phone.length!==10) e.phone = lang==='hi'?'सही 10 अंकों का नंबर':'Valid 10-digit number required';
    if (!village.trim()) e.village = lang==='hi'?'गांव आवश्यक है':'Village is required';
    if (!ward)           e.ward    = lang==='hi'?'वार्ड चुनें':'Select a ward';
    if (!booth)          e.booth   = lang==='hi'?'बूथ चुनें':'Select a booth';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const nextId = `JY-2024-${String(Math.floor(10000 + Math.random()*90000))}`;
    const m: Member = {
      id: nextId, name: name.trim(), phone, wardId: ward, boothId: booth,
      village: village.trim(), epicNo: epic.trim()||undefined,
      joinDate: new Date().toISOString().slice(0,10), status: 'active',
    };
    onAdd(m);
    setNewMember(m);
    setSubmitted(true);
  };

  if (submitted && newMember) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-5 px-8 pb-[88px]">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
          <Check size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-700 text-xl text-fg">{lang==='hi'?'सदस्य जोड़ा गया!':'Member Added!'}</h2>
          <p className="text-muted-fg text-sm mt-1">{lang==='hi'?'सदस्यता कार्ड तैयार है।':'Membership card ready to share.'}</p>
        </div>
        <div className="w-full">
          <MembershipCard member={newMember} />
        </div>
        <div className="flex gap-3 w-full">
          <button className="flex-1 bg-accent text-white rounded-xl py-3 font-600 text-sm tap-highlight-none">{lang==='hi'?'शेयर करें':'Share Card'}</button>
          <button onClick={onBack} className="flex-1 bg-card border border-border text-fg rounded-xl py-3 font-600 text-sm tap-highlight-none">{lang==='hi'?'सूची में जाएं':'Back to List'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="tap-highlight-none w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center">
          <ArrowLeft size={18} className="text-fg" />
        </button>
        <h2 className="font-display font-700 text-lg text-fg">{lang==='hi'?'नया सदस्य जोड़ें':'Add New Member'}</h2>
      </div>

      <div className="px-5 space-y-4">
        {/* Photo */}
        <div className="flex flex-col items-center gap-2">
          <button className="tap-highlight-none w-20 h-20 rounded-2xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-fg active:bg-surface">
            <Camera size={22} />
            <span className="text-[10px] mt-1">{lang==='hi'?'फोटो जोड़ें':'Add Photo'}</span>
          </button>
        </div>

        <FormField label={lang==='hi'?'पूरा नाम *':'Full Name *'} value={name} onChange={setName} placeholder={lang==='hi'?'जैसे: रमेश कुमार सिंह':'e.g. Ramesh Kumar Singh'} error={errors.name} />
        <FormField label={lang==='hi'?'मोबाइल नंबर *':'Mobile Number *'} value={phone} onChange={v=>setPhone(v.replace(/\D/g,'').slice(0,10))} placeholder="9XXXXXXXXX" type="tel" error={errors.phone} mono />
        <FormField label={lang==='hi'?'गांव / मोहल्ला *':'Village / Mohalla *'} value={village} onChange={setVillage} placeholder={lang==='hi'?'गांव का नाम':'Village name'} error={errors.village} />
        <FormField label={lang==='hi'?'पता':'Address'} value={address} onChange={setAddress} placeholder={lang==='hi'?'पूरा पता':'Full address (optional)'} />

        <div>
          <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'वार्ड *':'Ward *'}</label>
          <select value={ward} onChange={e=>{ setWard(e.target.value); setBooth(''); setErrors(er=>({...er,ward:''})); }}
            className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent ${errors.ward?'border-red-400':'border-border'}`}>
            <option value="">{lang==='hi'?'वार्ड चुनें':'Select ward'}</option>
            {wards.map(w => <option key={w.id} value={w.id}>{lang==='hi'?w.nameHi:w.name}</option>)}
          </select>
          {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
        </div>

        {ward && (
          <div>
            <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{lang==='hi'?'बूथ *':'Booth *'}</label>
            <select value={booth} onChange={e=>{ setBooth(e.target.value); setErrors(er=>({...er,booth:''})); }}
              className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-accent ${errors.booth?'border-red-400':'border-border'}`}>
              <option value="">{lang==='hi'?'बूथ चुनें':'Select booth'}</option>
              {booths.filter(b=>b.wardId===ward).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {errors.booth && <p className="text-red-500 text-xs mt-1">{errors.booth}</p>}
          </div>
        )}

        <FormField label={lang==='hi'?'मतदाता पहचान (EPIC)':'Voter ID (EPIC Number)'} value={epic} onChange={setEpic} placeholder="JHK1234567 (optional)" mono />

        <button onClick={handleSubmit} className="tap-highlight-none w-full bg-accent text-white rounded-xl py-3.5 font-display font-700 text-base mt-2">
          {lang==='hi'?'सदस्य जोड़ें':'Add Member'}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type='text', mono, error }: {
  label: string; value: string; onChange: (v:string)=>void; placeholder: string; type?: string; mono?: boolean; error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-600 text-muted-fg uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-card border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-muted-fg outline-none focus:border-accent transition-colors ${mono?'font-mono':''} ${error?'border-red-400':'border-border'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FilterChip({ label, active, onClick, count }: { label: string; active: boolean; onClick: ()=>void; count: number }) {
  return (
    <button onClick={onClick} className={`tap-highlight-none shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-600 transition-colors ${active?'bg-fg text-white':'bg-card border border-border text-muted-fg'}`}>
      {label}
      <span className={`text-[10px] ${active?'text-accent':'text-muted-fg'}`}>{count}</span>
    </button>
  );
}

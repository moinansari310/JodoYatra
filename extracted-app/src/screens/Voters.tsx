import { useState } from 'react';
import { ChevronDown, Check, RefreshCw } from 'lucide-react';
import { booths, wards, statusLabels, type VoterStatus } from '../data/mockData';
import type { AppState } from '../App';

interface Props {
  lang: 'en' | 'hi';
  appState: AppState;
}

const statusOrder: VoterStatus[] = ['not_contacted', 'contacted', 'supportive', 'undecided', 'opposed'];

export default function Voters({ lang, appState }: Props) {
  const { voters, updateVoterStatus } = appState;
  const [selectedBooth, setSelectedBooth] = useState('b1');
  const [filterStatus, setFilterStatus]   = useState<VoterStatus | 'all'>('all');
  const [openVoter, setOpenVoter]         = useState<string | null>(null);
  const [bulkMode, setBulkMode]           = useState(false);
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus]       = useState<VoterStatus>('contacted');

  const booth       = booths.find(b => b.id === selectedBooth);
  const boothVoters = voters.filter(v => v.boothId === selectedBooth);
  const filtered    = filterStatus === 'all' ? boothVoters : boothVoters.filter(v => v.status === filterStatus);

  const statusCounts = statusOrder.reduce((acc, s) => {
    acc[s] = boothVoters.filter(v => v.status === s).length;
    return acc;
  }, {} as Record<VoterStatus, number>);

  const contacted = boothVoters.filter(v => v.status !== 'not_contacted').length;
  const pct       = boothVoters.length > 0 ? Math.round((contacted / boothVoters.length) * 100) : 0;

  const toggleSelect = (epicNo: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(epicNo) ? next.delete(epicNo) : next.add(epicNo);
      return next;
    });
  };

  const handleBulkUpdate = () => {
    selected.forEach(epicNo => updateVoterStatus(epicNo, bulkStatus));
    setSelected(new Set());
    setBulkMode(false);
  };

  return (
    <div className="flex flex-col pb-[88px]">
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-700 text-xl text-fg">{lang==='hi'?'मतदाता ट्रैकर':'Voter Tracker'}</h1>
          <button
            onClick={() => { setBulkMode(v=>!v); setSelected(new Set()); }}
            className={`tap-highlight-none text-xs font-600 px-3 py-1.5 rounded-lg transition-colors ${bulkMode?'bg-accent text-white':'bg-card border border-border text-fg'}`}
          >
            {bulkMode ? (lang==='hi'?'रद्द करें':'Cancel') : (lang==='hi'?'बल्क अपडेट':'Bulk Update')}
          </button>
        </div>

        {/* Booth Selector */}
        <div className="relative mb-3">
          <select
            value={selectedBooth}
            onChange={e => { setSelectedBooth(e.target.value); setFilterStatus('all'); setBulkMode(false); setSelected(new Set()); }}
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-fg outline-none appearance-none focus:border-accent pr-10"
          >
            {booths.map(b => {
              const w = wards.find(w => w.id === b.wardId);
              return <option key={b.id} value={b.id}>{b.name} — {lang==='hi'?w?.nameHi:w?.name}</option>;
            })}
          </select>
          <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none" />
        </div>

        {/* Coverage card */}
        <div className="bg-fg rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-white text-sm font-600">{booth?.name.split(',')[0]}</div>
              <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {boothVoters.length} {lang==='hi'?'कुल मतदाता':'total voters'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-700 text-2xl text-accent">{pct}%</div>
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{lang==='hi'?'कवरेज':'coverage'}</div>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="h-full rounded-full bg-accent progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          {/* Mini distribution */}
          <div className="flex gap-2 mt-3">
            {statusOrder.map(s => {
              const sl = statusLabels[s];
              const cnt = statusCounts[s];
              if (!cnt) return null;
              return (
                <div key={s} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: sl.color }} />
                  <span className="text-[9px] font-600" style={{ color: 'rgba(255,255,255,0.6)' }}>{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bulk mode toolbar */}
        {bulkMode && selected.size > 0 && (
          <div className="bg-accent-light border border-accent rounded-xl p-3 mb-3 flex items-center gap-2">
            <span className="text-accent font-600 text-xs flex-1">{selected.size} {lang==='hi'?'चयनित':'selected'}</span>
            <select
              value={bulkStatus}
              onChange={e => setBulkStatus(e.target.value as VoterStatus)}
              className="bg-white border border-accent rounded-lg px-2 py-1 text-xs text-fg outline-none"
            >
              {statusOrder.map(s => (
                <option key={s} value={s}>{lang==='hi'?statusLabels[s].hi:statusLabels[s].en}</option>
              ))}
            </select>
            <button onClick={handleBulkUpdate} className="tap-highlight-none bg-accent text-white px-3 py-1 rounded-lg text-xs font-700 flex items-center gap-1">
              <RefreshCw size={11} /> {lang==='hi'?'अपडेट':'Update'}
            </button>
          </div>
        )}

        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <StatusChip label={lang==='hi'?'सभी':'All'} count={boothVoters.length} active={filterStatus==='all'} onClick={()=>setFilterStatus('all')} color="#1C1C1E" bg="#E4E4DF" />
          {statusOrder.map(s => (
            <StatusChip
              key={s}
              label={lang==='hi'?statusLabels[s].hi:statusLabels[s].en}
              count={statusCounts[s]}
              active={filterStatus===s}
              onClick={()=>setFilterStatus(s)}
              color={statusLabels[s].color}
              bg={statusLabels[s].bg}
            />
          ))}
        </div>
      </div>

      {/* Voter list */}
      <div className="px-5 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-fg text-sm">{lang==='hi'?'इस श्रेणी में कोई मतदाता नहीं':'No voters in this category'}</div>
        )}
        {filtered.map(voter => {
          const sl = statusLabels[voter.status];
          const isOpen = openVoter === voter.epicNo;
          const isSelected = selected.has(voter.epicNo);
          return (
            <div
              key={voter.epicNo}
              className={`bg-card border rounded-xl transition-all ${isSelected ? 'border-accent' : 'border-border'}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-2">
                  {bulkMode && (
                    <button
                      onClick={() => toggleSelect(voter.epicNo)}
                      className={`tap-highlight-none mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'bg-accent border-accent' : 'border-border bg-bg'}`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </button>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-600 text-sm text-fg flex items-center gap-2 flex-wrap">
                          {voter.name}
                          {voter.memberId && (
                            <span className="text-[9px] bg-accent-light text-accent font-700 px-1.5 py-0.5 rounded-full shrink-0">MEMBER</span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-fg mt-0.5">{voter.age}yr · {voter.address}</div>
                        <div className="font-mono text-[10px] text-muted-fg mt-0.5">{voter.epicNo}</div>
                      </div>
                      <button
                        onClick={() => !bulkMode && setOpenVoter(isOpen ? null : voter.epicNo)}
                        className="tap-highlight-none text-[10px] font-700 px-2.5 py-1 rounded-lg shrink-0 transition-colors"
                        style={{ background: sl.bg, color: sl.color }}
                      >
                        {lang==='hi'?sl.hi:sl.en}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status update panel */}
                {isOpen && !bulkMode && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="text-[10px] text-muted-fg font-600 uppercase tracking-wider mb-2">
                      {lang==='hi'?'स्थिति अपडेट करें':'Update Status'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {statusOrder.map(s => {
                        const l = statusLabels[s];
                        const isCurrent = voter.status === s;
                        return (
                          <button
                            key={s}
                            onClick={() => { updateVoterStatus(voter.epicNo, s); setOpenVoter(null); }}
                            className="tap-highlight-none flex items-center gap-1 text-[10px] font-600 px-2.5 py-1 rounded-lg transition-all"
                            style={{
                              background: isCurrent ? l.color : l.bg,
                              color: isCurrent ? '#fff' : l.color,
                              border: `1.5px solid ${l.color}`,
                            }}
                          >
                            {isCurrent && <Check size={10}/>}
                            {lang==='hi'?l.hi:l.en}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusChip({ label, count, active, onClick, color, bg }: {
  label: string; count: number; active: boolean; onClick: ()=>void; color: string; bg: string;
}) {
  return (
    <button
      onClick={onClick}
      className="tap-highlight-none shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-600 transition-all"
      style={active ? { background: color, color: '#fff' } : { background: bg, color }}
    >
      {label}
      <span className="font-700 text-[10px]">{count}</span>
    </button>
  );
}

import type { Member } from '../data/mockData';
import { wards, booths } from '../data/mockData';

interface Props {
  member: Member;
}

const initials = (name: string) =>
  name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

const formatDate = (d: string) => {
  const [y, m, day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[parseInt(m)-1]} ${y}`;
};

export default function MembershipCard({ member }: Props) {
  const ward = wards.find(w => w.id === member.wardId);
  const booth = booths.find(b => b.id === member.boothId);

  return (
    <div className="membership-card-gradient rounded-2xl overflow-hidden shadow-xl w-full" style={{ aspectRatio: '1.6/1' }}>
      {/* Accent top bar */}
      <div className="h-1.5 bg-accent w-full" />

      <div className="flex h-[calc(100%-6px)] p-4 gap-4">
        {/* Left: Logo + Photo */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="text-center">
            <div className="font-display text-white text-[10px] font-800 leading-tight tracking-widest uppercase opacity-90">जोड़ो</div>
            <div className="font-display text-accent text-[13px] font-800 leading-tight tracking-widest uppercase">YATRA</div>
          </div>
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-display font-700 text-lg shrink-0"
            style={{ background: 'rgba(216,90,48,0.25)', border: '2px solid rgba(216,90,48,0.5)' }}
          >
            {initials(member.name)}
          </div>
          <div
            className="text-[8px] px-1.5 py-0.5 rounded font-mono font-500 tracking-wider"
            style={{ background: member.status === 'active' ? 'rgba(22,163,74,0.25)' : 'rgba(156,163,175,0.25)', color: member.status === 'active' ? '#4ADE80' : '#9CA3AF', border: `1px solid ${member.status === 'active' ? 'rgba(22,163,74,0.4)' : 'rgba(156,163,175,0.3)'}` }}
          >
            {member.status === 'active' ? 'ACTIVE' : 'PENDING'}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.12)' }} />

        {/* Right: Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="text-white font-display font-700 text-sm leading-snug truncate">{member.name}</div>
            <div className="font-mono text-accent text-[11px] font-600 tracking-wider mt-0.5">{member.id}</div>
          </div>

          <div className="space-y-1">
            <FieldRow label="WARD" value={ward?.name ?? '—'} />
            <FieldRow label="BOOTH" value={booth?.name.split(',')[0] ?? '—'} />
            <FieldRow label="VILLAGE" value={member.village} />
            {member.epicNo && <FieldRow label="EPIC" value={member.epicNo} mono />}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>ENROLLED</div>
              <div className="text-white text-[10px] font-500">{formatDate(member.joinDate)}</div>
            </div>
            {/* QR placeholder */}
            <div className="w-9 h-9 rounded grid grid-cols-3 gap-0.5 p-1" style={{ background: 'rgba(255,255,255,0.08)' }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-sm" style={{ background: Math.random() > 0.4 ? 'rgba(255,255,255,0.7)' : 'transparent' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="text-[8px] tracking-widest shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
      <span
        className={`text-[10px] font-500 truncate ${mono ? 'font-mono' : ''}`}
        style={{ color: 'rgba(255,255,255,0.85)' }}
      >
        {value}
      </span>
    </div>
  );
}

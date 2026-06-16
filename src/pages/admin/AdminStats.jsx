import { useState, useEffect } from 'react';
import { adminService } from '../../services/api.service';

const FALLBACK_STATS = {
  hourlyDistribution: [
    { _id:'VIP', totalRevenue:2850, totalHours:1900, sessionCount:320 },
    { _id:'SUPER VIP', totalRevenue:4500, totalHours:1800, sessionCount:240 },
    { _id:'PLATINUM', totalRevenue:2400, totalHours:800, sessionCount:85 },
  ],
  monthlyRevenue: [
    { _id:'2024-11', revenue:5200, hours:2100 },
    { _id:'2024-12', revenue:6800, hours:2800 },
    { _id:'2025-01', revenue:5900, hours:2400 },
    { _id:'2025-02', revenue:7200, hours:2950 },
    { _id:'2025-03', revenue:6500, hours:2600 },
    { _id:'2025-04', revenue:7800, hours:3100 },
  ],
  topUsers: [
    { username:'XtremeKiller_07', totalHoursPlayed:892, points:1240, level:{ name:'INMORTAL' } },
    { username:'DarkNova_GG', totalHoursPlayed:756, points:1068, level:{ name:'INMORTAL' } },
    { username:'CyberWolf_PX', totalHoursPlayed:512, points:748, level:{ name:'LEYENDA' } },
    { username:'StormBlade_22', totalHoursPlayed:634, points:932, level:{ name:'LEYENDA' } },
    { username:'ShadowGamer99', totalHoursPlayed:342, points:847, level:{ name:'PRO' } },
  ],
  gameStats: [
    { _id:'Valorant', totalParticipants:142, count:8 },
    { _id:'Free Fire', totalParticipants:124, count:6 },
    { _id:'Counter Strike 2', totalParticipants:98, count:5 },
    { _id:'League of Legends', totalParticipants:86, count:4 },
    { _id:'DOTA 2', totalParticipants:54, count:3 },
    { _id:'Fortnite', totalParticipants:38, count:2 },
  ],
};

function HBar({ label, value, max, color }) {
  return (
    <div className="flex items-center gap-3 mb-2.5">
      <div className="text-xs md:text-sm w-20 md:w-36 flex-shrink-0 truncate" style={{ color:'#C0C0C0' }}>{label}</div>
      <div className="flex-1 h-2 rounded-full" style={{ background:'rgba(192,192,192,0.06)' }}>
        <div className="h-full rounded-full transition-all" style={{ width:`${Math.round((value/max)*100)}%`, background:color }} />
      </div>
      <div className="font-orbitron text-sm w-12 text-right" style={{ color }}>{value}</div>
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then(({ data }) => setStats(data.data || FALLBACK_STATS))
      .catch(() => setStats(FALLBACK_STATS)).finally(() => setLoading(false));
  }, []);

  const s = stats || FALLBACK_STATS;
  const maxRevenue = Math.max(...s.monthlyRevenue.map(m => m.revenue)) || 1;
  const maxParts = Math.max(...s.gameStats.map(g => g.totalParticipants)) || 1;

  const planColors = { VIP:'#8a8a8a', 'SUPER VIP':'#8B0000', PLATINUM:'#C0C0C0' };

  if (loading) return <div className="text-center py-20" style={{ color:'#8a8a8a' }}>Cargando estadísticas...</div>;

  return (
    <div>
      <div className="font-orbitron font-bold text-xl md:text-2xl mb-4 md:mb-6">Estadísticas Avanzadas</div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label:'Ingresos Totales (6 meses)', value:`S/ ${s.monthlyRevenue.reduce((a,m) => a+m.revenue,0).toLocaleString()}`, color:'#C0C0C0' },
          { label:'Horas Totales', value:s.monthlyRevenue.reduce((a,m) => a+m.hours,0).toLocaleString(), color:'#8B0000' },
          { label:'Torneo más activo', value:s.gameStats[0]?._id || '—', color:'#8B0000' },
          { label:'Top gamer', value:s.topUsers[0]?.username || '—', color:'#C0C0C0' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl p-4" style={{ background:'#1A1A1B', border:'1px solid rgba(192,192,192,0.06)' }}>
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color:'#8a8a8a' }}>{c.label}</div>
            <div className="font-orbitron font-black text-lg leading-tight" style={{ color:c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color:'#8a8a8a' }}>Ingresos mensuales (S/)</div>
          <div className="flex items-end gap-2 h-32">
            {s.monthlyRevenue.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="text-[10px] font-orbitron" style={{ color:'#8B0000' }}>S/{Math.round(m.revenue/1000)}k</div>
                <div className="w-full rounded-t-sm" style={{ height:`${Math.round((m.revenue/maxRevenue)*85)}%`, background:'linear-gradient(180deg,#8B0000,#8B000044)' }} />
                <span className="text-[10px]" style={{ color:'#8a8a8a' }}>{m._id?.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color:'#8a8a8a' }}>Ingresos por plan</div>
          {s.hourlyDistribution.map(p => {
            const total = s.hourlyDistribution.reduce((a,x) => a+x.totalRevenue,0) || 1;
            const pct = Math.round((p.totalRevenue/total)*100);
            return (
              <div key={p._id} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color:'#C0C0C0' }}>{p._id}</span>
                  <span className="font-orbitron font-bold" style={{ color:planColors[p._id]||'#8a8a8a' }}>{pct}% · S/ {p.totalRevenue}</span>
                </div>
                <div className="h-2.5 rounded-full" style={{ background:'rgba(192,192,192,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width:`${pct}%`, background:planColors[p._id]||'#8a8a8a' }} />
                </div>
                <div className="text-xs mt-1" style={{ color:'#5a5a5a' }}>{p.totalHours}h jugadas · {p.sessionCount} sesiones</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color:'#8a8a8a' }}>Popularidad por juego</div>
          {s.gameStats.map((g, i) => {
            const colors = ['#8B0000','#C0C0C0','#5a5a5a','#8B0000','#C0C0C0','#8a8a8a'];
            return <HBar key={g._id} label={g._id} value={g.totalParticipants} max={maxParts} color={colors[i]||'#8a8a8a'} />;
          })}
        </div>

        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color:'#8a8a8a' }}>Top gamers por horas</div>
          <div className="space-y-3">
            {s.topUsers.map((u, i) => {
              const maxH = s.topUsers[0]?.totalHoursPlayed || 1;
              const medals = ['👑','🥈','🥉'];
              return (
                <div key={u.username}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{medals[i]||`${i+1}.`}</span>
                    <span className="font-semibold text-sm flex-1">{u.username}</span>
                    <span className="text-xs font-orbitron" style={{ color:'#8B0000' }}>{u.totalHoursPlayed}h</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background:'rgba(192,192,192,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width:`${Math.round((u.totalHoursPlayed/maxH)*100)}%`, background:'linear-gradient(90deg,#8B0000,#cc0000)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

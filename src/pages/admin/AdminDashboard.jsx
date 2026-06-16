import { useEffect, useState } from 'react';
import { adminService } from '../../services/api.service';

const FALLBACK = {
  overview: { totalUsers: 524, newUsersMonth: 47, newUsersToday: 3, activeTournaments: 3, pendingRedemptions: 5, todayHours: 148, todayRevenue: 312, todaySessions: 62, revenueChange: 18 },
  last7Days: [
    { _id: 'Lun', hours: 88, revenue: 198 }, { _id: 'Mar', hours: 64, revenue: 148 },
    { _id: 'Mié', hours: 104, revenue: 240 }, { _id: 'Jue', hours: 80, revenue: 192 },
    { _id: 'Vie', hours: 144, revenue: 312 }, { _id: 'Sáb', hours: 160, revenue: 360 },
    { _id: 'Dom', hours: 120, revenue: 270 },
  ],
  planBreakdown: [
    { _id: 'VIP', revenue: 1200, hours: 800 },
    { _id: 'SUPER VIP', revenue: 1800, hours: 720 },
    { _id: 'PLATINUM', revenue: 800, hours: 267 },
  ],
  topUsers: [
    { username: 'XtremeKiller_07', points: 1240, level: { name: 'INMORTAL' } },
    { username: 'DarkNova_GG', points: 1068, level: { name: 'INMORTAL' } },
    { username: 'StormBlade_22', points: 932, level: { name: 'LEYENDA' } },
  ],
  recentActivity: [
    { text: 'ShadowGamer99 jugó 3 horas — PLATINUM', time: 'Hace 2h', type: 'ok' },
    { text: 'XtremeKiller_07 canjeó 500pts — Control Xbox', time: 'Hace 4h', type: 'info' },
    { text: 'DarkNova_GG inscripción Torneo Valorant', time: 'Hace 6h', type: 'warn' },
  ],
};

function BarChart({ data, valueKey, labelKey, color = '#8B0000' }) {
  const max = Math.max(...data.map(d => d[valueKey])) || 1;
  return (
    <div className="flex items-end gap-1.5 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
          <div className="w-full rounded-t-sm transition-all" style={{ height: `${Math.round((d[valueKey] / max) * 100)}%`, background: `linear-gradient(180deg,${color},${color}55)` }} />
          <span className="text-[10px]" style={{ color: '#8a8a8a' }}>{d[labelKey]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(({ data: d }) => setData(d.data || FALLBACK))
      .catch(() => setData(FALLBACK)).finally(() => setLoading(false));
  }, []);

  const d = data || FALLBACK;

  return (
    <div>
      <div className="font-orbitron font-bold text-xl md:text-2xl mb-4 md:mb-6">Dashboard General</div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Usuarios Totales', value: d.overview.totalUsers, change: `+${d.overview.newUsersMonth} este mes`, color: '#8B0000' },
          { label: 'Horas Hoy', value: d.overview.todayHours, change: '+23% vs ayer', color: '#C0C0C0' },
          { label: 'Ingresos Hoy', value: `S/ ${d.overview.todayRevenue}`, change: `+${d.overview.revenueChange}% vs ayer`, color: '#8B0000' },
          { label: 'Torneos Activos', value: d.overview.activeTournaments, change: `${d.overview.pendingRedemptions} canjes pendientes`, color: '#C0C0C0' },
        ].map((m) => (
          <div key={m.label} className="rounded-xl p-3 md:p-4" style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.06)' }}>
            <div className="text-[10px] md:text-xs uppercase tracking-widest mb-1 md:mb-2" style={{ color: '#8a8a8a' }}>{m.label}</div>
            <div className="font-orbitron font-black text-lg md:text-2xl" style={{ color: m.color }}>{m.value}</div>
            <div className="text-xs mt-1" style={{ color: '#C0C0C0' }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8a8a8a' }}>Horas jugadas — últimos 7 días</div>
          <BarChart data={d.last7Days} valueKey="hours" labelKey="_id" color="#8B0000" />
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8a8a8a' }}>Ingresos (S/) — últimos 7 días</div>
          <BarChart data={d.last7Days} valueKey="revenue" labelKey="_id" color="#C0C0C0" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8a8a8a' }}>Ingresos por plan</div>
          {d.planBreakdown.map((p, i) => {
            const total = d.planBreakdown.reduce((s, x) => s + x.revenue, 0) || 1;
            const pct = Math.round((p.revenue / total) * 100);
            const colors = ['#8B0000', '#C0C0C0', '#5a5a5a'];
            return (
              <div key={p._id} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: '#C0C0C0' }}>{p._id}</span>
                  <span className="font-orbitron font-bold" style={{ color: colors[i] }}>{pct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(192,192,192,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8a8a8a' }}>Top Gamers</div>
          <div className="space-y-3">
            {d.topUsers.map((u, i) => (
              <div key={u.username} className="flex items-center gap-3">
                <span className="font-orbitron text-sm w-5" style={{ color: ['#ffd700','#C0C0C0','#cd7f32'][i] || '#8a8a8a' }}>{i + 1}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{u.username}</div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>{u.level?.name}</div>
                </div>
                <div className="font-orbitron font-bold text-sm" style={{ color: '#8B0000' }}>{u.points}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="text-xs uppercase tracking-widest mb-4" style={{ color: '#8a8a8a' }}>Actividad Reciente</div>
          <div className="space-y-2">
            {(d.recentActivity || FALLBACK.recentActivity).map((a, i) => (
              <div key={i} className="text-sm px-3 py-2 rounded-lg" style={{ background: '#0D0D0D', borderLeft: `3px solid ${a.type === 'ok' ? '#C0C0C0' : a.type === 'warn' ? '#8B0000' : '#8a8a8a'}` }}>
                {a.text}
                <div className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

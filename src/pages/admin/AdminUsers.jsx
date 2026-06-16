import { useState, useEffect } from 'react';
import { adminService } from '../../services/api.service';

const FALLBACK_USERS = [
  { _id: '1', username: 'XtremeKiller_07', email: 'xtreme@gmail.com', points: 1240, totalHoursPlayed: 892, level: { name: 'INMORTAL', icon: '💎' }, visitCount: 240 },
  { _id: '2', username: 'DarkNova_GG', email: 'dark@gmail.com', points: 1068, totalHoursPlayed: 756, level: { name: 'INMORTAL', icon: '💎' }, visitCount: 195 },
  { _id: '3', username: 'ShadowGamer99', email: 'shadow@gmail.com', points: 847, totalHoursPlayed: 342, level: { name: 'PRO', icon: '🏆' }, visitCount: 85 },
  { _id: '4', username: 'CyberWolf_PX', email: 'cyber@gmail.com', points: 748, totalHoursPlayed: 512, level: { name: 'LEYENDA', icon: '👑' }, visitCount: 130 },
  { _id: '5', username: 'ThunderAce', email: 'thunder@gmail.com', points: 435, totalHoursPlayed: 180, level: { name: 'GAMER', icon: '⚡' }, visitCount: 60 },
];

const normalizeUser = (u) => ({
  _id: u.id ?? u._id,
  username: u.username,
  email: u.email,
  points: u.points,
  role: u.role,
  level: u.level ?? { name: u.level_name, icon: u.level_icon },
  totalHoursPlayed: u.total_hours_played ?? u.totalHoursPlayed,
  visitCount: u.visit_count ?? u.visitCount,
  is_active: u.is_active,
  created_at: u.created_at,
});

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState({ hours: '', plan: 'VIP' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    adminService.getUsers({ limit: 50 }).then(({ data }) => setUsers(data.data?.length ? data.data.map(normalizeUser) : FALLBACK_USERS))
      .catch(() => setUsers(FALLBACK_USERS)).finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selected || !session.hours) return;
    try {
      await adminService.assignSession(selected._id, { hours: Number(session.hours), plan: session.plan });
      showToast(`✓ ${session.hours}h asignadas a ${selected.username}`);
      const pts = { VIP: 1, 'SUPER VIP': 2, PLATINUM: 3 }[session.plan] * Number(session.hours);
      setUsers(prev => prev.map(u => u._id === selected._id ? { ...u, points: u.points + pts } : u));
      setSession({ hours: '', plan: 'VIP' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al asignar sesión.');
    }
  };

  return (
    <div>
      <div className="font-orbitron font-bold text-xl md:text-2xl mb-4 md:mb-6">Gestión de Usuarios</div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input className="input-dark flex-1" placeholder="Buscar por usuario o correo..." value={search} onChange={e => setSearch(e.target.value)} />
        <span className="px-4 py-2.5 rounded-lg text-sm flex items-center self-start" style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.07)', color: '#8a8a8a' }}>
          {filtered.length} usuarios
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div className="card overflow-x-auto">
          {loading ? <div className="text-center py-8" style={{ color: '#8a8a8a' }}>Cargando...</div> : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {filtered.map(u => (
                  <div key={u._id} onClick={() => setSelected(u)} className="p-3 rounded-xl cursor-pointer transition-colors"
                    style={{ background: selected?._id === u._id ? 'rgba(139,0,0,0.08)' : '#0D0D0D', border: '1px solid rgba(192,192,192,0.06)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-orbitron font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                        {u.username.slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{u.username}</div>
                        <div className="text-xs truncate" style={{ color: '#8a8a8a' }}>{u.email}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setSelected(u); }}
                        className="text-xs px-3 py-1.5 rounded flex-shrink-0" style={{ background: 'rgba(139,0,0,0.08)', color: '#8B0000', border: '1px solid rgba(139,0,0,0.2)' }}>
                        Seleccionar
                      </button>
                    </div>
                    <div className="flex gap-3 text-xs" style={{ color: '#8a8a8a' }}>
                      <span>{u.level?.icon} {u.level?.name}</span>
                      <span className="font-orbitron font-bold" style={{ color: '#8B0000' }}>{u.points} pts</span>
                      <span>{u.totalHoursPlayed}h</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop table */}
              <table className="hidden md:table w-full" style={{ fontSize: 14, minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(192,192,192,0.07)' }}>
                    {['Usuario', 'Email', 'Nivel', 'Puntos', 'Horas', 'Acción'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-xs uppercase tracking-wider font-semibold" style={{ color: '#8a8a8a' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id} onClick={() => setSelected(u)} className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid rgba(192,192,192,0.04)', background: selected?._id === u._id ? 'rgba(139,0,0,0.04)' : 'transparent' }}
                      onMouseEnter={e => { if (selected?._id !== u._id) e.currentTarget.style.background = 'rgba(192,192,192,0.02)'; }}
                      onMouseLeave={e => { if (selected?._id !== u._id) e.currentTarget.style.background = 'transparent'; }}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-orbitron font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                            {u.username.slice(0,2).toUpperCase()}
                          </div>
                          <span className="font-semibold">{u.username}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4" style={{ color: '#8a8a8a' }}>{u.email}</td>
                      <td className="py-3 pr-4"><span className="text-xs">{u.level?.icon} {u.level?.name}</span></td>
                      <td className="py-3 pr-4 font-orbitron font-bold text-sm" style={{ color: '#8B0000' }}>{u.points}</td>
                      <td className="py-3 pr-4" style={{ color: '#8a8a8a' }}>{u.totalHoursPlayed}h</td>
                      <td className="py-3">
                        <button onClick={(e) => { e.stopPropagation(); setSelected(u); }}
                          className="text-xs px-3 py-1 rounded" style={{ background: 'rgba(139,0,0,0.08)', color: '#8B0000', border: '1px solid rgba(139,0,0,0.2)' }}>
                          Seleccionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div className="space-y-4">
          {selected ? (
            <>
              <div className="card-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                    {selected.username.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{selected.username}</div>
                    <div className="text-xs" style={{ color: '#8a8a8a' }}>{selected.level?.icon} {selected.level?.name} · {selected.points} pts</div>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-widest mb-3" style={{ color: '#8B0000' }}>Asignar Sesión</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#8a8a8a' }}>Horas jugadas</label>
                    <input type="number" min="0.5" step="0.5" className="input-dark" placeholder="Ej: 2"
                      value={session.hours} onChange={e => setSession(s => ({ ...s, hours: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: '#8a8a8a' }}>Plan</label>
                    <select className="input-dark" value={session.plan} onChange={e => setSession(s => ({ ...s, plan: e.target.value }))}>
                      <option>VIP</option>
                      <option>SUPER VIP</option>
                      <option>PLATINUM</option>
                    </select>
                  </div>
                  {session.hours && (
                    <div className="text-xs p-2 rounded" style={{ background: '#0D0D0D', color: '#C0C0C0' }}>
                      +{({ VIP: 1, 'SUPER VIP': 2, PLATINUM: 3 }[session.plan] || 1) * Number(session.hours)} puntos · S/ {({ VIP: 1.5, 'SUPER VIP': 2.5, PLATINUM: 3 }[session.plan] * Number(session.hours)).toFixed(2)}
                    </div>
                  )}
                  <button onClick={handleAssign} className="btn-primary w-full py-2.5" disabled={!session.hours}>
                    Asignar Horas
                  </button>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-full py-2 text-sm rounded-lg" style={{ background: 'rgba(192,192,192,0.04)', color: '#8a8a8a', border: '1px solid rgba(192,192,192,0.07)' }}>
                Deseleccionar
              </button>
            </>
          ) : (
            <div className="card text-center py-8" style={{ color: '#8a8a8a' }}>
              <div className="text-3xl mb-3">👆</div>
              <div className="text-sm">Selecciona un usuario para gestionar su sesión</div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-center md:text-left"
          style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.4)', color: '#C0C0C0' }}>{toast}</div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api.service';

const LEVELS = [
  { name: 'NOVATO',   icon: '🎮', min: 0,   max: 24  },
  { name: 'GAMER',    icon: '⚡', min: 25,  max: 99  },
  { name: 'PRO',      icon: '🏆', min: 100, max: 199 },
  { name: 'LEYENDA',  icon: '👑', min: 200, max: 499 },
  { name: 'INMORTAL', icon: '💎', min: 500, max: Infinity },
];

function getProgress(points) {
  const cur = LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
  const next = LEVELS[LEVELS.indexOf(cur) + 1];
  if (!next) return 100;
  return Math.min(Math.round(((points - cur.min) / (next.min - cur.min)) * 100), 100);
}

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getHistory({ limit: 8 }),
      userService.getNotifications(),
    ]).then(([h, n]) => {
      setHistory(h.data.data || []);
      setNotifications(n.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const progress = getProgress(user.points);
  const curLevel = LEVELS.find(l => user.points >= l.min && user.points <= l.max) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(curLevel) + 1];

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.03) 0%, transparent 70%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-2xl p-6 mb-5 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center"
        style={{ background: 'linear-gradient(135deg,#1A1A1B,#252526)', border: '1px solid rgba(139,0,0,0.2)' }}>
        <div className="w-20 h-20 rounded-full p-0.5 flex-shrink-0" style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)' }}>
          <div className="w-full h-full rounded-full flex items-center justify-center font-orbitron font-black text-xl" style={{ background: '#1A1A1B', color: '#8B0000' }}>
            {user.username.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div>
          <div className="font-orbitron font-bold text-xl mb-1">{user.username}</div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
            style={{ background: 'rgba(139,0,0,0.15)', border: '1px solid rgba(139,0,0,0.4)', color: '#8B0000' }}>
            {curLevel.icon} {curLevel.name}
          </div>
          <div className="text-xs mb-2" style={{ color: '#8a8a8a' }}>
            Miembro desde {new Date(user.createdAt || Date.now()).toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })} · {user.visitCount || 0} visitas
          </div>
          <div className="progress-track h-2 w-72 max-w-full"><div className="progress-fill h-2" style={{ width: `${progress}%` }} /></div>
          <div className="text-xs mt-1" style={{ color: '#8a8a8a' }}>
            {nextLevel ? `${user.points} / ${nextLevel.min} pts para ${nextLevel.icon} ${nextLevel.name}` : '¡Nivel máximo alcanzado!'}
          </div>
        </div>
        <div className="text-center">
          <div className="font-orbitron font-black text-5xl leading-none" style={{ color: '#8B0000' }}>{user.points}</div>
          <div className="text-xs uppercase tracking-widest mt-1" style={{ color: '#8a8a8a' }}>Puntos</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { num: user.totalHoursPlayed || 0, label: 'Horas Jugadas' },
          { num: user.visitCount || 0, label: 'Visitas' },
          { num: user.tournamentsJoined?.length || 0, label: 'Torneos' },
          { num: user.totalRedemptions || 0, label: 'Canjes' },
        ].map((s) => (
          <div key={s.label} className="stat-card"><div className="stat-num">{s.num}</div><div className="stat-label">{s.label}</div></div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card">
          <div className="font-orbitron text-xs tracking-widest uppercase mb-4 pb-3" style={{ color: '#8B0000', borderBottom: '1px solid rgba(139,0,0,0.1)' }}>
            Historial Reciente
          </div>
          {loading ? <div style={{ color: '#8a8a8a' }} className="text-sm">Cargando...</div> :
            history.length > 0 ? (
              <div className="space-y-0">
                {history.map((s, i) => (
                  <div key={s._id || i} className="flex justify-between items-center py-2.5" style={{ borderBottom: '1px solid rgba(192,192,192,0.04)' }}>
                    <div>
                      <div className="font-semibold text-sm">Sesión {s.plan}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#8a8a8a' }}>{new Date(s.createdAt).toLocaleDateString('es-PE')} · {s.hours}h</div>
                    </div>
                    <div className="font-orbitron font-bold text-sm" style={{ color: '#C0C0C0' }}>+{s.pointsEarned} pts</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm py-4 text-center" style={{ color: '#8a8a8a' }}>
                Aún no tienes sesiones registradas.<br />
                <span style={{ color: '#8B0000' }}>¡Ven a jugar y acumula puntos!</span>
              </div>
            )
          }
        </div>

        <div className="card">
          <div className="font-orbitron text-xs tracking-widest uppercase mb-4 pb-3" style={{ color: '#8B0000', borderBottom: '1px solid rgba(139,0,0,0.1)' }}>
            Sistema de Niveles
          </div>
          <div className="space-y-3">
            {LEVELS.map((l) => {
              const done = user.points > l.max;
              const isCur = l.name === curLevel.name;
              return (
                <div key={l.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: done ? 'linear-gradient(135deg,#8B0000,#cc0000)' : isCur ? 'rgba(139,0,0,0.1)' : 'rgba(192,192,192,0.04)',
                      border: isCur ? '2px solid #8B0000' : done ? 'none' : '1px solid rgba(192,192,192,0.1)',
                      boxShadow: isCur ? '0 0 12px rgba(139,0,0,0.3)' : 'none',
                    }}>
                    {done ? '✓' : l.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm" style={{ color: isCur ? '#8B0000' : done ? '#C0C0C0' : '#8a8a8a' }}>{l.name}</div>
                    <div className="text-xs" style={{ color: '#5a5a5a' }}>{l.min}–{l.max === Infinity ? '∞' : l.max} puntos{isCur ? ' — NIVEL ACTUAL' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="card mt-5">
          <div className="font-orbitron text-xs tracking-widest uppercase mb-4 pb-3" style={{ color: '#8B0000', borderBottom: '1px solid rgba(139,0,0,0.1)' }}>
            Notificaciones
          </div>
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <div key={i} className="px-4 py-2.5 rounded-lg text-sm" style={{ background: '#0D0D0D', borderLeft: '3px solid #8B0000' }}>
                {n.message}
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

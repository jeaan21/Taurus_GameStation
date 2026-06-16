import { useEffect, useState } from 'react';
import { rankingService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

const FALLBACK = [
  { position: 1, username: 'XtremeKiller_07', level: { name: 'INMORTAL', icon: '💎' }, points: 1240, totalHoursPlayed: 892 },
  { position: 2, username: 'DarkNova_GG',     level: { name: 'INMORTAL', icon: '💎' }, points: 1068, totalHoursPlayed: 756 },
  { position: 3, username: 'StormBlade_22',   level: { name: 'LEYENDA',  icon: '👑' }, points: 932,  totalHoursPlayed: 634 },
  { position: 4, username: 'ShadowGamer99',   level: { name: 'PRO',      icon: '🏆' }, points: 847,  totalHoursPlayed: 342 },
  { position: 5, username: 'CyberWolf_PX',    level: { name: 'LEYENDA',  icon: '👑' }, points: 748,  totalHoursPlayed: 512 },
  { position: 6, username: 'VortexSniper',    level: { name: 'PRO',      icon: '🏆' }, points: 620,  totalHoursPlayed: 290 },
  { position: 7, username: 'FireStrike_99',   level: { name: 'PRO',      icon: '🏆' }, points: 521,  totalHoursPlayed: 240 },
  { position: 8, username: 'ThunderAce',      level: { name: 'GAMER',    icon: '⚡' }, points: 435,  totalHoursPlayed: 180 },
  { position: 9, username: 'NeonPulse',       level: { name: 'GAMER',    icon: '⚡' }, points: 312,  totalHoursPlayed: 145 },
  { position: 10, username: 'GhostRunner_X',  level: { name: 'GAMER',    icon: '⚡' }, points: 244,  totalHoursPlayed: 98  },
];

const MEDALS = { 1: '👑', 2: '🥈', 3: '🥉' };
const MEDAL_COLORS = { 1: '#ffd700', 2: '#C0C0C0', 3: '#cd7f32' };
const BORDER_COLORS = { 1: 'rgba(255,215,0,0.3)', 2: 'rgba(192,192,192,0.3)', 3: 'rgba(205,127,50,0.3)' };

export default function Ranking() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState([]);
  const [myPos, setMyPos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    rankingService.getGlobal({ limit: 20 })
      .then(({ data }) => setRanking(data.data?.length ? data.data : FALLBACK))
      .catch(() => setRanking(FALLBACK))
      .finally(() => setLoading(false));
    if (user) {
      rankingService.getMyPosition().then(({ data }) => setMyPos(data.data)).catch(() => {});
    }
  }, [user]);

  const maxPts = ranking[0]?.points || 1;

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.03) 0%, transparent 70%)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="section-tag">Competencia</div>
      <h1 className="section-title">Ranking Global</h1>
      <p className="section-sub">Los mejores gamers de Taurus Games Station. ¿Estás listo para el top?</p>

      {user && myPos && (
        <div className="rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3"
          style={{ background: 'rgba(139,0,0,0.06)', border: '1px solid rgba(139,0,0,0.2)' }}>
          <div className="text-sm" style={{ color: '#8a8a8a' }}>Tu posición actual</div>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-orbitron font-black text-2xl" style={{ color: '#8B0000' }}>#{myPos.position}</span>
              <span className="text-sm ml-2" style={{ color: '#8a8a8a' }}>de {myPos.total} jugadores</span>
            </div>
            <div className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(192,192,192,0.1)', color: '#C0C0C0' }}>
              Top {100 - myPos.percentile}%
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20" style={{ color: '#8a8a8a' }}>Cargando ranking...</div>
      ) : (
        <div className="space-y-3">
          {ranking.map((player) => {
            const isMe = user && player.username === user.username;
            const barWidth = Math.round((player.points / maxPts) * 100);

            return (
              <div key={player.position} className="rounded-xl px-5 py-4 flex items-center gap-4 transition-all duration-150"
                style={{
                  background: isMe ? 'rgba(139,0,0,0.06)' : '#1A1A1B',
                  border: `1px solid ${BORDER_COLORS[player.position] || (isMe ? 'rgba(139,0,0,0.2)' : 'rgba(192,192,192,0.06)')}`,
                }}>
                <div className="font-orbitron font-black text-xl w-8 text-center flex-shrink-0"
                  style={{ color: MEDAL_COLORS[player.position] || '#8a8a8a' }}>
                  {MEDALS[player.position] || player.position}
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron font-bold text-xs flex-shrink-0"
                  style={{ background: isMe ? 'linear-gradient(135deg,#8B0000,#cc0000)' : 'rgba(192,192,192,0.06)', color: isMe ? '#fff' : '#8a8a8a' }}>
                  {player.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm flex items-center gap-2">
                    {player.username}
                    {isMe && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,0,0,0.1)', color: '#8B0000' }}>Tú</span>}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: '#8a8a8a' }}>
                    {player.level?.icon} {player.level?.name} · {player.totalHoursPlayed}h jugadas
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-1.5 rounded-full hidden sm:block" style={{ background: 'rgba(192,192,192,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg,#8B0000,#cc0000)' }} />
                  </div>
                  <div className="font-orbitron font-bold text-base" style={{ color: '#8B0000' }}>{player.points}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

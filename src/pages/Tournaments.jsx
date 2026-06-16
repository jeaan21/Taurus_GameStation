import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

const FALLBACK = [
  { id: '1', name: 'Torneo Valorant — Copa Mayo', game: 'Valorant', prize_text: 'S/ 300', prize_amount: 300, max_participants: 16, scheduled_at: '2025-05-15T15:00:00', status: 'open', format: '5v5', participant_count: 12 },
  { id: '2', name: 'Liga Semanal — League of Legends', game: 'League of Legends', prize_text: 'S/ 150', prize_amount: 150, max_participants: 16, scheduled_at: '2025-05-10T17:00:00', status: 'open', format: '5v5', participant_count: 8 },
  { id: '3', name: 'Free Fire Battle Royale', game: 'Free Fire', prize_text: 'S/ 200', prize_amount: 200, max_participants: 32, scheduled_at: '2025-05-25T18:00:00', status: 'open', format: 'squad', participant_count: 4 },
  { id: '4', name: 'CS2 Showdown', game: 'Counter Strike 2', prize_text: 'S/ 250', prize_amount: 250, max_participants: 16, scheduled_at: '2025-04-28T15:00:00', status: 'finished', format: '5v5', participant_count: 16 },
  { id: '5', name: 'DOTA 2 — The Ancient Wars', game: 'DOTA 2', prize_text: 'S/ 800', prize_amount: 800, max_participants: 16, scheduled_at: '2025-06-15T15:00:00', status: 'open', format: '5v5', participant_count: 11 },
  { id: '6', name: 'Fortnite Storm Cup', game: 'Fortnite', prize_text: 'S/ 600', prize_amount: 600, max_participants: 24, scheduled_at: '2025-06-22T17:00:00', status: 'open', format: 'battle_royale', participant_count: 18 },
];

const normalizeTournament = (t) => {
  const pCount = t.participant_count ?? t.participants?.length ?? 0;
  return {
    _id: t.id ?? t._id,
    name: t.name, game: t.game,
    prize: t.prize_text ?? t.prize,
    prizeAmount: t.prize_amount ?? t.prizeAmount ?? 0,
    maxParticipants: t.max_participants ?? t.maxParticipants,
    scheduledAt: t.scheduled_at ?? t.scheduledAt,
    status: t.status, format: t.format,
    description: t.description, rules: t.rules,
    participants: t.participants || Array.from({ length: pCount }, (_, i) => ({ _id: `p${i}` })),
  };
};

const GAME_ASSETS = {
  'DOTA 2': { img: './img/dota_2.png', color: '#0B4A3B', accent: '#1B9E6B', icon: '🗡️' },
  'Fortnite': { img: './img/FORNITE.jpg', color: '#7C3AED', accent: '#A855F7', icon: '🌪️' },
  'League of Legends': { img: './img/league-of-legends.jpg', color: '#C8A951', accent: '#F0D060', icon: '🏆' },
  'Free Fire': { img: './img/FREE_FIRE.jpg', color: '#EA580C', accent: '#FF6B35', icon: '🔥' },
  'Counter Strike 2': { img: './img/counter_strick2.jpeg', color: '#D97706', accent: '#F59E0B', icon: '🎯' },
  'Valorant': { img: './img/Valorant.jpg', color: '#DC2626', accent: '#EF4444', icon: '⚔️' },
};
const STATUS_MAP = {
  open: { label: 'Abierto', cls: 'badge-active' },
  upcoming: { label: 'Próximo', cls: 'badge-upcoming' },
  closed: { label: 'Cerrado', cls: 'badge-closed' },
  in_progress: { label: 'En curso', cls: 'badge-upcoming' },
  finished: { label: 'Finalizado', cls: 'badge-closed' },
  cancelled: { label: 'Cancelado', cls: 'badge-closed' },
};

export default function Tournaments() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    tournamentService.getAll().then(({ data }) => setTournaments((data.data || FALLBACK).map(normalizeTournament)))
      .catch(() => setTournaments(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleJoin = async (id) => {
    if (!user) { showToast('Debes iniciar sesión para inscribirte.'); return; }
    setJoining(id);
    try {
      await tournamentService.register(id, {});
      showToast('¡Inscripción exitosa!');
      setTournaments(prev => prev.map(t => t._id === id ? { ...t, participants: [...t.participants, { user: { _id: user.id } }] } : t));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al inscribirse.');
    } finally { setJoining(null); }
  };

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t => t.status === filter);

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.03) 0%, transparent 70%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="section-tag">Competencia</div>
        <h1 className="section-title">Torneos & Eventos</h1>
        <p style={{ color: '#8a8a8a' }}>Inscríbete, compite y llévate los premios.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[['all','Todos'], ['open','Abiertos'], ['in_progress','En curso'], ['finished','Finalizados']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{ background: filter === v ? 'rgba(139,0,0,0.12)' : 'rgba(192,192,192,0.04)', border: filter === v ? '1px solid rgba(139,0,0,0.4)' : '1px solid rgba(192,192,192,0.07)', color: filter === v ? '#8B0000' : '#8a8a8a' }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: '#8a8a8a' }}>Cargando torneos...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((t) => {
            const asset = GAME_ASSETS[t.game] || { img: '', color: '#8B0000', accent: '#8B0000' };
            const spots = t.maxParticipants - (t.participants?.length || 0);
            const pct = Math.round(((t.participants?.length || 0) / t.maxParticipants) * 100);
            const st = STATUS_MAP[t.status] || STATUS_MAP.finished;
            const isJoined = user && t.participants?.some(p => (p.user?._id || p.user) === (user.id || user._id));
            const canJoin = t.status === 'open' && spots > 0 && !isJoined;

            return (
              <div key={t._id} className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.07)' }}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={asset.img} alt={t.game}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{
                    background: `linear-gradient(180deg, transparent 20%, ${asset.color}DD 100%)`,
                  }} />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-bold"
                      style={{ background: `${asset.color}33`, border: `1px solid ${asset.accent}55`, color: asset.accent }}>
                      {asset.icon} {t.game}
                    </span>
                    <span className={st.cls}>{st.label}</span>
                  </div>
                  <div className="absolute top-3 right-3 text-right">
                    <div className="font-orbitron font-black text-lg" style={{ color: asset.accent, textShadow: `0 0 20px ${asset.accent}44` }}>
                      {t.prize}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: `${asset.accent}AA` }}>Premio</div>
                  </div>
                  {isJoined && (
                    <div className="absolute top-12 right-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#22C55E' }}>
                        ✓ Inscrito
                      </span>
                    </div>
                  )}
                  <Link to={`/tournaments/${t._id}`} className="absolute inset-0 z-10" />
                </div>

                <div className="h-1 relative overflow-hidden" style={{ background: `${asset.color}33` }}>
                  <div className="h-full transition-all duration-700" style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${asset.accent}, ${asset.color})`,
                    boxShadow: `0 0 8px ${asset.accent}44`,
                  }} />
                </div>

                <div className="p-4">
                  <Link to={`/tournaments/${t._id}`} className="font-orbitron font-bold text-sm tracking-wide mb-1.5 block hover:underline"
                    style={{ color: '#C0C0C0' }}>
                    {t.name}
                  </Link>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs mb-3" style={{ color: '#8a8a8a' }}>
                    <span>📅 {new Date(t.scheduledAt).toLocaleDateString('es-PE', { day:'numeric', month:'short' })}</span>
                    <span>👥 {t.participants?.length || 0}/{t.maxParticipants}</span>
                    <span>🎮 {t.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {canJoin ? (
                      <button onClick={() => handleJoin(t._id)} disabled={joining === t._id}
                        className="flex-1 text-xs font-bold py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
                        style={{ background: asset.accent, color: '#0D0D0D' }}>
                        {joining === t._id ? '...' : 'Inscribirse'}
                      </button>
                    ) : (
                      <button disabled
                        className="flex-1 text-xs font-bold py-2 rounded-lg cursor-default"
                        style={{ background: 'rgba(192,192,192,0.05)', color: '#5a5a5a' }}>
                        {isJoined ? 'Inscrito' : spots <= 0 ? 'Completo' : st.label}
                      </button>
                    )}
                    <Link to={`/tournaments/${t._id}`}
                      className="text-[10px] px-3 py-2 rounded-lg font-bold transition-all duration-200"
                      style={{ background: `${asset.accent}15`, color: asset.accent, border: `1px solid ${asset.accent}30` }}>
                      Info →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16" style={{ color: '#8a8a8a' }}>No hay torneos en esta categoría.</div>
          )}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold animate-pulse"
          style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.4)', color: '#C0C0C0' }}>
          {toast}
        </div>
      )}
      </div>
    </div>
  );
}

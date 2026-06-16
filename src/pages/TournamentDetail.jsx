import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tournamentService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

const normalizeParticipant = (p) => ({
  ...p,
  user: p.user || { _id: p.user_id, username: p.username },
  teamName: p.team_name ?? p.teamName,
});

const normalizeTournament = (t) => ({
  _id: t.id ?? t._id,
  name: t.name, game: t.game, format: t.format,
  prize: t.prize_text ?? t.prize,
  prizeAmount: t.prize_amount ?? t.prizeAmount ?? 0,
  maxParticipants: t.max_participants ?? t.maxParticipants,
  scheduledAt: t.scheduled_at ?? t.scheduledAt,
  status: t.status, description: t.description, rules: t.rules,
  participants: (t.participants || []).map(normalizeParticipant),
});

export function TournamentDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    tournamentService.getById(id).then(({ data }) => setTournament(normalizeTournament(data.data)))
      .catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg, ok = true) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const handleJoin = async () => {
    if (!user) { showToast('Debes iniciar sesión.'); return; }
    setJoining(true);
    try {
      await tournamentService.register(id, {});
      showToast('¡Inscripción exitosa!');
      setTournament(prev => ({
        ...prev,
        participants: [...prev.participants, { user: { _id: user.id, username: user.username } }],
      }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al inscribirse.', false);
    } finally { setJoining(false); }
  };

  if (loading) return <div className="text-center py-32" style={{ color: '#8a8a8a' }}>Cargando torneo...</div>;
  if (!tournament) return (
    <div className="text-center py-32">
      <div className="text-4xl mb-4">🏆</div>
      <div className="font-orbitron text-xl mb-2">Torneo no encontrado</div>
      <Link to="/tournaments" className="btn-outline mt-4 inline-flex">← Ver torneos</Link>
    </div>
  );

  const isJoined = user && tournament.participants?.some(p => (p.user?._id || p.user_id) === (user.id || user._id));
  const spotsLeft = tournament.maxParticipants - (tournament.participants?.length || 0);
  const canJoin = tournament.status === 'open' && spotsLeft > 0 && !isJoined;

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.03) 0%, transparent 70%)' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/tournaments" className="text-sm mb-6 inline-flex items-center gap-1" style={{ color: '#8a8a8a' }}>← Volver a torneos</Link>
      <div className="card-glow mb-5">
        <div className="font-orbitron font-black text-2xl mb-2">{tournament.name}</div>
        <div className="flex flex-wrap gap-3 mb-4">
          <span className="badge-active">{tournament.status === 'open' ? 'Abierto' : tournament.status}</span>
          <span className="text-sm" style={{ color: '#8a8a8a' }}>🎮 {tournament.game}</span>
          <span className="text-sm" style={{ color: '#8a8a8a' }}>🏅 {tournament.prize}</span>
          <span className="text-sm" style={{ color: '#8a8a8a' }}>👥 {tournament.participants?.length}/{tournament.maxParticipants}</span>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#8a8a8a' }}>{tournament.description}</p>
        {tournament.rules && <div className="text-sm p-3 rounded-lg" style={{ background: '#0D0D0D', color: '#8a8a8a' }}><strong style={{ color: '#8B0000' }}>Reglas:</strong> {tournament.rules}</div>}
        <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(192,192,192,0.06)' }}>
          {canJoin ? (
            <button onClick={handleJoin} disabled={joining} className="btn-primary text-sm px-6 py-2.5">
              {joining ? 'Inscribiendo...' : 'Inscribirse al torneo'}
            </button>
          ) : (
            <button disabled className="px-6 py-2.5 rounded-lg text-sm font-bold" style={{ background: 'rgba(192,192,192,0.05)', color: '#5a5a5a', cursor: 'default' }}>
              {isJoined ? 'Ya estás inscrito ✓' : spotsLeft <= 0 ? 'Torneo lleno' : 'Inscripciones cerradas'}
            </button>
          )}
          <span className="text-xs" style={{ color: '#8a8a8a' }}>{spotsLeft} cupo{spotsLeft !== 1 ? 's' : ''} disponible{spotsLeft !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div className="card">
        <div className="font-orbitron text-xs tracking-widest uppercase mb-4" style={{ color: '#8B0000' }}>Participantes ({tournament.participants?.length || 0})</div>
        {tournament.participants?.length > 0 ? (
          <div className="space-y-2">
            {tournament.participants.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(192,192,192,0.04)' }}>
                <span className="font-orbitron text-sm w-6" style={{ color: '#8a8a8a' }}>{i + 1}</span>
                <span className="font-semibold text-sm">{p.user?.username || p.username || 'Participante'}</span>
                {p.teamName && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(139,0,0,0.08)', color: '#8B0000' }}>{p.teamName}</span>}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm" style={{ color: '#8a8a8a' }}>Aún no hay participantes. ¡Sé el primero!</div>
        )}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold"
          style={{ background: '#1A1A1B', border: `1px solid ${toast.ok !== false ? 'rgba(192,192,192,0.4)' : 'rgba(139,0,0,0.4)'}`, color: toast.ok !== false ? '#C0C0C0' : '#cc0000' }}>
          {toast.msg || toast}
        </div>
      )}
      </div>
    </div>
  );
}

export default TournamentDetail;

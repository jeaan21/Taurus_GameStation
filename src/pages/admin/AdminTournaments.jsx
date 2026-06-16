import { useState, useEffect, useCallback } from 'react';
import { adminService, tournamentService } from '../../services/api.service';

const normalizeParticipant = (p) => ({
  _id: p.id ?? p._id,
  username: p.username,
  teamName: p.team_name ?? p.teamName,
  levelName: p.level_name ?? p.levelName,
  levelIcon: p.level_icon ?? p.levelIcon,
  registeredAt: p.created_at ?? p.registeredAt,
});

const normalizeTournament = (t) => ({
  _id: t.id ?? t._id,
  name: t.name, game: t.game, format: t.format,
  prize: t.prize_text ?? t.prize,
  maxParticipants: t.max_participants ?? t.maxParticipants,
  scheduledAt: t.scheduled_at ?? t.scheduledAt,
  status: t.status,
  description: t.description, rules: t.rules,
  createdBy: t.created_by ?? t.createdBy,
  branchId: t.branch_id ?? t.branchId,
  participants: (t.participants || []).map(normalizeParticipant),
});

const GAMES = ['DOTA 2','Fortnite','League of Legends','Free Fire','Counter Strike 2','Valorant'];
const FORMATS = ['1v1','2v2','5v5','battle_royale','squad'];
const STATUSES = { open:'Abierto', closed:'Cerrado', in_progress:'En curso', finished:'Finalizado', cancelled:'Cancelado', draft:'Borrador' };

export function AdminTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', game:'Valorant', format:'5v5', prize:'', prizeAmount:0, maxParticipants:16, scheduledAt:'', description:'', rules:'' });
  const [expandedId, setExpandedId] = useState(null);
  const [participants, setParticipants] = useState({});
  const [loadingParts, setLoadingParts] = useState({});
  const [toast, setToast] = useState('');

  const fetchParticipants = useCallback(async (id) => {
    if (participants[id]) return;
    setLoadingParts(p => ({ ...p, [id]: true }));
    try {
      const { data } = await tournamentService.getById(id);
      setParticipants(prev => ({ ...prev, [id]: (data.data?.participants || []).map(normalizeParticipant) }));
    } catch { setParticipants(prev => ({ ...prev, [id]: [] })); }
    finally { setLoadingParts(p => ({ ...p, [id]: false })); }
  }, [participants]);

  useEffect(() => {
    tournamentService.getAll().then(({ data }) => setTournaments((data.data || []).map(normalizeTournament)))
      .catch(() => {});
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        game: form.game,
        format: form.format,
        prize_text: form.prize,
        prize_amount: Number(form.prizeAmount),
        max_participants: Number(form.maxParticipants),
        scheduled_at: form.scheduledAt,
        description: form.description,
        rules: form.rules,
      };
      const { data } = await adminService.createTournament(payload);
      setTournaments(prev => [normalizeTournament(data.data), ...prev]);
      setShowForm(false);
      showToast('Torneo creado exitosamente.');
    } catch { showToast('Error al crear torneo. Verifica los datos.'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await adminService.updateTournament(id, { status });
      setTournaments(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      showToast('Estado actualizado.');
    } catch { showToast('Error al actualizar.'); }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    fetchParticipants(id);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="font-orbitron font-bold text-2xl">Torneos</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-5 py-2 text-sm self-start sm:self-auto">
          {showForm ? '✕ Cancelar' : '+ Nuevo Torneo'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card-glow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 font-orbitron text-sm" style={{ color: '#8B0000' }}>Crear Nuevo Torneo</div>
          {[['name','Nombre del torneo','text'],['prize','Premio (texto)','text'],['scheduledAt','Fecha y hora','datetime-local']].map(([k,l,t]) => (
            <div key={k}>
              <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>{l}</label>
              <input type={t} required className="input-dark" value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Juego</label>
            <select className="input-dark" value={form.game} onChange={e => setForm(f => ({ ...f, game: e.target.value }))}>
              {GAMES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Formato</label>
            <select className="input-dark" value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))}>
              {FORMATS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Máx. participantes</label>
            <input type="number" className="input-dark" value={form.maxParticipants} onChange={e => setForm(f => ({ ...f, maxParticipants: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Descripción</label>
            <textarea className="input-dark" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="btn-primary px-6 py-2">Crear Torneo</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-6 py-2">Cancelar</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tournaments.map(t => {
          const isExpanded = expandedId === t._id;
          const parts = participants[t._id];
          const partCount = parts?.length ?? t.participants?.length ?? 0;

          return (
            <div key={t._id} className="rounded-xl overflow-hidden transition-all duration-200"
              style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.07)' }}>
              <div className="flex flex-wrap items-center gap-4 p-5 cursor-pointer"
                onClick={() => toggleExpand(t._id)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,192,192,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm flex items-center gap-2">
                    {t.name}
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(139,0,0,0.08)', color: '#8B0000', border: '1px solid rgba(139,0,0,0.2)' }}>
                      {t.game}
                    </span>
                  </div>
                  <div className="text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1" style={{ color: '#8a8a8a' }}>
                    <span>📅 {new Date(t.scheduledAt).toLocaleDateString('es-PE')}</span>
                    <span>👥 {partCount}/{t.maxParticipants}</span>
                    <span>🏅 {t.prize}</span>
                    <span>🎮 {t.format}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select className="input-dark w-auto text-sm py-1.5 px-3"
                    value={t.status} onClick={e => e.stopPropagation()}
                    onChange={e => handleStatus(t._id, e.target.value)}>
                    {Object.entries(STATUSES).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <div className="text-[10px] px-2 py-1 rounded transition-all duration-200"
                    style={{
                      background: 'rgba(139,0,0,0.06)',
                      color: '#8B0000',
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                    }}>
                    ▼
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t transition-all duration-300" style={{ borderColor: 'rgba(192,192,192,0.06)' }}>
                  <div className="p-5">
                    <div className="font-orbitron text-xs tracking-widest uppercase mb-3" style={{ color: '#8B0000' }}>
                      Participantes inscritos {parts ? `(${parts.length})` : ''}
                    </div>
                    {loadingParts[t._id] ? (
                      <div className="text-center py-6 text-sm" style={{ color: '#8a8a8a' }}>Cargando participantes...</div>
                    ) : parts && parts.length > 0 ? (
                      <>
                        {/* Mobile participant cards */}
                        <div className="md:hidden space-y-2">
                          {parts.map((p, i) => (
                            <div key={p._id || i} className="p-3 rounded-lg" style={{ background: '#0D0D0D', border: '1px solid rgba(192,192,192,0.05)' }}>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-bold" style={{ color: '#8a8a8a' }}>#{i + 1}</span>
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                  style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                                  {p.username?.slice(0, 2).toUpperCase()}
                                </div>
                                <span className="font-semibold text-sm">{p.username}</span>
                              </div>
                              <div className="flex gap-3 text-xs" style={{ color: '#8a8a8a' }}>
                                <span>{p.levelIcon} {p.levelName}</span>
                                <span>{p.teamName || '—'}</span>
                                <span>{p.registeredAt ? new Date(p.registeredAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '—'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Desktop participant table */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="w-full" style={{ fontSize: 13 }}>
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(192,192,192,0.06)' }}>
                                <th className="text-left pb-2 pr-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8a8a8a' }}>#</th>
                                <th className="text-left pb-2 pr-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8a8a8a' }}>Usuario</th>
                                <th className="text-left pb-2 pr-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8a8a8a' }}>Nivel</th>
                                <th className="text-left pb-2 pr-3 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8a8a8a' }}>Equipo</th>
                                <th className="text-left pb-2 font-semibold text-xs uppercase tracking-wider" style={{ color: '#8a8a8a' }}>Inscripción</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parts.map((p, i) => (
                                <tr key={p._id || i} style={{ borderBottom: '1px solid rgba(192,192,192,0.03)' }}>
                                  <td className="py-2.5 pr-3 text-xs" style={{ color: '#8a8a8a' }}>{i + 1}</td>
                                  <td className="py-2.5 pr-3 font-medium">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                                        style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                                        {p.username?.slice(0, 2).toUpperCase()}
                                      </div>
                                      {p.username}
                                    </div>
                                  </td>
                                  <td className="py-2.5 pr-3 text-xs">{p.levelIcon} {p.levelName}</td>
                                  <td className="py-2.5 pr-3 text-xs" style={{ color: '#8a8a8a' }}>{p.teamName || '—'}</td>
                                  <td className="py-2.5 text-xs" style={{ color: '#8a8a8a' }}>
                                    {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6 text-sm" style={{ color: '#5a5a5a' }}>
                        Aún no hay participantes inscritos en este torneo.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {tournaments.length === 0 && (
          <div className="card text-center py-10">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-sm" style={{ color: '#8a8a8a' }}>No hay torneos registrados. Crea el primero.</div>
          </div>
        )}
      </div>
      {toast && <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-center md:text-left" style={{ background:'#1A1A1B', border:'1px solid rgba(192,192,192,0.4)', color:'#C0C0C0' }}>{toast}</div>}
    </div>
  );
}
export default AdminTournaments;

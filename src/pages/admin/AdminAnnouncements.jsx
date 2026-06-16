import { useState, useEffect } from 'react';
import { adminService, announcementService } from '../../services/api.service';

const TYPES = { promo:'Promoción', event:'Evento', news:'Noticia', tournament:'Torneo' };
const TYPE_COLORS = { promo:'#8B0000', event:'#C0C0C0', news:'#8a8a8a', tournament:'#8B0000' };

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title:'', body:'', type:'promo', color:'#8B0000', isPinned:false });
  const [toast, setToast] = useState('');

  useEffect(() => {
    announcementService.getAll().then(({ data }) => setAnnouncements(data.data || [])).catch(() => {});
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminService.createAnnouncement(form);
      setAnnouncements(prev => [data.data, ...prev]);
      setForm({ title:'', body:'', type:'promo', color:'#8B0000', isPinned:false });
      showToast('Anuncio publicado exitosamente.');
    } catch { showToast('Error al publicar. Conecta el backend primero.'); }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a._id !== id));
      showToast('Anuncio eliminado.');
    } catch { showToast('Error al eliminar.'); }
  };

  return (
    <div>
      <div className="font-orbitron font-bold text-xl md:text-2xl mb-4 md:mb-6">Anuncios & Eventos</div>

      <form onSubmit={handleCreate} className="card-glow mb-6 space-y-4">
        <div className="font-orbitron text-sm mb-2" style={{ color:'#8B0000' }}>Publicar Nuevo Anuncio</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Título</label>
            <input required className="input-dark" placeholder="Ej: Noche Gamer — Viernes 2x1" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Tipo</label>
            <select className="input-dark" value={form.type} onChange={e => setForm(f => ({ ...f, type:e.target.value, color: TYPE_COLORS[e.target.value] }))}>
              {Object.entries(TYPES).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Contenido</label>
          <textarea required rows={4} className="input-dark" placeholder="Describe el evento, promoción o noticia..."
            value={form.body} onChange={e => setForm(f => ({ ...f, body:e.target.value }))} />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color:'#8a8a8a' }}>
            <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned:e.target.checked }))} />
            Fijar en inicio
          </label>
          <button type="submit" className="btn-primary px-6 py-2">Publicar Anuncio</button>
        </div>
      </form>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color:'#8a8a8a' }}>No hay anuncios publicados aún.</div>
        ) : (
          announcements.map(a => (
            <div key={a._id} className="card flex items-start gap-4"
              style={{ borderLeft:`4px solid ${a.color || '#8B0000'}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{a.title}</span>
                  {a.isPinned && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background:'rgba(139,0,0,0.1)', color:'#8B0000' }}>Fijado</span>}
                  <span className="text-xs" style={{ color:'#5a5a5a' }}>{TYPES[a.type]}</span>
                </div>
                <div className="text-sm leading-relaxed" style={{ color:'#8a8a8a' }}>{a.body}</div>
                <div className="text-xs mt-2" style={{ color:'#5a5a5a' }}>{new Date(a.createdAt).toLocaleDateString('es-PE', { year:'numeric', month:'long', day:'numeric' })}</div>
              </div>
              <button onClick={() => handleDelete(a._id)} className="text-xs px-3 py-1 rounded flex-shrink-0 mt-1"
                style={{ background:'rgba(139,0,0,0.08)', color:'#8B0000', border:'1px solid rgba(139,0,0,0.2)' }}>
                Eliminar
              </button>
            </div>
          ))
        )}
      </div>
      {toast && <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-center md:text-left" style={{ background:'#1A1A1B', border:'1px solid rgba(192,192,192,0.4)', color:'#C0C0C0' }}>{toast}</div>}
    </div>
  );
}

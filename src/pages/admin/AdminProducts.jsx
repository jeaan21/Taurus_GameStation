import { useState, useEffect } from 'react';
import { adminService, shopService } from '../../services/api.service';

const CATS = ['accessory','snack','beverage','merchandise','gaming_time','collectible'];
const CAT_LABELS = { accessory:'Accesorio', snack:'Snack', beverage:'Bebida', merchandise:'Merch', gaming_time:'Tiempo juego', collectible:'Coleccionable' };

const FALLBACK = [
  { _id:'1', name:'Control Xbox', category:'accessory', pointsCost:500, icon:'🎮', stock:5, isActive:true, totalRedeemed:12 },
  { _id:'2', name:'Auriculares Gaming', category:'accessory', pointsCost:350, icon:'🎧', stock:8, isActive:true, totalRedeemed:7 },
  { _id:'3', name:'Figura Gamer', category:'collectible', pointsCost:200, icon:'🏆', stock:10, isActive:true, totalRedeemed:4 },
  { _id:'4', name:'Polo TAURUS', category:'merchandise', pointsCost:80, icon:'👕', stock:20, isActive:true, totalRedeemed:15 },
  { _id:'5', name:'Snack Pack', category:'snack', pointsCost:15, icon:'🍫', stock:-1, isActive:true, totalRedeemed:88 },
];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', category:'accessory', pointsCost:'', icon:'🎁', stock:-1, description:'' });
  const [toast, setToast] = useState('');

  useEffect(() => {
    shopService.getProducts().then(({ data }) => setProducts(data.data?.length ? data.data : FALLBACK))
      .catch(() => setProducts(FALLBACK));
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminService.createProduct({ ...form, pointsCost: Number(form.pointsCost), stock: Number(form.stock) });
      setProducts(prev => [data.data, ...prev]);
      setShowForm(false);
      showToast('Producto creado.');
    } catch { showToast('Error al crear producto.'); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await (isActive ? adminService.deleteProduct(id) : adminService.updateProduct(id, { isActive: true }));
      setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: !isActive } : p));
      showToast(isActive ? 'Producto desactivado.' : 'Producto activado.');
    } catch { showToast('Error.'); }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="font-orbitron font-bold text-xl md:text-2xl">Catálogo de Productos</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-5 py-2 text-sm self-start sm:self-auto">
          {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card-glow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 font-orbitron text-sm" style={{ color:'#8B0000' }}>Nuevo Producto</div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Nombre</label>
            <input required className="input-dark" value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Categoría</label>
            <select className="input-dark" value={form.category} onChange={e => setForm(f => ({ ...f, category:e.target.value }))}>
              {CATS.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Costo (pts)</label>
            <input type="number" required min="1" className="input-dark" value={form.pointsCost} onChange={e => setForm(f => ({ ...f, pointsCost:e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Ícono (emoji)</label>
            <input className="input-dark" maxLength={4} value={form.icon} onChange={e => setForm(f => ({ ...f, icon:e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color:'#8a8a8a' }}>Stock (-1 = ilimitado)</label>
            <input type="number" min="-1" className="input-dark" value={form.stock} onChange={e => setForm(f => ({ ...f, stock:e.target.value }))} />
          </div>
          <div className="md:col-span-3 flex gap-3">
            <button type="submit" className="btn-primary px-6 py-2">Crear</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost px-6 py-2">Cancelar</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        {/* Mobile cards */}
        <div className="md:hidden space-y-2">
          {products.map(p => (
            <div key={p._id} className="p-3 rounded-xl" style={{ background: '#0D0D0D', border: '1px solid rgba(192,192,192,0.06)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.name}</div>
                  <div className="text-xs" style={{ color: '#8a8a8a' }}>{CAT_LABELS[p.category] || p.category}</div>
                </div>
                <span className={p.isActive ? 'badge-active' : 'badge-closed'}>{p.isActive ? 'Activo' : 'Inactivo'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: '#8a8a8a' }}>
                <span className="font-orbitron font-bold" style={{ color: '#8B0000' }}>{p.pointsCost} pts</span>
                <span>Stock: {p.stock === -1 ? '∞' : p.stock}</span>
                <span>Canjeados: {p.totalRedeemed || 0}</span>
                <button onClick={() => handleToggle(p._id, p.isActive)} className="ml-auto text-xs px-3 py-1 rounded transition-all"
                  style={{ background: p.isActive ? 'rgba(139,0,0,0.08)' : 'rgba(192,192,192,0.08)', color: p.isActive ? '#8B0000' : '#C0C0C0', border: `1px solid ${p.isActive ? 'rgba(139,0,0,0.2)' : 'rgba(192,192,192,0.2)'}` }}>
                  {p.isActive ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop table */}
        <table className="hidden md:table w-full" style={{ fontSize:14, minWidth:500 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(192,192,192,0.07)' }}>
              {['Producto','Categoría','Puntos','Stock','Canjeados','Estado','Acción'].map(h => (
                <th key={h} className="text-left pb-3 pr-4 text-xs uppercase tracking-wider font-semibold" style={{ color:'#8a8a8a' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} style={{ borderBottom:'1px solid rgba(192,192,192,0.04)' }}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon}</span>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm" style={{ color:'#8a8a8a' }}>{CAT_LABELS[p.category] || p.category}</td>
                <td className="py-3 pr-4 font-orbitron font-bold text-sm" style={{ color:'#8B0000' }}>{p.pointsCost}</td>
                <td className="py-3 pr-4 text-sm" style={{ color:'#8a8a8a' }}>{p.stock === -1 ? '∞' : p.stock}</td>
                <td className="py-3 pr-4 text-sm" style={{ color:'#8a8a8a' }}>{p.totalRedeemed || 0}</td>
                <td className="py-3 pr-4">
                  <span className={p.isActive ? 'badge-active' : 'badge-closed'}>{p.isActive ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td className="py-3">
                  <button onClick={() => handleToggle(p._id, p.isActive)} className="text-xs px-3 py-1 rounded transition-all"
                    style={{ background: p.isActive ? 'rgba(139,0,0,0.08)' : 'rgba(192,192,192,0.08)', color: p.isActive ? '#8B0000' : '#C0C0C0', border: `1px solid ${p.isActive ? 'rgba(139,0,0,0.2)' : 'rgba(192,192,192,0.2)'}` }}>
                    {p.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-center md:text-left" style={{ background:'#1A1A1B', border:'1px solid rgba(192,192,192,0.4)', color:'#C0C0C0' }}>{toast}</div>}
    </div>
  );
}

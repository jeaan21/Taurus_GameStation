import { useEffect, useState } from 'react';
import { shopService } from '../services/api.service';
import { useAuth } from '../context/AuthContext';

const FALLBACK_PRODUCTS = [
  { _id: '1', name: 'Control Xbox', category: 'accessory', pointsCost: 500, icon: '🎮', stock: 5 },
  { _id: '2', name: 'Auriculares Gaming', category: 'accessory', pointsCost: 350, icon: '🎧', stock: 8 },
  { _id: '3', name: 'Figura Gamer', category: 'collectible', pointsCost: 200, icon: '🏆', stock: 10 },
  { _id: '4', name: 'Mouse Pad XL', category: 'accessory', pointsCost: 120, icon: '🖱️', stock: 15 },
  { _id: '5', name: 'Polo TAURUS', category: 'merchandise', pointsCost: 80, icon: '👕', stock: 20 },
  { _id: '6', name: '1 Hora PLATINUM', category: 'gaming_time', pointsCost: 30, icon: '🎁', stock: -1 },
  { _id: '7', name: 'Energizante Monster', category: 'beverage', pointsCost: 10, icon: '⚡', stock: -1 },
  { _id: '8', name: 'Snack Pack', category: 'snack', pointsCost: 15, icon: '🍫', stock: -1 },
];

const CAT_LABELS = { accessory: 'Accesorio', collectible: 'Coleccionable', merchandise: 'Merch', gaming_time: 'Tiempo de juego', beverage: 'Bebida', snack: 'Snack' };

export default function Shop() {
  const { user, updateUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [toast, setToast] = useState({ msg: '', ok: true });

  useEffect(() => {
    shopService.getProducts().then(({ data }) => setProducts(data.data?.length ? data.data : FALLBACK_PRODUCTS))
      .catch(() => setProducts(FALLBACK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast({ msg: '', ok: true }), 3500); };

  const handleRedeem = async (product) => {
    if (user.points < product.pointsCost) { showToast(`Necesitas ${product.pointsCost - user.points} pts más.`, false); return; }
    setRedeeming(product._id);
    try {
      await shopService.redeem(product._id);
      updateUser({ points: user.points - product.pointsCost });
      showToast(`¡Canjeo de "${product.name}" exitoso! Retira en caja.`, true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al canjear.', false);
    } finally { setRedeeming(null); }
  };

  const cats = ['all', ...new Set(products.map(p => p.category))];
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.03) 0%, transparent 70%)' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="section-tag">Recompensas</div>
      <h1 className="section-title">Tienda de Puntos</h1>

      <div className="rounded-xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4"
        style={{ background: 'linear-gradient(135deg,rgba(139,0,0,0.08),rgba(139,0,0,0.03))', border: '1px solid rgba(139,0,0,0.2)' }}>
        <div>
          <div className="text-sm" style={{ color: '#8a8a8a' }}>Tus puntos disponibles</div>
          <div className="text-xs mt-0.5" style={{ color: '#5a5a5a' }}>1 hora = 1–3 puntos según tu plan</div>
        </div>
        <div className="text-right">
          <div className="font-orbitron font-black text-4xl" style={{ color: '#8B0000' }}>{user?.points || 0}</div>
          <div className="text-xs uppercase tracking-widest" style={{ color: '#8a8a8a' }}>puntos</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all"
            style={{ background: filter === c ? 'rgba(139,0,0,0.12)' : 'rgba(192,192,192,0.04)', border: filter === c ? '1px solid rgba(139,0,0,0.4)' : '1px solid rgba(192,192,192,0.07)', color: filter === c ? '#8B0000' : '#8a8a8a' }}>
            {c === 'all' ? 'Todos' : CAT_LABELS[c] || c}
          </button>
        ))}
      </div>

      {loading ? <div className="text-center py-20" style={{ color: '#8a8a8a' }}>Cargando tienda...</div> : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map(p => {
            const canAfford = (user?.points || 0) >= p.pointsCost;
            const outOfStock = p.stock === 0;
            return (
              <div key={p._id} className="rounded-xl p-4 text-center transition-all duration-200"
                style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.07)' }}
                onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.borderColor = 'rgba(139,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(192,192,192,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div className="text-4xl mb-2">{p.icon}</div>
                <div className="font-bold text-sm mb-0.5">{p.name}</div>
                <div className="text-xs mb-3" style={{ color: '#8a8a8a' }}>{CAT_LABELS[p.category] || p.category}</div>
                <div className="font-orbitron font-bold text-lg mb-3" style={{ color: '#8B0000' }}>
                  {p.pointsCost} <span className="text-xs font-normal" style={{ color: '#8a8a8a', fontFamily: 'inherit' }}>pts</span>
                </div>
                <button onClick={() => handleRedeem(p)} disabled={!canAfford || outOfStock || redeeming === p._id}
                  className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                  style={{
                    background: outOfStock ? 'rgba(192,192,192,0.04)' : canAfford ? 'rgba(139,0,0,0.08)' : 'rgba(192,192,192,0.04)',
                    border: outOfStock ? '1px solid rgba(192,192,192,0.06)' : canAfford ? '1px solid rgba(139,0,0,0.25)' : '1px solid rgba(192,192,192,0.06)',
                    color: outOfStock ? '#5a5a5a' : canAfford ? '#8B0000' : '#5a5a5a',
                    cursor: (!canAfford || outOfStock) ? 'not-allowed' : 'pointer',
                  }}>
                  {redeeming === p._id ? '...' : outOfStock ? 'Agotado' : canAfford ? 'Canjear' : 'Sin pts'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {toast.msg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold"
          style={{ background: '#1A1A1B', border: `1px solid ${toast.ok ? 'rgba(192,192,192,0.4)' : 'rgba(139,0,0,0.4)'}`, color: toast.ok ? '#C0C0C0' : '#cc0000' }}>
          {toast.msg}
        </div>
      )}
      </div>
    </div>
  );
}

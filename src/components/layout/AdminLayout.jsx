import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const sideLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/users', label: 'Usuarios', icon: '👥' },
  { to: '/admin/tournaments', label: 'Torneos', icon: '🏆' },
  { to: '/admin/products', label: 'Productos', icon: '🛍️' },
  { to: '/admin/announcements', label: 'Anuncios', icon: '📢' },
  { to: '/admin/stats', label: 'Estadísticas', icon: '📈' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = async () => { await logout(); navigate('/'); };

  const sidebar = (
    <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#1A1A1B', borderRight: '1px solid rgba(192,192,192,0.06)', minHeight: '100vh' }}>
      <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: 'rgba(139,0,0,0.2)' }}>
        <img src="./img/logo_solo.png" alt="Taurus" className="h-7 w-auto" />
        <div>
          <div className="font-orbitron font-black text-sm" style={{ color: '#8B0000' }}>TAURUS</div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: '#8a8a8a' }}>Panel Admin</div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {sideLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${isActive ? 'bg-[rgba(139,0,0,0.12)] text-[#8B0000]' : 'text-[#8a8a8a] hover:bg-white/5 hover:text-white'}`}>
            <span>{l.icon}</span>{l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(192,192,192,0.06)' }}>
        <div className="text-sm font-semibold mb-1">{user?.username}</div>
        <div className="text-xs mb-3 uppercase tracking-widest" style={{ color: '#8a8a8a' }}>{user?.role}</div>
        <button onClick={handleLogout} className="w-full btn-outline text-xs py-1.5">Cerrar sesión</button>
        <NavLink to="/" onClick={() => setSidebarOpen(false)} className="block text-center text-xs mt-2 transition-colors" style={{ color: '#8a8a8a' }}>← Ir al sitio</NavLink>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0D0D0D' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full max-w-56">{sidebar}</div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto min-w-0">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden flex items-center gap-2 mb-4 px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-white/5" style={{ color: '#8a8a8a' }}>
            <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
            Menú Admin
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

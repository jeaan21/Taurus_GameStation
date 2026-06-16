import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/tournaments', label: 'Torneos' },
    { to: '/ranking', label: 'Ranking' },
    ...(user ? [{ to: '/shop', label: 'Tienda' }, { to: '/profile', label: 'Mi Perfil' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: '⚙ Admin' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav style={{ background: 'rgba(13,13,13,0.97)', borderBottom: '1px solid rgba(139,0,0,0.2)', backdropFilter: 'blur(12px)' }}
        className="fixed top-0 left-0 right-0 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="./img/logo_solo.png" alt="Taurus" className="h-8 w-auto" />
            <span className="font-orbitron font-black text-lg tracking-widest hidden sm:block neon-text">TAURUS</span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-1.5 rounded text-sm font-semibold tracking-wider uppercase transition-all duration-150 ${pathname === l.to ? 'text-[#8B0000] bg-[rgba(139,0,0,0.08)]' : 'text-[#8a8a8a] hover:text-[#C0C0C0] hover:bg-white/5'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2" style={{ color: '#8B0000' }}>
                  <span className="font-orbitron text-sm font-bold">{user.points}</span>
                  <span className="text-xs" style={{ color: '#8a8a8a' }}>pts</span>
                </div>
                <button onClick={handleLogout} className="btn-outline text-xs px-4 py-1.5">Salir</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Ingresar</Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2">Registrarse</Link>
              </>
            )}
          </div>
          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2" style={{ color: '#C0C0C0' }}>
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: '#C0C0C0' }}></span>
              <span className={`block w-6 h-0.5 transition-all ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#C0C0C0' }}></span>
              <span className={`block w-6 h-0.5 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: '#C0C0C0' }}></span>
            </div>
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: 'rgba(13,13,13,0.98)', borderTop: '1px solid rgba(139,0,0,0.15)' }} className="md:hidden py-3 px-4 space-y-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded text-sm font-semibold uppercase tracking-wider"
                style={{ color: pathname === l.to ? '#8B0000' : '#8a8a8a' }}>
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t" style={{ borderColor: 'rgba(192,192,192,0.06)' }}>
              {user ? (
                <button onClick={handleLogout} className="w-full btn-outline text-sm py-2 mt-1">Cerrar sesión</button>
              ) : (
                <div className="flex gap-2 mt-1">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 btn-ghost text-center text-sm py-2">Ingresar</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 btn-primary text-center text-sm py-2">Registrarse</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#1A1A1B', borderTop: '1px solid rgba(192,192,192,0.06)' }} className="py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="./img/logo_solo.png" alt="Taurus" className="h-8 w-auto" />
              <span className="font-orbitron font-black text-lg tracking-widest neon-text">TAURUS</span>
            </div>
            <p className="text-sm" style={{ color: '#8a8a8a', lineHeight: 1.7 }}>El mejor LAN Center de Cerro de Pasco. PCs de última generación, torneos y sistema de fidelización.</p>
          </div>
          <div>
            <div className="font-orbitron text-xs tracking-widest uppercase mb-3" style={{ color: '#8B0000' }}>Navegación</div>
            <div className="space-y-1.5 text-sm" style={{ color: '#8a8a8a' }}>
              <Link to="/" className="block hover:text-white transition-colors">Inicio</Link>
              <Link to="/tournaments" className="block hover:text-white transition-colors">Torneos</Link>
              <Link to="/ranking" className="block hover:text-white transition-colors">Ranking</Link>
              <Link to="/shop" className="block hover:text-white transition-colors">Tienda de Puntos</Link>
            </div>
          </div>
          <div>
            <div className="font-orbitron text-xs tracking-widest uppercase mb-3" style={{ color: '#8B0000' }}>Horarios</div>
            <div className="text-sm space-y-1" style={{ color: '#8a8a8a' }}>
              <div>Lunes a Viernes: 8am – 12am</div>
              <div>Fines de semana: 8am – 2am</div>
              <div className="mt-2" style={{ color: '#C0C0C0' }}>● Abierto ahora</div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 text-center text-xs" style={{ color: '#5a5a5a', borderTop: '1px solid rgba(192,192,192,0.04)' }}>
          © 2025 Taurus Games Station. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

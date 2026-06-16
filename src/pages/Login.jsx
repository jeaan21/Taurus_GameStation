import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="./img/logo_solo.png" alt="Taurus" className="h-12 mx-auto mb-4" />
          <div className="font-orbitron font-black text-3xl neon-text mb-2">Ingresar</div>
          <p style={{ color: '#8a8a8a' }}>Bienvenido de vuelta, gamer.</p>
        </div>
        <form onSubmit={handleSubmit} className="card-glow space-y-4">
          {error && <div className="text-sm px-4 py-3 rounded-lg" style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)', color: '#cc0000' }}>{error}</div>}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#8a8a8a' }}>Usuario o correo</label>
            <input className="input-dark" value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} placeholder="shadowgamer99" required />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#8a8a8a' }}>Contraseña</label>
            <input type="password" className="input-dark" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="text-center text-sm" style={{ color: '#8a8a8a' }}>
            ¿No tienes cuenta? <Link to="/register" style={{ color: '#8B0000' }}>Regístrate gratis</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="./img/logo_solo.png" alt="Taurus" className="h-12 mx-auto mb-4" />
          <div className="font-orbitron font-black text-3xl neon-text mb-2">Crear Cuenta</div>
          <p style={{ color: '#8a8a8a' }}>Únete a Taurus Games Station y empieza a ganar puntos.</p>
        </div>
        <form onSubmit={handleSubmit} className="card-glow space-y-4">
          {error && <div className="text-sm px-4 py-3 rounded-lg" style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)', color: '#cc0000' }}>{error}</div>}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#8a8a8a' }}>Nombre de usuario</label>
            <input className="input-dark" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="shadowgamer99" required minLength={3} />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#8a8a8a' }}>Correo electrónico</label>
            <input type="email" className="input-dark" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="gamer@email.com" required />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#8a8a8a' }}>Contraseña</label>
            <input type="password" className="input-dark" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
            {loading ? 'Creando cuenta...' : 'Registrarse gratis'}
          </button>
          <p className="text-center text-sm" style={{ color: '#8a8a8a' }}>
            ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#8B0000' }}>Ingresar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;

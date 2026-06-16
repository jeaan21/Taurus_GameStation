import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center">
      <div className="font-orbitron font-black text-8xl mb-4 neon-text">404</div>
      <div className="font-orbitron text-2xl mb-3">Página no encontrada</div>
      <p className="mb-8 max-w-md" style={{ color: '#8a8a8a' }}>La ruta que buscas no existe en esta dimensión. Vuelve al inicio y sigue jugando.</p>
      <Link to="/" className="btn-primary px-8 py-3">← Volver al inicio</Link>
    </div>
  );
}

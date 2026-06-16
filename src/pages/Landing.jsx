import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { announcementService } from '../services/api.service';

const PLANS = [
  { name: 'VIP', price: 'S/ 1.50', per: 'por hora', icon: '🖥️', pts: '1 punto/hora', featured: false,
    features: ['PC gaming estándar', 'Teclado y mouse gaming', 'Auriculares incluidos', '1 punto por hora jugada'] },
  { name: 'SUPER VIP', price: 'S/ 2.50', per: 'por hora', icon: '⚡', pts: '2 puntos/hora', featured: true,
    features: ['PC de alta gama', 'Monitor 144Hz', 'Silla gaming premium', '2 puntos por hora', 'Snack de bienvenida'] },
  { name: 'PLATINUM', price: 'S/ 3.00', per: 'por hora', icon: '💎', pts: '3 puntos/hora', featured: false,
    features: ['PC RTX 4090', 'Monitor 240Hz curved', 'Zona privada VIP', '3 puntos por hora', 'Bebida + snack incluido'] },
];

const GAMES = [
  { name: 'DOTA 2', genre: 'MOBA · Estrategia', img: './img/dota_2.png', desc: 'Batallas 5v5. Destruye el ancient enemigo con tu equipo.' },
  { name: 'Fortnite', genre: 'Battle Royale', img: './img/FORNITE.jpg', desc: 'Construye, lucha y sé el último en pie.' },
  { name: 'League of Legends', genre: 'MOBA · Competitivo', img: './img/league-of-legends.jpg', desc: 'El MOBA más competitivo del mundo.' },
  { name: 'Free Fire', genre: 'Battle Royale', img: './img/FREE_FIRE.jpg', desc: 'Combates rápidos de 4 min. 50 jugadores, un ganador.' },
  { name: 'Counter Strike 2', genre: 'FPS · Táctico', img: './img/counter_strick2.jpeg', desc: 'FPS táctico por excelencia. Apunta, cubre, gana.' },
  { name: 'Valorant', genre: 'FPS · Agentes', img: './img/Valorant.jpg', desc: 'FPS táctico con agentes de habilidades únicas.' },
];

const TOURNAMENTS = [
  {
    game: 0, prize: 'S/ 800', date: '15 Jun 2026', spots: 16, filled: 11, status: 'open',
    color: '#0B4A3B', accent: '#1B9E6B', glow: 'rgba(27,158,107,0.15)',
    theme: '🌿', label: 'The Ancient Wars', desc: 'Torneo 5v5 • Eliminación directa • Bo3 final',
    anim: 'tournFloat1',
  },
  {
    game: 1, prize: 'S/ 600', date: '22 Jun 2026', spots: 24, filled: 18, status: 'open',
    color: '#7C3AED', accent: '#A855F7', glow: 'rgba(168,85,247,0.15)',
    theme: '🌀', label: 'Storm Cup', desc: 'Solo/Duo • Battle Royale • Puntos por partida',
    anim: 'tournFloat2',
  },
  {
    game: 2, prize: 'S/ 1000', date: '28 Jun 2026', spots: 16, filled: 8, status: 'open',
    color: '#C8A951', accent: '#F0D060', glow: 'rgba(200,169,81,0.15)',
    theme: '👑', label: 'Rift Champions', desc: 'Torneo 5v5 • Draft pick • Fase de grupos + playoffs',
    anim: 'tournFloat3',
  },
  {
    game: 3, prize: 'S/ 400', date: '1 Jul 2026', spots: 20, filled: 20, status: 'closed',
    color: '#EA580C', accent: '#FF6B35', glow: 'rgba(255,107,53,0.15)',
    theme: '🔥', label: 'Firestorm Clash', desc: 'Sala personalizada • 4 equipos • Eliminación',
    anim: 'tournFloat4',
  },
  {
    game: 4, prize: 'S/ 700', date: '5 Jul 2026', spots: 16, filled: 14, status: 'open',
    color: '#D97706', accent: '#F59E0B', glow: 'rgba(245,158,11,0.15)',
    theme: '🎯', label: 'Tactical Strike', desc: '5v5 • MR12 • 2 bans por equipo',
    anim: 'tournFloat5',
  },
  {
    game: 5, prize: 'S/ 900', date: '12 Jul 2026', spots: 16, filled: 5, status: 'upcoming',
    color: '#DC2626', accent: '#EF4444', glow: 'rgba(239,68,68,0.15)',
    theme: '⚔️', label: 'Agent Showdown', desc: '5v5 • Bo1 grupos • Bo3 eliminatorias',
    anim: 'tournFloat6',
  },
];

const SNACKS = [
  { name: 'Lays', desc: 'Papas doradas crujientes para mantener el ánimo en largas travesías.', price: 'S/3', img: './img/lays.png' },
  { name: 'Cuates', desc: 'Tiras crujientes de maíz bañadas en especias secretas.', price: 'S/3', img: './img/cuates.png' },
  { name: 'MENÚ', desc: 'Combos de provisiones para el héroe decidido.', price: 'desde S/5', img: './img/cambio de chips.webp', menu: true },
  { name: 'Chocolates', desc: 'Dulce maná que restaura la energía perdida.', price: 'S/4', img: './img/chocolate.png' },
  { name: 'Galletas', desc: 'Raciones de campaña con un toque dulce.', price: 'S/2.50', img: './img/galletas.jpg' },
  { name: 'Agua', desc: 'Agua pura de manantial para hidratar al guerrero.', price: 'S/1.50', img: './img/agua.jpg' },
  { name: 'Gaseosas', desc: 'Poción burbujeante que revitaliza los sentidos.', price: 'S/2.50', img: './img/gaseosa.jpg' },
  { name: 'Energizantes', desc: 'Poción de celeridad embotellada para reflejos sobrehumanos.', price: 'S/4', img: './img/energisantes.jpg' },
];

const STATS = [{ num: '30+', label: 'PCs Gaming' }, { num: '6', label: 'Juegos Top' }, { num: '500+', label: 'Gamers' }, { num: '24/7', label: 'Disponible' }];

const SectionGradient = ({ children, className = '' }) => (
  <section className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0" style={{
      background: 'radial-gradient(ellipse 120% 80% at 50% 0%, rgba(139,0,0,0.04) 0%, transparent 70%)',
    }} />
    <div className="relative z-10">{children}</div>
  </section>
);

export default function Landing() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    announcementService.getAll().then(({ data }) => setAnnouncements(data.data || [])).catch(() => {});
  }, []);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden px-6 py-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(./img/fondo_principal.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.5) 50%, rgba(26,26,27,0.85) 100%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(139,0,0,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 60%, rgba(139,0,0,0.08) 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6"
              style={{ background: 'rgba(139,0,0,0.1)', border: '1px solid rgba(139,0,0,0.3)', color: '#8B0000' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] animate-pulse" />
              Abierto Ahora · Cerro de Pasco
            </div>
            <h1 className="font-orbitron font-black leading-[1.1] mb-5" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)' }}>
              <span style={{ color: '#C0C0C0' }}>EL MEJOR</span><br />
              <span className="neon-text">LAN CENTER</span><br />
              <span style={{ color: '#C0C0C0' }}>DE LA REGIÓN</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#8a8a8a', maxWidth: 480 }}>
              PCs de última generación, torneos épicos y un sistema de fidelización que te premia por cada hora de juego.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/register" className="btn-primary text-base px-8 py-3">▶ Empieza Ahora</Link>
              <Link to="/tournaments" className="btn-outline text-base px-8 py-3">Ver Torneos</Link>
            </div>
            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-orbitron font-bold text-2xl" style={{ color: '#8B0000' }}>{s.num}</div>
                  <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: '#8a8a8a' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLANES ─── */}
      <SectionGradient>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="section-tag">Precios</div>
          <h2 className="section-title">Elige tu Plan</h2>
          <p className="section-sub">Accede a la experiencia gaming que mereces.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 relative overflow-hidden transition-transform duration-200 hover:-translate-y-1`}
                style={{
                  background: plan.featured ? 'linear-gradient(145deg,#1A1A1B,#252526)' : '#1A1A1B',
                  border: plan.featured ? '1px solid rgba(139,0,0,0.5)' : '1px solid rgba(192,192,192,0.08)',
                }}>
                {plan.featured && (
                  <div className="absolute top-4 -right-8 text-[10px] font-black tracking-widest uppercase px-10 py-1 rotate-[35deg]"
                    style={{ background: 'linear-gradient(135deg,#8B0000,#cc0000)', color: '#fff' }}>
                    Popular
                  </div>
                )}
                <div className="text-3xl mb-3">{plan.icon}</div>
                <div className="font-orbitron font-bold text-base tracking-widest mb-2">{plan.name}</div>
                <div className="font-orbitron font-black text-4xl mb-0.5" style={{ color: '#8B0000' }}>{plan.price}</div>
                <div className="text-sm mb-5" style={{ color: '#8a8a8a' }}>{plan.per} · {plan.pts}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm" style={{ color: '#8a8a8a' }}>
                      <span style={{ color: '#8B0000', fontSize: 10 }}>▸</span>{f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block w-full text-center py-2.5 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${plan.featured ? 'btn-primary' : 'btn-outline'}`}>
                  Seleccionar
                </Link>
              </div>
            ))}
          </div>
        </section>
      </SectionGradient>

      {/* ─── JUEGOS ─── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(139,0,0,0.02) 0%, transparent 50%, rgba(139,0,0,0.02) 100%)' }}>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="section-tag">Juegos</div>
          <h2 className="section-title">Arena de Batalla</h2>
          <p className="section-sub">Los títulos más populares, siempre actualizados.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map((g) => (
              <div key={g.name} className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
                style={{ background: '#1A1A1B', border: '1px solid rgba(192,192,192,0.06)' }}>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={g.img} alt={g.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ borderBottom: '1px solid rgba(192,192,192,0.06)' }} />
                  <div className="absolute inset-0" style={{
                    background: 'linear-gradient(0deg, rgba(26,26,27,0.9) 0%, transparent 50%)',
                  }} />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,0,0,0.2)', border: '1px solid rgba(139,0,0,0.3)', color: '#C0C0C0' }}>
                      {g.genre}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="font-orbitron font-bold text-sm tracking-wide mb-1">{g.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#8a8a8a' }}>{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ─── SNACKS (TABERNA DEL MERCADER) ─── */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 60% at 50% 50%, rgba(212,135,44,0.06) 0%, rgba(139,0,0,0.02) 40%, transparent 80%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(240,192,64,0.03) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212,135,44,0.03) 0%, transparent 50%)',
        }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-2xl mb-2">🏕️</span>
            <div className="font-orbitron font-black text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#D4872C' }}>Taberna del Mercader</div>
            <h2 className="font-orbitron font-black text-3xl sm:text-4xl mb-3" style={{ color: '#F0C040' }}>El Almacén del Aventurero</h2>
            <p className="text-sm" style={{ color: '#b8946a' }}>Provisiones de batalla para tu próxima misión.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SNACKS.map((s) => (
              <div key={s.name} className="rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: s.menu
                    ? 'linear-gradient(135deg, rgba(40,25,10,0.9), rgba(30,18,8,0.95))'
                    : 'linear-gradient(145deg, rgba(40,25,10,0.6), rgba(30,18,8,0.4))',
                  border: s.menu
                    ? '1px solid rgba(212,135,44,0.3)'
                    : '1px solid rgba(212,135,44,0.12)',
                  boxShadow: s.menu
                    ? '0 0 30px rgba(212,135,44,0.1), inset 0 0 40px rgba(212,135,44,0.03)'
                    : '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                <div className={`relative mx-auto mb-3 ${s.menu ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-16 h-16'}`}>
                  {s.menu && (
                    <div className="absolute inset-0 rounded-full" style={{
                      background: 'conic-gradient(from 0deg, #D4872C, #F0C040, #8B6914, #D4872C)',
                      mask: 'radial-gradient(circle, transparent 58%, black 60%)',
                      WebkitMask: 'radial-gradient(circle, transparent 58%, black 60%)',
                    }} />
                  )}
                  <div className={`absolute inset-0 rounded-full overflow-hidden ${s.menu ? 'inset-1' : ''}`}
                    style={{
                      border: s.menu ? '2px solid rgba(212,135,44,0.3)' : '1px solid rgba(212,135,44,0.2)',
                      boxShadow: '0 0 16px rgba(212,135,44,0.06)',
                    }}>
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  {s.menu && (
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px]"
                      style={{ background: 'linear-gradient(135deg, #D4872C, #F0C040)', color: '#1A1A1B' }}>
                      👑
                    </div>
                  )}
                </div>
                <div className="font-orbitron font-bold text-xs tracking-wide mb-1" style={{ color: '#F0C040' }}>{s.name}</div>
                <div className="text-[10px] leading-relaxed mb-2 px-1" style={{ color: '#b8946a' }}>{s.desc}</div>
                <div className="font-bold text-xs" style={{ color: '#D4872C' }}>
                  {s.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TORNEOS ─── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(139,0,0,0.02) 0%, transparent 50%, rgba(139,0,0,0.02) 100%)' }}>
        <style>{`
          @keyframes tournFloat1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes tournFloat2 { 0%,100% { transform: translateY(0) rotate(-0.5deg); } 50% { transform: translateY(-8px) rotate(0.5deg); } }
          @keyframes tournFloat3 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          @keyframes tournFloat4 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          @keyframes tournFloat5 { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
          @keyframes tournFloat6 { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-7px) scale(1.01); } }
          @keyframes tournPulse2 { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
          @keyframes tournPulse5 { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          @keyframes fireGlow { 0%,100% { box-shadow: 0 0 8px rgba(255,107,53,0.2); } 50% { box-shadow: 0 0 25px rgba(255,107,53,0.5), 0 0 60px rgba(255,107,53,0.15); } }
          @keyframes spinGlow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes slideUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        `}</style>
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-tag">Torneos</div>
            <h2 className="section-title">Liga de Campeones</h2>
            <p className="section-sub">Demuestra tu valía. La gloria espera a los mejores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {TOURNAMENTS.map((t) => {
              const game = GAMES[t.game];
              const pct = Math.round((t.filled / t.spots) * 100);
              const statusColor = t.status === 'open' ? '#22C55E' : t.status === 'upcoming' ? '#F59E0B' : '#EF4444';
              const statusLabel = t.status === 'open' ? 'Abierto' : t.status === 'upcoming' ? 'Próximo' : 'Cerrado';

              return (
                <div key={t.label} className="group relative rounded-2xl overflow-hidden transition-all duration-500"
                  style={{ animation: `${t.anim} ${[6,7,5,4,8,5.5][t.game]}s ease-in-out infinite` }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-[2deg]" />
                    <div className="absolute inset-0" style={{
                      background: `linear-gradient(180deg, transparent 20%, ${t.color}DD 100%)`,
                    }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `linear-gradient(135deg, ${t.accent}22, transparent 60%)`,
                    }} />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-xs px-3 py-1 rounded-full backdrop-blur-sm font-bold"
                        style={{ background: `${t.color}33`, border: `1px solid ${t.accent}55`, color: t.accent }}>
                        {t.theme} {game.name}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full backdrop-blur-sm font-bold flex items-center gap-1.5"
                        style={{ background: `${statusColor}22`, border: `1px solid ${statusColor}55`, color: statusColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor, animation: t.status === 'open' ? 'tournPulse2 1.5s infinite' : 'none' }} />
                        {statusLabel}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 text-center">
                      <div className="text-2xl font-black font-orbitron" style={{ color: t.accent, textShadow: `0 0 20px ${t.glow}` }}>
                        {t.prize}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest" style={{ color: `${t.accent}AA` }}>Premio</div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="font-orbitron font-bold text-sm mb-1" style={{ color: '#F5F5F5' }}>{t.label}</div>
                      <div className="text-[11px] mb-2" style={{ color: `${t.accent}BB` }}>{t.desc}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px]" style={{ color: '#C0C0C0' }}>📅 {t.date}</span>
                          <span className="text-[11px]" style={{ color: '#C0C0C0' }}>👥 {t.filled}/{t.spots}</span>
                        </div>
                        {t.status === 'open' && (
                          <Link to="/tournaments" className="text-[11px] font-bold px-3 py-1 rounded-full transition-all duration-300 hover:scale-105"
                            style={{ background: t.accent, color: '#0D0D0D' }}>
                            Inscribirse
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-1 relative overflow-hidden" style={{ background: `${t.color}44` }}>
                    <div className="h-full transition-all duration-1000" style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${t.accent}, ${t.color})`,
                      boxShadow: `0 0 10px ${t.glow}`,
                    }} />
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between" style={{ background: `${t.color}15` }}>
                    <div className="flex items-center gap-2">
                      {t.game === 2 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #C8A951, #F0D060, #C8A951)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite', color: '#0D0D0D' }}>🏆 PREMIUM</span>}
                      {t.game === 3 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,107,53,0.2)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.3)', animation: 'tournPulse5 1.2s infinite' }}>🔥 SOLD OUT</span>}
                      {t.game === 0 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(27,158,107,0.2)', color: '#1B9E6B', border: '1px solid rgba(27,158,107,0.3)' }}>🌿 RANKED</span>}
                      {t.game === 1 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.2)', color: '#A855F7', border: '1px solid rgba(168,85,247,0.3)' }}>🌀 CROSSPLAY</span>}
                      {t.game === 4 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>🎯 MR12</span>}
                      {t.game === 5 && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>⚔️ BO3</span>}
                    </div>
                    <div className="text-[10px] font-bold" style={{ color: t.accent }}>{pct}% lleno</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ─── CTA FINAL ─── */}
      <SectionGradient>
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto text-center rounded-2xl p-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,rgba(139,0,0,0.08),rgba(139,0,0,0.03))', border: '1px solid rgba(139,0,0,0.2)' }}>
            <div className="font-orbitron font-black text-3xl mb-4 neon-text">¿Listo para jugar?</div>
            <p className="mb-8" style={{ color: '#8a8a8a' }}>Regístrate gratis, acumula puntos y sube al ranking.</p>
            <Link to="/register" className="btn-primary text-base px-10 py-3">Crear mi cuenta gratis</Link>
          </div>
        </section>
      </SectionGradient>
    </div>
  );
}

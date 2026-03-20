import { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Shield, Satellite, Radar, AlertTriangle } from 'lucide-react';
import Starfield from './components/Starfield';

import DonkiModule from './pages/DonkiModule';
import EarthModule from './pages/EarthModule';
import NeoWsModule from './pages/NeoWsModule';

function App() {
  const [criticalAlert, setCriticalAlert] = useState<string | null>(null);

  return (
    <HashRouter>
      {/* Immersive Background */}
      <Starfield />

      {/* Global Alerts Banner */}
      {criticalAlert && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--critical-red)', color: 'white', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
          <AlertTriangle className="mr-2" style={{ marginRight: '8px' }} />
          {criticalAlert}
          <button onClick={() => setCriticalAlert(null)} style={{ marginLeft: '16px', background: 'transparent', border: '1px solid white', color: 'white', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>DISMISS</button>
        </div>
      )}

      {/* Main App Container */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: criticalAlert ? '50px' : '0' }}>
        
        {/* Header / Navigation */}
        <header className="glass-panel" style={{ margin: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Shield size={32} color="var(--cyber-green)" />
            <div>
              <div className="tactical-title" style={{ fontSize: '1.4rem', marginBottom: '2px' }}>AstroWatch</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>by OrbeSystems</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '32px' }}>
            <NavLink to="/" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-green)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 8px var(--cyber-green-glow)' : 'none', transition: 'color 0.3s' })}>
              <Shield size={18} /> Defesa de Infraestrutura (DONKI)
            </NavLink>
            <NavLink to="/earth" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-green)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 8px var(--cyber-green-glow)' : 'none', transition: 'color 0.3s' })}>
              <Satellite size={18} /> Telemetria Terrestre (Earth)
            </NavLink>
            <NavLink to="/neows" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-green)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 8px var(--cyber-green-glow)' : 'none', transition: 'color 0.3s' })}>
              <Radar size={18} /> Varredura Orbital (NeoWs)
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyber-green)', boxShadow: '0 0 10px var(--cyber-green)' }}></div>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--cyber-green)', letterSpacing: '1px' }}>SYSTEM ONLINE</span>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<DonkiModule />} />
            <Route path="/earth" element={<EarthModule />} />
            <Route path="/neows" element={<NeoWsModule />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', background: 'var(--bg-deep-space)', zIndex: 10 }}>
          © 2026 OrbeSystems. Plataforma AstroWatch. Todos os direitos reservados.
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;

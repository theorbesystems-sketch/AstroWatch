import { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Shield, Satellite, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        <header className="glass-panel" style={{ margin: '16px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--cyber-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Shield size={32} color="var(--cyber-cyan)" />
            <div>
              <div className="tactical-title" style={{ fontSize: '1.4rem', marginBottom: '2px', color: 'var(--cyber-cyan)' }}>AstroWatch</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '1px' }}>by OrbeSystems</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '32px' }}>
            <NavLink to="/" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-cyan)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 12px var(--cyber-cyan-glow)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' })}>
              <Shield size={18} /> Radar (NeoWs)
            </NavLink>
            <NavLink to="/donki" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-cyan)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 12px var(--cyber-cyan-glow)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' })}>
              <Shield size={18} /> Clima Espacial (DONKI)
            </NavLink>
            <NavLink to="/earth" style={({ isActive }) => ({ textDecoration: 'none', color: isActive ? 'var(--cyber-cyan)' : 'var(--text-primary)', fontWeight: isActive ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: '8px', textShadow: isActive ? '0 0 12px var(--cyber-cyan-glow)' : 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' })}>
              <Satellite size={18} /> Telemetria (Earth)
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--cyber-cyan)', boxShadow: '0 0 12px var(--cyber-cyan)' }}></div>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)', letterSpacing: '1px' }}>SENTINEL ACCESS: GRANTED</span>
          </div>
        </header>

        {/* Dynamic Route Content with Framer Motion transitions */}
        <main className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', margin: '0 16px 16px 16px', display: 'flex', flexDirection: 'column' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<motion.div key="neows" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ flex: 1, overflowY: 'auto' }}><NeoWsModule /></motion.div>} />
              <Route path="/donki" element={<motion.div key="donki" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ flex: 1, overflowY: 'auto' }}><DonkiModule /></motion.div>} />
              <Route path="/earth" element={<motion.div key="earth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} style={{ flex: 1, overflowY: 'auto' }}><EarthModule /></motion.div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
        
        {/* Footer Institutional Signature */}
        <footer style={{ textAlign: 'center', padding: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.5)', zIndex: 10, borderTop: '1px solid var(--glass-border)', letterSpacing: '1px' }}>
          © 2026 OrbeSystems | AstroWatch Platform | Sentinel Access Level: Granted
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;

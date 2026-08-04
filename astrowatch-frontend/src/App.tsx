import { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Shield, Satellite, AlertTriangle, Orbit, Camera, Globe2, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Starfield from './components/Starfield';

import DonkiModule from './pages/DonkiModule';
import EarthModule from './pages/EarthModule';
import NeoWsModule from './pages/NeoWsModule';
import GalaxyModule from './pages/GalaxyModule';
import ApodModule from './pages/ApodModule';
import UniverseHub from './pages/UniverseHub';

function App() {
  const [criticalAlert, setCriticalAlert] = useState<string | null>(null);

  const navItems = [
    { path: '/universe', name: 'Universo Hub', icon: Globe2 },
    { path: '/galaxy', name: 'Navegação 3D', icon: Orbit },
    { path: '/earth', name: 'Telemetria Earth', icon: Satellite },
    { path: '/neows', name: 'Radar NeoWs', icon: Shield },
    { path: '/donki', name: 'Clima Solar', icon: Sun },
    { path: '/apod', name: 'Galeria APOD', icon: Camera }
  ];

  return (
    <HashRouter>
      {/* Deep Space Background Canvas */}
      <Starfield />

      {/* Global Tactical Alert Banner */}
      {criticalAlert && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999, background: 'var(--critical-red)', color: 'white', padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
          <AlertTriangle className="mr-2" style={{ marginRight: '8px' }} />
          {criticalAlert}
          <button onClick={() => setCriticalAlert(null)} style={{ marginLeft: '16px', background: 'transparent', border: '1px solid white', color: 'white', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}>DISMISS</button>
        </div>
      )}

      {/* Main App Container */}
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden', paddingTop: criticalAlert ? '45px' : '0' }}>

        {/* Tactical Sleek Collapsible Sidebar Navigation */}
        <aside style={{
          width: '240px',
          background: 'rgba(2, 5, 12, 0.92)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 100
        }}>
          <div>
            {/* Header Brand */}
            <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={28} color="var(--cyber-cyan)" />
              <div>
                <div className="tactical-title" style={{ fontSize: '1.2rem', color: 'var(--cyber-cyan)', margin: 0, letterSpacing: '1px' }}>AstroWatch</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>ORBESYSTEMS AI</div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={({ isActive }) => ({
                      textDecoration: 'none',
                      color: isActive ? 'var(--cyber-cyan)' : 'var(--text-secondary)',
                      background: isActive ? 'rgba(0, 240, 255, 0.12)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? 'var(--cyber-cyan)' : 'transparent'}`,
                      padding: '12px 14px',
                      borderRadius: '0 6px 6px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    })}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* System Telemetry Indicator at Sidebar Bottom */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f0ff', boxShadow: '0 0 8px #00f0ff' }}></div>
              <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)' }}>SENTINEL ONLINE</span>
            </div>
            <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
              DEEP SPACE RADAR v2.5
            </div>
          </div>
        </aside>

        {/* Dynamic Route Content Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Navigate to="/universe" replace />} />
              <Route path="/universe" element={<motion.div key="universe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><UniverseHub /></motion.div>} />
              <Route path="/galaxy" element={<motion.div key="galaxy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><GalaxyModule /></motion.div>} />
              <Route path="/earth" element={<motion.div key="earth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><EarthModule /></motion.div>} />
              <Route path="/neows" element={<motion.div key="neows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><NeoWsModule /></motion.div>} />
              <Route path="/donki" element={<motion.div key="donki" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><DonkiModule /></motion.div>} />
              <Route path="/apod" element={<motion.div key="apod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ flex: 1, display: 'flex', overflow: 'hidden' }}><ApodModule /></motion.div>} />
              <Route path="*" element={<Navigate to="/universe" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;

import { useState } from 'react';
import { Info, Radar, Compass, Globe, Sparkles, Eye } from 'lucide-react';
import GalaxyScene from '../components/galaxy/GalaxyScene';
import { solarSystemData } from '../services/galaxyData';
import type { CelestialBodyData } from '../services/galaxyData';

export default function GalaxyModule() {
    const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);
    const [exoplanets, setExoplanets] = useState<CelestialBodyData[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [activeTab, setActiveTab] = useState<'system' | 'exoplanets'>('system');

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            const discovered: CelestialBodyData[] = Array.from({ length: 8 }).map((_, i) => ({
                id: `exo-${Date.now()}-${i}`,
                name: `Kepler-${Math.floor(Math.random() * 900) + 100}${String.fromCharCode(98 + (i % 5))}`,
                type: 'planet',
                classification: 'Exoplaneta Confirmado (TESS)',
                emoji: '✨',
                radius: 1 + Math.random() * 3,
                orbitRadius: 130 + i * 18,
                orbitSpeed: 0.0002 + Math.random() * 0.0008,
                color: ['#00ffcc', '#ff00aa', '#9900ff', '#0099ff', '#ffaa00'][i % 5],
                atmosphereColor: '#00ffff',
                description: 'Exoplaneta detectado pelo método de trânsito. Apresenta variação de curvatura de luz com forte assinatura espectroscópica.'
            }));
            setExoplanets(discovered);
            setIsScanning(false);
            setActiveTab('exoplanets');
        }, 2200);
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', overflow: 'hidden', background: '#020409' }}>
            {/* Left Planetary Navigator Sidebar */}
            <div style={{
                width: '320px',
                background: 'rgba(3, 8, 20, 0.85)',
                backdropFilter: 'blur(12px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 10
            }}>
                {/* Header Selector */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cyber-cyan)', marginBottom: '8px' }}>
                        <Compass className="animate-spin-slow" size={22} />
                        <h2 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--cyber-cyan)' }}>Navegador estelar</h2>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                        SECTOR 001 // ORBE-SYSTEMS DEEP NAVIGATION
                    </p>

                    {/* Navigation Tabs */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        <button
                            onClick={() => setActiveTab('system')}
                            style={{
                                flex: 1, padding: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                                background: activeTab === 'system' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                                border: `1px solid ${activeTab === 'system' ? 'var(--cyber-cyan)' : 'rgba(255,255,255,0.1)'}`,
                                color: activeTab === 'system' ? 'var(--cyber-cyan)' : 'var(--text-secondary)',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Sistema Solar ({solarSystemData.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('exoplanets')}
                            style={{
                                flex: 1, padding: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                                background: activeTab === 'exoplanets' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                                border: `1px solid ${activeTab === 'exoplanets' ? 'var(--cyber-cyan)' : 'rgba(255,255,255,0.1)'}`,
                                color: activeTab === 'exoplanets' ? 'var(--cyber-cyan)' : 'var(--text-secondary)',
                                cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            Exoplanetas ({exoplanets.length})
                        </button>
                    </div>
                </div>

                {/* Body List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    {/* Reset Zoom / Solar Overview Button */}
                    <button
                        onClick={() => setSelectedBody(null)}
                        style={{
                            width: '100%', padding: '10px 14px', marginBottom: '12px',
                            background: selectedBody === null ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedBody === null ? 'var(--cyber-cyan)' : 'rgba(255,255,255,0.1)'}`,
                            color: selectedBody === null ? 'var(--cyber-cyan)' : 'white',
                            fontFamily: 'var(--font-mono)', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: '4px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Eye size={16} /> Visão Geral do Sistema
                    </button>

                    {activeTab === 'system' && solarSystemData.map(body => {
                        const isSelected = selectedBody?.id === body.id;
                        return (
                            <div
                                key={body.id}
                                onClick={() => setSelectedBody(body)}
                                style={{
                                    padding: '12px', marginBottom: '8px', borderRadius: '4px',
                                    background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                                    borderLeft: `4px solid ${isSelected ? '#00f0ff' : body.color}`,
                                    borderTop: '1px solid rgba(255,255,255,0.05)',
                                    borderRight: '1px solid rgba(255,255,255,0.05)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '1.2rem' }}>{body.emoji}</span>
                                        <span style={{ fontFamily: 'var(--font-mono)', color: isSelected ? '#00f0ff' : 'white', fontWeight: isSelected ? 'bold' : 'normal', fontSize: '0.9rem' }}>
                                            {body.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                                        {body.orbitRadius === 0 ? 'CENTRO' : `${body.orbitRadius} UA`}
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {body.classification}
                                </div>
                            </div>
                        );
                    })}

                    {activeTab === 'exoplanets' && (
                        exoplanets.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                Nenhum exoplaneta mapeado neste setor.<br />Use a varredura profunda abaixo.
                            </div>
                        ) : (
                            exoplanets.map(body => {
                                const isSelected = selectedBody?.id === body.id;
                                return (
                                    <div
                                        key={body.id}
                                        onClick={() => setSelectedBody(body)}
                                        style={{
                                            padding: '12px', marginBottom: '8px', borderRadius: '4px',
                                            background: isSelected ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.02)',
                                            borderLeft: `4px solid ${isSelected ? '#00f0ff' : body.color}`,
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>✨</span>
                                                <span style={{ fontFamily: 'var(--font-mono)', color: isSelected ? '#00f0ff' : 'white', fontSize: '0.85rem' }}>
                                                    {body.name}
                                                </span>
                                            </div>
                                            <Sparkles size={14} color={body.color} />
                                        </div>
                                    </div>
                                );
                            })
                        )
                    )}
                </div>

                {/* Scan Exoplanets Console Button */}
                <div style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.5)' }}>
                    <button
                        onClick={handleScan}
                        disabled={isScanning}
                        style={{
                            width: '100%', padding: '12px',
                            background: isScanning ? 'rgba(255, 170, 0, 0.15)' : 'rgba(0, 240, 255, 0.1)',
                            border: `1px solid ${isScanning ? 'var(--warning-orange)' : 'var(--cyber-cyan)'}`,
                            color: isScanning ? 'var(--warning-orange)' : 'var(--cyber-cyan)',
                            fontFamily: 'var(--font-mono)', fontWeight: 'bold', fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: isScanning ? 'wait' : 'pointer', borderRadius: '4px', transition: '0.3s'
                        }}
                    >
                        <Radar className={isScanning ? 'animate-spin-slow' : ''} size={18} />
                        {isScanning ? 'VARREDURA DEEP SPACE...' : 'ESCANEAR EXOPLANETAS'}
                    </button>
                </div>
            </div>

            {/* Main 3D Canvas Area */}
            <div style={{ flex: 1, position: 'relative' }}>
                <GalaxyScene
                    onSelectBody={setSelectedBody}
                    exoplanets={exoplanets}
                    selectedBody={selectedBody}
                />

                {/* HUD Top Coordinates */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', pointerEvents: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cyber-cyan)' }}>
                    <div>[ ASTROWATCH DEEP SPACE TELEMETRY ]</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: '4px' }}>
                        FOV: 45° // ENGINE: R3F+DREI // PARTICLES: 12,000 STARS // ASTEROIDS: 1,500
                    </div>
                </div>

                {/* Planet Detailed Intelligence Card Overlay */}
                {selectedBody && (
                    <div className="glass-panel" style={{
                        position: 'absolute', top: '20px', right: '20px', width: '340px',
                        padding: '20px', zIndex: 10, border: `1px solid ${selectedBody.color}`,
                        animation: 'fadeIn 0.3s ease-in-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.6rem' }}>{selectedBody.emoji}</span>
                                <div>
                                    <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem', color: selectedBody.color }}>
                                        {selectedBody.name}
                                    </h3>
                                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                                        {selectedBody.classification}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span>ÓRBITA</span>
                                <span style={{ color: 'white' }}>{selectedBody.orbitRadius === 0 ? 'CENTRAL' : `${selectedBody.orbitRadius} UA`}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span>RAIO RELATIVO</span>
                                <span style={{ color: 'white' }}>{selectedBody.radius} U</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                <span>VELOCIDADE</span>
                                <span style={{ color: 'white' }}>{(selectedBody.orbitSpeed * 1000).toFixed(2)} km/s</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--cyber-cyan)', marginBottom: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                                <Info size={14} /> DOSSIÊ CIENTÍFICO
                            </div>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                                {selectedBody.description}
                            </p>
                        </div>

                        {selectedBody.moons && selectedBody.moons.length > 0 && (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--warning-orange)', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                                    <Globe size={14} /> SATÉLITES NATURAIS ({selectedBody.moons.length})
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {selectedBody.moons.map(m => (
                                        <span key={m.id} style={{ padding: '3px 8px', background: 'rgba(255,170,0,0.1)', border: '1px solid var(--warning-orange)', color: 'var(--warning-orange)', borderRadius: '3px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                                            {m.emoji} {m.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Focus, Info, Activity, Radar } from 'lucide-react';
import GalaxyScene from '../components/galaxy/GalaxyScene';
import type { CelestialBodyData } from '../services/galaxyData';

export default function GalaxyModule() {
    const [selectedBody, setSelectedBody] = useState<CelestialBodyData | null>(null);
    const [exoplanets, setExoplanets] = useState<CelestialBodyData[]>([]);
    const [isScanning, setIsScanning] = useState(false);

    const handleScan = () => {
        setIsScanning(true);
        // Procedural WebGL generation of exoplanets based on NASA metadata context
        setTimeout(() => {
            const discovered: CelestialBodyData[] = Array.from({ length: 12 }).map((_, i) => ({
                id: `exo-${i}`,
                name: `Kepler-${Math.floor(Math.random() * 900) + 100}${String.fromCharCode(98 + Math.floor(Math.random() * 5))}`,
                type: 'planet',
                radius: 1 + Math.random() * 4,
                orbitRadius: 120 + Math.random() * 150,
                orbitSpeed: 0.0002 + Math.random() * 0.001,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
                description: 'Exoplaneta recém processado pelos algoritmos de varredura. Possui marcadores espectrais desconhecidos. Mais observações da rede Deep Space Network são requeridas.'
            }));
            setExoplanets(discovered);
            setIsScanning(false);
        }, 2500);
    };

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex' }}>
            {/* 3D Scene Container */}
            <div style={{ flex: 1, position: 'relative' }}>
                <GalaxyScene onSelectBody={setSelectedBody} exoplanets={exoplanets} />

                {/* HUD Overlay Text */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)', fontSize: '0.85rem', pointerEvents: 'none' }}>
                    [GALAXY MAP: ENGAGED]<br />
                    SYSTEM: SOLAR (SECTOR 001)<br />
                    EXOPLANETS LOGGED: <span style={{ color: 'var(--neon-green)' }}>{exoplanets.length}</span>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', fontFamily: 'var(--font-mono)', color: 'var(--warning-orange)', fontSize: '0.85rem', textAlign: 'right', pointerEvents: 'none' }}>
                    ARRASTE PARA ROTACIONAR<br />
                    SCROLL PARA ZOOM<br />
                    CLIQUE EM UM CORPO CELESTE
                </div>

                {/* Exoplanet Scanner Console */}
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 5 }}>
                    <button onClick={handleScan} disabled={isScanning} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '12px 24px',
                        background: isScanning ? 'rgba(0,0,0,0.8)' : 'rgba(0, 255, 245, 0.1)',
                        border: `1px solid ${isScanning ? 'var(--warning-orange)' : 'var(--cyber-cyan)'}`,
                        color: isScanning ? 'var(--warning-orange)' : 'var(--cyber-cyan)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 'bold',
                        cursor: isScanning ? 'wait' : 'pointer',
                        transition: 'all 0.3s'
                    }}>
                        <Radar className={isScanning ? 'animate-spin-slow' : ''} />
                        {isScanning ? 'INICIANDO VARREDURA PROFUNDA...' : 'LOCALIZAR EXOPLANETAS'}
                    </button>
                </div>
            </div>

            {/* Right Panel: Body Details */}
            {selectedBody && (
                <div className="glass-panel" style={{
                    position: 'absolute',
                    right: '24px',
                    top: '24px',
                    width: '320px',
                    padding: '24px',
                    zIndex: 10,
                    animation: 'fadeIn 0.3s ease-in-out'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: selectedBody.color, marginBottom: '16px' }}>
                        <Focus size={24} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem', color: selectedBody.color }}>{selectedBody.name}</h3>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${selectedBody.color}`, padding: '16px', borderRadius: '2px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>TIPO</span>
                            <span style={{ color: 'white', textTransform: 'uppercase' }}>{selectedBody.type}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>RAIO (Relativo)</span>
                            <span style={{ color: 'white' }}>{selectedBody.radius} U</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>ÓRBITA</span>
                            <span style={{ color: 'white' }}>{selectedBody.orbitRadius} UA</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>VELOCIDADE</span>
                            <span style={{ color: 'white' }}>{selectedBody.orbitSpeed.toFixed(4)} v/s</span>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyber-cyan)', marginBottom: '8px' }}>
                            <Info size={16} />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>INTELIGÊNCIA</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            {selectedBody.description}
                        </p>
                    </div>

                    {selectedBody.moons && selectedBody.moons.length > 0 && (
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning-orange)', marginBottom: '8px' }}>
                                <Activity size={16} />
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>SATÉLITES NATURAIS</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {selectedBody.moons.map(moon => (
                                    <span key={moon.id} style={{ padding: '4px 8px', background: 'rgba(255,165,0,0.1)', border: '1px solid var(--warning-orange)', borderRadius: '2px', color: 'var(--warning-orange)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                                        {moon.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button onClick={() => setSelectedBody(null)} style={{
                        marginTop: '24px',
                        width: '100%',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: '0.2s'
                    }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        FECHAR PAINEL
                    </button>

                </div>
            )}
        </div>
    );
}

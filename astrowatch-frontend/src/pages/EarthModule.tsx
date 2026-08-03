import { useState, useRef, useEffect, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { Target, BarChart2, MapPin, Eye } from 'lucide-react';
import { fetchEonetData } from '../services/api';

const EarthModule = () => {
    const globeEl = useRef<any>(null);
    const [coords, setCoords] = useState({ lat: -23.5505, lng: -46.6333 }); // default SP, Brazil
    const [altitude] = useState(1.5);
    const [inputLat, setInputLat] = useState('-23.5505');
    const [inputLng, setInputLng] = useState('-46.6333');
    const containerRef = useRef<HTMLDivElement>(null);
    const [globeSize, setGlobeSize] = useState({ w: 800, h: 600 });

    const updateSize = useCallback(() => {
        if (containerRef.current) {
            setGlobeSize({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
        }
    }, []);

    // EONET State
    const [ringsData, setRingsData] = useState<any[]>([]);
    const [eventCount, setEventCount] = useState(0);

    // Helper for Hex to RGB conversion for Globe ring colors
    const hexToRgb = (hex: string) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r},${g},${b}`;
    };

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);

        // Fetch EONET
        fetchEonetData().then((data) => {
            const rings: any[] = [];
            if (data.events) {
                setEventCount(data.events.length);
                data.events.forEach((event: any) => {
                    if (event.geometries && event.geometries.length > 0) {
                        const coords = event.geometries[0].coordinates;
                        const categoryId = event.categories?.[0]?.id || '';

                        let color = '#ff3333'; // Default red (fires/volcanoes)
                        if (categoryId === 'severeStorms') color = '#00f2ff'; // Cyan
                        if (categoryId === 'seaLakeIce') color = '#ffffff'; // White

                        rings.push({
                            lat: coords[1], // EONET gives [lng, lat]
                            lng: coords[0],
                            maxR: 3 + Math.random() * 4,
                            propagationSpeed: 1 + Math.random(),
                            repeatPeriod: 700 + Math.random() * 800,
                            color: (t: number) => `rgba(${hexToRgb(color)},${1 - t})`
                        });
                    }
                });
            }
            setRingsData(rings);
        });
    }, []);

    const handleTrack = () => {
        const lat = parseFloat(inputLat);
        const lng = parseFloat(inputLng);
        if (!isNaN(lat) && !isNaN(lng)) {
            setCoords({ lat, lng });
            if (globeEl.current) {
                globeEl.current.pointOfView({ lat, lng, altitude }, 2000);
            }
        }
    };

    return (
        <div style={{ padding: '32px', height: '100%', display: 'flex', gap: '32px' }}>

            {/* Left Panel: Tracker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '320px', zIndex: 10 }}>
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-cyan)', marginBottom: '24px' }}>
                        <Target size={24} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem' }}>RASTREAMENTO ORBITAL</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>LATITUDE</label>
                            <input
                                value={inputLat}
                                onChange={e => setInputLat(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>LONGITUDE</label>
                            <input
                                value={inputLng}
                                onChange={e => setInputLng(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}
                            />
                        </div>
                        <button
                            onClick={handleTrack}
                            style={{ padding: '12px', background: 'var(--cyber-cyan)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <MapPin size={18} /> INICIAR TELEMETRIA
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>STATUS</span>
                            <span style={{ color: 'var(--cyber-cyan)' }}>LOCKED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>DISTÂNCIA</span>
                            <span>{altitude.toFixed(2)} AU</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>SATÉLITE</span>
                            <span>DSCOVR (EPIC)</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                        <Eye size={20} color="var(--cyber-cyan)" />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1rem' }}>IMAGENS EPIC</h3>
                    </div>
                    <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(0,0,0,0.6)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 50%, rgba(0, 242, 255, 0.1) 100%)' }}></div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>AGUARDANDO FEED DE ALTA RESOLUÇÃO...</span>
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                        [TIMESTAMP: 2026-03-20T17:42:01Z]
                    </div>
                </div>
            </div>

            {/* Center: Globe View */}
            <div ref={containerRef} style={{ flex: 1, position: 'relative', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 0 50px rgba(0,0,0,1)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <Globe
                        ref={globeEl}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundImageUrl="" // Empty to use our Starfield
                        backgroundColor="rgba(0,0,0,0)"
                        ringsData={ringsData}
                        ringColor="color"
                        ringMaxRadius="maxR"
                        ringPropagationSpeed="propagationSpeed"
                        ringRepeatPeriod="repeatPeriod"
                        width={globeSize.w}
                        height={globeSize.h}
                    />
                </div>
                {/* HUD overlays */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)', fontSize: '0.85rem', pointerEvents: 'none' }}>
                    [OPTICS: NOMINAL]<br />
                    COORD: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}<br />
                    EVENTOS (EONET): <span style={{ color: 'var(--critical-red)' }}>{eventCount} ATIVOS</span>
                </div>
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', fontFamily: 'var(--font-mono)', color: 'var(--warning-orange)', fontSize: '0.85rem', textAlign: 'right', pointerEvents: 'none' }}>
                    ARRASTE PARA ROTACIONAR<br />
                    SCROLL PARA ZOOM
                </div>
            </div>

            {/* Right Panel: Delta Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '320px', zIndex: 10 }}>
                <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '24px' }}>
                        <BarChart2 size={24} color="var(--cyber-cyan)" />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem' }}>PROCESSADOR DELTA</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>VEGETATION INDEX</span>
                                <span style={{ color: 'var(--critical-red)' }}>-4.2%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '65%', height: '100%', background: 'var(--critical-red)' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>THERMAL ANOMALIES</span>
                                <span style={{ color: 'var(--warning-orange)' }}>+12.8%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '82%', height: '100%', background: 'var(--warning-orange)' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>AEROSOL OPTICAL DEPTH</span>
                                <span style={{ color: 'var(--cyber-cyan)' }}>NOMINAL</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '30%', height: '100%', background: 'var(--cyber-cyan)' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '16px', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-deep-space)', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--warning-orange)' }}>
                            ANÁLISE IA
                        </div>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                            Degradação leve na cobertura vegetal detectada via processamento hiperespectral. Coeficiente de risco ambiental: Estável.
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EarthModule;

import { useState, useRef, useEffect } from 'react';
import Globe from 'react-globe.gl';
import { Target, BarChart2, MapPin, Eye } from 'lucide-react';

const EarthModule = () => {
    const globeEl = useRef<any>(null);
    const [coords, setCoords] = useState({ lat: -23.5505, lng: -46.6333 }); // default SP, Brazil
    const [altitude] = useState(1.5);
    const [inputLat, setInputLat] = useState('-23.5505');
    const [inputLng, setInputLng] = useState('-46.6333');

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
        }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-green)', marginBottom: '24px' }}>
                        <Target size={24} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem' }}>ORBITAL TRACKER</h3>
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
                            style={{ padding: '12px', background: 'var(--cyber-green)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '4px', marginTop: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            <MapPin size={18} /> INITIATE TRACKING
                        </button>
                    </div>

                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--glass-border)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>STATUS</span>
                            <span style={{ color: 'var(--cyber-green)' }}>LOCKED</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>ELEVATION</span>
                            <span>{altitude.toFixed(2)} AU</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>SATELLITE</span>
                            <span>DSCOVR (EPIC)</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '16px' }}>
                        <Eye size={20} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>LATEST IMAGERY</h3>
                    </div>
                    <div style={{ width: '100%', aspectRatio: '1', background: 'rgba(0,0,0,0.6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                        {/* Simulate radar visual over image placeholder */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, transparent 50%, rgba(0,255,102,0.1) 100%)' }}></div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>AWAITING NASA FEED...</span>
                    </div>
                </div>
            </div>

            {/* Center: Globe View */}
            <div style={{ flex: 1, position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 0 50px rgba(0,0,0,1)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <Globe
                        ref={globeEl}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                        backgroundColor="rgba(0,0,0,0)"
                        width={window.innerWidth - 750} // Rough approx of remaining space
                        height={window.innerHeight - 150}
                    />
                </div>
                {/* HUD overlays */}
                <div style={{ position: 'absolute', top: '24px', left: '24px', fontFamily: 'var(--font-mono)', color: 'var(--cyber-green)', fontSize: '0.85rem', pointerEvents: 'none' }}>
                    [TACTICAL OPTICS: NOMINAL]<br/>
                    COORD: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </div>
                <div style={{ position: 'absolute', bottom: '24px', right: '24px', fontFamily: 'var(--font-mono)', color: 'var(--warning-yellow)', fontSize: '0.85rem', textAlign: 'right', pointerEvents: 'none' }}>
                    DRAG TO ROTATE<br/>
                    SCROLL TO ZOOM
                </div>
            </div>

            {/* Right Panel: Delta Analytics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '320px', zIndex: 10 }}>
                <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '24px' }}>
                        <BarChart2 size={24} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>DELTA PROCESSOR</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>VEGETATION INDEX</span>
                                <span style={{ color: 'var(--critical-red)' }}>-4.2%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '65%', height: '100%', background: 'var(--critical-red)' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>THERMAL ANOMALIES</span>
                                <span style={{ color: 'var(--warning-yellow)' }}>+12.8%</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '82%', height: '100%', background: 'var(--warning-yellow)' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '8px' }}>
                                <span>AEROSOL OPTICAL DEPTH</span>
                                <span style={{ color: 'var(--cyber-green)' }}>NOMINAL</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{ width: '30%', height: '100%', background: 'var(--cyber-green)' }}></div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', position: 'relative' }}>
                         <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'var(--bg-deep-space)', padding: '0 8px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--warning-yellow)' }}>
                             AI ANALYSIS
                         </div>
                         <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                             O modelo de visão computacional da OrbeSystems detectou uma degradação leve na cobertura vegetal da região selecionada frente ao histórico de 30 dias. Nível de alerta: Baixo.
                         </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default EarthModule;

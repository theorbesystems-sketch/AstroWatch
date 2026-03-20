import { useEffect, useState, useMemo } from 'react';
import { fetchNeoWsData } from '../services/api';
import { AlertCircle, ChevronLeft, ChevronRight, Crosshair } from 'lucide-react';

const RadarDisplay = ({ asteroids }: { asteroids: any[] }) => {
    // A pure CSS/SVG radar sweeping effect!
    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '50%', background: 'rgba(0,30,50,0.1)', border: '2px solid var(--cyber-cyan)', overflow: 'hidden', boxShadow: '0 0 30px rgba(0,242,255,0.2)' }}>
            
            {/* Concentric rings */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', top: '30%', left: '30%', right: '30%', bottom: '30%', border: '1px solid rgba(0,242,255,0.2)', borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', right: '50%', bottom: '50%', border: '1px solid rgba(0,242,255,0.4)', borderRadius: '50%' }}></div>
            
            {/* Crosshairs */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,242,255,0.3)', transform: 'translateY(-50%)' }}></div>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '1px', background: 'rgba(0,242,255,0.3)', transform: 'translateX(-50%)' }}></div>

            {/* Sweeping Cone */}
            <style>
                {`
                    @keyframes radar-sweep {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .radar-cone {
                        position: absolute;
                        top: 50%; left: 50%;
                        width: 50%; height: 50%;
                        background: conic-gradient(from 0deg, rgba(0,242,255,0) 0deg, rgba(0,242,255,0.1) 70deg, rgba(0,242,255,0.8) 90deg, transparent 90deg);
                        transform-origin: 0 0;
                        animation: radar-sweep 4s linear infinite;
                    }
                `}
            </style>
            <div className="radar-cone"></div>

            {/* Asteroid Blips */}
            {asteroids.slice(0, 30).map((ast) => {
                const distKm = parseFloat(ast.close_approach_data?.[0]?.miss_distance?.kilometers) || 10000000;
                const normalizedDist = Math.max(5, Math.min(48, (distKm / 50000000) * 50)); 
                const angle = (parseInt(ast.id) % 360) * (Math.PI / 180);
                
                const top = 50 + normalizedDist * Math.sin(angle);
                const left = 50 + normalizedDist * Math.cos(angle);
                
                const isDanger = ast.is_potentially_hazardous_asteroid;

                return (
                    <div key={ast.id} 
                         title={ast.name}
                         style={{
                            position: 'absolute',
                            top: `${top}%`, left: `${left}%`,
                            width: isDanger ? '8px' : '4px',
                            height: isDanger ? '8px' : '4px',
                            backgroundColor: isDanger ? 'var(--critical-red)' : 'var(--cyber-cyan)',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)',
                            boxShadow: isDanger ? '0 0 10px var(--critical-red)' : '0 0 5px var(--cyber-cyan)',
                            animation: isDanger ? 'pulse-border 1s infinite' : 'none'
                        }}>
                    </div>
                );
            })}

        </div>
    );
};


const NeoWsModule = () => {
    const [asteroids, setAsteroids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    useEffect(() => {
        fetchNeoWsData().then(res => {
            const days = res?.near_earth_objects || {};
            let allAsts: any[] = [];
            Object.values(days).forEach((dayAsts: any) => {
                allAsts = [...allAsts, ...dayAsts];
            });
            
            allAsts.sort((a, b) => {
                if (a.is_potentially_hazardous_asteroid && !b.is_potentially_hazardous_asteroid) return -1;
                if (!a.is_potentially_hazardous_asteroid && b.is_potentially_hazardous_asteroid) return 1;
                const aDia = a.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
                const bDia = b.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
                return bDia - aDia;
            });

            setAsteroids(allAsts);
            setLoading(false);
        });
    }, []);

    const totalPages = Math.ceil(asteroids.length / ITEMS_PER_PAGE);
    const paginated = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return asteroids.slice(start, start + ITEMS_PER_PAGE);
    }, [page, asteroids]);

    return (
        <div style={{ padding: '32px', height: '100%', display: 'flex', gap: '32px', overflowY: 'auto' }}>
            
            {/* Left: Radar */}
            <div style={{ flex: '1', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-cyan)', marginBottom: '32px' }}>
                        <Crosshair size={28} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.4rem' }}>ORBITAL RADAR</h3>
                    </div>
                    <RadarDisplay asteroids={asteroids} />
                    <div style={{ marginTop: '32px', width: '100%', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                         <span>RANGE: 0.5 AU</span>
                         <span>DETECTIONS: {loading ? '--' : asteroids.length}</span>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px' }}>
                     <h3 className="tactical-title" style={{ margin: 0, fontSize: '1rem', color: 'var(--warning-orange)', marginBottom: '16px' }}>ALERTA DE SEGURANÇA</h3>
                     <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        O sistema de defesa planetária cataloga detritos e asteroides (NEOs). Objetos que violam os limites da gravidade terrestre ou representam um Score de Risco acima de 85 disparam varreduras imediatas na matriz à direita.
                     </p>
                </div>
            </div>

            {/* Right: Risk Matrix */}
            <div className="glass-panel" style={{ flex: '2', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <h2 className="tactical-title" style={{ fontSize: '1.8rem', margin: 0 }}>MATRIZ DE RISCO ASTEROIDAL</h2>
                    {!loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,77,77,0.1)', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--critical-red)' }}>
                            <AlertCircle size={18} color="var(--critical-red)" />
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                {asteroids.filter(a => a.is_potentially_hazardous_asteroid).length} THREATS DETECTED
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                     {/* Table Header */}
                     <div style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1.2fr) minmax(150px, 2fr) minmax(100px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)', padding: '16px', background: 'rgba(0, 242, 255, 0.05)', color: 'var(--cyber-cyan)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '1px', borderBottom: '1px solid var(--glass-border)' }}>
                        <span>ORBESYSTEMS SCORE</span>
                        <span>NOMENCLATURE</span>
                        <span>DIAMETER (MAX)</span>
                        <span>VELOCITY</span>
                        <span>MISS DISTANCE</span>
                    </div>

                    {loading ? (
                        <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)' }}>SYNCING NEO DATABASE...</div>
                    ) : paginated.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>NO DATA AVAILABLE</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {paginated.map((ast) => {
                                const isDanger = ast.is_potentially_hazardous_asteroid;
                                const dia = ast.estimated_diameter?.kilometers?.estimated_diameter_max || 0;
                                const vel = parseFloat(ast.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || "0").toFixed(2);
                                const dist = parseFloat(ast.close_approach_data?.[0]?.miss_distance?.lunar || "0").toFixed(2);
                                
                                const riskScore = ast.orbesystems_risk_score || 0;

                                return (
                                <div key={ast.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(130px, 1.2fr) minmax(150px, 2fr) minmax(100px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)', padding: '20px 16px', background: isDanger ? 'rgba(255,77,77,0.1)' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', borderLeft: isDanger ? '4px solid var(--critical-red)' : '4px solid transparent', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', alignItems: 'center' }}>
                                    
                                    <span style={{ color: riskScore > 80 ? 'var(--critical-red)' : riskScore > 50 ? 'var(--warning-orange)' : 'var(--cyber-cyan)', fontWeight: 'bold', fontSize: '1.1rem', textShadow: riskScore > 80 ? '0 0 8px var(--critical-red)' : 'none' }}>{riskScore.toFixed(1)}/100</span>
                                    <span style={{ color: 'var(--text-primary)' }}>{ast.name}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{dia.toFixed(2)} km</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{vel} km/s</span>
                                    <span style={{ color: isDanger ? 'var(--critical-red)' : 'var(--warning-orange)' }}>{dist} LD</span>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)' }}>
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '8px', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.3 : 1 }}>
                            <ChevronLeft size={20} />
                        </button>
                        <span>PAGE {page} OF {totalPages}</span>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '8px', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.3 : 1 }}>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default NeoWsModule;

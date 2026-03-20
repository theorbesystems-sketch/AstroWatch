import { useEffect, useState } from 'react';
import { fetchDonkiData } from '../services/api';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

const ThreatGauge = ({ level }: { level: number }) => {
    const color = level < 30 ? 'var(--cyber-cyan)' : level < 70 ? 'var(--warning-orange)' : 'var(--critical-red)';
    const strokeDasharray = `${level}, 100`;

    return (
        <div style={{ position: 'relative', width: '260px', height: '130px', margin: '0 auto', overflow: 'hidden' }}>
            <svg viewBox="0 0 36 18" style={{ width: '100%', height: '200%', transform: 'rotate(-180deg)', transformOrigin: '50% 50%' }}>
                <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="50, 100" />
                <path className="circle"
                    strokeDasharray={strokeDasharray}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={color} strokeWidth="3"
                    style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' }} />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: '0', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color, textShadow: `0 0 15px ${color}` }}>{level}%</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginTop: '4px' }}>TELEMETRIA ELETROMAGNÉTICA</div>
            </div>
        </div>
    );
};

const DonkiModule = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDonkiData().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    const threatLevel = loading ? 0 : (data?.gst?.length > 0 ? 88 : data?.cme?.length > 0 ? 52 : 14);

    return (
        <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr minmax(300px, 1fr)', gap: '24px' }}>
                {/* Left Panel: Telemetry */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-cyan)', marginBottom: '16px' }}>
                            <Activity size={24} />
                            <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem' }}>FLUXO SOLAR</h3>
                        </div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', margin: '16px 0', color: 'var(--text-primary)' }}>
                            {loading ? '--' : "125.4"} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>sfu</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MÍNIMO TÁTICO: 70.0 sfu</div>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning-orange)', marginBottom: '16px' }}>
                            <Zap size={24} />
                            <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--warning-orange)' }}>GEOMAGNETISMO</h3>
                        </div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', margin: '16px 0', color: 'var(--text-primary)' }}>
                           {loading ? '--' : data?.gst?.length || 0} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>tempestades</span>
                        </div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Anomalias ativas (Janela 30d)</div>
                    </div>
                </div>

                {/* Center Panel: Gauge */}
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderTop: '4px solid var(--cyber-cyan)' }}>
                    <h2 className="tactical-title" style={{ fontSize: '1.6rem', marginBottom: '40px', textAlign: 'center', letterSpacing: '4px' }}>AMEAÇA ELETROMAGNÉTICA GLOBAL</h2>
                    <ThreatGauge level={threatLevel} />
                    
                    <div style={{ marginTop: '48px', width: '85%', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '8px' }}>{loading ? '--' : data?.cme?.length || 0}</div>
                            EVENTOS CME
                        </div>
                        <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '8px' }}>{loading ? '--' : data?.flr?.length || 0}</div>
                            SOLAR FLARES
                        </div>
                    </div>
                </div>

                {/* Right Panel: Impact Matrix */}
                <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '24px' }}>
                        <ShieldAlert size={24} color="var(--cyber-cyan)" />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>MATRIZ DE IMPACTO</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                        {[
                            { name: 'SATELLITE DOWNLINK', status: 'NOMINAL', color: 'var(--cyber-cyan)' },
                            { name: 'LATAM POWER GRID', status: threatLevel > 50 ? 'WARNING' : 'NOMINAL', color: threatLevel > 50 ? 'var(--warning-orange)' : 'var(--cyber-cyan)', blinking: threatLevel > 50 },
                            { name: 'DATA SYNC LAYER', status: 'NOMINAL', color: 'var(--cyber-cyan)' },
                            { name: 'GPS GUIDANCE', status: threatLevel > 80 ? 'CRITICAL' : 'NOMINAL', color: threatLevel > 80 ? 'var(--critical-red)' : 'var(--cyber-cyan)', blinking: threatLevel > 80 }
                        ].map((node, i) => (
                            <div key={i} className={node.blinking ? "blinking-alert" : ""} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', borderLeft: `4px solid ${node.color}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                    <Cpu size={18} color={node.color} />
                                    {node.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: node.color, letterSpacing: '2px' }}>
                                    {node.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Activity Logs */}
            <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: '250px' }}>
                <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', marginBottom: '24px' }}>LOGS DE ATIVIDADE SOLAR (CME)</h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {loading ? (
                        <div className="blinking-alert" style={{ padding: '16px', color: 'var(--cyber-cyan)' }}>SINCRONIZANDO COM REDE DONKI...</div>
                    ) : (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(200px, 4fr)', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--cyber-cyan)', fontWeight: 'bold' }}>
                                <span>ID DE ATIVIDADE</span>
                                <span>DATA (UTC)</span>
                                <span>TIPO/VELOCIDADE</span>
                                <span>ASSINATURA DE ANÁLISE</span>
                            </div>
                            {(data?.cme || []).slice(0, 6).map((ev: any, i: number) => {
                                const analysis = ev.cmeAnalyses?.[0] || {};
                                return (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(200px, 4fr)', padding: '12px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                                    <span style={{ color: 'var(--text-primary)' }}>{ev.activityID}</span>
                                    <span>{ev.startTime?.slice(0, 10)}</span>
                                    <span style={{ color: 'var(--warning-orange)' }}>{analysis.type || 'N/A'} {analysis.speed ? `${analysis.speed}km/s` : ''}</span>
                                    <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={ev.note}>{ev.note}</span>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DonkiModule;

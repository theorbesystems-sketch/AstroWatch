import { useEffect, useState } from 'react';
import { fetchDonkiData } from '../services/api';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

const ThreatGauge = ({ level }: { level: number }) => {
    const color = level < 30 ? 'var(--cyber-green)' : level < 70 ? 'var(--warning-yellow)' : 'var(--critical-red)';
    const strokeDasharray = `${level}, 100`;

    return (
        <div style={{ position: 'relative', width: '220px', height: '110px', margin: '0 auto', overflow: 'hidden' }}>
            <svg viewBox="0 0 36 18" style={{ width: '100%', height: '200%', transform: 'rotate(-180deg)', transformOrigin: '50% 50%' }}>
                <path className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="var(--glass-border)" strokeWidth="2" strokeDasharray="50, 100" />
                <path className="circle"
                    strokeDasharray={strokeDasharray}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke={color} strokeWidth="3"
                    style={{ transition: 'stroke-dasharray 1s ease-out, stroke 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', bottom: 0, left: '0', width: '100%', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color, textShadow: `0 0 10px ${color}` }}>{level}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '1px', marginTop: '4px' }}>STATUS DE MONITORAMENTO ASTROWATCH</div>
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

    const threatLevel = loading ? 0 : (data?.gst?.length > 0 ? 85 : data?.cme?.length > 0 ? 45 : 12);

    return (
        <div style={{ padding: '32px', height: '100%', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr minmax(300px, 1fr)', gap: '24px' }}>
                {/* Left Panel: Telemetry */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-green)', marginBottom: '16px' }}>
                            <Activity size={24} />
                            <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem' }}>SOLAR FLUX</h3>
                        </div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', margin: '16px 0' }}>
                            {loading ? '--' : "125.4"} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>sfu</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Baseline: 90.0 sfu</div>
                    </div>

                    <div className="glass-panel" style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning-yellow)', marginBottom: '16px' }}>
                            <Zap size={24} />
                            <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--warning-yellow)' }}>GEOMAGNETIC</h3>
                        </div>
                        <div style={{ fontSize: '3rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', margin: '16px 0' }}>
                           {loading ? '--' : data?.gst?.length || 0} <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>storms</span>
                        </div>
                         <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active anomalies in last 30d</div>
                    </div>
                </div>

                {/* Center Panel: Gauge */}
                <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 className="tactical-title" style={{ fontSize: '1.6rem', marginBottom: '40px', textAlign: 'center', letterSpacing: '4px' }}>GLOBAL ELECTROMAGNETIC THREAT</h2>
                    <ThreatGauge level={threatLevel} />
                    
                    <div style={{ marginTop: '48px', width: '80%', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '1rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '8px' }}>{loading ? '--' : data?.cme?.length || 0}</div>
                            CME EVENTS
                        </div>
                        <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '8px' }}>{loading ? '--' : data?.flr?.length || 0}</div>
                            SOLAR FLARES
                        </div>
                    </div>
                </div>

                {/* Right Panel: Impact Map */}
                <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-primary)', marginBottom: '24px' }}>
                        <ShieldAlert size={24} />
                        <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>INFRA IMPACT</h3>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                        {[
                            { name: 'SAT-COM ORBITAL', status: 'NOMINAL', color: 'var(--cyber-green)' },
                            { name: 'LATAM POWER GRID', status: threatLevel > 50 ? 'WARNING' : 'NOMINAL', color: threatLevel > 50 ? 'var(--warning-yellow)' : 'var(--cyber-green)', blinking: threatLevel > 50 },
                            { name: 'GLOBAL DATACENTERS', status: 'NOMINAL', color: 'var(--cyber-green)' },
                            { name: 'GPS SYNC LAYER', status: threatLevel > 80 ? 'CRITICAL' : 'NOMINAL', color: threatLevel > 80 ? 'var(--critical-red)' : 'var(--cyber-green)', blinking: threatLevel > 80 }
                        ].map((node, i) => (
                            <div key={i} className={node.blinking ? "blinking-alert" : ""} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', borderLeft: `6px solid ${node.color}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                                    <Cpu size={20} color={node.color} />
                                    {node.name}
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: node.color, letterSpacing: '2px' }}>
                                    {node.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Panel: Logs */}
            <div className="glass-panel" style={{ padding: '24px', flex: 1, minHeight: '250px' }}>
                <h3 className="tactical-title" style={{ margin: 0, fontSize: '1.1rem', marginBottom: '24px' }}>CME ACTIVITY LOGS</h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {loading ? (
                        <div className="blinking-alert" style={{ padding: '16px', color: 'var(--cyber-green)' }}>Establishing secure handshake with NASA DONKI API...</div>
                    ) : data?.cme?.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Table Header */}
                             <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(200px, 4fr)', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                                <span>ACTIVITY ID</span>
                                <span>DATE (UTC)</span>
                                <span>TYPE/SPEED</span>
                                <span>ANALYSIS SIGNATURE (NOTE)</span>
                            </div>
                            {/* Table Body */}
                            {data.cme.slice(0, 6).map((ev: any, i: number) => {
                                const analysis = ev.cmeAnalyses?.[0] || {};
                                return (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) minmax(200px, 4fr)', padding: '12px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
                                    <span style={{ color: 'var(--text-primary)' }}>{ev.activityID}</span>
                                    <span>{ev.startTime?.slice(0, 10)}</span>
                                    <span style={{ color: 'var(--warning-yellow)' }}>{analysis.type || 'N/A'} {analysis.speed ? `${analysis.speed}km/s` : ''}</span>
                                    <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '12px' }} title={ev.note}>{ev.note}</span>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div style={{ padding: '16px' }}>No anomalous events detected in current operational window.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default DonkiModule;

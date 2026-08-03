import { useEffect, useState } from 'react';
import { fetchSpaceXNextLaunch } from '../services/api';

const SpaceXModule = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState<string>('T- --D --:--:--');

    useEffect(() => {
        fetchSpaceXNextLaunch().then((res) => {
            if (res) setData(res);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!data || !data.launch_date_unix) return;

        const interval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const diff = data.launch_date_unix - now;

            if (diff <= 0) {
                setCountdown('LIFTOFF');
                clearInterval(interval);
                return;
            }

            const d = Math.floor(diff / (24 * 60 * 60));
            const h = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
            const m = Math.floor((diff % (60 * 60)) / 60);
            const s = Math.floor(diff % 60);

            setCountdown(`T- ${d}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [data]);

    if (loading) {
        return (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)' }}>
                SATELLITE UPLINK INITIALIZING...
            </div>
        );
    }

    if (!data) {
        return (
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--critical-red)' }}>
                TELEMETRY LINK OFFLINE
            </div>
        );
    }

    const { telemetry } = data;

    return (
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <h2 className="tactical-title" style={{ fontSize: '1.4rem', margin: 0 }}>CENTRO DE CONTROLE SPACEX</h2>
                <div style={{ display: 'flex', gap: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)' }}>VEÍCULO</div>
                        <div style={{ fontWeight: 'bold' }}>{data.vehicle}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)' }}>LOCAL</div>
                        <div style={{ fontWeight: 'bold' }}>{data.launch_site}</div>
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)' }}>ÓRBITA</div>
                        <div style={{ fontWeight: 'bold' }}>{data.orbit}</div>
                    </div>
                </div>
            </div>

            {/* Content Container (Grid style background) */}
            <div style={{ 
                flex: 1, 
                position: 'relative',
                background: 'linear-gradient(rgba(0,242,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                borderRadius: '8px',
                border: '1px solid rgba(0,242,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px'
            }}>
                
                {/* Status Badges */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', border: '1px solid var(--cyber-cyan)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    LC-39A, KENNEDY SPACE CENTER
                </div>

                <div style={{ marginTop: '24px', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 24px', letterSpacing: '2px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    STATUS DO SISTEMA: {data.is_upcoming ? 'GO FOR LAUNCH' : 'STANDBY'}
                </div>

                {/* Countdown */}
                <div style={{ margin: '48px 0', fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)', color: 'var(--cyber-cyan)', textShadow: '0 0 20px var(--cyber-cyan)' }}>
                    {countdown}
                </div>

                <div style={{ color: '#b366ff', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'var(--font-mono)', fontSize: '1.2rem', marginBottom: '48px', textShadow: '0 0 10px rgba(179, 102, 255, 0.5)' }}>
                    {data.mission_name}
                </div>

                {/* Telemetry Bars */}
                <div style={{ width: '100%', maxWidth: '600px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 48px' }}>
                    
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                            <span>COMBUSTÍVEL</span>
                            <span>{telemetry.fuel.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ height: '100%', width: `${telemetry.fuel}%`, background: '#3b82f6', boxShadow: '0 0 10px #3b82f6' }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                            <span>OXIGÊNIO</span>
                            <span>{telemetry.oxygen.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ height: '100%', width: `${telemetry.oxygen}%`, background: '#60a5fa', boxShadow: '0 0 10px #60a5fa' }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                            <span>AVIÔNICOS</span>
                            <span>{telemetry.avionics.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ height: '100%', width: `${telemetry.avionics}%`, background: '#4ade80', boxShadow: '0 0 10px #4ade80' }}></div>
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: '8px', fontWeight: 'bold' }}>
                            <span>CLIMA</span>
                            <span>{telemetry.climate.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)' }}>
                            <div style={{ height: '100%', width: `${telemetry.climate}%`, background: '#a855f7', boxShadow: '0 0 10px #a855f7' }}></div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default SpaceXModule;

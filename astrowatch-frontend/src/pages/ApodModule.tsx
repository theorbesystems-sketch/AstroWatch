import { useState, useEffect } from 'react';
import { fetchApodData } from '../services/api';
import { Camera, Calendar, Info } from 'lucide-react';
import Starfield from '../components/Starfield';

export default function ApodModule() {
    const [apod, setApod] = useState<any>(null);

    useEffect(() => {
        fetchApodData().then(data => setApod(data));
    }, []);

    if (!apod) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)' }}>
                [ DECODING HIGH-RES FEED FROM APOD... ]
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', overflow: 'hidden', borderRadius: '4px' }}>
            {/* Background Layer */}
            {apod.media_type === 'image' ? (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url(${apod.hdurl || apod.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.6) contrast(1.1) saturate(1.2)',
                    zIndex: 0,
                    animation: 'fadeIn 1s ease-in-out'
                }} />
            ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, background: 'black' }}>
                    <Starfield />
                    <iframe src={apod.url} style={{ width: '100%', height: '100%', border: 'none', opacity: 0.8 }} />
                </div>
            )}

            {/* Tactical Overlay */}
            <div style={{ zIndex: 1, position: 'relative', padding: '32px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)' }}>
                <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', background: 'rgba(0,10,20,0.6)', backdropFilter: 'blur(16px)', borderLeft: '4px solid var(--cyber-cyan)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--cyber-cyan)', marginBottom: '16px' }}>
                        <Camera size={28} />
                        <h2 className="tactical-title" style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '2px', textShadow: '0 0 10px rgba(0,255,245,0.5)' }}>{apod.title}</h2>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={16} color="var(--warning-orange)" />
                            <span>DATA OBTENÇÃO: {apod.date}</span>
                        </div>
                        {apod.copyright && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={16} color="var(--warning-orange)" />
                                <span>COPYRIGHT: {apod.copyright}</span>
                            </div>
                        )}
                    </div>

                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.8, maxHeight: '35vh', overflowY: 'auto', paddingRight: '16px' }}>
                        {apod.explanation}
                    </p>
                </div>
            </div>

            <div style={{ position: 'absolute', top: '24px', right: '24px', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textAlign: 'right', pointerEvents: 'none' }}>
                [ ASTROWATCH APOD VIEWER ]<br />
                AGÊNCIA: NASA<br />
                COORD: VISUAL CORE
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Orbit, Satellite, Shield, Sun, Camera, ArrowRight, Activity } from 'lucide-react';

export default function UniverseHub() {
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Navegação Galáctica 3D',
            path: '/galaxy',
            icon: Orbit,
            color: '#00f0ff',
            tag: 'DEEP SPACE EXPLORER',
            description: 'Explore o Sistema Solar em 3D interativo com materiais Fresnel, cinturão de asteroides instanciado e varredura de exoplanetas.'
        },
        {
            title: 'Telemetria Earth & Satélites',
            path: '/earth',
            icon: Satellite,
            color: '#00ff88',
            tag: 'SATELLITE ORBITAL RADAR',
            description: 'Telemetria planetária em tempo real, monitoramento de vegetação, anomalias térmicas e imagens de satélite.'
        },
        {
            title: 'Radar de Asteroides (NeoWs)',
            path: '/neows',
            icon: Shield,
            color: '#ffaa00',
            tag: 'NEAR EARTH OBJECTS',
            description: 'Rastreamento de objetos próximos à Terra, cálculo de órbita relativa e alerta tático de aproximações críticas.'
        },
        {
            title: 'Clima Espacial (DONKI)',
            path: '/donki',
            icon: Sun,
            color: '#ff4444',
            tag: 'SPACE WEATHER MONITOR',
            description: 'Detecção de tempestades solares, ejeções de massa coronal (CME) e alertas de vento solar.'
        },
        {
            title: 'Galeria APOD NASA',
            path: '/apod',
            icon: Camera,
            color: '#9900ff',
            tag: 'ASTRONOMY PICTURE OF THE DAY',
            description: 'Imagens diárias de altíssima resolução capturadas pelo telescópio Hubble, James Webb e sondas espaciais.'
        }
    ];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px', overflowY: 'auto' }}>
            {/* Hero Header */}
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--cyber-cyan)', padding: '6px 16px', borderRadius: '20px', color: 'var(--cyber-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '16px' }}>
                        <Activity size={16} className="animate-spin-slow" /> ASTROWATCH SENTINEL PLATFORM v2.5
                    </div>
                    <h1 className="tactical-title" style={{ fontSize: '2.8rem', color: 'white', letterSpacing: '2px', marginBottom: '16px' }}>
                        EXPLORE O UNIVERSO DEEP SPACE
                    </h1>
                    <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Central de comando e inteligência astronômica da OrbeSystems. Rastreie corpos celestes, monitore clima solar e navegue pelo cosmos em tempo real.
                    </p>
                </motion.div>
            </div>

            {/* Grid of Modules */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                {modules.map((mod, index) => {
                    const Icon = mod.icon;
                    return (
                        <motion.div
                            key={mod.path}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            onClick={() => navigate(mod.path)}
                            className="glass-panel"
                            style={{
                                padding: '24px',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                borderLeft: `4px solid ${mod.color}`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5), 0 0 20px ${mod.color}33`;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ background: `${mod.color}20`, border: `1px solid ${mod.color}`, padding: '10px', borderRadius: '8px' }}>
                                        <Icon size={28} color={mod.color} />
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: mod.color, background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: '4px', border: `1px solid ${mod.color}40` }}>
                                        {mod.tag}
                                    </span>
                                </div>
                                <h3 className="tactical-title" style={{ fontSize: '1.3rem', color: 'white', marginBottom: '8px' }}>
                                    {mod.title}
                                </h3>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                                    {mod.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: mod.color, fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                <span>ACESSAR MÓDULO</span> <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

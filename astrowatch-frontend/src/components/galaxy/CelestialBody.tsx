import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CelestialBodyData } from '../../services/galaxyData';
import { createAtmosphereMaterial } from './AtmosphereMaterial';
import { Html } from '@react-three/drei';

interface Props {
    data: CelestialBodyData;
    onBodyClick: (data: CelestialBodyData) => void;
    isFocused?: boolean;
}

export default function CelestialBody({ data, onBodyClick, isFocused = false }: Props) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);

    // Atmosphere shader material memoization
    const atmosphereMat = useMemo(() => {
        if (data.atmosphereColor) {
            return createAtmosphereMaterial(data.atmosphereColor, 0.65, 3.5);
        }
        return null;
    }, [data.atmosphereColor]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.008; // Planet axis spin
        }
        if (groupRef.current && data.orbitSpeed > 0) {
            groupRef.current.rotation.y = clock.getElapsedTime() * data.orbitSpeed; // Solar orbit
        }
    });

    const isSun = data.id === 'sun';

    return (
        <group ref={groupRef}>
            <group position={[data.orbitRadius, 0, 0]}>
                {/* Sun Core Light & Flares */}
                {isSun && (
                    <>
                        <pointLight intensity={3.5} color="#ffffff" distance={300} decay={0.5} />
                        <mesh>
                            <sphereGeometry args={[data.radius * 1.2, 32, 32]} />
                            <meshBasicMaterial color="#ffea00" transparent opacity={0.25} />
                        </mesh>
                        <mesh>
                            <sphereGeometry args={[data.radius * 1.5, 32, 32]} />
                            <meshBasicMaterial color="#ff7700" transparent opacity={0.12} />
                        </mesh>
                    </>
                )}

                {/* Main Celestial Body Mesh */}
                <mesh
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        onBodyClick(data);
                    }}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                    <sphereGeometry args={[data.radius, 32, 32]} />
                    <meshStandardMaterial
                        color={data.color}
                        emissive={isSun ? data.color : isFocused ? data.color : '#000000'}
                        emissiveIntensity={isSun ? 1.2 : isFocused ? 0.4 : 0.05}
                        roughness={isSun ? 0.1 : 0.7}
                        metalness={0.2}
                    />

                    {/* Fresnel Atmosphere Mesh Layer */}
                    {atmosphereMat && !isSun && (
                        <mesh scale={[1.15, 1.15, 1.15]}>
                            <sphereGeometry args={[data.radius, 32, 32]} />
                            <primitive object={atmosphereMat} attach="material" />
                        </mesh>
                    )}

                    {/* Cyberpunk Selection Focus Wireframe */}
                    <mesh>
                        <sphereGeometry args={[data.radius * (isFocused ? 1.25 : 1.08), 16, 16]} />
                        <meshBasicMaterial
                            color={isFocused ? '#00f0ff' : data.color}
                            wireframe
                            transparent
                            opacity={isFocused ? 0.4 : 0.08}
                        />
                    </mesh>
                </mesh>

                {/* Planetary Rings (Saturn / Uranus) */}
                {data.hasRings && data.ringRadiusInner && data.ringRadiusOuter && (
                    <group rotation={[Math.PI / 3, 0, 0]}>
                        <mesh>
                            <ringGeometry args={[data.ringRadiusInner, data.ringRadiusOuter, 64]} />
                            <meshStandardMaterial
                                color={data.ringColor || data.color}
                                side={THREE.DoubleSide}
                                transparent
                                opacity={0.8}
                                roughness={0.5}
                            />
                        </mesh>
                    </group>
                )}

                {/* Cyberpunk Dynamic HTML Label */}
                <Html distanceFactor={70} position={[0, data.radius + 1.8, 0]} center>
                    <div style={{
                        color: isFocused ? '#00f0ff' : data.color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        background: 'rgba(3, 8, 20, 0.85)',
                        backdropFilter: 'blur(4px)',
                        padding: '3px 8px',
                        border: `1px solid ${isFocused ? '#00f0ff' : 'rgba(255,255,255,0.15)'}`,
                        borderRadius: '3px',
                        boxShadow: isFocused ? '0 0 12px rgba(0, 240, 255, 0.5)' : 'none',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                    }}>
                        <span>{data.emoji}</span>
                        <span>{data.name}</span>
                    </div>
                </Html>

                {/* Render Moons recursively */}
                {data.moons && data.moons.map((moon) => (
                    <CelestialBody
                        key={moon.id}
                        data={moon}
                        onBodyClick={onBodyClick}
                        isFocused={false}
                    />
                ))}
            </group>

            {/* Orbit Path Ring */}
            {data.orbitRadius > 0 && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[data.orbitRadius - 0.15, data.orbitRadius + 0.15, 128]} />
                    <meshBasicMaterial
                        color={isFocused ? '#00f0ff' : '#4a6080'}
                        transparent
                        opacity={isFocused ? 0.3 : 0.08}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            )}
        </group>
    );
}

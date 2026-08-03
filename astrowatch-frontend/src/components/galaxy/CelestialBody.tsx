import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { CelestialBodyData } from '../../services/galaxyData';
import { Html } from '@react-three/drei';

interface Props {
    data: CelestialBodyData;
    onBodyClick: (data: CelestialBodyData) => void;
}

export default function CelestialBody({ data, onBodyClick }: Props) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01; // Spin the planet
        }
        if (groupRef.current && data.orbitSpeed > 0) {
            groupRef.current.rotation.y = clock.getElapsedTime() * data.orbitSpeed; // Orbit the center
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                position={[data.orbitRadius, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    onBodyClick(data);
                }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <sphereGeometry args={[data.radius, 32, 32]} />
                <meshStandardMaterial
                    color={data.color}
                    emissive={data.type === 'star' ? data.color : '#000000'}
                    emissiveIntensity={data.type === 'star' ? 0.5 : 0}
                    wireframe={false}
                />

                {/* Tactical Ring / Wireframe overlay for selected/cyberpunk effect */}
                <mesh>
                    <sphereGeometry args={[data.radius * 1.05, 16, 16]} />
                    <meshBasicMaterial color={data.color} wireframe transparent opacity={0.1} />
                </mesh>

                {/* Name Label */}
                <Html distanceFactor={50} position={[0, data.radius + 1.5, 0]} center>
                    <div style={{
                        color: data.color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '2px 6px',
                        border: `1px solid ${data.color}`,
                        borderRadius: '2px',
                        pointerEvents: 'none'
                    }}>
                        {data.name}
                    </div>
                </Html>
            </mesh>

            {/* Orbit Trail */}
            {data.orbitRadius > 0 && (
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[data.orbitRadius - 0.1, data.orbitRadius + 0.1, 128]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Render Moons recursively */}
            {data.moons && data.moons.map((moon) => (
                <group position={[data.orbitRadius, 0, 0]} key={moon.id}>
                    <CelestialBody data={moon} onBodyClick={onBodyClick} />
                </group>
            ))}
        </group>
    );
}

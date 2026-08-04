import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Stars } from '@react-three/drei';
import { solarSystemData } from '../../services/galaxyData';
import type { CelestialBodyData } from '../../services/galaxyData';
import CelestialBody from './CelestialBody';
import GalacticParticles from './GalacticParticles';
import AsteroidBelt from './AsteroidBelt';

interface Props {
    onSelectBody: (data: CelestialBodyData) => void;
    exoplanets?: CelestialBodyData[];
    selectedBody?: CelestialBodyData | null;
}

export default function GalaxyScene({ onSelectBody, exoplanets = [], selectedBody = null }: Props) {
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (!controlsRef.current) return;

        if (selectedBody) {
            const r = selectedBody.orbitRadius;
            if (r === 0) {
                // Focus on Sun
                controlsRef.current.setLookAt(0, 15, 25, 0, 0, 0, true);
            } else {
                // Fly smoothly to target planet's radial position
                const targetDist = selectedBody.radius * 3 + 8;
                controlsRef.current.setLookAt(
                    r + targetDist,
                    targetDist * 0.4,
                    targetDist * 0.8,
                    r,
                    0,
                    0,
                    true
                );
            }
        } else {
            // Zoom out overview of entire Solar System
            controlsRef.current.setLookAt(0, 70, 160, 0, 0, 0, true);
        }
    }, [selectedBody]);

    return (
        <Canvas camera={{ position: [0, 70, 160], fov: 45 }} style={{ width: '100%', height: '100%' }}>
            <color attach="background" args={['#020409']} />
            <fog attach="fog" args={['#020409', 180, 450]} />

            {/* Ambient & Core Solar Lighting */}
            <ambientLight intensity={0.15} />

            {/* Camera Controls with Locked Safety Boundaries */}
            <CameraControls
                ref={controlsRef}
                maxDistance={350}
                minDistance={3}
                maxPolarAngle={Math.PI / 2 + 0.1} // Prevent going upside down under plane
                minPolarAngle={0.1}
            />

            {/* Deep Space Atmosphere */}
            <Stars radius={250} depth={80} count={12000} factor={4} saturation={0.5} fade speed={1.5} />
            <GalacticParticles />

            {/* Instanced Asteroid Belt between Mars & Jupiter */}
            <AsteroidBelt count={1500} innerRadius={34} outerRadius={44} />

            {/* Solar System Celestial Bodies */}
            {solarSystemData.map(body => (
                <CelestialBody
                    key={body.id}
                    data={body}
                    onBodyClick={onSelectBody}
                    isFocused={selectedBody?.id === body.id}
                />
            ))}

            {/* Procedural Exoplanets */}
            {exoplanets.map(body => (
                <CelestialBody
                    key={body.id}
                    data={body}
                    onBodyClick={onSelectBody}
                    isFocused={selectedBody?.id === body.id}
                />
            ))}
        </Canvas>
    );
}

import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Stars } from '@react-three/drei';
import { solarSystemData } from '../../services/galaxyData';
import type { CelestialBodyData } from '../../services/galaxyData';
import CelestialBody from './CelestialBody';
import GalacticParticles from './GalacticParticles';

interface Props {
    onSelectBody: (data: CelestialBodyData) => void;
    exoplanets?: CelestialBodyData[];
    selectedBody?: CelestialBodyData | null;
}

export default function GalaxyScene({ onSelectBody, exoplanets = [], selectedBody = null }: Props) {
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        if (controlsRef.current) {
            if (selectedBody) {
                const r = selectedBody.orbitRadius;
                if (r === 0) { // Sun
                    controlsRef.current.setLookAt(0, 30, 60, 0, 0, 0, true);
                } else {
                    // Fly close to the planet's general radius ring
                    controlsRef.current.setLookAt(r + 5, 5, 20, r, 0, 0, true);
                }
            } else {
                // Zoom-out overview
                controlsRef.current.setLookAt(0, 100, 150, 0, 0, 0, true);
            }
        }
    }, [selectedBody]);
    return (
        <Canvas camera={{ position: [0, 40, 80], fov: 45 }}>
            <color attach="background" args={['#03050a']} />

            <ambientLight intensity={0.1} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" distance={200} />

            <CameraControls
                ref={controlsRef}
                maxDistance={400}
                minDistance={2}
            />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <GalacticParticles />

            {solarSystemData.map(body => (
                <CelestialBody key={body.id} data={body} onBodyClick={onSelectBody} />
            ))}

            {exoplanets.map(body => (
                <CelestialBody key={body.id} data={body} onBodyClick={onSelectBody} />
            ))}
        </Canvas>
    );
}

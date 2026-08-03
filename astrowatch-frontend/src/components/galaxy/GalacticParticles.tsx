import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GalacticParticles() {
    const pointsRef = useRef<THREE.Points>(null!);

    const count = 5000;
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 100 + Math.random() * 200; // spread from 100 to 300
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions.set([x, y, z], i * 3);

            // Random bluish/whitish colors for stars
            const color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, Math.random() * 0.5 + 0.5);
            colors.set([color.r, color.g, color.b], i * 3);
        }
        return [positions, colors];
    }, [count]);

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.0005;
            pointsRef.current.rotation.z += 0.0002;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" count={count} args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.5} vertexColors transparent opacity={0.8} />
        </points>
    );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
    count?: number;
    innerRadius?: number;
    outerRadius?: number;
}

export default function AsteroidBelt({ count = 1500, innerRadius = 35, outerRadius = 42 }: Props) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    // Generate random orbits and matrices for all asteroids
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const asteroidData = useMemo(() => {
        return Array.from({ length: count }).map(() => {
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const angle = Math.random() * Math.PI * 2;
            const yOffset = (Math.random() - 0.5) * 3; // slight inclination variance
            const scale = 0.08 + Math.random() * 0.25; // asteroid sizes
            const speed = (0.0005 + Math.random() * 0.001) * (Math.random() > 0.5 ? 1 : -1);
            const rotationSpeed = (Math.random() - 0.5) * 0.02;

            return { radius, angle, yOffset, scale, speed, rotationSpeed, currentAngle: angle };
        });
    }, [count, innerRadius, outerRadius]);

    useFrame(() => {
        if (!meshRef.current) return;

        asteroidData.forEach((ast, i) => {
            ast.currentAngle += ast.speed;
            const x = Math.cos(ast.currentAngle) * ast.radius;
            const z = Math.sin(ast.currentAngle) * ast.radius;

            dummy.position.set(x, ast.yOffset, z);
            dummy.rotation.x += ast.rotationSpeed;
            dummy.rotation.y += ast.rotationSpeed;
            dummy.scale.set(ast.scale, ast.scale, ast.scale);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
                color="#8a8a9e"
                roughness={0.9}
                metalness={0.3}
                wireframe={false}
            />
        </instancedMesh>
    );
}

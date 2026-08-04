import * as THREE from 'three';

/**
 * Creates a custom ShaderMaterial that implements a Fresnel scattering effect
 * to produce a glowing atmospheric halo around celestial bodies.
 */
export function createAtmosphereMaterial(colorHex: string = '#00f0ff', coefficient: number = 0.5, power: number = 4.0): THREE.ShaderMaterial {
    const color = new THREE.Color(colorHex);

    return new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            uniform float uCoefficient;
            uniform float uPower;
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
                // Fresnel intensity calculation: dot product of view vector and normal
                float intensity = pow(uCoefficient - dot(vNormal, vPositionNormal), uPower);
                gl_FragColor = vec4(uColor, intensity);
            }
        `,
        uniforms: {
            uColor: { value: color },
            uCoefficient: { value: coefficient },
            uPower: { value: power }
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false
    });
}

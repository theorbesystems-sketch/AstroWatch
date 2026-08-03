export interface CelestialBodyData {
    id: string;
    name: string;
    type: 'star' | 'planet' | 'moon';
    radius: number; // For scaling 3D objects
    orbitRadius: number; // Distance from the center (sun)
    orbitSpeed: number; // Speed of revolution
    color: string;
    textureUrl?: string; // Optional realistic texture
    description: string;
    moons?: CelestialBodyData[];
}

export const solarSystemData: CelestialBodyData[] = [
    {
        id: 'sun',
        name: 'Sun',
        type: 'star',
        radius: 5,
        orbitRadius: 0,
        orbitSpeed: 0,
        color: '#ffdd00',
        description: 'The star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.'
    },
    {
        id: 'mercury',
        name: 'Mercury',
        type: 'planet',
        radius: 0.5,
        orbitRadius: 10,
        orbitSpeed: 0.04,
        color: '#a8a8a8',
        description: 'The smallest planet in the Solar System and the closest to the Sun.'
    },
    {
        id: 'venus',
        name: 'Venus',
        type: 'planet',
        radius: 1.2,
        orbitRadius: 16,
        orbitSpeed: 0.015,
        color: '#e0c9a6',
        description: 'The second planet from the Sun. It is a terrestrial planet and is sometimes called Earth\'s "sister planet" because of their similar size, mass, proximity to the Sun, and bulk composition.'
    },
    {
        id: 'earth',
        name: 'Earth',
        type: 'planet',
        radius: 1.3,
        orbitRadius: 22,
        orbitSpeed: 0.01,
        color: '#2e7bf6',
        description: 'Our home planet is the third planet from the Sun, and the only place we know of so far thats inhabited by living things.',
        moons: [
            {
                id: 'moon',
                name: 'Moon',
                type: 'moon',
                radius: 0.3,
                orbitRadius: 2,
                orbitSpeed: 0.05,
                color: '#d9d9d9',
                description: 'Earth\'s only natural satellite.'
            }
        ]
    },
    {
        id: 'mars',
        name: 'Mars',
        type: 'planet',
        radius: 0.7,
        orbitRadius: 30,
        orbitSpeed: 0.008,
        color: '#c1440e',
        description: 'The fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury.'
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        type: 'planet',
        radius: 3.5,
        orbitRadius: 45,
        orbitSpeed: 0.002,
        color: '#c99975',
        description: 'The fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined.'
    },
    {
        id: 'saturn',
        name: 'Saturn',
        type: 'planet',
        radius: 3.0,
        orbitRadius: 65,
        orbitSpeed: 0.0009,
        color: '#ebd196',
        description: 'The sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth.'
    },
    {
        id: 'uranus',
        name: 'Uranus',
        type: 'planet',
        radius: 2.0,
        orbitRadius: 85,
        orbitSpeed: 0.0004,
        color: '#a1e4e6',
        description: 'The seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus, who, according to Greek mythology, was the grandfather of Zeus (Jupiter) and father of Cronus (Saturn).'
    },
    {
        id: 'neptune',
        name: 'Neptune',
        type: 'planet',
        radius: 1.9,
        orbitRadius: 105,
        orbitSpeed: 0.0001,
        color: '#3452bd',
        description: 'The eighth planet from the Sun and the farthest known solar planet. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.'
    }
];

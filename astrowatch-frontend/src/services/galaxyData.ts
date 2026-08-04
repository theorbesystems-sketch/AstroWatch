export interface CelestialBodyData {
    id: string;
    name: string;
    type: 'star' | 'planet' | 'moon';
    classification: string;
    emoji: string;
    radius: number; // For scaling 3D objects
    orbitRadius: number; // Distance from center
    orbitSpeed: number; // Speed of revolution
    color: string;
    atmosphereColor?: string;
    hasRings?: boolean;
    ringColor?: string;
    ringRadiusInner?: number;
    ringRadiusOuter?: number;
    description: string;
    moons?: CelestialBodyData[];
}

export const solarSystemData: CelestialBodyData[] = [
    {
        id: 'sun',
        name: 'Sol (Estrela Central)',
        type: 'star',
        classification: 'Anã Amarela (G2V)',
        emoji: '☀️',
        radius: 6,
        orbitRadius: 0,
        orbitSpeed: 0,
        color: '#ffaa00',
        atmosphereColor: '#ffea00',
        description: 'A estrela no centro do nosso Sistema Solar. Representa 99.86% de toda a massa do sistema e gera energia por fusão nuclear de hidrogênio em hélio.'
    },
    {
        id: 'mercury',
        name: 'Mercúrio',
        type: 'planet',
        classification: 'Planeta Rochoso',
        emoji: '🪨',
        radius: 0.6,
        orbitRadius: 10,
        orbitSpeed: 0.035,
        color: '#a8a8a8',
        atmosphereColor: '#6e6e6e',
        description: 'O menor e mais interno planeta. Possui temperaturas extremas variando de -180°C à noite a +430°C durante o dia.'
    },
    {
        id: 'venus',
        name: 'Vênus',
        type: 'planet',
        classification: 'Planeta Rochoso / Efeito Estufa',
        emoji: '🟡',
        radius: 1.1,
        orbitRadius: 16,
        orbitSpeed: 0.02,
        color: '#e0c9a6',
        atmosphereColor: '#ffcc66',
        description: 'O planeta mais quente do sistema devido ao efeito estufa descontrolado em sua densa atmosfera de CO2 e nuvens de ácido sulfúrico.'
    },
    {
        id: 'earth',
        name: 'Terra',
        type: 'planet',
        classification: 'Planeta Habito-Telúrico',
        emoji: '🌍',
        radius: 1.3,
        orbitRadius: 22,
        orbitSpeed: 0.012,
        color: '#2e7bf6',
        atmosphereColor: '#00f0ff',
        description: 'Nosso planeta natal. O único corpo celeste conhecido que abriga vida e possui água em estado líquido na superfície.',
        moons: [
            {
                id: 'moon',
                name: 'Lua',
                type: 'moon',
                classification: 'Satélite Natural',
                emoji: '🌙',
                radius: 0.35,
                orbitRadius: 2.2,
                orbitSpeed: 0.05,
                color: '#d9d9d9',
                description: 'O único satélite natural da Terra. Responsável pelas marés terrestres e estabilização do eixo planetário.'
            }
        ]
    },
    {
        id: 'mars',
        name: 'Marte',
        type: 'planet',
        classification: 'Planeta Rochoso / Deserto Vermelho',
        emoji: '🔴',
        radius: 0.85,
        orbitRadius: 30,
        orbitSpeed: 0.009,
        color: '#c1440e',
        atmosphereColor: '#ff5533',
        description: 'O Planeta Vermelho. Abriga o Olympus Mons, o maior vulcão do Sistema Solar, e os desfiladeiros de Valles Marineris.'
    },
    {
        id: 'jupiter',
        name: 'Júpiter',
        type: 'planet',
        classification: 'Gigante Gasoso',
        emoji: '🪐',
        radius: 3.8,
        orbitRadius: 48,
        orbitSpeed: 0.004,
        color: '#c99975',
        atmosphereColor: '#e0aa80',
        description: 'O maior planeta do Sistema Solar. Possui mais que o dobro da massa de todos os outros planetas juntos e a famosa Grande Mancha Vermelha.',
        moons: [
            {
                id: 'io',
                name: 'Io',
                type: 'moon',
                classification: 'Satélite Vulcânico',
                emoji: '🌋',
                radius: 0.3,
                orbitRadius: 4.8,
                orbitSpeed: 0.07,
                color: '#e6c843',
                description: 'O corpo com maior atividade vulcânica de todo o Sistema Solar.'
            },
            {
                id: 'europa',
                name: 'Europa',
                type: 'moon',
                classification: 'Satélite Oceânico Congelado',
                emoji: '❄️',
                radius: 0.3,
                orbitRadius: 5.8,
                orbitSpeed: 0.04,
                color: '#c5d3e8',
                description: 'Possui uma crosta de gelo sobre um oceano líquido subterrâneo global com potencial biosfera.'
            }
        ]
    },
    {
        id: 'saturn',
        name: 'Saturno',
        type: 'planet',
        classification: 'Gigante Anelar Gasoso',
        emoji: '🪐',
        radius: 3.2,
        orbitRadius: 68,
        orbitSpeed: 0.002,
        color: '#ebd196',
        atmosphereColor: '#ffdd99',
        hasRings: true,
        ringColor: '#d6be8a',
        ringRadiusInner: 4.2,
        ringRadiusOuter: 7.5,
        description: 'Famoso por seu espetacular e complexo sistema de anéis composto por bilhões de partículas de gelo e rocha.',
        moons: [
            {
                id: 'titan',
                name: 'Titã',
                type: 'moon',
                classification: 'Satélite Atmosférico',
                emoji: '🟠',
                radius: 0.4,
                orbitRadius: 8.5,
                orbitSpeed: 0.03,
                color: '#d69e45',
                description: 'O único satélite natural com atmosfera densa e lagos de metano e etano líquidos na superfície.'
            }
        ]
    },
    {
        id: 'uranus',
        name: 'Urano',
        type: 'planet',
        classification: 'Gigante de Gelo',
        emoji: '🔷',
        radius: 2.2,
        orbitRadius: 88,
        orbitSpeed: 0.001,
        color: '#a1e4e6',
        atmosphereColor: '#66ffff',
        hasRings: true,
        ringColor: '#66cccc',
        ringRadiusInner: 2.8,
        ringRadiusOuter: 3.8,
        description: 'Um gigante de gelo com rotação deitada (eixo inclinado a 98 graus), provavelmente devido a uma colisão primordial.'
    },
    {
        id: 'neptune',
        name: 'Netuno',
        type: 'planet',
        classification: 'Gigante de Gelo / Tempestuoso',
        emoji: '🔵',
        radius: 2.1,
        orbitRadius: 108,
        orbitSpeed: 0.0006,
        color: '#3452bd',
        atmosphereColor: '#3388ff',
        description: 'O planeta mais distante do Sol. Registrar os ventos mais velozes do Sistema Solar, ultrapassando 2.100 km/h.'
    }
];

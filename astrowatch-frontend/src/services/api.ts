const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const fetchDonkiData = async () => {
    try {
        const [cme, gst, flr] = await Promise.all([
            fetch(`${BASE_URL}/donki/cme`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/donki/geomagnetic-storm`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/donki/solar-flare`).then(r => r.json()).catch(() => [])
        ]);
        return { cme, gst, flr };
    } catch (err) {
        console.warn("API Backend offline. Falling back to Mock Data for DONKI.", err);
        return {
            cme: [{ note: "Simulated CME Data (Backend Offline)", startTime: "2026-08-01T12:00:00Z" }],
            gst: [{ note: "Simulated GST Data (Backend Offline)" }],
            flr: [{ note: "Simulated FLR Data (Backend Offline)", classType: "X1.0" }]
        };
    }
};

export const fetchNeoWsData = async () => {
    try {
        const res = await fetch(`${BASE_URL}/neows/feed`);
        return await res.json();
    } catch (err) {
        console.warn("API Backend offline. Falling back to Mock Data for NeoWs.", err);
        return {
            near_earth_objects: [
                { name: "2026 MX FAKE", is_potentially_hazardous_asteroid: true, estimated_diameter: { meters: { estimated_diameter_max: 300 } }, orbesystems_risk_score: 9.8 },
                { name: "2026 APOD MOCK", is_potentially_hazardous_asteroid: false, estimated_diameter: { meters: { estimated_diameter_max: 50 } }, orbesystems_risk_score: 2.1 }
            ]
        };
    }
};

// Extracted EONET
export const fetchEonetData = async () => {
    try {
        const res = await fetch(`${BASE_URL}/earth/eonet`);
        if (!res.ok) throw new Error("Failed to fetch EONET");
        return await res.json();
    } catch (err) {
        console.warn("API Backend offline. Falling back to Mock EONET Fires.", err);
        return {
            events: [
                { categories: [{ id: "wildfires" }], geometries: [{ coordinates: [-46.6, -23.5] }] }, // SP
                { categories: [{ id: "severeStorms" }], geometries: [{ coordinates: [-122.4, 37.7] }] }, // SF
                { categories: [{ id: "volcanos" }], geometries: [{ coordinates: [139.7, 35.6] }] } // Tokyo area
            ]
        };
    }
};

export const fetchApodData = async () => {
    try {
        const res = await fetch(`${BASE_URL}/earth/apod`);
        if (!res.ok) throw new Error("Failed to fetch APOD");
        return await res.json();
    } catch (err) {
        console.warn("API Backend offline. Falling back to Mock APOD.", err);
        return {
            title: "Orion Nebula Complex (Mock Offline Mode)",
            date: new Date().toISOString().split('T')[0],
            explanation: "The AstroWatch Backend Python API is currently offline. Exhibiting local cache. This massive stellar nursery showcases intense planetary formations and cosmic dust. Establish connection with the backend to resume live NASA telemetry.",
            url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
            media_type: "image",
            hdurl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
            copyright: "OrbeSystems Offline Proxy"
        };
    }
};

export const fetchSpaceXNextLaunch = async () => {
    try {
        const res = await fetch(`${BASE_URL}/spacex/launches/next`);
        if (!res.ok) throw new Error("Failed to fetch SpaceX telemetry");
        return await res.json();
    } catch (err) {
        console.error("API error SpaceX", err);
        return null;
    }
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const fetchDonkiData = async () => {
    try {
        const [cme, gst, flr] = await Promise.all([
            fetch(`${BASE_URL}/nasa/donki/cme`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/nasa/donki/gst`).then(r => r.json()).catch(() => []),
            fetch(`${BASE_URL}/nasa/donki/flr`).then(r => r.json()).catch(() => [])
        ]);
        return { cme, gst, flr };
    } catch(err) {
        console.error("API error", err);
        return { cme: [], gst: [], flr: [] };
    }
};

export const fetchNeoWsData = async () => {
    try {
        const res = await fetch(`${BASE_URL}/nasa/neo/feed`);
        return await res.json();
    } catch (err) {
        console.error("API error NeoWs", err);
        return { near_earth_objects: {} };
    }
};

// ... Future EPIC endpoints can be added here

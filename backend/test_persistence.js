import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testPersistence() {
    try {
        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'ngo@pawmitra.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('✅ Logged in. Token:', token.substring(0, 10) + '...');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Create Incident
        console.log('\n2. Creating test incident...');
        const incidentData = {
            description: 'Test Persistence Incident ' + Date.now(),
            location: { coordinates: [77.1025, 28.7041] },
            imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' // 1x1 pixel
        };

        // Create
        const createRes = await axios.post(`${API_URL}/incidents`, incidentData, { headers });
        const newIncidentId = createRes.data.incident._id;
        console.log('✅ Incident created:', newIncidentId);

        // 3. Fetch Active Incidents IMMEDIATE
        console.log('\n3. Fetching active incidents immediately...');
        const fetchRes = await axios.get(`${API_URL}/incidents`, {
            params: { status: 'active', limit: 10 },
            headers
        });

        const found = fetchRes.data.incidents.find(i => i._id === newIncidentId);
        if (found) {
            console.log('✅ Found incident in active list!');
            console.log('Status:', found.status);
        } else {
            console.log('❌ Incident NOT found in active list!');
            console.log('Total returned:', fetchRes.data.incidents.length);
            console.log('IDs returned:', fetchRes.data.incidents.map(i => i._id));
        }

    } catch (error) {
        console.error('❌ Error:', error.response ? error.response.data : error.message);
    }
}

testPersistence();

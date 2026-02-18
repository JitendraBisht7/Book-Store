const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
    try {
        console.log('--- Starting Backend Smoke Test ---');

        // 1. Register User
        const uniqueSuffix = Date.now();
        const user = {
            username: `testuser_${uniqueSuffix}`,
            email: `test_${uniqueSuffix}@example.com`,
            password: 'password123'
        };

        console.log(`\n1. Registering user: ${user.username}...`);
        try {
            await axios.post(`${API_URL}/auth/register`, user);
            console.log('✅ Registration successful');
        } catch (error) {
            console.error('❌ Registration failed:', error.response?.data || error.message);
        }

        // 2. Login User
        console.log(`\n2. Logging in...`);
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: user.email,
                password: user.password
            });
            token = res.data.token;
            console.log('✅ Login successful. Token received.');
        } catch (error) {
            console.error('❌ Login failed:', error.response?.data || error.message);
            return; // Cannot proceed without token
        }

        const authHeaders = { headers: { Authorization: token } };

        // 3. Get Products
        console.log(`\n3. Fetching products...`);
        let productId;
        try {
            const res = await axios.get(`${API_URL}/products`);
            console.log(`✅ Fetched ${res.data.products.length} products`);
            if (res.data.products.length > 0) {
                productId = res.data.products[0]._id;
            }
        } catch (error) {
            console.error('❌ Fetch products failed:', error.response?.data || error.message);
        }

        // 4. Add to Favorites (if product exists)
        if (productId) {
            console.log(`\n4. Adding product ${productId} to favorites...`);
            try {
                const res = await axios.post(`${API_URL}/user/favorites/${productId}`, {}, authHeaders);
                console.log('✅ Added to favorites:', res.data);
            } catch (error) {
                console.error('❌ Add to favorites failed:', error.response?.data || error.message);
            }
        } else {
            console.log('\n⚠️ Skipping Favorites test (no products found)');
        }

        console.log('\n--- Backend Smoke Test Completed ---');

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

testBackend();

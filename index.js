// Load modules
// Express
const express = require('express');
const app = express();

// Redis
const redis = require('redis');

// Create Redis Client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect()

// Get all shoes
async function getShoes() {
    const shoes = await redisClient.json.get('shoe');
    return shoes;
}

app.get('/', (req, res) => {
    res.send(getShoes());
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
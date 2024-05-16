const express = require('express');
const redis = require('redis');

// Create Express
const app = express();
app.use(express.json()); 

// Connect Redis
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();


// Endpoint para retornar "Hello World" en el root
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Endpoint get specific shoe
app.get('/shoes', async (req, res) => {
    try {
        const shoeData = await redisClient.json.get('shoes', {path: '.'});
        res.json(shoeData);
    } catch (error) {
        res.status(500).json({error: 'Error retrieving data'});
    }
});

// Endpoint new shoe
app.post('/shoes', async (req, res) => {
    const newShoe = req.body;
    try {
        await redisClient.json.set(`shoes:${newShoe.id}`, '.', newShoe);
        res.status(201).send('Shoe added');
    } catch (error) {
        res.status(500).json({error: 'Error adding shoe'});
    }
});

// Port server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

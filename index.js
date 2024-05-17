// Load modules
// Express
const express = require('express');
const app = express();

// Redis
const redis = require('redis');

// CORS
const cors = require('cors');
app.use(cors());

// Create Redis Client
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

// Connect to Redis
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

app.get('/', async (req, res) => {
    res.send('Hello World!');
});

app.get('/shoes', async (req, res) => {
    if(req.body.color) {
        const shoesGet = await redisClient.json.get('shoe:', 'color', req.body.color);
        return res.send(shoesGet);
    } else {
        const shoesGet = await redisClient.json.get('shoe:');
        return res.send(shoesGet);
    }
});

app.post('/shoes', async (req, res) => {
    const shoe = {
        id: 1,
        name: 'Nike Air Max 90',
        color: 'White',
        price: 100
    }
    await redisClient.json.set('shoe:', '$', shoe, (err, reply) => {
        if (err) {
            console.log(err);
        }
    });
    return res.send('Shoe added')
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
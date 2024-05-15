const redis = require('redis');
const express = require('express');
const app = express();
const port = 3000;

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
}); //Creating a redis client
redisClient.on('error', (err) => console.log('Redis Client Error:', err)); //If there is an error, log it from redis
redisClient.on('connect', () => console.log('DB connected')); //If the connection is successful, log it
redisClient.connect();

app.use(express.json()); //Making all payloads be returned to the express server as json
//Basic Hello world for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

shoe = {
    id: 1,
    name: 'Nike',
    price: 101
}

//defining what to do when there is a post request on /shoes
app.post('/shoes', async (req, res) => {
    await redisClient.set('shoe:1', JSON.stringify(shoe));
    res.send('Shoe added');
    console.log('Shoe added');
});

//defining what to do when there is a get request on /shoes
app.get('/shoes', async (req, res) => {
    console.log('Received GET request to /shoes');
    const getShoe = await redisClient.get('shoe:1');
    res.send(getShoe);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
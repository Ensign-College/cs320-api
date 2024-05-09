const redis = require('redis');

// create and connect to a redis client
const redisClient = redis.createClient({
    host: 'localhost', // replace with your host, if not localhost
    port: 6379 // replace with your port, if not 6379
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect()

redisClient.on('error', function (err) {
    console.error('Redis error:', err);
});

const express = require('express')
const app = express()
const port = 3000

const shoe = {
    id: '1',
    name: 'Nike Air Max',
    price: '100',
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
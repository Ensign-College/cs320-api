const express = require('express')
const { RedisClient } = require('redis')
const redis = require("redis");
const {response} = require("express");
const app = express()
const port = 3000
const REDIS_HOST = "127.0.0.1";
const REDIS_PORT = 6379;

const redisClient = redis.createClient({

    host: REDIS_HOST,
    port: REDIS_PORT
});
redisClient.connect();


// redisClient.on('error', function(err) {
//     console.error('Error connecting to Redis', err);
// });

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/shoes', (request, response) => {


    response.send('Shoes Baby!')

})
app.post('/shoes', (request, response) => {
    redisClient.set('shoeCollection','red adidas')
    response.send('Shoes added!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
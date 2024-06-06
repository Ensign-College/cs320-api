const express = require('express')

const {createClient} = require('redis');
const REDIS_HOST = "127.0.0.1";
const REDIS_PORT = 6379;
const app = express();

// Use Environment Variables for Redis Host & Port
//const REDIS_HOST = process.env.REDIS_HOST;
//const REDIS_PORT = process.env.REDIS_PORT;

// Create Redis Client & Handle Connection Errors
const redisClient = createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
})

redisClient.connect().then(r => {
    console.log("Redis client connected");
});




redisClient.on('error', function(err) {
    console.error('Error connecting to Redis', err);
})

app.post('/shoes', (request, response) => {
    redisClient.set('shoeCollection','red adidas')
    response.send('Shoes added!')
})

// Refactor the Get Shoes Endpoint to Handle Errors & Return Result to Client
app.get('/shoes', async (request, response) => {
    let shoeData = ''
    console.log('bagelMound')
    shoeData = await redisClient.get('shoe2')
    console.log(shoeData);
    response.send(shoeData)


});
// Refactor the Post Shoes Endpoint to Handle Errors in Redis Set
//app.post('/shoes', (request, response) => {
//  redisClient.set('shoeCollection', 'red adidas', (err) => {
//    if (err) {
//      response.status(500).send(err);
//} else {
//  response.send('Shoes added!');
//}
//});



//});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000)


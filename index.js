const redis = require('redis');
const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
}); //Creating a redis client
redisClient.on('error', (err) => console.log('Redis Client Error:', err)); //If there is an error, log it from redis

const options = {
    origin: 'http://localhost:3000'
};
redisClient.on('connect', () => console.log('DB connected')); //If the connection is successful, log it
redisClient.connect();

app.use(express.json()); //Making all payloads be returned to the express server as json
app.use(cors(options)); //Allowing cors for the React app
//Basic Hello world for the home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//defining what to do when there is a post request on /shoes
app.post('/crocs', async (req, res) => {
    const crocsKeyPrefix = 'croc:';
    let id = req.body.id;
    let croc = req.body;
    await redisClient.set(crocsKeyPrefix + JSON.stringify(id), JSON.stringify(croc));
    res.send('Shoe added');
    console.log('Shoe added');
});

//defining what to do when there is a get request on /crocs
app.get('/crocs', async (req, res) => {
    console.log('Received GET request to /shoes');
    const getShoe = await redisClient.get('shoe:1');
    res.send(getShoe);
});

app.get('/search', async (req, res) => {
    // Get the search term from the query string
    const searchTerm = req.query.searchTerm;

    // Get all keys matching the pattern 'croc:*'
    const keys = await redisClient.keys('croc:*');

    // Filter keys that have a name containing the searchTerm
    let relevantShoes = [];
    for (let key of keys) {
        const shoe = JSON.parse(await redisClient.get(key));
        if (shoe.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            relevantShoes.push(key);
        }
    }

    // console.log("relevant Shoes: " + relevantShoes); testing

    // Retrieve the full shoe data for the relevant shoes
    let shoeData = [];
    if (relevantShoes.length > 0) {
        shoeData = await redisClient.mGet(relevantShoes);
    }

    // console.log("shoeData: " + shoeData) testing

    // Parse the shoe data into JavaScript objects
    const shoeObjects = shoeData.map(JSON.parse);

    // console.log(shoeObjects); testing

    // Send the shoeData back to the client as a JSON object
    res.json(shoeObjects);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
const redis = require('redis');
const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
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


app.get('/shoe/:id', async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;    // Construct the key based on the redis  data structure

    // Get the shoe data from redis
    let shoe = await redisClient.get(shoeKey);

    // Change the string Data into a JSON object
    let shoeData = JSON.parse(shoe);

    // Send the shoe data back to the client as a JSON object
    res.json(shoeData);
});

//defining what to do when there is a post request on /shoes
app.post('/shoes', async (req, res) => {
    const shoesKeyPrefix = 'shoe:';
    let id = req.body.id;
    let shoe = req.body;
    await redisClient.set(shoesKeyPrefix + JSON.stringify(id), JSON.stringify(shoe));
    res.send('Shoe added');
    console.log('Shoe added');
});

// Get all keys matching the pattern 'shoe:*'
app.get('/shoes', async (req, res) => {
    const shoeKeys = await redisClient.keys('shoe:*');
    const shoeData = [];

    for (const key of shoeKeys) { //Grabbing all the keys and pushing them to the shoeData array
        let data = await redisClient.get(key);
        shoeData.push(JSON.parse(data));
    }

    res.json(shoeData);
});

app.delete('/shoe/:id', async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;    // Construct the key based on the redis data structure

    // Delete the shoe data from redis
    let result = await redisClient.del(shoeKey);

    if (result === 1) {
        // If the shoe was successfully deleted
        res.json({ message: `Shoe with id ${shoeId} was deleted.` });
    } else {
        // If the shoe was not found in the database
        res.status(404).json({ message: `Shoe with id ${shoeId} not found.` });
    }
});

app.get('/search', async (req, res) => {
    // Get the search term from the query string
    const searchTerm = req.query.searchTerm;

    // Get all keys matching the pattern 'shoe:*'
    const keys = await redisClient.keys('shoe:*');

    // Filter keys that have a name containing the searchTerm
    let relevantShoes = [];
    for (let key of keys) {
        const shoe = JSON.parse(await redisClient.get(key));
        if (shoe.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            relevantShoes.push(key);
        }
    }

    // Retrieve the full shoe data for the relevant shoes
    let shoeData = [];
    if (relevantShoes.length > 0) {
        shoeData = await redisClient.mGet(relevantShoes);
    }

    // Parse the shoe data into JavaScript objects
    const shoeObjects = shoeData.map(JSON.parse);

    // Send the shoeData back to the client as a JSON object
    res.json(shoeObjects);
});

// PUT endpoint to update a shoe by ID
app.put('/shoe/:id', async (req, res) => {
    const shoeId = req.params.id;
    const shoeKey = `shoe:${shoeId}`;

    // Get the existing shoe data
    let existingShoe = await redisClient.get(shoeKey);

    if (existingShoe) {
        // Parse the existing shoe data
        existingShoe = JSON.parse(existingShoe);

        // Update the existing shoe data with the new data from the request body
        const updatedShoe = { ...existingShoe, ...req.body };

        // Save the updated shoe data back to Redis
        await redisClient.set(shoeKey, JSON.stringify(updatedShoe));

        // Send the updated shoe data back to the client
        res.json(updatedShoe);
    } else {
        res.status(404).json({ message: `Shoe with id ${shoeId} not found.` });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
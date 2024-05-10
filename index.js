const redis = require('redis');
const express = require('express');
const app = express();
const port = 3000;

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
}); //Creating a redis client

redisClient.on('error', (err) => console.log('Redis Client Error:', err)); //If there is an error, log it from redis

app.use(express.json()); //Making all the requests JSON

//defining what to do when there is a post request on /shoes
app.post('/shoes', (req, res) => {
    const { id, name, price } = req.body;
    const shoeObject = { id, name, price };

    redisClient.set(id, JSON.stringify(shoeObject), (err, reply) => {
        if (err) {
            console.error('Error storing shoe:', err);
            res.status(500).json({ error: 'Failed to store shoe in database' });
        } else {
            console.log('Shoe stored successfully');
            res.status(201).json({ message: 'Shoe stored successfully' });
        }
    });
});

//defining what to do when there is a get request on /shoes
app.get('/shoes/:id', (req, res) => {
    const shoeId = req.params.id;

    redisClient.get(shoeId, (err, reply) => {
        if (err) {
            console.error('Error retrieving shoe:', err);
            res.status(500).json({ error: 'Failed to retrieve shoe from database' });
        } else if (reply) {
            const shoeObject = JSON.parse(reply);
            res.status(200).json(shoeObject);
        } else {
            res.status(404).json({ error: 'Shoe not found' });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
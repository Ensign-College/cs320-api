// Erick Duran
const express = require('express');
const redis = require('redis');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuration 
const options = {
  origin: 'http://localhost:3000'
};

// Create Express app
const app = express();
app.use(express.json());
app.use(cors(options)); // frontend call backend
app.use(bodyParser.json()); // Middleware JSON

// Connect to Redis
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect and initialize data
redisClient.connect().then(async () => {
  console.log('Connected to Redis!');
});

// Endpoint to return "Hello World" on the root
app.get('/', (req, res) => {
  res.send('Hello World');
});


// Endpoint to get specific shoe by ID
app.get('/shoes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const shoe = await redisClient.get(`shoe:${id}`);
    if (shoe) {
      res.status(200).json(JSON.parse(shoe));
    } else {
      res.status(404).json({ error: 'Shoe not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

// Endpoint to save new shoe data
app.post('/shoes', async (req, res) => {
  const newShoe = req.body;
  try {
    await redisClient.set(`shoe:${newShoe.id}`, JSON.stringify(newShoe));
    res.status(201).send('Shoe added');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving shoe' });
  }
});


// Port server
const PORT = process.env.PORT || 3001; // Use 3001 as the default port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

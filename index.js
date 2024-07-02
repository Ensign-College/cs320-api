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
  try {
    // Optionally check if 'shoes' key exists and delete it if necessary
    const keyExists = await redisClient.exists('shoes');
    if (keyExists) {
      await redisClient.del('shoes');
      console.log('Existing shoes key deleted');
    }

    // Hardcode shoe data
    const initialShoeData = {
      id: 1234,
      name: 'My sick red adidas',
      color: 'red',
      owner: 'Initial Owner' // added owner field
    };
    // Store the hardcoded data in Redis using SET
    await redisClient.set('shoes', JSON.stringify(initialShoeData), (err) => {
      if (err) {
        console.log('Error initializing shoe data:', err);
      } else {
        console.log('Initial shoe data set in Redis');
      }
    });
  } catch (err) {
    console.log('Error initializing shoe data:', err);
  }
});

// Endpoint to return "Hello World" on the root
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Endpoint to get specific shoe
app.get('/shoes', async (req, res) => {
  try {
    redisClient.get('shoes', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Error retrieving data' });
      } else {
        res.json(JSON.parse(data));
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

// Endpoint to save new shoe data
app.post('/shoes', async (req, res) => {
  const newShoe = req.body;
  try {
    await redisClient.set(`shoe:${newShoe.id}`, JSON.stringify(newShoe), (err) => {
      if (err) {
        res.status(500).json({ error: 'Error updating shoe' });
      } else {
        res.status(201).send('Shoe updated');
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error updating shoe' });
  }
});

// Port server
const PORT = process.env.PORT || 3001; // Use 3001 as the default port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

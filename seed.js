const redis = require('redis');

// Conexión a Redis
const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Datos de los zapatos
const shoes = [
  {
    "name": "My sick blue adidas",
    "color": "blue",
    "owner": "Bro. Connole",
    "id": 1
  },
  {
    "name": "My sick red adidas",
    "color": "red",
    "owner": "Bro. Murdock",
    "id": 2
  },
  {
    "name": "Nikes",
    "color": "red",
    "owner": "Brandon",
    "id": 14
  },
  {
    "name": "Nikes cool",
    "color": "red",
    "owner": "Brandon J",
    "id": 15
  },
  {
    "name": "Crocs",
    "color": "Yellow and Blue",
    "owner": "Bro. Connole",
    "id": 16
  },
  {
    "name": "Sketchers",
    "color": "White",
    "owner": "Pedro",
    "id": 17
  }
];

// Función para agregar datos a Redis
const seedData = async () => {
  try {
    await redisClient.connect();
    for (let shoe of shoes) {
      await redisClient.set(`shoe:${shoe.id}`, JSON.stringify(shoe));
    }
    console.log('Data seeded successfully');
    await redisClient.quit();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Ejecutar la función de seed
seedData();

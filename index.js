// Load modules
// Express
const express = require("express");
const app = express();

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// File System
const fs = require("fs");
// Decycle function
function decycle(obj, stack = []) {
  if (!obj || typeof obj !== "object") return obj;

  if (stack.includes(obj)) return null;

  let s = stack.concat([obj]);

  return Array.isArray(obj)
    ? obj.map((x) => decycle(x, s))
    : Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, decycle(v, s)])
      );
}

// Redis
const redis = require("redis");

// CORS
const options = {
  origin: "http://localhost:3000",
};
const cors = require("cors");
app.use(cors(options));

// Create Redis Client
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

// Connect to Redis
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// Hello World Endpoint
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// Get all shoes from Redis Endpoint
app.get("/shoes", async (req, res) => {
  const query = req.query;
  if (query.owner) {
    const owner = query.owner;
    try {
      const shoes = await redisClient.ft.search("idx:shoe", `@owner:${owner}`);
      const shoesArray = shoes.documents.map((shoe) => {
        const refactID = shoe.id.split(":");
        return {
          id: refactID[1],
          color: shoe.value.color,
          brand: shoe.value.brand,
        };
      });
      return res.status(200).json({ owner: owner, shoes: shoesArray });
    } catch (error) {
      return res.status(404).send(error.message);
    }
  }
  const owners = await redisClient.SMEMBERS("owners");
  const jsonArray = [];
  for (const owner of owners) {
    try {
      const shoes = await redisClient.ft.search("idx:shoe", `@owner:${owner}`);
      const shoesArray = shoes.documents.map((shoe) => {
        const refactID = shoe.id.split(":");
        return {
          id: refactID[1],
          color: shoe.value.color,
          brand: shoe.value.brand,
        };
      });
      jsonArray.push({ owner: owner, shoes: shoesArray });
    } catch (error) {
      return res.status(404).send(error.message);
    }
  }
  return res.status(200).json(jsonArray);
});

// Add a shoe to Redis Endpoint
app.post("/shoes", async (req, res) => {
  const query = req.query;
  if (query.owner) {
    const owner = query.owner;
    const color = req.body.color;
    const brand = req.body.brand;
    if (brand && color) {
      const id = Math.floor(Math.random() * 100000);
      await redisClient.hSet(
        `shoe:${id}`,
        ["owner", owner, "color", color, "brand", brand],
        (err) => {
          if (err) {
            return res.status(400).send(err.message);
          }
        }
      );
      await redisClient.SADD("owners", owner);
      return res
        .status(201)
        .json({ id: id, owner: owner, color: color, brand: brand });
    }
    return res.status(400).send("Brand and color are required");
  }
  return res.status(400).send("Owner is required");
});

// Get a shoe from Redis Endpoint
app.get("/shoes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const shoe = await redisClient.hGetAll(`shoe:${id}`);
    const shoeJson = {
      id: id,
      owner: shoe.owner,
      color: shoe.color,
      brand: shoe.brand,
    };
    return res.status(200).json(shoeJson);
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

// Delete a shoe from Redis Endpoint
app.delete("/shoes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const owner = await redisClient.hGet(`shoe:${id}`, "owner");
    const response = await redisClient.del(`shoe:${id}`);
    if (response === 1) {
      const otherKeys = await redisClient.ft.search(
        "idx:shoe",
        `@owner:${owner}`
      );
      console.log(otherKeys);
      if (otherKeys.total === 0) {
        await redisClient.SREM("owners", owner);
      }
      return res.status(200).send("Shoe deleted from Redis");
    }
    return res.status(404).send("Shoe not found");
  } catch (error) {
    return res.status(404).send(error.message);
  }
});

// Add n-number of sample shoes to Redis Endpoint
app.post("/dev-shoes", async (req, res) => {
  const number = req.query.number;
  const owners = ["John", "Jane", "Doe"];
  const colors = ["red", "blue", "green"];
  const brands = ["nike", "adidas", "reebok"];
  if (!number) {
    number = 10;
  }
  const shoesArray = [];
  for (let index = 0; index < number; index++) {
    const shoe = {
      owner: owners[Math.floor(Math.random() * owners.length)],
      id: Math.floor(Math.random() * 100000),
      brand: brands[Math.floor(Math.random() * brands.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    shoesArray.push(shoe);
  }
  try {
    const multi = redisClient.multi();
    shoesArray.forEach((shoe) => {
      multi.hSet(`shoe:${shoe.id}`, [
        "owner",
        shoe.owner,
        "color",
        shoe.color,
        "brand",
        shoe.brand,
      ]);
      multi.SADD("owners", shoe.owner);
    });
    multi.exec();
  } catch (error) {
    return res.status(500).send(error.message);
  }
  return res
    .status(201)
    .json({ shoes: shoesArray, message: "Shoes added to Redis" });
});

app.delete("/dev-shoes", async (req, res) => {
  const response = await redisClient.flushAll();
  await redisClient.ft.create("idx:shoe", {
    owner: "TEXT",
    color: "TEXT",
    brand: "TEXT",
  });
  console.log(`All shoes deleted from Redis: ${response}`);
  return res.status(200).send("All shoes deleted from Redis");
});

// Get all owners from Redis Endpoint
app.get("/owners", async (req, res) => {
  const owners = await redisClient.SMEMBERS("owners");
  res.send(owners);
});

// Define a port
const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Load Environment Variables
require("dotenv").config();

// Express
const express = require("express");
const app = express();

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// CORS
const options = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Accepts, Authorization",
};
const cors = require("cors");
app.use(cors(options));

// User Routes
const userRoutes = require("./routes/user_routes");
app.use(userRoutes);

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

// MongoDB
const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI);

// PostgreSQL

// Redis
const redis = require("redis");
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// Hello World Endpoint
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// Define a port
const port = process.env.PORT || 3001;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

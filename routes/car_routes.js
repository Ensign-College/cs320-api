const express = require("express");
const Car = require("../models/car");
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const { auth } = require("../middleware/auth");
const router = express.Router();
const carController = require("../controllers/car_controller");

// Get cars route
router.get("/cars", auth, carController.getCars);

// Get car route
router.get("/car/:id", auth, carController.getCar);

// Create car route
router.post(
  "/car",
  auth,
  [
    body("stockId").trim().isLength({ min: 1 }),
    body("make").trim().isLength({ min: 1 }),
    body("model").trim().isLength({ min: 1 }),
    body("year").isInt(),
    body("color").trim().isLength({ min: 1 }),
    body("odometer").isInt(),
    body("owner").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
  ],
  carController.createCar
);

// Update car route
router.put(
  "/car/:id",
  auth,
  [
    body("stockId").trim().isLength({ min: 1 }),
    body("make").trim().isLength({ min: 1 }),
    body("model").trim().isLength({ min: 1 }),
    body("year").isInt(),
    body("color").trim().isLength({ min: 1 }),
    body("odometer").isInt(),
    body("owner").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
  ],
  carController.updateCar
);

// Delete car route
router.delete("/car/:id", auth, carController.deleteCar);

module.exports = router;

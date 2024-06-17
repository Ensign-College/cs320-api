const Car = require("../models/car");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

exports.getCars = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(201)
        .json({ message: "No user logged in. Please log in" });
    }
    const decodedToken = jwt.verify(token, jwtSecret);
    if (!decodedToken) {
      return res
        .status(201)
        .json({ message: "Token not valid. Please log in." });
    }
    const cars = await Car.find();
    if (!cars) {
      return res.status(404).json({ message: "No cars found" });
    }
    res.status(200).json({
      message: "User authenticated and logged in",
      cars: cars,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ error: error.data });
  }
};

exports.getCar = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(201)
        .json({ message: "No user logged in. Please log in" });
    }
    const decodedToken = jwt.verify(token, jwtSecret);
    if (!decodedToken) {
      return res
        .status(201)
        .json({ message: "Token not valid. Please log in." });
    }
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "No car found" });
    }
    res.status(200).json({
      message: "User authenticated and logged in",
      car: car,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    res.status(error.statusCode).json({ error: error.data });
  }
};

// TODO: Implement the createCar, updateCar, and deleteCar controller functions
exports.createCar = async (req, res, next) => {};

exports.updateCar = async (req, res, next) => {};

exports.deleteCar = async (req, res, next) => {};

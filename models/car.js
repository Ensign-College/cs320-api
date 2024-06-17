const mongoose = require("mongoose");
const { Schema } = mongoose;

const carSchema = new Schema({
  stockId: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  odometer: {
    type: Number,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Car", carSchema);

const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  route: { type: String, required: true },
  driver: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
});

module.exports = mongoose.model('Bus', busSchema);

const express = require('express');
const Bus = require('../models/Bus');
const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
  const buses = await Bus.find();
  res.json(buses);
});

// Update bus location
router.put('/:id', async (req, res) => {
  const { latitude, longitude } = req.body;
  const bus = await Bus.findById(req.params.id);
  if (bus) {
    bus.location = { latitude, longitude };
    await bus.save();
    res.json(bus);
  } else {
    res.status(404).json({ message: 'Bus not found' });
  }
});

module.exports = router;

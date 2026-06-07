const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// ✅ GET all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST a new food item
router.post('/', async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    const food = new Food({ name, price, category, description, image });
    const savedFood = await food.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ GET a single food item by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE a food item
router.put('/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE a food item
router.delete('/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
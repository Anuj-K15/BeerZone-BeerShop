const express = require('express');
const Inventory = require('../models/Inventory');
const router = express.Router();

// Get all stock
router.get('/', async (req, res) => {
    try {
        const stock = await Inventory.find({});
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Refill stock
router.put('/refill', async (req, res) => {
    const { brand, quantity } = req.body;

    try {
        const inventoryItem = await Inventory.findOne({ brand });
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        inventoryItem.quantity += parseInt(quantity, 10);
        await inventoryItem.save();

        res.json(inventoryItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

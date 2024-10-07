const express = require('express');
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
const router = express.Router();

// Get all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sale.find({});
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a sale
router.post('/', async (req, res) => {
    const { brand, quantity } = req.body;

    try {
        // Check inventory
        const inventoryItem = await Inventory.findOne({ brand });
        if (!inventoryItem || inventoryItem.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Create sale
        const sale = new Sale({
            brand,
            quantity,
            date: new Date()
        });

        await sale.save();

        // Update inventory
        inventoryItem.quantity -= quantity;
        await inventoryItem.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete sale route
router.delete('/:id', async (req, res) => {
    try {
        // Find the sale by ID
        const sale = await Sale.findById(req.params.id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale record not found' });
        }

        // Add the quantity back to the inventory
        await Inventory.updateOne(
            { brand: sale.brand },
            { $inc: { quantity: sale.quantity } }
        );

        // Delete the sale record
        await Sale.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sale record deleted and inventory updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

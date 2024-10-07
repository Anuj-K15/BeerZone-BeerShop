// models/Inventory.js
const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0 // Default quantity can be set to 0 or any other number
    }
});

module.exports = mongoose.model('Inventory', InventorySchema);

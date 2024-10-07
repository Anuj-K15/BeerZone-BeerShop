const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;

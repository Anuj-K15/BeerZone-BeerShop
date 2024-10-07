const express = require('express');
const mongoose = require('mongoose');
const Stock = require('./models/Inventory');
const Sale = require('./models/Sale');
const Inventory = require('./models/Inventory');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://anuj:ilushaurya@anujapi.my4e3.mongodb.net/?retryWrites=true&w=majority&appName=AnujAPI', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Assuming you're using Express.js
app.get('/api/stock', async (req, res) => {
    try {
        const stock = await Stock.find(); // Fetch stock data from the database
        res.json(stock); // Send the stock data as JSON
    } catch (error) {
        console.error('Error fetching stock:', error);
        res.status(500).json({ message: 'Error fetching stock' });
    }
});


// Refill stock
app.put('/api/stock/refill', async (req, res) => {
    const { brand, quantity } = req.body;
    try {
        let stock = await Stock.findOne({ brand });
        if (stock) {
            stock.quantity += parseInt(quantity, 10);
            await stock.save();
        } else {
            stock = new Stock({ brand, quantity });
            await stock.save();
        }
        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ error: 'Failed to refill stock' });
    }
});

app.get('/api/brands', async (req, res) => {
    try {
        const brands = await Inventory.distinct('brand'); // Assuming 'Stock' is your stock model
        res.json(brands);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
});


// Record a sale
app.post('/api/sales', async (req, res) => {
    const { brand, quantity } = req.body;
    const date = new Date();

    try {
        const stock = await Stock.findOne({ brand });
        if (!stock || stock.quantity < quantity) {
            return res.status(400).json({ error: 'Not enough stock' });
        }

        stock.quantity -= quantity;
        await stock.save();

        const sale = new Sale({ brand, quantity, date });
        await sale.save();

        res.status(201).json(sale);
    } catch (err) {
        res.status(500).json({ error: 'Failed to record sale' });
    }
});

// View sales data
app.get('/api/sales', async (req, res) => {
    try {
        const sales = await Sale.find();
        res.json(sales);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sales' });
    }
});

// Delete a sale
app.delete('/api/sales/:id', async (req, res) => {
    try {
        const saleId = req.params.id;
        const sale = await Sale.findByIdAndDelete(saleId);

        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        // Optionally, add stock back to inventory
        const stock = await Stock.findOne({ brand: sale.brand });
        if (stock) {
            stock.quantity += sale.quantity;
            await stock.save();
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete sale' });
    }
});


// Serve static files
app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on port 3000'));

// seed.js
const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://anuj:ilushaurya@anujapi.my4e3.mongodb.net/?retryWrites=true&w=majority&appName=AnujAPI';

const seedBrands = async () => {
    const brands = [
        { brand: 'Kingfisher', quantity: 100 },
        { brand: 'Budweiser', quantity: 100 },
        { brand: 'Tuborg', quantity: 100 },
        { brand: 'Heineken', quantity: 100 }
    ];

    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB.');

        // Loop through each brand and add it to the database if it doesn't already exist
        for (const brand of brands) {
            const existingBrand = await Inventory.findOne({ brand: brand.brand });
            if (!existingBrand) {
                await Inventory.create(brand);
                console.log(`Added ${brand.brand} to inventory.`);
            } else {
                console.log(`${brand.brand} already exists in inventory.`);
            }
        }
    } catch (error) {
        console.error('Error seeding brands:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
};

seedBrands();

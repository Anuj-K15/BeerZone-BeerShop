// seed.js
const mongoose = require('mongoose');
const Inventory = require('./models/Inventory');

// Replace with your MongoDB connection string
const MONGODB_URI = 'mongodb+srv://anuj:ilushaurya@anujapi.my4e3.mongodb.net/?retryWrites=true&w=majority&appName=AnujAPI';

const seedBrands = async () => {
    const brands = [
        { brand: 'Budwiser Magnum 500ml', quantity: 0 },
        { brand: 'Budwiser Magnum 650ml', quantity: 0 },
        { brand: 'Budwiser Mild 650ml', quantity: 0 },
        { brand: 'Calsberg Strong 500ml', quantity: 0 },
        { brand: 'Calsberg Strong 650ml', quantity: 0 },
        { brand: 'Heineken Silver 650ml', quantity: 0 },
        { brand: 'Haywards 2000 Strong 650ml', quantity: 0 },
        { brand: 'Kingfisher Mild 500ml', quantity: 0 },
        { brand: 'Kingfisher Mild 650ml', quantity: 0 },
        { brand: 'Kingfisher Strong 500ml', quantity: 0 },
        { brand: 'Kingfisher Strong 650ml', quantity: 0 },
        { brand: 'Kingfisher Ultra Max 650ml', quantity: 0 },
        { brand: 'London Pilsner Mild 500ml', quantity: 0 },
        { brand: 'London Pilsner Strong 650ml', quantity: 0 },
        { brand: 'Port Wine 1000 330ml', quantity: 0 },
        { brand: 'Rio Breezer Cranberry 330ml', quantity: 0 },
        { brand: 'Rio Breezer Lemon 330ml', quantity: 0 },
        { brand: 'Rio Breezer Orange 330ml', quantity: 0 },
        { brand: 'Royal Challenge Strong 650ml', quantity: 0 },
        { brand: 'Tuborg Strong 330ml', quantity: 0 },
        { brand: 'Tuborg Strong 500ml', quantity: 0 },
        { brand: 'Tuborg Strong 650ml', quantity: 0 }
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

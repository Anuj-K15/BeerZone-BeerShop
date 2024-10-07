document.addEventListener('DOMContentLoaded', async () => {
    const brandSelectRefill = document.getElementById('brand-select-refill');

    try {
        const response = await fetch('/api/stock'); // Fetch the stock brands
        const brands = await response.json();

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.brand;
            option.textContent = brand.brand;
            brandSelectRefill.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
});


document.getElementById('stockRefillForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const brand = document.getElementById('brandInput').value;
    const quantityRefill = parseInt(document.getElementById('quantityInput').value);
    
    console.log('Submitting Refill:', { brand, quantityRefill }); // Debug log
    
    try {
        const response = await fetch('/api/stock/refill', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brand, quantity_refill: quantityRefill }),
        });

        console.log('Response:', response); // Debug log
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        alert(data.message);
        document.getElementById('stockRefillForm').reset();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

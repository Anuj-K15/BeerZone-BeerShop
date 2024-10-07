document.addEventListener('DOMContentLoaded', async () => {
    const brandSelect = document.getElementById('brand-select');

    try {
        const response = await fetch('/api/stock'); // Fetch the stock brands
        const brands = await response.json();

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.brand;
            option.textContent = brand.brand;
            brandSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching brands:', error);
    }
});


document.getElementById('recordSaleForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const brand = document.getElementById('brandInput').value;
    const quantitySold = parseInt(document.getElementById('quantityInput').value);
    
    console.log('Submitting Sale:', { brand, quantitySold }); // Debug log
    
    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ brand, quantity_sold: quantitySold }),
        });

        console.log('Response:', response); // Debug log
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const data = await response.json();
        alert(data.message);
        document.getElementById('recordSaleForm').reset();
    } catch (error) {
        alert('Error: ' + error.message);
    }
});

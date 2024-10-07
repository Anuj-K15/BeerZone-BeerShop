document.addEventListener('DOMContentLoaded', async () => {
    const brandSelect = document.getElementById('brand-select');
    const brandSelectRefill = document.getElementById('brand-select-refill');
    const stockInfoTable = document.querySelector('#stock-info tbody');
    const salesInfoTable = document.querySelector('#sales-info tbody');

    // Fetch and populate brands for dropdowns
    async function populateBrands() {
        try {
            const response = await fetch('/api/stock');
            const brands = await response.json();

            // Clear existing options
            brandSelect.innerHTML = '';
            brandSelectRefill.innerHTML = '';

            // Populate dropdowns with brand options
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.brand;
                option.textContent = brand.brand;

                brandSelect.appendChild(option);
                brandSelectRefill.appendChild(option.cloneNode(true));
            });

            populateStockInfo(brands);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    }

    // Populate stock info
    function populateStockInfo(stock) {
        stockInfoTable.innerHTML = '';
        stock.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.brand}</td>
                <td>${item.quantity}</td>
            `;
            stockInfoTable.appendChild(row);
        });
    }

    // Populate sales info
    async function populateSalesInfo() {
        try {
            const response = await fetch('/api/sales');
            const sales = await response.json();

            salesInfoTable.innerHTML = '';
            sales.forEach(sale => {
                const date = new Date(sale.date);
                const time = date.toLocaleTimeString();
                const formattedDate = date.toLocaleDateString();
            
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${sale.brand}</td>
                    <td>${sale.quantity}</td>
                    <td>${formattedDate}</td>
                    <td>${time}</td>
                    <td><button class="delete-btn" data-id="${sale._id}">Delete</button></td> <!-- Delete button -->
                `;
                salesInfoTable.appendChild(row);
            });

            // Add delete event listeners
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const saleId = event.target.getAttribute('data-id');
                    await deleteSale(saleId);
                });
            });
        } catch (error) {
            console.error('Error fetching sales info:', error);
        }
    }

    // Handle refill stock form submission
    document.getElementById('refill-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const brand = brandSelectRefill.value;
        const quantity = document.getElementById('quantity-refill').value;

        try {
            await fetch('/api/stock/refill', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand, quantity })
            });
            await populateBrands();
        } catch (error) {
            console.error('Error refilling stock:', error);
        }
    });

    // Handle record sale form submission
    document.getElementById('sales-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const brand = brandSelect.value;
        const quantity = document.getElementById('quantity-sales').value;

        try {
            await fetch('/api/sales', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ brand, quantity })
            });
            await populateBrands();
            await populateSalesInfo();
        } catch (error) {
            console.error('Error recording sale:', error);
        }
    });

    // Handle delete sale
    async function deleteSale(saleId) {
        try {
            await fetch(`/api/sales/${saleId}`, {
                method: 'DELETE'
            });
            await populateSalesInfo(); // Refresh the sales info after deletion
            await populateBrands(); // Refresh brands to update inventory
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    }

    // Event delegation for delete buttons
    salesInfoTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-sale')) {
            const saleId = event.target.dataset.id; // Assuming the button has a data-id attribute
            deleteSale(saleId);
        }
    });

    // Initial load of brands and sales data
    await populateBrands();
    await populateSalesInfo();
});
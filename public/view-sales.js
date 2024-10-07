document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/api/sales');
    const sales = await response.json();

    const salesTableBody = document.querySelector('#salesTable tbody');
    sales.forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.brand}</td>
            <td>${sale.quantity_sold}</td>
            <td>${new Date(sale.date).toLocaleString()}</td>
        `;
        salesTableBody.appendChild(row);
    });
});

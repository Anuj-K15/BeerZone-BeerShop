document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/api/stock');
    const stockData = await response.json();

    const stockTableBody = document.querySelector('#stockTable tbody');
    stockData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.brand}</td>
            <td>${item.quantity_available}</td>
        `;
        stockTableBody.appendChild(row);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const recommendedProducts = document.getElementById("recommended-products");

    // Fetch and display recommended products
    fetch("https://fakestoreapi.com/products?limit=4") // Fetch only 4 recommended products
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const card = document.createElement("div");
                card.classList.add("card");

                card.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>$${product.price}</p>
                    <button onclick="viewDetails(${product.id})">View Details</button>
                `;

                recommendedProducts.appendChild(card);
            });
        });
});

// Search function to navigate to Product Listing with search query
function searchProducts() {
    const searchQuery = document.getElementById("search-input").value.trim();
    if (searchQuery) {
        localStorage.setItem("searchQuery", searchQuery);
        window.location.href = "productlisting.html";
    } else {
        alert("Please enter a search term.");
    }
}

// Function to navigate to view details page
function viewDetails(id) {
    localStorage.setItem("selectedProduct", id);
    window.location.href = "viewdetails.html";
}

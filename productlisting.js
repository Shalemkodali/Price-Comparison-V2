document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const searchQuery = localStorage.getItem("searchQuery");

    let apiUrl = "https://fakestoreapi.com/products";

    // If search query exists, modify the API URL to fetch specific products
    if (searchQuery) {
        apiUrl = `https://fakestoreapi.com/products`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = ""; // Clear previous results
            let filteredProducts = products;

            if (searchQuery) {
                filteredProducts = products.filter(product =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            // Display products
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const card = document.createElement("div");
                    card.classList.add("card");

                    card.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p>$${product.price}</p>
                        <button onclick="viewDetails(${product.id})">View Details</button>
                    `;

                    productList.appendChild(card);
                });
            } else {
                productList.innerHTML = "<p>No products found for your search.</p>";
            }
        });

    // Function to navigate to view details page
    window.viewDetails = (id) => {
        localStorage.setItem("selectedProduct", id);
        window.location.href = "viewdetails.html";
    };
});
document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const relatedProductsList = document.getElementById("related-products");
    const searchQuery = localStorage.getItem("searchQuery");

    if (!searchQuery) {
        productList.innerHTML = "<p>Please enter a product name to search.</p>";
        return;
    }

    fetch("https://fakestoreapi.com/products")
        .then(response => response.json())
        .then(products => {
            productList.innerHTML = "";
            let filteredProducts = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    fetchFakeEcommerceData(product).then(ecommerceData => {
                        displayProductComparison(product, ecommerceData);
                    });
                });

                // Show related products
                displayRelatedProducts(products, filteredProducts[0].category);
            } else {
                productList.innerHTML = "<p>No products found for your search.</p>";
            }
        });

    // Simulate fetching product prices from Amazon, Walmart, and eBay
    function fetchFakeEcommerceData(product) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { store: "Amazon", price: (product.price * 0.95).toFixed(2) },
                    { store: "Walmart", price: (product.price * 1.05).toFixed(2) },
                    { store: "eBay", price: (product.price * 0.90).toFixed(2) }
                ]);
            }, 500);
        });
    }

    // Display product comparison
    function displayProductComparison(product, ecommerceData) {
        const card = document.createElement("div");
        card.classList.add("card");

        let priceComparisonHTML = ecommerceData.map(data => 
            `<p><strong>${data.store}:</strong> $${data.price}</p>`
        ).join("");

        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let isInWishlist = wishlist.some(item => item.id === product.id);

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            ${priceComparisonHTML}
            <button onclick="viewDetails(${product.id})">View Details</button>
            <button id="wishlist-btn-${product.id}" onclick="toggleWishlist(${product.id}, '${product.title}', '${product.image}')">
                ${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
        `;

        productList.appendChild(card);
    }

    // Show related products
    function displayRelatedProducts(products, category) {
        let related = products.filter(product => product.category === category);
        relatedProductsList.innerHTML = "";
        related.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="viewDetails(${product.id})">View Details</button>
            `;

            relatedProductsList.appendChild(card);
        });
    }

    // Function to navigate to view details page
    window.viewDetails = (id) => {
        localStorage.setItem("selectedProduct", id);
        window.location.href = "viewdetails.html";
    };

    // Toggle Wishlist
    window.toggleWishlist = (id, title, image) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let isInWishlist = wishlist.some(item => item.id === id);

        if (isInWishlist) {
            wishlist = wishlist.filter(item => item.id !== id);
            document.getElementById(`wishlist-btn-${id}`).innerText = "Add to Wishlist";
        } else {
            wishlist.push({ id, title, image });
            document.getElementById(`wishlist-btn-${id}`).innerText = "Remove from Wishlist";
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };
});

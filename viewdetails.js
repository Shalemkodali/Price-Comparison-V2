document.addEventListener("DOMContentLoaded", () => {
    const productId = localStorage.getItem("selectedProduct");
    const productDetails = document.getElementById("product-details");

    if (!productId) {
        productDetails.innerHTML = "<p>No product selected.</p>";
        return;
    }

    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            fetchFakeEcommerceData(product).then(ecommerceData => {
                displayProductDetails(product, ecommerceData);
            });
        });

    function fetchFakeEcommerceData(product) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        store: "Amazon",
                        price: (product.price * 0.95).toFixed(2),
                        rating: (Math.random() * 2 + 3).toFixed(1),
                        reviews: Math.floor(Math.random() * 500) + 50,
                        link: `https://www.amazon.com/s?k=${encodeURIComponent(product.title)}`
                    },
                    {
                        store: "Walmart",
                        price: (product.price * 1.05).toFixed(2),
                        rating: (Math.random() * 2 + 3).toFixed(1),
                        reviews: Math.floor(Math.random() * 500) + 50,
                        link: `https://www.walmart.com/search?q=${encodeURIComponent(product.title)}`
                    },
                    {
                        store: "eBay",
                        price: (product.price * 0.90).toFixed(2),
                        rating: (Math.random() * 2 + 3).toFixed(1),
                        reviews: Math.floor(Math.random() * 500) + 50,
                        link: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.title)}`
                    }
                ]);
            }, 500);
        });
    }

    function displayProductDetails(product, ecommerceData) {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let isInWishlist = wishlist.some(item => item.id === product.id);

        let ecommerceHTML = ecommerceData.map(data => 
            `<div class="ecommerce-card">
                <h3>${data.store}</h3>
                <p><strong>Price:</strong> $${data.price}</p>
                <p><strong>Rating:</strong> ${data.rating} ⭐ (${data.reviews} reviews)</p>
                <a href="${data.link}" target="_blank">
                    <button class="buy-button">Buy from ${data.store}</button>
                </a>
            </div>`
        ).join("");

        productDetails.innerHTML = `
            <div class="card">
                <img src="${product.image}" alt="${product.title}">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <div class="ecommerce-comparison">${ecommerceHTML}</div>
                <button id="wishlist-btn" onclick="toggleWishlist(${product.id}, '${product.title}', '${product.image}')">
                    ${isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </button>
            </div>
        `;
    }

    window.toggleWishlist = (id, title, image) => {
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        let isInWishlist = wishlist.some(item => item.id === id);

        if (isInWishlist) {
            wishlist = wishlist.filter(item => item.id !== id);
            document.getElementById("wishlist-btn").innerText = "Add to Wishlist";
        } else {
            wishlist.push({ id, title, image });
            document.getElementById("wishlist-btn").innerText = "Remove from Wishlist";
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };
});
